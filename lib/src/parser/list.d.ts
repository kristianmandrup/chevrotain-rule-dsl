import { BaseParser } from './base';
import { IResult } from '../common/interfaces';
export declare class ListParser extends BaseParser {
    parseKeys: string[];
    ruleKeys: string[];
    constructor(parser: any, rules: any, options: any);
    resolve(rules: any, options?: any): IResult;
}
