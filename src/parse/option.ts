import { Base } from '../common/base'
import { IResult } from '../common/result'
import * as util from '../common/util'

export class ParseOption extends Base {
  constructor(parser, rules, options) {
    super(parser, rules, options)
  }

  protected option(value: any) {
    return this.rules.option(value)
  }

  resolve(rule, options): IResult {
    const regExp = /\(([^)]+)\)(\?)/;
    let matches = regExp.exec(rule)
    if (matches && matches.length > 0) {
      return this.option(matches[1])
    }
  }
}