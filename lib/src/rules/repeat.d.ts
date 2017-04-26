import { BaseRule } from './base';
import { IResult, IRepeatObj } from '../common/interfaces';
import { ProdType } from '../gast';
export declare class Repeat extends BaseRule {
    parseKeys: string[];
    constructor(parser: any, options?: any, value?: IRepeatObj);
    protected calcType(value: any): ProdType.MANY | ProdType.MANY_SEP | ProdType.AT_LEAST_ONE | ProdType.AT_LEAST_ONE_SEP;
    resolve(value: any, options: object): IResult;
}
