import { Base } from '../common/base';
import { IResult } from '../common/result';
export declare class ParseSpaced extends Base {
    constructor(parser: any, rules: any, options: any);
    parse(rule: any, options: any): IResult;
    protected parseList(list: any, options: any): any;
    protected or(value: any): any;
}
