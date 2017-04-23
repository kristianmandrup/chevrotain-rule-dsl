import { Base } from '../common/base';
import { IResult } from '../common/result';
export declare class Option extends Base {
    constructor(parser: any, options?: any, value?: any);
    protected resolve(): IResult;
}
