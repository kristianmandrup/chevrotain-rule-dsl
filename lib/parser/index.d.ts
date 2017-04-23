import { Abstract } from '../common/abstract';
import { IRuleParser } from '../common/base';
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
