import { BaseParser } from './base';
import { IResult } from '../common/interfaces';
export declare class WordParser extends BaseParser {
    option: Function;
    constructor(parser: any, rules: any, options: any);
    protected resolve(rule: any, options?: any): IResult;
}
