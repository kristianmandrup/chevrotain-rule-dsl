export { DslParser } from './dsl-parser'
export { GastBuilder } from './gast-builder'

import { Rules } from './rules'
import { RulesParser } from './parser'
export { RuleParser, rule } from './legacy'

export {
  Rules,
  RulesParser
}

import { Base } from './common/base'
export class NewRuleParser extends Base {
  public codeStr: string

  constructor(parser, options = { logging: false, logMap: {}, registry: null, tokenMap: {} }) {
    super(parser, options)
    this.parser = new RulesParser(parser, options)
    this.rules = new Rules(parser, options)
  }

  protected rule(name, rule, config): Function {
    this.log('rule', name, rule)
    if (typeof name !== 'string') {
      throw new Error(`rule name must be a valid name (string), was ${name}`)
    }
    let $ = this.$
    let parserRule = () => $.RULE(name, rule, config).bind($)
    return parserRule
  }
  
  public createRule(name: string, rules, options): Function {
    options = options || {}
    this.configureLog(options)
    let parsed = this.parser.parse(rules, options)
    this.log('createRule', 'parsed.rule', parsed.rule)
    options.code = options.code || parsed.code
    this.codeStr = parsed.code
    this.log('createRule', 'parsed.code', parsed.code)
    let parsedRule = this.rule(name, parsed.rule, options)
    this.log('createRule', 'parsedRule', parsedRule)
    this.register(name, parsedRule)
    return parsedRule
  }
}

export function createRule(parser, name: string, rules, options?): Function {
  return new NewRuleParser(parser, options).createRule(name, rules, options)
}