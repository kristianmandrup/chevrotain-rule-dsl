import { Base } from './base'
import { IResult } from './result'
import * as util from './util'

export class Alt extends Base {
  constructor(parser, options?, value?) {
    super(parser, options, value)
  }

  protected parse(value: any, options?): IResult {
      return undefined
  }

  protected alt(value, options?): IResult {
    this.log('alt', value)
    let parsedRule = this.parse(value)
    let code = '{ALT: () => {\n ' + parsedRule.code + '\n}}'
    let rule = { ALT: parsedRule.rule }
    return { rule, code }
  }
}