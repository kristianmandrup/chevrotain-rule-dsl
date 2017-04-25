import { BaseRule } from './base'
import { IResult, IRepeatObj } from '../common/interfaces'
import * as util from '../common/util'
import {
  ProdType
} from '../gast'

export class Subrule extends BaseRule {
  constructor(parser, options?, value?) {
    super(parser, options, value)
  }

  public resolve() {
    let value = this.value
    let fun = 'SUBRULE'
    this.log('subrule', value)
    let _rule = (typeof value === 'string') ? this.findRule(value) : value
    let name = (typeof value === 'string') ? value : value.toString()

    let repeatCount = 0
    // auto-detect reuse of subrule!
    if (this.usedRules[fun]) {
      this.log('repeat rule')
      fun = 'SUBRULE2'
      repeatCount++
    }
    this.usedRules[fun] = true
    let code = `$.${fun}(` + _rule + ')'
    let rule = () => this.$[fun](rule)

    let type = ProdType.REF
    let node = {
      type,
      name,
      repeatCount
    } 
    return { rule, code, node }
  }
}