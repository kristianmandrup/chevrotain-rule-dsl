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

export class Parsers extends Basic implements IRuleParser {
    parse: Resolver
    repeat: Resolver
    option: Resolver
    obj: Resolver
    list: Resolver
    string: Resolver
    word: Resolver
    spaced: Resolver
    parserKeys: string[]
    configured = false

    constructor(parser, options) {
        super(parser, options)
    }

    public config(ctx) {
        console.log('Parser config', this.parserKeys)
        this.parserKeys.map(key => {
            this[key].config(ctx)
        })
    }

    public configure() {
        if (this.configured) return
        this.parserKeys = Object.keys(parserRegistry)
        console.log('Parser configure', this.parserKeys)
        this.parserKeys.map(key => {
            console.log('add parser', key)
            this[key] = this[key] || this.resolverFor(key)
        })
        this.configured = true
        return this
    }

    protected resolverFor(name) {
        return new parserRegistry[name](this.$, this.options)
    }
}

export function create(parser, options) {
    return new Parsers(parser, options)
}