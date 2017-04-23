export declare class Logger {
    logRule: boolean;
    logging: boolean;
    logMap: {};
    constructor(options: any);
    protected configureLog(options: any): void;
    readonly islogging: boolean;
    log(msg: any, ...args: any[]): void;
}
