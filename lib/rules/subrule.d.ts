import { Base } from '../common/base';
import { ProdType } from '../gast';
export declare class Subrule extends Base {
    constructor(parser: any, options?: any, value?: any);
    resolve(): {
        rule: () => any;
        code: string;
        node: {
            type: ProdType;
        };
    };
}
