import { Abstract } from './abstract'
import * as util from './util'
import { IResult } from './result'
import { IParser } from '../parser/base'
import { RulesParser } from '../parser' 
import { Rules } from '../rules'

let registry = {}
export interface IRepeatObj {
    min: number
    sep: string
    rule: IResult
    def: any
}

export type Resolver = (rule: any, options?:object) => IResult
export interface IRuleParser {
    parse: Resolver
    repeat: Resolver
    option: Resolver
    obj: Resolver
    list: Resolver
    string: Resolver
    word: Resolver
    spaced: Resolver // TODO: move to string parser?
}
export interface IRules {
    repeat: Resolver
    alt: Resolver
    consume: Resolver
    option: Resolver
    or: Resolver
    subrule: Resolver
}
export interface IParsable {
    tokenMap?: object
    registry?: object
}

export class Base extends Abstract  {
    value: any
    tokenMap = {}
    usedRules = {}
    _registry = {}

    parser: IRuleParser
    rules: IRules

    constructor(parser, options: IParsable = {}, value?) {
        super(parser, options)
        this.value = value
        this.parser = new RulesParser(parser, options)
        this.rules = new Rules(parser, options)

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
