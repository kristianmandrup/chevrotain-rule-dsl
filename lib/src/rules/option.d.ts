import { BaseRule } from './base';
import { IResult } from '../common/interfaces';
export declare class Option extends BaseRule {
    constructor(parser: any, options?: any, value?: any);
    protected resolve(value: any, options?: any): IResult;
}
