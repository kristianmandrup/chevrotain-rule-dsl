import { Basic } from '../common/basic'

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

    constructor(parser, options) {
        super(parser, options)
        // this.configure()
    }

    protected configure() {
        let keys = Object.keys(ruleRegistry)
        console.log('Rules configure',keys)
        keys.map(key => {
            console.log('add rule',key)
            this[key] = this.resolverFor(key)
        })
    }

    protected resolverFor(name) {
        let inst = new ruleRegistry[name](this.$, this.options)
        return inst.resolve.bind(this)
    }
}

export function createRules(parser, options) {
    return new Rules(parser, options)
}