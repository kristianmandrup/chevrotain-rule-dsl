import { Base } from './base'
import { IResult } from './result'
import * as util from './util'

export class Options extends Base {
  constructor(parser, options?, value?) {
    super(parser, options, value)
  }

  protected parse(value: any, options?): IResult {
      return undefined
  }

  protected resolve(): IResult {
    let value = this.value
    this.log('option', value)
    let _rule = (typeof value === 'string') ? this.findRule[value] : value
    let parsed = this.parse(_rule)
    if (typeof parsed.rule !== 'function') {
      throw new Error(`option must be function, was ${typeof parsed.rule}`)
    }

    let rule = () => this.$.OPTION(parsed.rule)
    let code = parsed.code
    return { rule, code }
  }
}