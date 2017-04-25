"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class StringParser extends base_1.BaseParser {
    constructor(parser, rules, options) {
        super(parser, rules, options);
        this.parserKeys = [
            'option',
            'repeat',
            'word',
            'spaced'
        ];
    }
    resolve(rule, options) {
        this.log('parseString', rule);
        return this.funs.repeat(rule, options) ||
            this.funs.option(rule, options) ||
            this.funs.spaced(rule, options) ||
            this.funs.word(rule, options);
    }
}
exports.StringParser = StringParser;
//# sourceMappingURL=string.js.map