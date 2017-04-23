import { Base } from '../common/base'
import { IResult } from '../common/result'
import * as util from '../common/util'

export class Option extends Base {
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
    return { rule, code }
  }
}