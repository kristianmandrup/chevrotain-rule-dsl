import { Abstract } from '../common/abstract'
import { IRules } from '../common/base'

import { Alt } from './alt'
import { Consume } from './consume'
import { Or } from './or'
import { Option } from './option'
import { Repeat } from './repeat'
import { Subrule } from './subrule'

const ruleRegistry = {
    alt: Alt,
    consume: Consume,
    or: Or,
    option: Option,
    repeat: Repeat,
    subrule: Subrule
}

export class Rules extends Abstract implements IRules {
    repeat: Function
    alt: Function
    consume: Function
    option: Function
    or: Function
    subrule: Function

    constructor(parser, options) {
        super(parser, options)
        this.configure()
    }

    protected configure() {
        Object.keys(ruleRegistry).map(key => this.createFun(key))
    }

    protected createFun(name) {
        return (value, options) => {
            let inst = new ruleRegistry[name](this.$, this.options)
            return inst.resolve(value, options)
        }
    }
}

export function create(parser, options) {
    return new Rules(parser, options)
}