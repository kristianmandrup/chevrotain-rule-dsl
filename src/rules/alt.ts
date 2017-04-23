import { Base } from '../common/base'
import { IResult } from '../common/result'
import * as util from '../common/util'
import {
  ProdType
} from '../gast'

export class Alt extends Base {
  constructor(parser, options?, value?) {
    super(parser, options, value)
  }

  protected alt(value, options?): IResult {
    this.log('alt', value)
    let parsedRule = this.parser.parse(value)
    let code = '{ALT: () => {\n ' + parsedRule.code + '\n}}'
    let rule = { ALT: parsedRule.rule }
    let type = ProdType.FLAT
    let children = [] // TODO
    let node = {
      type,
      children
    }    
    return { rule, code }
  }
}