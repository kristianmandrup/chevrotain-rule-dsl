import { Base } from '../common/base'
import { IResult } from '../common/result'
import * as util from '../common/util'
import {
  ProdType
} from '../gast'

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
    let type = ProdType.FLAT
    let children = [] // TODO
    let node = {
      type,
      children
    }   
    return { rule, code, node }
  }
}
