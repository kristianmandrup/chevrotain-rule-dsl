import { BaseParser } from './base'
import { IResult } from '../common/interfaces'
import * as util from '../common/util'

export class OptionParser extends BaseParser {
  constructor(parser, rules, options) {
    super(parser, rules, options)
  }

  public resolve(rule, options): IResult {
    const regExp = /\(([^)]+)\)(\?)/;
    let matches = regExp.exec(rule)
    if (matches && matches.length > 0) {
      let match = matches[1]
      return this.funs.option(match)
    }
  }
}