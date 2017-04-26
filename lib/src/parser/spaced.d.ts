import { BaseParser } from './base';
import { IResult } from '../common/interfaces';
export declare class SpacedParser extends BaseParser {
    parserKeys: string[];
    ruleKeys: string[];
    constructor(parser: any, rules: any, options: any);
    resolve(rule: any, options: any): IResult;
}
