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
        return this.logging || this.logRule;
    }
    log(msg, ...args) {
        if (this.islogging === true && this.logMap[msg] === true) {
            console.log(msg, ...args);
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map