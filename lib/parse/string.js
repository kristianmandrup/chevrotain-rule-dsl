"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../common/base");
class ParseString extends base_1.Base {
    constructor(parser, rules, options) {
        super(parser, rules, options);
    }
    resolve(rule, options) {
        this.log('parseString', rule);
        return this.parseRepeat(rule, options) ||
            this.parseOption(rule, options) ||
            this.parseSpaced(rule, options) ||
            this.parseWord(rule, options);
    }
}
exports.ParseString = ParseString;
//# sourceMappingURL=string.js.map