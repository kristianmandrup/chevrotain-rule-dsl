import { Abstract } from './abstract';
import { IResult } from './result';
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
export declare class Base extends Abstract {
    value: any;
    tokenMap: {};
    usedRules: {};
    _registry: {};
    parser: IRuleParser;
    rules: IRules;
    constructor(parser: any, options?: IParsable, value?: any);
    protected validate(parser: any): void;
    findRule(name: any): any;
    readonly registry: {};
    register(name: any, rule: any): void;
    findToken(value: any): any;
    resolveToken(token: any): any;
}
