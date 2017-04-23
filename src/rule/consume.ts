import { Base } from '../common/base'
import { IResult } from '../common/result'
import * as util from '../common/util'

export class Consume extends Base {
  constructor(parser, options?, value?) {
    super(parser, options, value)
  }

  // must be a Token
  public resolve(): IResult {
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
