"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    constructor(options) {
        this.configureLog(options);
    }
    configureLog(options = {}) {
        this.logMap = options.logMap || this.logMap || {};
        this.logging = (options.logging || Object.keys(this.logMap).length > 0 || this.logging) === true;
    }
    get islogging() {
        return this.logging === true;
    }
    isMapped(rule) {
        if (!this.logMap)
            return true;
        return this.logMap && this.logMap[rule];
    }
    log(rule, ...args) {
        if (this.islogging) {
            if (this.isMapped(rule)) {
                console.log(rule, ...args);
            }
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map