"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_1 = require("./abstract");
const util = require("./util");
let registry = {};
class Base extends abstract_1.Abstract {
    constructor(parser, options, value) {
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
    validate(parser) {
        if (!(parser && parser.RULE)) {
            console.error('parser', parser);
            throw new Error('RuleParser must be created with a Parser instance that has a public RULE method');
        }
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
        return this.tokenMap[value] || this.tokenMap[value.name];
    }
    resolveToken(token) {
        return this.findToken(token) || token;
    }
}
exports.Base = Base;
//# sourceMappingURL=base.js.map