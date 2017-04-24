import { Abstract } from '../common/abstract'
import { IRuleParser } from '../common/base'

import { ObjParser } from './obj'
import { ListParser } from './list'
import { ValueParser } from './parse'
import { OptionParser } from './option'
import { RepeatParser } from './repeat'
import { SpacedParser } from './spaced'
import { StringParser } from './string'
import { WordParser } from './word'

export const allParsers = {
    ObjParser,
    ListParser,
    ValueParser,
    OptionParser,
    RepeatParser,
    SpacedParser,
    StringParser,
    WordParser
}

const parserRegistry = {
    obj: ObjParser,
    list: ListParser,
    option: OptionParser,
    parse: ValueParser,
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
        let keys = Object.keys(parserRegistry)
        console.log('configure parsers', keys)
        keys.map(key => {
            console.log('add parser', key)
            this[key] = this.createFun(key)
        })
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