import { BaseParser } from './base'
import { IResult } from '../common/interfaces'
import * as util from '../common/util'

export class ObjParser extends BaseParser {
  ruleKeys = [
    'repeat',
    'alt'
  ]

  constructor(parser, rules, options) {
    super(parser, rules, options)
  }

  public resolve(rule, options?): IResult {
    this.log('parseObj', rule, options)
    return this.resolveRule(rule, options) || this.resolveKey(rule, options)
  }
 
  protected resolverFor(key) {
    console.log('resolverFor', this.rules.funs, key)
    return this.rules.funs[key]
  }

  protected findResolverName(rule, options) {
    console.log('findResolver', rule)
    if (util.isAlt(options)) return 'alt'
    if (util.isRepeat(rule)) return 'repeat'
  }

  protected resolveRule(rule, options): IResult {
    let name = this.findResolverName(rule, options)
    console.log('name', name)
    let resolver = this.resolverFor(name)
    if (typeof resolver === 'function') return resolver(rule) 
    console.warn('Not a resolver', {rule, options}, typeof resolver)
    return undefined
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