"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const util = require("../common/util");
class ObjParser extends base_1.BaseParser {
    constructor(parser, rules, options) {
        super(parser, rules, options);
        this.ruleKeys = [
            'repeat',
            'alt'
        ];
    }
    resolve(rule, options) {
        this.log('parseObj', rule, options);
        return this.resolveRule(rule, options) || this.resolveKey(rule, options);
    }
    resolverFor(key) {
        console.log('resolverFor', this.rules.funs, key);
        return this.rules.funs[key];
    }
    findResolverName(rule, options) {
        console.log('findResolver', rule);
        if (util.isAlt(options))
            return 'alt';
        if (util.isRepeat(rule))
            return 'repeat';
    }
    resolveRule(rule, options) {
        let name = this.findResolverName(rule, options);
        console.log('name', name);
        let resolver = this.resolverFor(name);
        if (typeof resolver === 'function')
            return resolver(rule);
        console.warn('Not a resolver', { rule, options }, typeof resolver);
        return undefined;
    }
    resolveKey(rule, options) {
        let key = Object.keys(rule)[0];
        let value = rule[key];
        let resolver = this.resolverFor(key);
        return resolver ? resolver(value) : this.unknown(key);
    }
    unknown(key) {
        throw new Error(`Unknown key in rule object: ${key}`);
    }
}
exports.ObjParser = ObjParser;
//# sourceMappingURL=obj.js.map