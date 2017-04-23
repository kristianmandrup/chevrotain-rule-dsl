import { Base } from '../common/base';
import { IResult } from '../common/result';
export declare class ParseObj extends Base {
    constructor(parser: any, rules: any, options: any);
    parse(rule: any, options?: any): IResult;
    protected resolverFor(key: any): any;
    protected findResolverName(rule: any, options: any): "alt" | "repeat";
    protected resolveRule(rule: any, options: any): IResult;
    protected resolve(rule: any, options?: any): IResult;
    protected resolveKey(rule: any, options?: any): IResult;
    protected unknown(key: string): void;
}
