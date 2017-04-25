import { Basic } from '../common/basic';
import { Alt } from './alt';
import { Consume } from './consume';
import { Or } from './or';
import { Option } from './option';
import { Repeat } from './repeat';
import { Subrule } from './subrule';
import { Resolver, IRules } from '../common/interfaces';
export declare const allRules: {
    Alt: typeof Alt;
    Consume: typeof Consume;
    Or: typeof Or;
    Option: typeof Option;
    Repeat: typeof Repeat;
    Subrule: typeof Subrule;
};
export declare class Rules extends Basic implements IRules {
    repeat: Resolver;
    alt: Resolver;
    consume: Resolver;
    option: Resolver;
    or: Resolver;
    subrule: Resolver;
    ruleKeys: string[];
    configured: boolean;
    constructor(parser: any, options: any);
    config(ctx: any): void;
    configure(): this;
    protected resolverFor(name: any): any;
}
export declare function createRules(parser: any, options: any): Rules;
