import { BaseParser } from './base'
import { IResult } from '../common/interfaces'
import * as util from '../common/util'
import {
  RulesParser
} from '../parser'
export class StringParser extends BaseParser {
  option: Function
  repeat: Function
  spaced: Function
  word: Function

  parserKeys = [
    'option',
    'repeat',
    'word',
    'spaced'
  ]

  constructor(parser, rules, options) {
    super(parser, rules, options)
  }

  protected resolve(rule, options?): IResult {
    this.log('parseString', rule)
    return this.funs.repeat(rule, options) ||
      this.funs.option(rule, options) ||
      this.funs.spaced(rule, options) ||
      this.funs.word(rule, options)
  }
}