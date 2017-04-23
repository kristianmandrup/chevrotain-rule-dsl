import { Base, IRepeatObj } from '../common/base';
import { IResult } from '../common/result';
export declare class Or extends Base {
    constructor(parser: any, options?: any, value?: IRepeatObj);
    resolve(alternatives: any, options?: any): IResult;
}
