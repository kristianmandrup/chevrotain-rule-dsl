export { DslParser } from './dsl-parser';
export { GastBuilder } from './gast-builder';
import { Rules, allRules } from './rules';
import { Parsers, allParsers } from './parser';
export { RuleParser, rule } from './legacy';
export { allRules, allParsers, Rules, Parsers };
import { Base } from './common/base';
export declare class NewRuleParser extends Base {
    codeStr: string;
    constructor(parser: any, options?: {
        logging: boolean;
        logMap: {};
        registry: any;
        tokenMap: {};
    });
    protected rule(name: any, rule: any, config: any): Function;
    createRule(name: string, rules: any, options: any): Function;
}
export declare function createRule(parser: any, name: string, rules: any, options?: any): Function;
