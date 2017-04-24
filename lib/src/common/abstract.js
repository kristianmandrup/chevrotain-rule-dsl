"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
class Abstract extends logger_1.Logger {
    constructor(parser, options = {}) {
        super(options);
        this.validate(parser);
        this.$ = parser;
        this.options = options;
    }
    validate(parser) {
        if (!(parser && parser.RULE)) {
            console.error('parser', parser);
            throw new Error('RuleParser must be created with a Parser instance that has a public RULE method');
        }
    }
}
exports.Abstract = Abstract;
//# sourceMappingURL=abstract.js.map