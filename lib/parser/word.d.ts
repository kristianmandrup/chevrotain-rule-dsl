import { Base } from '../common/base';
import { IResult } from '../common/result';
export declare class WordParser extends Base {
    constructor(parser: any, rules: any, options: any);
    protected resolve(rule: any, options?: any): IResult;
}
