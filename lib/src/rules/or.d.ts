import { BaseRule } from './base';
import { IResult, IRepeatObj } from '../common/interfaces';
export declare class Or extends BaseRule {
    constructor(parser: any, options?: any, value?: IRepeatObj);
    resolve(alternatives: any, options?: any): IResult;
}
