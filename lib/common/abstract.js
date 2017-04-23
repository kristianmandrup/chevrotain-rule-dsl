"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
class Abstract extends logger_1.Logger {
    constructor(parser, options) {
        super(options);
        this.$ = parser;
        this.options = options;
    }
}
exports.Abstract = Abstract;
//# sourceMappingURL=abstract.js.map