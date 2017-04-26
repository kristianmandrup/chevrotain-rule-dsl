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

  protected resolve(value, options?): IResult {
    this.log('option', value)
    let ruleRef = (typeof value === 'string') ? this.findRule(value) : value
    if (!ruleRef) {
      // this.error(`Not a ruleRef: ${ruleRef}`)
      ruleRef = value
    }
    let parsed = this.funs.parse(ruleRef)
    if (typeof parsed.rule !== 'function') {
      this.error(`option must be function, was ${typeof parsed.rule}`)
    }
    let rule = () => this.$.OPTION(parsed.rule)
    let code = `() => this.$.OPTION(${parsed.code})`
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