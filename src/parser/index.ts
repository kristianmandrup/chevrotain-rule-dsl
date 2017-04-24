import { Basic } from '../common/basic'

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
    string: StringParser,
    word: WordParser
}

import { Resolver, IRuleParser } from '../common/interfaces'

export class RulesParser extends Basic implements IRuleParser {
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
        // this.configure()
    }

    public configure() {
        let keys = Object.keys(parserRegistry)
        console.log('configure parsers', keys)
        keys.map(key => {
            console.log('add parser', key)
            this[key] = this.resolverFor(key)
        })
        return this
    }

    protected resolverFor(name) {
        let inst = new parserRegistry[name](this.$, this.options)
        inst.config({parser: this})
        return inst.resolve.bind(inst)
    }
}

export function create(parser, options) {
    return new RulesParser(parser, options)
}