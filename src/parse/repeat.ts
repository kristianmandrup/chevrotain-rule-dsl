import { Base } from './base'
import { IResult } from '../rule/result'
import * as util from '../rule/util'

export class ParseRepeat extends Base {
  constructor(parser, rules, options) {
    super(parser, rules, options)
  }

  protected repeat(value: any) {
    return this.rules.repeat(value)
  }

  public parse(rule, options): IResult {
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
}