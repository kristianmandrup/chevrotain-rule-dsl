import { Basic } from './basic';
import { IConfig } from './interfaces';
import { IParsable } from './interfaces';
export declare class Base extends Basic implements IConfig {
    value: any;
    tokenMap: {};
    usedRules: {};
    _registry: {};
    constructor(parser: any, options?: IParsable, value?: any);
    protected findRule(name: any): any;
    readonly registry: {};
    protected register(name: any, rule: any): void;
    protected findToken(value: any): any;
    protected resolveToken(token: any): any;
}
