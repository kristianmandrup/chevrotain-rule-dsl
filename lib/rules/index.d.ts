import { Abstract } from '../common/abstract';
import { IRules } from '../common/base';
import { Resolver } from '../common/base';
export declare class Rules extends Abstract implements IRules {
    repeat: Resolver;
    alt: Resolver;
    consume: Resolver;
    option: Resolver;
    or: Resolver;
    subrule: Resolver;
    constructor(parser: any, options: any);
    protected configure(): void;
    protected createFun(name: any): (value: any, options: any) => any;
}
export declare function create(parser: any, options: any): Rules;
