import { Abstract } from '../common/abstract';
import { IRuleParser } from '../common/base';
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
import { Resolver } from '../common/base';
export declare class RulesParser extends Abstract implements IRuleParser {
    parse: Resolver;
    repeat: Resolver;
    option: Resolver;
    obj: Resolver;
    list: Resolver;
    string: Resolver;
    word: Resolver;
    spaced: Resolver;
    constructor(parser: any, options: any);
    protected configure(): void;
    protected createFun(name: any): (value: any, options: any) => any;
}
export declare function create(parser: any, options: any): RulesParser;
