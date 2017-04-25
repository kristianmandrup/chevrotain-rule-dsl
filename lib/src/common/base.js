"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basic_1 = require("./basic");
const util = require("./util");
let registry = {};
class Base extends basic_1.Basic {
    constructor(parser, options = {}, value) {
        super(parser, options);
        this.tokenMap = {};
        this.usedRules = {};
        this._registry = {};
        this.value = value;
        let tokenMap = util.toTokenMap(parser['tokensMap']);
        this.tokenMap = Object.assign(tokenMap, options.tokenMap);
        this.usedRules = {};
        this._registry = parser['registry'] || options.registry || registry;
    }
    findRule(name) {
        return this.registry[name];
    }
    get registry() {
        return this._registry;
    }
    register(name, rule) {
        this.registry[name] = rule;
    }
    findToken(value) {
        if (!value) {
            console.error('invalid token value', value);
            return;
        }
        return this.tokenMap[value] || this.tokenMap[value.name];
    }
    resolveToken(token) {
        return this.findToken(token) || token;
    }
}
exports.Base = Base;
//# sourceMappingURL=base.js.map