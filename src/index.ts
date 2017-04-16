import {
  Parser,
  Token
} from 'chevrotain'

export interface IResult {
  rule: any
  code: string
}

function codeOf(value) {
  return typeof value === 'function' ? value.name : new String(value)
}

function isAlt(value) {
  return value && value.parent === 'or'
}

function toTokenMap(value) {
  if (Array.isArray(value)) {
    return value.reduce((acc, item) => {
      let name = typeof item === 'function' ? item.name : new String(item)
      acc[name] = item
    }, {})
  }
  if (typeof value === 'object') return value
  throw new Error(`Invalid tokenMap ${value}`)
}

export class RuleParser {
  static registry = {}
  usedRules = {}
  _registry = {}
  code = []
  tokenMap = {}
  public codeStr: string
  logging: boolean
  logRule: boolean
  $: any

  constructor(parser, options = { logging: false, registry: null, tokenMap: {} }) {
    if (!(parser && parser.RULE)) {
      console.error('parser', parser)
      throw new Error('RuleParser must be created with a Parser instance that has a public RULE method')
    }
    this.$ = parser
    let tokenMap = toTokenMap(parser['tokensMap'])
    this.tokenMap = Object.assign(tokenMap, options.tokenMap)
    this.usedRules = {}
    this.logging = options.logging
    this._registry = parser['registry'] || options.registry || RuleParser.registry
  }

  findToken(value) {
    return this.tokenMap[value] || this.tokenMap[value.name]
  }

  resolveToken(token) {
    return this.findToken(token) || token
  }

  parse(rule, options = {}): IResult {
    this.log('parse', rule, options)

    if (Array.isArray(rule)) {
      return this.parseList(rule, options)
    }

    if (this.findToken(rule)) {
      this.log('consume since rule is token', rule)
      return this.consume(rule, options)
    }

    if (typeof rule === 'object') {
      return this.parseObj(rule, options)
    }
    // if string, always assume subrule
    if (typeof rule === 'string') {
      return this.parseString(rule, options)
    }
    if (typeof rule === 'function') {
      return { rule, code: rule.name }
    }
    throw new Error(`Invalid rule(s) ${typeof rule}`)
  }

  parseRepeat(rule, options): IResult {
    // repeat
    const regExp = /\(([^)]+)\)([+\*])/;
    let matches = regExp.exec(rule)
    if (matches && matches.length > 0) {
      let words = matches[1].split(/\s+/)
      let lastWord = words.splice(-1, 1)
      let sep = lastWord
      let min = matches[2] == '+' ? 1 : 0
      return this.repeat({
        sep,
        min,
        def: words.join(' ')
      })
    }
  }

  parseOption(rule, options): IResult {
    const regExp = /\(([^)]+)\)(\?)/;
    let matches = regExp.exec(rule)
    if (matches && matches.length > 0) {
      return this.option(matches[1])
    }
  }

  parseSpaced(rule, options): IResult {
    // two or more word with spaces between?
    if (/\S+\s+\S+/.test(rule)) {
      this.log('parse space separation', rule)
      // or rule
      let orExp = /\sor\s/
      let pipeExp = /\|/

      let or = orExp.test(rule)
      let orPipe = pipeExp.test(rule)
      // if separator is either 'or' OR '|'
      if (or || orPipe) {
        let splitExp = or ? orExp : pipeExp
        this.log('or rule: split', splitExp)
        let alternatives = rule.split(splitExp).map(alt => alt.trim())
        return this.or(alternatives)
      } else {
        this.log('split rules by space', options)
        let list = rule.split(/\s+/).map(item => item.trim())
        return this.parseList(list, options)
      }
    }
  }

  // TODO: extract to separate class
  protected parseString(rule, options?): IResult {
    this.log('parseString', rule)
    return this.parseRepeat(rule, options) ||
      this.parseOption(rule, options) ||
      this.parseSpaced(rule, options) ||
      this.parseWord(rule, options)
  }

  protected parseWord(rule, options?) {
    return this.findToken(rule) ? this.consume(rule, options) : this.subrule(rule, options)
  }

  protected parseList(rules, options?): IResult {
    var flat = (r, a) => Array.isArray(a) ? a.reduce(flat, r) : r.concat(a)

    this.log('parseList', rules, options)
    let alt = isAlt(options)
    let codeJoin = alt ? ',' : '\n'
    let parser = alt ? 'alt' : 'parse'
    // reset options if parent is 'or'
    if (alt) {
      options = {}
    }
    this.log('item parser', parser, options)
    rules = rules.reduce(flat, [])
    let parsedRules = rules.map(rule => this[parser](rule, options))
    let codeStmts = parsedRules.map(pr => pr.code).join(codeJoin)

    this.log('parsedRules', parsedRules)
    this.log('codeStmts', codeStmts)
    let rule = () => {
      parsedRules.map(pr => pr.rule())
    }
    this.log('rule', rule)
    let code = alt ? codeStmts : '() => {\n' + codeStmts + '\n}\n'
    let result = {
      rule,
      code
    }
    this.log('parsedList', result)
    return result
  }

  protected parseObj(rule, options?): IResult {
    this.log('parseObj', rule, options)

    function isRepeat(value) {
      return value.repeat || value.sep || value.min || value.def
    }

    if (isAlt(options)) {
      return this.alt(rule)
    }

    if (isRepeat(rule)) {
      return this.repeat(rule)
    }

    let key = Object.keys(rule)[0]
    let value = rule[key]

    switch (key) {
      case 'rule':
        return this.subrule(value)
      case 'rule2':
        return this.subrule(value, 'SUBRULE2')
      case 'option':
        return this.option(value)
      case 'consume':
        return this.consume(value)
      case 'repeat':
        return this.repeat(value)
      case 'alt':
        return this.alt(value)
      case 'or':
        return this.or(value)
      default:
        throw new Error(`Unknown key in rule object: ${key}`)
    }
  }

  get islogging() {
    return this.logging || this.logRule
  }

  log(msg, ...args) {
    if (this.islogging) {
      console.log(msg, ...args)
    }
  }

  findRule(name) {
    return this.registry[name]
  }

  get registry() {
    return this._registry
  }

  register(name, rule) {
    this.registry[name] = rule
  }

  addCode(ruleCode) {
    this.code.push(ruleCode)
  }

  subrule(value, options?) {
    let fun = 'SUBRULE'
    this.log('subrule', value)
    let _rule = (typeof value === 'string') ? this.findRule(value) : value
    if (typeof _rule !== 'function') {
      console.warn('Not yet registered, evaluate later...', _rule, value, this.findRule(value), Object.keys(this.registry))
      // throw new Error(`subrule must be function, was ${typeof rule}`)
    }
    // auto-detect reuse of subrule!
    if (this.usedRules[fun]) {
      this.log('repeat rule')
      fun = 'SUBRULE2'
    }
    this.usedRules[fun] = true
    let code = `$.${fun}(` + _rule + ')'
    let rule = () => this.$[fun](rule)
    return { rule, code }
  }

  // must be a Token
  protected consume(value, options?): IResult {
    this.log('consume', value)
    let token = this.resolveToken(value)
    let code = '$.CONSUME(' + codeOf(token) + ')'
    let $ = this.$
    let rule = () => $.CONSUME(token).bind($)
    let result = { rule, code }
    this.log('consumed', result)
    return result
  }

  protected alt(value, options?): IResult {
    this.log('alt', value)
    let parsedRule = this.parse(value)
    let code = '{ALT: () => {\n ' + parsedRule.code + '\n}}'
    let rule = { ALT: parsedRule.rule }
    return { rule, code }
  }

  protected repeat(value, options?): IResult {
    this.log('repeat', value)
    let rep = {
      SEP: '',
      DEF: () => { }
    }
    let prefix = value.min > 0 ? 'AT_LEAST_ONE' : 'MANY'
    let postfix = value.sep ? 'SEP' : null
    let fun = postfix ? [prefix, postfix].join('_') : prefix

    this.log('type', fun)

    rep.SEP = value.sep || value.separator
    this.log('separator', rep.SEP)

    let def = value.rule || value.def
    this.log('def:', def)
    let definition = this.parse(def)
    this.log('definition', definition)

    rep.DEF = () => definition.rule
    let codeRep = {
      SEP: rep.SEP,
      DEF: definition.code
    }
    this.log('repeat rule:', fun, rep)
    let rule = this.$[fun](rep)
    let code = (`$.${fun}(` + codeRep + ')')
    return { rule, code }
  }

  protected or(alternatives, options?): IResult {
    this.log('or', alternatives)
    let parsed = this.parse(alternatives, { parent: 'or' })
    let code = '$.OR([' + parsed.code + '])'
    let rule = () => this.$.OR(parsed.rule)
    return { rule, code }
  }

  protected option(value, options?): IResult {
    this.log('option', value)
    let _rule = (typeof value === 'string') ? this.findRule[value] : value
    let parsed = this.parse(_rule)
    if (typeof parsed.rule !== 'function') {
      throw new Error(`option must be function, was ${typeof parsed.rule}`)
    }

    let rule = () => this.$.OPTION(parsed.rule)
    let code = parsed.code
    return { rule, code }
  }

  protected rule(name, rules, config): Function {
    this.log('rule', name, rules)
    if (typeof name !== 'string') {
      throw new Error(`rule name must be a valid name (string), was ${name}`)
    }
    let $ = this.$
    let rule = () => $.RULE(name, rules.rule, config).bind($)
    return rule
  }

  public createRule(name: string, rules, options): Function {
    options = options || {}
    this.logRule = options.logging
    let parsed = this.parse(rules, options)
    this.log('createRule: parsedRule', parsed.rule)
    options.code = options.code || parsed.code
    this.codeStr = parsed.code
    this.log('createRule: parsedCode', parsed.code)
    let parsedRule = this.rule(name, parsed.rule, options)
    this.log('createRule: rule', parsedRule)
    this.register(name, parsedRule)
    return parsedRule
  }
}

export function rule(parser, name: string, rules, options?): Function {
  return new RuleParser(parser, options).createRule(name, rules, options)
}