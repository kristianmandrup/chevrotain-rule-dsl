import { Resolver } from '../common/interfaces';
import { Base } from '../common/base';
import { IConfig } from '../common/interfaces';
export interface IParser {
    resolve: Resolver;
}
export declare class BaseParser extends Base implements IConfig {
    parserKeys: string[];
    ruleKeys: string[];
    parsers?: any;
    rules?: any;
    funs: any;
    constructor(parser: any, options: any);
    protected unknown(rule: any, options?: any): void;
    protected error(msg: any): void;
    protected methodize(): void;
    protected methodizeParsers(): void;
    protected methodizeRules(): void[];
    config(conf?: IConfig): this;
    protected configParser(conf?: IConfig): void;
    protected configRules(conf?: IConfig): void;
}
