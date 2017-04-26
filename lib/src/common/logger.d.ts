export interface ILogging {
    logging?: boolean;
    logRule?: boolean;
    logMap?: object;
}
export declare class Logger implements ILogging {
    logging: boolean;
    logMap: {};
    constructor(options: any);
    protected configureLog(options?: ILogging): void;
    readonly islogging: boolean;
    protected isMapped(rule: any): any;
    protected logger(rule: any): (...args: any[]) => void;
    protected log(rule: any, ...args: any[]): void;
}
