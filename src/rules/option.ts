import { BaseRule } from './base'
import { IResult } from '../common/interfaces'
import * as util from '../common/util'
import {
  ProdType
} from '../gast'
export class Option extends BaseRule {
  constructor(parser, options?, value?) {
    super(parser, options, value)
  }

  protected resolve(): IResult {
    let value = this.value
    this.log('option', value)
    let _rule = (typeof value === 'string') ? this.findRule[value] : value
    let parsed = this.parser.parse(_rule)
    if (typeof parsed.rule !== 'function') {
      throw new Error(`option must be function, was ${typeof parsed.rule}`)
    }
    let rule = () => this.$.OPTION(parsed.rule)
    let code = parsed.code
    let type = ProdType.OPTION
    let nested = parsed.node
    let children = Array.isArray(nested) ? nested : [nested]
    let node = {
      type,
      children
    }
    return { rule, code, node }
  }
}