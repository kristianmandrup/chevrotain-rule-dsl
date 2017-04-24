import { Base } from '../common/base'
import { IResult } from '../common/result'
import * as util from '../common/util'
import {
  ProdType
} from '../gast'

import {
  RulesParser
} from '../parser'

export class Alt extends Base {
  constructor(parser, options?, value?) {
    super(parser, options, value)
  }

  public config() {
    this.parser = new RulesParser(this.$, this.options).configure()
    return this
  }

  protected resolve(value, options?): IResult {
    this.log('alt', value)
    let parsedRule = this.parser.parse(value)
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