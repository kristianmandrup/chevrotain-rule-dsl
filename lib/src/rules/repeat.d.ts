import { BaseRule } from './base';
import { IResult, IRepeatObj } from '../common/interfaces';
export declare class Repeat extends BaseRule {
    parseKeys: string[];
    constructor(parser: any, options?: any, value?: IRepeatObj);
    resolve(value: any, options: object): IResult;
}
