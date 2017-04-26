import { BaseRule } from './base'
import { IResult, IRepeatObj } from '../common/interfaces'
import * as util from '../common/util'
import {
  ProdType
} from '../gast'
export class Repeat extends BaseRule {
  parseKeys = [
    'parse'
  ]

  constructor(parser, options?, value?: IRepeatObj) {
    super(parser, options, value)
  }

  protected calcType(value) {
    if (value.min > 0) {
      return value.sep ? ProdType.AT_LEAST_ONE : ProdType.AT_LEAST_ONE_SEP
    }
    return value.sep ? ProdType.MANY : ProdType.MANY_SEP
  }

  public resolve(value, options: object): IResult {
    this.log('repeat', value)
    let rep = {
      SEP: value.sep,
      DEF: () => { }
    }
    let prefix = value.min > 0 ? 'AT_LEAST_ONE' : 'MANY'
    let type = this.calcType(value)
    let postfix = value.sep ? 'SEP' : null
    let fun = postfix ? [prefix, postfix].join('_') : prefix

    this.log('type', fun)
    this.log('separator', rep.SEP)

    let def = value.rule || value.def
    this.log('def:', def)
    let definition = this.funs.parse(def)
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
      sepName: value.sep,
      definition
    }
    return { rule, code, node }
  }
}