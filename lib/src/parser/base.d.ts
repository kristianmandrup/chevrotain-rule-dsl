import { Resolver } from '../common/interfaces';
import { Base } from '../common/base';
import { IConfig } from '../common/interfaces';
export interface IParser {
    resolve: Resolver;
}
export declare class BaseParser extends Base implements IConfig {
    parser?: any;
    rules?: any;
    constructor(parser: any, rules: any, options: any);
    config(conf?: IConfig): this;
}
