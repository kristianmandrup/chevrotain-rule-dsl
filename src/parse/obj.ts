import { Base } from './base'
import { IResult } from '../rule/result'
import * as util from '../rule/util'

export class ParseObj extends Base {
  constructor(parser, rules, options) {
    super(parser, rules, options)
  }

  public parse(rule, options?): IResult {
    this.log('parseObj', rule, options)
    return this.resolve(rule, options)
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

  protected resolve(rule, options?): IResult {
    return this.resolveRule(rule, options) || this.resolveKey(rule, options)
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