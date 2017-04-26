import { BaseParser } from './base';
import { IResult } from '../common/interfaces';
export declare class OptionParser extends BaseParser {
    ruleKeys: string[];
    constructor(parser: any, options: any);
    resolve(rule: any, options: any): IResult;
}
