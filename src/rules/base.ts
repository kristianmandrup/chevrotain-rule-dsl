import { Base } from '../common/base'
import { IConfig } from '../common/interfaces'
import {
  RulesParser
} from '../parser'
import {
  Rules
} from '../rules'

export class BaseRule extends Base implements IConfig {
    parser?: any // IRuleParser
    rules?: any // IRules

  constructor(parser, rules, options) {
    super(parser, rules, options)
  }

  public config(conf:IConfig = {}) {
    this.parser = this.parser || conf.parser
    this.rules = this.rules || conf.rules
    return this
  }    
}