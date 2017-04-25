import { Basic } from '../common/basic'
import { ParserDefinitionErrorType } from "./../dsl-parser";

import { Alt } from './alt'
import { Consume } from './consume'
import { Or } from './or'
import { Option } from './option'
import { Repeat } from './repeat'
import { Subrule } from './subrule'

import { Resolver, IRules } from '../common/interfaces'

export const allRules = {
    Alt,
    Consume,
    Or,
    Option,
    Repeat,
    Subrule
}

const ruleRegistry = {
    alt: Alt,
    consume: Consume,
    or: Or,
    option: Option,
    repeat: Repeat,
    subrule: Subrule
}

export class Rules extends Basic implements IRules {
    repeat: Resolver
    alt: Resolver
    consume: Resolver
    option: Resolver
    or: Resolver
    subrule: Resolver
    ruleKeys: string[]
    configured = false

    constructor(parser, options) {
        super(parser, options)
    }

    public config(ctx) {
        console.log('Rules config', this.ruleKeys)
        this.ruleKeys.map(key => {
            this[key].config(ctx)
        })
    }

    public configure() {
        if (this.configured) return
        this.ruleKeys = Object.keys(ruleRegistry)
        console.log('Rules configure', this.ruleKeys)
        this.ruleKeys.map(key => {
            console.log('add rule',key)
            this[key] = this[key] || this.resolverFor(key)
        })
        this.configured = true
        return this
    }

    protected resolverFor(name) {
        return new ruleRegistry[name](this.$, this.options)
    }
}

export function createRules(parser, options) {
    return new Rules(parser, options)
}