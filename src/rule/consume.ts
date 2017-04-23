import { Base } from './base'
import { IResult } from './result'
import * as util from './util'

export class Consume extends Base {
  constructor(parser, options?, value?) {
    super(parser, options, value)

  }

  // must be a Token
  public consume(): IResult {
    let value = this.value
    this.log('consume', value)
    let token = this.resolveToken(value)
    let code = '$.CONSUME(' + util.codeOf(token) + ')'
    let $ = this.$
    let rule = () => $.CONSUME(token).bind($)
    let result = { rule, code }
    this.log('consumed', result)
    return result
  }
}
