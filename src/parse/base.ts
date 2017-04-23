import { Logger } from '../logger'

export class Base extends Logger {
  parser: any
  rules: any

  constructor(parser, rules, options) {
    super(options)
    this.parser = parser
    this.rules = rules
  }
}