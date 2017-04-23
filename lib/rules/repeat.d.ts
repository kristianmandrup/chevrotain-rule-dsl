import { Base, IRepeatObj } from '../common/base';
import { IResult } from '../common/result';
export declare class Repeat extends Base {
    constructor(parser: any, options?: any, value?: IRepeatObj);
    protected resolve(): IResult;
}
