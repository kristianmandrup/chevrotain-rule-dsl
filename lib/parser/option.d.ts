import { Base } from '../common/base';
import { IResult } from '../common/result';
export declare class ParseOption extends Base {
    constructor(parser: any, rules: any, options: any);
    protected option(value: any): any;
    resolve(rule: any, options: any): IResult;
}
