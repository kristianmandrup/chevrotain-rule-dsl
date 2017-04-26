"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class ValueParser extends base_1.BaseParser {
    constructor(parser, rules, options) {
        super(parser, rules, options);
        this.name = '_parse';
        this.parserKeys = [
            'list',
            'obj',
            'string'
        ];
        this.ruleKeys = [
            'consume'
        ];
    }
    resolve(rule, options = {}) {
        this.log('parse', rule, options);
        if (Array.isArray(rule)) {
            return this.parsers.funs.list(rule, options);
        }
        if (this.findToken(rule)) {
            this.log('consume since rule is token', rule);
            return this.rules.funs.consume(rule, options);
        }
        if (typeof rule === 'object') {
            return this.parsers.funs.obj(rule, options);
        }
        // if string, always assume subrule
        if (typeof rule === 'string') {
            return this.parsers.funs.string(rule, options);
        }
        if (typeof rule === 'function') {
            return { rule, code: rule.name };
        }
        throw new Error(`Invalid rule(s) ${typeof rule}`);
    }
}
exports.ValueParser = ValueParser;
//# sourceMappingURL=parse.js.map