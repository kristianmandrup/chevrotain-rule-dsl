import { Base } from './base'
import { IResult } from './result'
import * as util from './util'

export class Subrule extends Base {
  constructor(parser, options?, value?) {
    super(parser, options, value)
  }

  resolve() {
    let value = this.value
    let fun = 'SUBRULE'
    this.log('subrule', value)
    let _rule = (typeof value === 'string') ? this.findRule(value) : value

    // auto-detect reuse of subrule!
    if (this.usedRules[fun]) {
      this.log('repeat rule')
      fun = 'SUBRULE2'
    }
    this.usedRules[fun] = true
    let code = `$.${fun}(` + _rule + ')'
    let rule = () => this.$[fun](rule)
    return { rule, code }
  }
}