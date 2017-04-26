import { Basic } from './basic'
import { IConfig } from './interfaces'
import * as util from './util'
import { IParser } from '../parser/base'

let registry = {}

import {
    IRuleParser,
    IRules,
    IParsable
} from './interfaces'

export class Base extends Basic implements IConfig {
    name?: string
    value: any
    tokenMap = {}
    usedRules = {}
    _registry = {}

    constructor(parser, options: IParsable = {}, value?) {
        super(parser, options)
        this.value = value
        let tokenMap = util.toTokenMap(parser['tokensMap'])
        this.tokenMap = Object.assign(tokenMap, options.tokenMap)
        this.usedRules = {}
        this._registry = parser['registry'] || options.registry || registry
    }

    protected resolveRuleRef(ref) {
        switch (typeof ref) {
            case 'string':
                return this.findRule(ref)
            case 'function':
                return ref
            default:
                console.error(ref)
                throw new Error(`Invalid rule ref: ${ref}`)
        }
    }

    protected findRule(name) {
        if (typeof name !== 'string') {
            throw new Error(`findRule must take a string: ${name}`)
        }
        return this.registry[name]
    }

    get registry() {
        return this._registry
    }

    protected register(name, rule) {
        this.registry[name] = rule
    }

    protected findToken(value) {
        if (!value) {
            console.error('invalid token value', value)
            return
        }
        return this.tokenMap[value] || this.tokenMap[value.name]
    }

    protected resolveToken(token) {
        return this.findToken(token) || token
    }
}
