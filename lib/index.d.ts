export interface IResult {
    rule: any;
    code: string;
}
export declare class RuleParser {
    static registry: {};
    usedRules: {};
    _registry: {};
    code: any[];
    tokenMap: {};
    codeStr: string;
    logging: boolean;
    logRule: boolean;
    $: any;
    constructor(parser: any, options?: {
        logging: boolean;
        registry: any;
        tokenMap: {};
    });
    findToken(value: any): any;
    resolveToken(token: any): any;
    parse(rule: any, options?: {}): IResult;
    parseRepeat(rule: any, options: any): IResult;
    parseOption(rule: any, options: any): IResult;
    parseSpaced(rule: any, options: any): IResult;
    protected parseString(rule: any, options?: any): IResult;
    protected parseWord(rule: any, options?: any): IResult;
    protected parseList(rules: any, options?: any): IResult;
    protected parseObj(rule: any, options?: any): IResult;
    readonly islogging: boolean;
    log(msg: any, ...args: any[]): void;
    findRule(name: any): any;
    readonly registry: {};
    register(name: any, rule: any): void;
    addCode(ruleCode: any): void;
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
