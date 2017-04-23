import { Base } from '../common/base'
import { IResult } from '../common/result'
import * as util from '../common/util'

export class WordParser extends Base {
  constructor(parser, rules, options) {
    super(parser, rules, options)
  }

  protected resolve(rule, options?): IResult {
    this.log('parseString', rule)
    return this.parser.repeat(rule, options) ||
      this.parser.option(rule, options) ||
      this.parser.spaced(rule, options) ||
      this.parser.word(rule, options)
  }
}