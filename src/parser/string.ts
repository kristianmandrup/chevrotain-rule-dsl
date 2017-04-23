import { Base } from '../common/base'
import { IResult } from '../common/result'
import * as util from '../common/util'

export class ParseString extends Base {
  constructor(parser, rules, options) {
    super(parser, rules, options)
  }

  protected resolve(rule, options?): IResult {
    this.log('parseString', rule)
    return this.parseRepeat(rule, options) ||
      this.parseOption(rule, options) ||
      this.parseSpaced(rule, options) ||
      this.parseWord(rule, options)
  }
}