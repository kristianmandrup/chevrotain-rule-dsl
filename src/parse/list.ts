import { Base } from '../common/base'
import { IResult } from '../common/result'
import * as util from '../common/util'

export class ParseList extends Base {
  constructor(parser, rules, options) {
    super(parser, rules, options)
  }

  public resolve(rules, options?): IResult {
    var flat = (r, a) => Array.isArray(a) ? a.reduce(flat, r) : r.concat(a)

    this.log('parseList', rules, options)
    let alt = util.isAlt(options)
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

  protected alt(value): IResult {
    return this.rules.alt(value)
  }

  protected parse(rule): IResult {
    return this.parser.parse(value)
  }  
}