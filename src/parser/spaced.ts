import { BaseParser } from './base'
import { IResult } from '../common/interfaces'
import * as util from '../common/util'
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

  public resolve(rule, options): IResult {
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
        return this.funs.or(alternatives)
      } else {
        this.log('split rules by space', options)
        let list = rule.split(/\s+/).map(item => item.trim())
        return this.funs.list(list, options)
      }
    }
  }
}