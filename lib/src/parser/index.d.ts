import { Basic } from '../common/basic';
import { ObjParser } from './obj';
import { ListParser } from './list';
import { ValueParser } from './parse';
import { OptionParser } from './option';
import { RepeatParser } from './repeat';
import { SpacedParser } from './spaced';
import { StringParser } from './string';
import { WordParser } from './word';
export declare const allParsers: {
    ObjParser: typeof ObjParser;
    ListParser: typeof ListParser;
    ValueParser: typeof ValueParser;
    OptionParser: typeof OptionParser;
    RepeatParser: typeof RepeatParser;
    SpacedParser: typeof SpacedParser;
    StringParser: typeof StringParser;
    WordParser: typeof WordParser;
};
import { Resolver, IRuleParser } from '../common/interfaces';
export declare class RulesParser extends Basic implements IRuleParser {
    parse: Resolver;
    repeat: Resolver;
    option: Resolver;
    obj: Resolver;
    list: Resolver;
    string: Resolver;
    word: Resolver;
    spaced: Resolver;
    constructor(parser: any, options: any);
    configure(): this;
    protected resolverFor(name: any): any;
}
export declare function create(parser: any, options: any): RulesParser;
