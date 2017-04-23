"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../common/base");
class ParseOption extends base_1.Base {
    constructor(parser, rules, options) {
        super(parser, rules, options);
    }
    option(value) {
        return this.rules.option(value);
    }
    resolve(rule, options) {
        const regExp = /\(([^)]+)\)(\?)/;
        let matches = regExp.exec(rule);
        if (matches && matches.length > 0) {
            return this.option(matches[1]);
        }
    }
}
exports.ParseOption = ParseOption;
//# sourceMappingURL=option.js.map