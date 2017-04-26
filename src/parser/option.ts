import { BaseParser } from './base'
import { IResult } from '../common/interfaces'
import * as util from '../common/util'

const optionExpr = /\(([^)]+)\)(\?)/

function isOption(rule) {
    let matches = optionExpr.exec(rule)
    return matches && matches.length > 0 ? matches : false
}

export class OptionParser extends BaseParser {
  ruleKeys = [
    'option'
  ]
  constructor(parser, options) {
    super(parser, options)
  }

  public resolve(rule, options): IResult {
    this.log('option', {rule, options})
    if (typeof rule !== 'string') {
      this.error(`option can only parse string: ${rule}`)
    }
    let matches = isOption(rule)
    if (!matches) {
      this.error('no option match')
      return
    }
    let match = matches[1]
    this.log('option', {matches, match})
    return this.rules.funs.option(match, options)
  }
}