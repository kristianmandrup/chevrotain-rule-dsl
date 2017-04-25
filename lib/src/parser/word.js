"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class WordParser extends base_1.BaseParser {
    constructor(parser, rules, options) {
        super(parser, rules, options);
    }
    resolve(rule, options) {
        this.log('parseString', rule);
        let result = this.funs.repeat(rule, options) ||
            this.option(rule, options) ||
            this.funs.spaced(rule, options) ||
            this.funs.consume(rule, options);
        return result || this.unknown(rule, options);
    }
}
exports.WordParser = WordParser;
//# sourceMappingURL=word.js.map