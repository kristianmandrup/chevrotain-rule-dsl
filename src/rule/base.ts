import { Logger } from '../logger'
import * as util from './util'

let registry = {}

export class Base extends Logger {
    value: string
    options: object
    $: any
    tokenMap = {}
    usedRules = {}
    _registry = {}

    constructor(parser, options?, value?) {
        super(options)
        this.$ = parser
        this.value = value
        this.options = options

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