import { Logger } from './logger';
export declare class Basic extends Logger {
    options: object;
    $: any;
    constructor(parser: any, options?: {});
    protected validate(parser: any): void;
}
