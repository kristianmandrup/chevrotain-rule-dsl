"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../common/base");
const util = require("../common/util");
class ParseList extends base_1.Base {
    constructor(parser, rules, options) {
        super(parser, rules, options);
    }
    resolve(rules, options) {
        var flat = (r, a) => Array.isArray(a) ? a.reduce(flat, r) : r.concat(a);
        this.log('parseList', rules, options);
        let alt = util.isAlt(options);
        let codeJoin = alt ? ',' : '\n';
        let parser = alt ? 'alt' : 'parse';
        // reset options if parent is 'or'
        if (alt) {
            options = {};
        }
        this.log('item parser', parser, options);
        rules = rules.reduce(flat, []);
        let parsedRules = rules.map(rule => this[parser](rule, options));
        let codeStmts = parsedRules.map(pr => pr.code).join(codeJoin);
        this.log('parsedRules', parsedRules);
        this.log('codeStmts', codeStmts);
        let rule = () => {
            parsedRules.map(pr => pr.rule());
        };
        this.log('rule', rule);
        let code = alt ? codeStmts : '() => {\n' + codeStmts + '\n}\n';
        let result = {
            rule,
            code
        };
        this.log('parsedList', result);
        return result;
    }
    alt(value) {
        return this.rules.alt(value);
    }
    parse(rule) {
        return this.parser.parse(value);
    }
}
exports.ParseList = ParseList;
//# sourceMappingURL=list.js.map