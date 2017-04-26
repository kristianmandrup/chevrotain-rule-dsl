import { BaseRule } from './base'
import { IResult, IRepeatObj } from '../common/interfaces'
import * as util from '../common/util'
import { IRuleConfig } from "./../dsl-parser";
import {
  ProdType
} from '../gast'

export class Or extends BaseRule {
  constructor(parser, options?, value?: IRepeatObj) {
    super(parser, options, value)
  }

  public resolve(alternatives, options?): IResult {
    this.log('or', alternatives)
    let parsed = this.funs.parse(alternatives, { parent: 'or' })
    let code = '$.OR([' + parsed.code + '])'
    let children = parsed.node
    let type = ProdType.OR
    let node = {
      type,
      children
    }
    let rule = () => this.$.OR(parsed.rule)
    return { rule, code, node }
  }
}