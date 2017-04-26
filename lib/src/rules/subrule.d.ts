import { BaseRule } from './base';
import { ProdType } from '../gast';
export declare class Subrule extends BaseRule {
    constructor(parser: any, options?: any, value?: any);
    resolve(value: any): {
        rule: () => any;
        code: string;
        node: {
            type: ProdType;
            name: any;
            repeatCount: number;
        };
    };
}
