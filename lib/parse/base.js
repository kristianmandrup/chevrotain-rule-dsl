"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");
class Base extends logger_1.Logger {
    constructor(parser, rules, options) {
        super(options);
        this.parser = parser;
        this.rules = rules;
    }
}
exports.Base = Base;
//# sourceMappingURL=base.js.map