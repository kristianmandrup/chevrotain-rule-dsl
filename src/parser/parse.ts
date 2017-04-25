import { BaseParser } from './base'
import { IResult } from '../common/interfaces'
import * as util from '../common/util'

import {
  RulesParser
} from '../parser'
export class ValueParser extends BaseParser {
  string: Function
  list: Function
  obj: Function
  consume: Function

  name = '_parse'
  parserKeys = [
    'list',
    'obj',
    'string'
  ]
  ruleKeys = [
    'consume'
  ]

  constructor(parser, rules, options) {
    super(parser, rules, options)
  }  
  
  resolve(rule, options = {}): IResult {
    this.log('parse', rule, options)
    if (Array.isArray(rule)) {
      return this.parsers.funs.list(rule, options)
    }

    if (this.findToken(rule)) {
      this.log('consume since rule is token', rule)
      return this.rules.funs.consume(rule, options)
    }

    if (typeof rule === 'object') {
      return this.parsers.funs.obj(rule, options)
    }
    // if string, always assume subrule
    if (typeof rule === 'string') {
      console.log('funs', this.parsers.funs)
      return this.parsers.funs.string(rule, options)
    }
    if (typeof rule === 'function') {
      return { rule, code: rule.name }
    }
    throw new Error(`Invalid rule(s) ${typeof rule}`)
  }
}