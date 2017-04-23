import { Base, IRepeatObj } from './base'
import { IRuleConfig } from "./../dsl-parser";
import { IResult } from './result'
import * as util from './util'

export class Repeat extends Base {
  constructor(parser, options?, value?: IRepeatObj) {
    super(parser, options, value)
  }

  protected parse(value: any): IResult {
      return undefined
  }

  protected resolve(): IResult {
    let value: IRepeatObj = this.value
    this.log('repeat', value)
    let rep = {
      SEP: '',
      DEF: () => { }
    }
    let prefix = value.min > 0 ? 'AT_LEAST_ONE' : 'MANY'
    let postfix = value.sep ? 'SEP' : null
    let fun = postfix ? [prefix, postfix].join('_') : prefix

    this.log('type', fun)

    rep.SEP = value.sep
    this.log('separator', rep.SEP)

    let def = value.rule || value.def
    this.log('def:', def)
    let definition = this.parse(def)
    this.log('definition', definition)

    rep.DEF = () => definition.rule
    let codeRep = {
      SEP: rep.SEP,
      DEF: definition.code
    }
    this.log('repeat rule:', fun, rep)
    let rule = this.$[fun](rep)
    let code = (`$.${fun}(` + codeRep + ')')
    return { rule, code }
  }
}