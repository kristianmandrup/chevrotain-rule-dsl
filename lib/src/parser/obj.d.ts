import { BaseParser } from './base';
import { IResult } from '../common/result';
export declare class ObjParser extends BaseParser {
    constructor(parser: any, rules: any, options: any);
    resolve(rule: any, options?: any): IResult;
    protected resolverFor(key: any): any;
    protected findResolverName(rule: any, options: any): "alt" | "repeat";
    protected resolveRule(rule: any, options: any): IResult;
    protected resolveKey(rule: any, options?: any): IResult;
    protected unknown(key: string): void;
}
