"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class OptionParser extends base_1.BaseParser {
    constructor(parser, rules, options) {
        super(parser, rules, options);
    }
    resolve(rule, options) {
        const regExp = /\(([^)]+)\)(\?)/;
        let matches = regExp.exec(rule);
        if (matches && matches.length > 0) {
            let match = matches[1];
            return this.rules.option(match);
        }
    }
}
exports.OptionParser = OptionParser;
//# sourceMappingURL=option.js.map