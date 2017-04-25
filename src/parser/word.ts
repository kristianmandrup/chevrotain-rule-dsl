import { BaseParser } from './base'
import { IResult } from '../common/interfaces'
import * as util from '../common/util'

export class WordParser extends BaseParser {
  option: Function
  constructor(parser, rules, options) {
    super(parser, rules, options)
  }

  protected resolve(rule, options?): IResult {
    this.log('parseString', rule)
    let result = this.funs.repeat(rule, options) ||
      this.option(rule, options) ||
      this.funs.spaced(rule, options) ||
      this.funs.consume(rule, options)
      return result || this.unknown(rule, options)
  }
}