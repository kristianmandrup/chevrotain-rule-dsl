import { Base } from '../common/base';
import { IResult } from '../common/result';
export declare class ParseRepeat extends Base {
    constructor(parser: any, rules: any, options: any);
    protected repeat(value: any): any;
    resolve(rule: any, options: any): IResult;
}
