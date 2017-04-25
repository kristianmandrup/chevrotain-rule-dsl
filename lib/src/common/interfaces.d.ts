export interface IResult {
    rule: any;
    code?: string;
    node?: object;
}
export interface IConfig {
    parsers?: any;
    rules?: any;
}
export interface IRepeatObj {
    min: number;
    sep: string;
    rule: IResult;
    def: any;
}
export declare type Resolver = (rule: any, options?: object) => IResult;
export interface IRuleParser {
    parse: Resolver;
    repeat: Resolver;
    option: Resolver;
    obj: Resolver;
    list: Resolver;
    string: Resolver;
    word: Resolver;
    spaced: Resolver;
}
export interface IRules {
    repeat: Resolver;
    alt: Resolver;
    consume: Resolver;
    option: Resolver;
    or: Resolver;
    subrule: Resolver;
}
export interface IParsable {
    tokenMap?: object;
    registry?: object;
}
