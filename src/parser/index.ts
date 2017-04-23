import { Abstract } from '../common/abstract'
import { IRuleParser } from '../common/base'

import { ObjParser } from './obj'
import { ListParser } from './list'
import { RuleParser } from './parse'
import { OptionParser } from './option'
import { RepeatParser } from './repeat'
import { SpacedParser } from './spaced'
import { StringParser } from './string'
import { WordParser } from './word'

const parserRegistry = {
    obj: ObjParser,
    list: ListParser,
    option: OptionParser,
    parse: RuleParser,
    repeat: RepeatParser,
    spaced: SpacedParser,
    word: WordParser
}

import { Resolver } from '../common/base'

export class RulesParser extends Abstract implements IRuleParser {
    parse: Resolver
    repeat: Resolver
    option: Resolver
    obj: Resolver
    list: Resolver
    string: Resolver
    word: Resolver
    spaced: Resolver

    constructor(parser, options) {
        super(parser, options)
        this.configure()
    }

    protected configure() {
        Object.keys(parserRegistry).map(key => this.createFun(key))
    }

    protected createFun(name) {
        return (value, options) => {
            let inst = new parserRegistry[name](this.$, this.options)
            return inst.resolve(value, options)
        }
    }
}

export function create(parser, options) {
    return new RulesParser(parser, options)
}