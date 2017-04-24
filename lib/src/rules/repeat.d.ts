import { Base, IRepeatObj } from '../common/base';
import { IResult } from '../common/result';
import { ProdType } from '../gast';
export declare class Repeat extends Base {
    constructor(parser: any, options?: any, value?: IRepeatObj);
    protected calcType(value: any): ProdType.MANY | ProdType.MANY_SEP | ProdType.AT_LEAST_ONE | ProdType.AT_LEAST_ONE_SEP;
    resolve(): IResult;
}
