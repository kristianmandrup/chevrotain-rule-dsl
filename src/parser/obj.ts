import { Base } from '../common/base'
import { IResult } from '../common/result'
import * as util from '../common/util'

console.log('Base', Base)

export class ObjParser extends Base {
  constructor(parser, rules, options) {
    super(parser, rules, options)
  }

  public resolve(rule, options?): IResult {
    this.log('parseObj', rule, options)
    return this.resolveRule(rule, options) || this.resolveKey(rule, options)
  }
 
  protected resolverFor(key) {
    return this.rules[key]
  }

  protected findResolverName(rule, options) {
    if (util.isAlt(options)) return 'alt'
    if (util.isRepeat(rule)) return 'repeat'
  }

  protected resolveRule(rule, options): IResult {
    let resolver = this.resolverFor(this.findResolverName(rule, options))
    return resolver ? resolver(rule) : undefined
  }

  protected resolveKey(rule, options?): IResult {
    let key = Object.keys(rule)[0]
    let value = rule[key]
    let resolver = this.resolverFor(key)
    return resolver ? resolver(value) : this.unknown(key)
  }

  protected unknown(key: string) {
    throw new Error(`Unknown key in rule object: ${key}`)
  }
}