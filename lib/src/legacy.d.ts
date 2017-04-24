import { Base } from './common/base';
import { IResult } from './common/result';
export declare class RuleParser extends Base {
    codeStr: string;
    constructor(parser: any, options?: {
        logging: boolean;
        logMap: {};
        registry: any;
        tokenMap: {};
    });
    parse(rule: any, options?: {}): IResult;
    parseRepeat(rule: any, options: any): IResult;
    parseOption(rule: any, options: any): IResult;
    parseSpaced(rule: any, options: any): IResult;
    protected parseString(rule: any, options?: any): IResult;
    protected parseWord(rule: any, options?: any): IResult;
    protected parseList(rules: any, options?: any): IResult;
    protected parseObj(rule: any, options?: any): IResult;
    subrule(value: any, options?: any): {
        rule: () => any;
        code: string;
    };
    protected consume(value: any, options?: any): IResult;
    protected alt(value: any, options?: any): IResult;
    protected repeat(value: any, options?: any): IResult;
    protected or(alternatives: any, options?: any): IResult;
    protected option(value: any, options?: any): IResult;
    protected rule(name: any, rule: any, config: any): Function;
    createRule(name: string, rules: any, options: any): Function;
}
export declare function rule(parser: any, name: string, rules: any, options?: any): Function;
