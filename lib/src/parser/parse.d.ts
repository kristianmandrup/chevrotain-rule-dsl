import { Base } from '../common/base';
import { IResult } from '../common/result';
export declare class ValueParser extends Base {
    constructor(parser: any, rules: any, options: any);
    resolve(rule: any, options?: {}): IResult;
}
