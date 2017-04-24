import { Base } from '../common/base';
import { IConfig } from '../common/interfaces';
export declare class BaseRule extends Base implements IConfig {
    parser?: any;
    rules?: any;
    constructor(parser: any, rules: any, options: any);
    config(conf?: IConfig): this;
}
