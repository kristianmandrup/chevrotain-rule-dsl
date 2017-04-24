import { BaseParser } from './base';
import { IResult } from '../common/result';
export declare class OptionParser extends BaseParser {
    constructor(parser: any, rules: any, options: any);
    resolve(rule: any, options: any): IResult;
}
