import { Abstract } from './abstract'
import * as util from './util'
import { IResult } from './result'

let registry = {}

export interface IRepeatObj {
    min: number
    sep: string
    rule: IResult
    def: any
}

export interface IRuleParser {
    parse: Function
    repeat: Function
    obj: Function
    list: Function
    string: Function
    spaced: Function // TODO: move to string parser?
}

export interface IRules {
    repeat: Function
    alt: Function
    consume: Function
    option: Function
    or: Function
    subrule: Function
}

export class Base extends Abstract {
    value: any
    tokenMap = {}
    usedRules = {}
    _registry = {}

    parser: IRuleParser
    rules: IRules

    constructor(parser, options?, value?) {
        super(parser, options)
        this.value = value

        let tokenMap = util.toTokenMap(parser['tokensMap'])
        this.tokenMap = Object.assign(tokenMap, options.tokenMap)
        this.usedRules = {}
        this._registry = parser['registry'] || options.registry || registry
    }

    protected validate(parser) {
        if (!(parser && parser.RULE)) {
            console.error('parser', parser)
            throw new Error('RuleParser must be created with a Parser instance that has a public RULE method')
        }
    }

    findRule(name) {
        return this.registry[name]
    }

    get registry() {
        return this._registry
    }

    register(name, rule) {
        this.registry[name] = rule
    }

    findToken(value) {
        return this.tokenMap[value] || this.tokenMap[value.name]
    }

    resolveToken(token) {
        return this.findToken(token) || token
    }
}