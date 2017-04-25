import { BaseParser } from './base';
import { IResult } from '../common/interfaces';
export declare class StringParser extends BaseParser {
    option: Function;
    repeat: Function;
    spaced: Function;
    word: Function;
    parserKeys: string[];
    constructor(parser: any, rules: any, options: any);
    protected resolve(rule: any, options?: any): IResult;
}
