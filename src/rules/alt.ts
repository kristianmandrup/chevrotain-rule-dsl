import { BaseRule } from './base'
import { IResult } from '../common/interfaces'
import * as util from '../common/util'
import {
  ProdType
} from '../gast'

import {
  Parsers
} from '../parser'

export class Alt extends BaseRule {
  parse: Function
  parserKeys = [
    'parse'
  ]

  constructor(parser, options?, value?) {
    super(parser, options, value)
  }

  protected resolve(value, options?): IResult {
    this.log('alt', value)
    console.log('parsers', this.parsers.funs)
    let parsedRule = this.funs.parse(value)
    console.log('parsedRule', parsedRule)
    let code = '{ALT: () => {\n ' + parsedRule.code + '\n}}'
    let rule = { ALT: parsedRule.rule }
    let type = ProdType.FLAT
    let node = {
      type,
      definition: parsedRule.rule
    }
    return { rule, code, node }
  }
}