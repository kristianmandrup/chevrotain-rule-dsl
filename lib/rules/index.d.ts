import { Abstract } from '../common/abstract';
import { IRules } from '../common/base';
export declare class Rules extends Abstract implements IRules {
    repeat: Function;
    alt: Function;
    consume: Function;
    option: Function;
    or: Function;
    subrule: Function;
    constructor(parser: any, options: any);
    protected configure(): void;
    protected createFun(name: any): (value: any, options: any) => any;
}
export declare function create(parser: any, options: any): Rules;
