import { Base } from '../common/base';
import { IResult } from '../common/result';
export declare class Alt extends Base {
    constructor(parser: any, options?: any, value?: any);
    protected resolve(value: any, options?: any): IResult;
}
