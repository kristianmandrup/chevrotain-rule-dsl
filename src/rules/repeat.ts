import { Base, IRepeatObj } from '../common/base'
import { IResult } from '../common/result'
import * as util from '../common/util'
import {
  ProdType
} from '../gast'
export class Repeat extends Base {
  constructor(parser, options?, value?: IRepeatObj) {
    super(parser, options, value)
  }

  protected calcType(value) {
    if (value.min > 0) {
      return value.sep ? ProdType.AT_LEAST_ONE : ProdType.AT_LEAST_ONE_SEP
    }
    return value.sep ? ProdType.MANY : ProdType.MANY_SEP
  }

  public resolve(): IResult {
    let value: IRepeatObj = this.value
    this.log('repeat', value)
    let rep = {
      SEP: '',
      DEF: () => { }
    }
    let prefix = value.min > 0 ? 'AT_LEAST_ONE' : 'MANY'
    let type = this.calcType(value)
    let postfix = value.sep ? 'SEP' : null
    let fun = postfix ? [prefix, postfix].join('_') : prefix

    this.log('type', fun)

    rep.SEP = value.sep
    this.log('separator', rep.SEP)

    let def = value.rule || value.def
    this.log('def:', def)
    let definition = this.parser.parse(def)
    this.log('definition', definition)

    rep.DEF = () => definition.rule
    let codeRep = {
      SEP: rep.SEP,
      DEF: definition.code
    }
    this.log('repeat rule:', fun, rep)
    let rule = this.$[fun](rep)
    let code = (`$.${fun}(` + codeRep + ')')
    let node = {
      type,
      definition
    }
    return { rule, code, node }
  }
}