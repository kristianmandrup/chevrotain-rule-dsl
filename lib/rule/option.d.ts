import { Base } from '../common/base';
import { IResult } from '../common/result';
export declare class Options extends Base {
    constructor(parser: any, options?: any, value?: any);
    protected parse(value: any, options?: any): IResult;
    protected resolve(): IResult;
}
