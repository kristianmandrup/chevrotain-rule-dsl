import { Base, IRepeatObj } from '../common/base';
import { IResult } from '../common/result';
export declare class Or extends Base {
    constructor(parser: any, options?: any, value?: IRepeatObj);
    protected parse(value: any, options?: any): IResult;
    protected resolve(alternatives: any, options?: any): IResult;
}
