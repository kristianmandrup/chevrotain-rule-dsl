import { Base } from '../common/base';
export declare class Subrule extends Base {
    constructor(parser: any, options?: any, value?: any);
    resolve(): {
        rule: () => any;
        code: string;
    };
}
