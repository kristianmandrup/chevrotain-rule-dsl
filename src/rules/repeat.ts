import { BaseRule } from './base'
import { IResult, IRepeatObj } from '../common/interfaces'
import * as util from '../common/util'
import {
  ProdType
} from '../gast'

function calcType(value) {
  if (value.min > 0) {
    return value.sep ? ProdType.AT_LEAST_ONE : ProdType.AT_LEAST_ONE_SEP
  }
  return value.sep ? ProdType.MANY : ProdType.MANY_SEP
}
export class Repeat extends BaseRule {
  parseKeys = [
    'parse'
  ]

  constructor(parser, options?, value?: IRepeatObj) {
    super(parser, options, value)
  }

  public resolve(value, options: object): IResult {
    const log = this.logger('repeat')

    log({value, options})

    if (typeof value !== 'object') {
      this.error(`Repeat rule must take an object, was: ${value}`)
    }
    let sep = value.sep
    let rep = {}
    if (sep) {
      rep['SEP'] = sep
    }
    log('rep', rep)
    let prefix = value.min > 0 ? 'AT_LEAST_ONE' : 'MANY'
    let type = calcType(value)
    let postfix = value.sep ? 'SEP' : false
    let fun = postfix ? [prefix, postfix].join('_') : prefix

    log('type', fun)
    let def = value.rule || value.def
    log('def', def)
    let definition = this.funs.parse(def)
    log('definition', definition)

    rep['DEF'] = () => definition.rule
    let defCode = definition.code
    let codeDEF = `() => {\n${defCode}\n}`
    let codeRep = {
      DEF: codeDEF
    }
    if (sep) {
      codeRep['SEP'] = sep
    }

    log('rule:', fun, rep, codeRep)
    let ruleFun = this.$[fun]
    let rule = ruleFun(rep)
    let code = `$.${fun}(${codeRep})`
    let node = {
      type,
      definition
    }
    if (sep) {
      node['sepName'] = sep
    }

    log({node})
    return { rule, code, node }
  }
}