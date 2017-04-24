import { Base } from '../common/base';
import { IResult } from '../common/result';
export declare class ListParser extends Base {
    constructor(parser: any, rules: any, options: any);
    resolve(rules: any, options?: any): IResult;
}
