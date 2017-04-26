"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const expr = {
    spaces: /\S+\s+\S+/,
    space: /\s+/,
    or: [/\sor\s/, /\|/]
};
function splitExp(rule) {
    let or = expr.or.find(exp => exp.test(rule));
    return or ? or : expr.space;
}
function isSpaced(rule) {
    return expr.spaces.test(rule);
}
class SpacedParser extends base_1.BaseParser {
    constructor(parser, rules, options) {
        super(parser, rules, options);
        this.parserKeys = [
            'list'
        ];
        this.ruleKeys = [
            'or'
        ];
    }
    resolve(rule, options) {
        // two or more word with spaces between?
        if (!isSpaced(rule)) {
            return;
        }
        this.log('parse space separation', rule);
        // or rule
        let exp = splitExp(rule);
        let list = rule.split(exp).map(item => item.trim());
        return this.funs.list(list, options);
    }
}
exports.SpacedParser = SpacedParser;
//# sourceMappingURL=spaced.js.map