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

  public resolve(value) {
    let fun = 'SUBRULE'
    this.log('subrule', value)
    let ruleRef = this.resolveRuleRef(value)
    if (!ruleRef) {
      throw new Error(`ruleRef could not be resolved for: ${value}`)
    }
    let name = (typeof value === 'string') ? ruleRef : ruleRef.toString()
    this.log('subrule', { ruleRef, name })

    let repeatCount = 0
    // auto-detect reuse of subrule!
    if (this.usedRules[fun]) {
      this.log('repeat rule')
      fun = 'SUBRULE2'
      repeatCount++
    }
    this.usedRules[fun] = true
    let code = `$.${fun}(` + name + ')'
    let rule = () => this.$[fun](ruleRef)

    let type = ProdType.REF
    let node = {
      type,
      name,
      repeatCount
    } 
    return { rule, code, node }
  }
}