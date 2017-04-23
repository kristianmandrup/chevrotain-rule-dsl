import { Base, IRepeatObj } from '../common/base'
import { IResult } from '../common/result'
import * as util from '../common/util'
import { IRuleConfig } from "./../dsl-parser";

export class Or extends Base {
  constructor(parser, options?, value?: IRepeatObj) {
    super(parser, options, value)
  }

  public resolve(alternatives, options?): IResult {
    this.log('or', alternatives)
    let parsed = this.parser.parse(alternatives, { parent: 'or' })
    let code = '$.OR([' + parsed.code + '])'
    let rule = () => this.$.OR(parsed.rule)
    return { rule, code }
  }
}