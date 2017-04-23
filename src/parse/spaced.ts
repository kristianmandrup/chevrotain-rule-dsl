import { Base } from './base'
import { IResult } from '../rule/result'
import * as util from '../rule/util'

export class ParseSpaced extends Base {
  constructor(parser, rules, options) {
    super(parser, rules, options)
  }

  public parse(rule, options): IResult {
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

  protected parseList(list, options) {
    return this.parser.list(list, options)
  }

  protected or(value) {
      return this.rules.or(value)
  }
}