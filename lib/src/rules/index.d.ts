import { Abstract } from '../common/abstract';
import { IRules } from '../common/base';
import { Alt } from './alt';
import { Consume } from './consume';
import { Or } from './or';
import { Option } from './option';
import { Repeat } from './repeat';
import { Subrule } from './subrule';
import { Resolver } from '../common/base';
export declare const allRules: {
    Alt: typeof Alt;
    Consume: typeof Consume;
    Or: typeof Or;
    Option: typeof Option;
    Repeat: typeof Repeat;
    Subrule: typeof Subrule;
};
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
