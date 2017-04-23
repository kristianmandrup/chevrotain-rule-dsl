import { Base } from '../common/base';
import { IResult } from '../common/result';
export declare class ParseList extends Base {
    constructor(parser: any, rules: any, options: any);
    resolve(rules: any, options?: any): IResult;
    protected alt(value: any): IResult;
    protected parse(rule: any): IResult;
}
