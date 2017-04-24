import { BaseParser } from './base'
import { IResult } from '../common/result'
import * as util from '../common/util'

import {
  RulesParser
} from '../parser'
export class ValueParser extends BaseParser {
  constructor(parser, rules, options) {
    super(parser, rules, options)
  }

  resolve(rule, options = {}): IResult {
    this.log('parse', rule, options)
    if (Array.isArray(rule)) {
      return this.parser.list(rule, options)
    }

    if (this.findToken(rule)) {
      this.log('consume since rule is token', rule)
      return this.rules.consume(rule, options)
    }

    if (typeof rule === 'object') {
      return this.parser.obj(rule, options)
    }
    // if string, always assume subrule
    if (typeof rule === 'string') {
      return this.parser.string(rule, options)
    }
    if (typeof rule === 'function') {
      return { rule, code: rule.name }
    }
    throw new Error(`Invalid rule(s) ${typeof rule}`)
  }
}