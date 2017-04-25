import { BaseParser } from './base';
import { IResult } from '../common/interfaces';
export declare class ValueParser extends BaseParser {
    string: Function;
    list: Function;
    obj: Function;
    consume: Function;
    name: string;
    parserKeys: string[];
    ruleKeys: string[];
    constructor(parser: any, rules: any, options: any);
    resolve(rule: any, options?: {}): IResult;
}
