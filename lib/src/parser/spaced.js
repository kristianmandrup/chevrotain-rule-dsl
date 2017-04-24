"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../common/base");
class SpacedParser extends base_1.Base {
    constructor(parser, rules, options) {
        super(parser, rules, options);
    }
    resolve(rule, options) {
        // two or more word with spaces between?
        if (/\S+\s+\S+/.test(rule)) {
            this.log('parse space separation', rule);
            // or rule
            let orExp = /\sor\s/;
            let pipeExp = /\|/;
            let or = orExp.test(rule);
            let orPipe = pipeExp.test(rule);
            // if separator is either 'or' OR '|'
            if (or || orPipe) {
                let splitExp = or ? orExp : pipeExp;
                this.log('or rule: split', splitExp);
                let alternatives = rule.split(splitExp).map(alt => alt.trim());
                return this.rules.or(alternatives);
            }
            else {
                this.log('split rules by space', options);
                let list = rule.split(/\s+/).map(item => item.trim());
                return this.parser.list(list, options);
            }
        }
    }
}
exports.SpacedParser = SpacedParser;
//# sourceMappingURL=spaced.js.map