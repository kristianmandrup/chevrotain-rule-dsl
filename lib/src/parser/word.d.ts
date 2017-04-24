import { BaseParser } from './base';
import { IResult } from '../common/result';
export declare class WordParser extends BaseParser {
    constructor(parser: any, rules: any, options: any);
    protected resolve(rule: any, options?: any): IResult;
}
