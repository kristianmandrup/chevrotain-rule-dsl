export interface ILogging {
    logging?: boolean;
    logRule?: boolean;
    logMap?: object;
}
export declare class Logger implements ILogging {
    logRule: boolean;
    logging: boolean;
    logMap: {};
    constructor(options: any);
    protected configureLog(options?: ILogging): void;
    readonly islogging: boolean;
    log(msg: any, ...args: any[]): void;
}
