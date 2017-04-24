import { BaseParser } from './base'
import { ProdType } from "./../gast";
import { IResult } from '../common/result'
import * as util from '../common/util'

export class ListParser extends BaseParser {
  constructor(parser, rules, options) {
    super(parser, rules, options)
  }

  public resolve(rules, options?): IResult {
    var flat = (r, a) => Array.isArray(a) ? a.reduce(flat, r) : r.concat(a)

    this.log('parseList', rules, options)
    let alt = util.isAlt(options)
    let codeJoin = alt ? ',' : '\n'
    let parseFun = alt ? this.rules.alt : this.parser.parse
    // reset options if parent is 'or'
    if (alt) {
      options = {}
    }
    this.log('item parser', parseFun, options)
    rules = rules.reduce(flat, [])
    let parsedRules = rules.map(rule => parseFun(rule, options))
    let codeStmts = parsedRules.map(pr => pr.code).join(codeJoin)
    let children = parsedRules.map(pr => pr.node)
    let node = {
      children
    }

    this.log('parsedRules', parsedRules)
    this.log('codeStmts', codeStmts)
    let rule = () => {
      parsedRules.map(pr => pr.rule())
    }
    this.log('rule', rule)
    let code = alt ? codeStmts : '() => {\n' + codeStmts + '\n}\n'
    let result = {
      rule,
      code,
      node
    }
    this.log('parsedList', result)
    return result
  } 
}