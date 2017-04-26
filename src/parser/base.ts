import { Resolver, IResult } from '../common/interfaces'
import { Base } from '../common/base'
import { IConfig } from '../common/interfaces'

export interface IParser {
    resolve: Resolver
}

import {
    Parsers
} from '../parser'

import {
    Rules
} from '../rules'

export class BaseParser extends Base implements IConfig {
    parserKeys: string[] = []
    ruleKeys: string[] = []
    parsers?: any // IRuleParser
    rules?: any // IRules
    funs: any

    constructor(parser, rules, options) {
        super(parser, rules, options)
    }

  protected unknown(rule, options?) {
    console.error('unknown rule', rule, options)
    throw new Error('unknown rule')
  }

    protected methodize() {
        this.methodizeParsers()
        this.methodizeRules()
    }

    protected methodizeParsers() {
        console.log('methodizeParsers', this.name)
        if (!this.parsers) {
            throw new Error('methodize: missing parser')
        }
        console.log('parserKeys', this.name, this.parserKeys)
        this.parsers.funs = this.parsers.funs|| {}
        let self = this
        this.parserKeys.map(key => {
            let inst = this.parsers[key]
            console.log('parsers methodize', key)
            if (inst) {
                let fun = inst.resolve.bind(self)
                this.parsers.funs[key] = fun
            } else {
                console.log('no parse inst', key)
            }
        })
        console.log('parsers', this.parsers.funs)
    }

    protected methodizeRules() {
        console.log('methodizeRules', this.name)
        if (!this.rules) {
            throw new Error('methodize: missing rules')
        }
        this.rules.funs = this.rules.funs || {}
        let self = this
        return this.ruleKeys.map(key => {
            console.log('rules methodize', key)
             let inst = this.rules[key]
            if (inst) {
                let fun = inst.resolve.bind(self)
                this.rules.funs[key] = fun
            } else {
                console.log('no rule inst', key)
            }
        })
    }

    public config(conf: IConfig = {}) {
        this.configParser(conf)
        this.configRules(conf)
        this.methodize()
        this.funs = Object.assign(this.parsers.funs, this.rules.funs)
        Object.keys(this.funs).map(key => this[key] = this.funs[key])
        return this
    }

    protected configParser(conf: IConfig = {}) {
        console.log('BaseParser config parser')
        this.parsers = conf.parsers
    }

    protected configRules(conf: IConfig = {}) {
        console.log('BaseParser config rules')
        this.rules = conf.rules
    }
}