import { BaseParser } from './base'
import { IResult } from '../common/result'
import * as util from '../common/util'
import {
  RulesParser
} from '../parser'
export class WordParser extends BaseParser {
  constructor(parser, rules, options) {
    super(parser, rules, options)
  }

  protected resolve(rule, options?): IResult {
    this.log('parseString', rule)
    return this.parser.repeat(rule, options) ||
      this.parser.option(rule, options) ||
      this.parser.spaced(rule, options)
  }
}