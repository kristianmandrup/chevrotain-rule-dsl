import { BaseParser } from './base'
import { IResult } from '../common/interfaces'
import * as util from '../common/util'

const repeatExp = /\(([^)]+)\)([+\*])/;

export class RepeatParser extends BaseParser {
  constructor(parser, rules, options) {
    super(parser, rules, options)
  }

  public resolve(value, options): IResult {
    // repeat
    this.log('repeat', value, options)
    let matches = repeatExp.exec(value)
    if (!(matches && matches.length > 0)) {
      return
    }
    let words = matches[1].split(/\s+/)
    let lastWord = words.splice(-1, 1)
    let sep = lastWord
    let min = matches[2] == '+' ? 1 : 0
    return this.rules.repeat({
      sep,
      min,
      def: words.join(' ')
    })
  }
}
}