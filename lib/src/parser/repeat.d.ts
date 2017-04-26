import { BaseParser } from './base';
import { IResult } from '../common/interfaces';
export declare class RepeatParser extends BaseParser {
    constructor(parser: any, rules: any, options: any);
    resolve(value: any, options: any): IResult;
}
