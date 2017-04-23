"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../common/base");
class OptionParser extends base_1.Base {
    constructor(parser, rules, options) {
        super(parser, rules, options);
    }
    resolve(rule, options) {
        const regExp = /\(([^)]+)\)(\?)/;
        let matches = regExp.exec(rule);
        if (matches && matches.length > 0) {
            return this.rules.option(matches[1]);
        }
    }
}
exports.OptionParser = OptionParser;
//# sourceMappingURL=option.js.map