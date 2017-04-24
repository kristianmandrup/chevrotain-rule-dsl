import { BaseParser } from './base';
import { IResult } from '../common/result';
export declare class ListParser extends BaseParser {
    constructor(parser: any, rules: any, options: any);
    resolve(rules: any, options?: any): IResult;
}
