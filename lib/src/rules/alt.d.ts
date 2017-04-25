import { BaseRule } from './base';
import { IResult } from '../common/interfaces';
export declare class Alt extends BaseRule {
    parse: Function;
    parserKeys: string[];
    constructor(parser: any, options?: any, value?: any);
    protected resolve(value: any, options?: any): IResult;
}
