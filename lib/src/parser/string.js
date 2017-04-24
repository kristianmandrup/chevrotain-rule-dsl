"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class StringParser extends base_1.BaseParser {
    constructor(parser, rules, options) {
        super(parser, rules, options);
    }
    resolve(rule, options) {
        this.log('parseString', rule);
        return this.parser.repeat(rule, options) ||
            this.parser.option(rule, options) ||
            this.parser.spaced(rule, options) ||
            this.parser.word(rule, options);
    }
}
exports.StringParser = StringParser;
//# sourceMappingURL=string.js.map