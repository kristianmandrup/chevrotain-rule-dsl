"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const optionExpr = /\(([^)]+)\)(\?)/;
function isOption(rule) {
    let matches = optionExpr.exec(rule);
    return matches && matches.length > 0 ? matches : false;
}
class OptionParser extends base_1.BaseParser {
    constructor(parser, options) {
        super(parser, options);
        this.ruleKeys = [
            'option'
        ];
    }
    resolve(rule, options) {
        this.log('option', { rule, options });
        if (typeof rule !== 'string') {
            this.error(`option can only parse string: ${rule}`);
        }
        let matches = isOption(rule);
        if (!matches) {
            this.error('no option match');
            return;
        }
        let match = matches[1];
        this.log('option', { matches, match });
        return this.rules.funs.option(match, options);
    }
}
exports.OptionParser = OptionParser;
//# sourceMappingURL=option.js.map