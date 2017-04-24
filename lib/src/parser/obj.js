"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const util = require("../common/util");
class ObjParser extends base_1.BaseParser {
    constructor(parser, rules, options) {
        super(parser, rules, options);
    }
    resolve(rule, options) {
        this.log('parseObj', rule, options);
        return this.resolveRule(rule, options) || this.resolveKey(rule, options);
    }
    resolverFor(key) {
        return this.rules[key];
    }
    findResolverName(rule, options) {
        if (util.isAlt(options))
            return 'alt';
        if (util.isRepeat(rule))
            return 'repeat';
    }
    resolveRule(rule, options) {
        let resolver = this.resolverFor(this.findResolverName(rule, options));
        return resolver ? resolver(rule) : undefined;
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