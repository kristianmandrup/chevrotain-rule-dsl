import { BaseRule } from './base';
import { IResult } from '../common/interfaces';
export declare class Consume extends BaseRule {
    constructor(parser: any, options?: any, value?: any);
    resolve(value: any, options: any): IResult;
}
