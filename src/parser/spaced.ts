import { BaseParser } from './base'
import { IResult } from '../common/interfaces'
import * as util from '../common/util'

const expr = {
  spaces: /\S+\s+\S+/,
  space: /\s+/,
  or: [/\sor\s/, /\|/]
}
  
function splitExp(rule) {
  let or = expr.or.find(exp => exp.test(rule))
  return or ? or : expr.space
}

function isSpaced(rule) {
  return expr.spaces.test(rule)
}
export class SpacedParser extends BaseParser {
  parserKeys = [
    'list'
  ]
  ruleKeys = [
    'or'
  ]

  constructor(parser, rules, options) {
    super(parser, rules, options)
  }

  public resolve(rule, options?): IResult {
    // two or more word with spaces between?
    if (!isSpaced(rule)) {
      return
    }

    this.log('parse space separation', rule)
    // or rule
    let exp = splitExp(rule)
    let list = rule.split(exp).map(item => item.trim())
    return this.funs.list(list, options)
  }
}