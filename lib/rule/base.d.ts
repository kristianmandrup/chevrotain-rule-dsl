import { Logger } from '../logger';
import { IResult } from './result';
export interface IRepeatObj {
    min: number;
    sep: string;
    rule: IResult;
    def: any;
}
export declare class Base extends Logger {
    value: any;
    options: object;
    $: any;
    tokenMap: {};
    usedRules: {};
    _registry: {};
    constructor(parser: any, options?: any, value?: any);
    protected validate(parser: any): void;
    findRule(name: any): any;
    readonly registry: {};
    register(name: any, rule: any): void;
    findToken(value: any): any;
    resolveToken(token: any): any;
}
