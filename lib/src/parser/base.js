"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../common/base");
class BaseParser extends base_1.Base {
    constructor(parser, rules, options) {
        super(parser, rules, options);
        this.parserKeys = [];
        this.ruleKeys = [];
    }
    unknown(rule, options) {
        console.error('unknown rule', rule, options);
        throw new Error('unknown rule');
    }
    error(msg) {
        console.error(msg);
        throw new Error(msg);
    }
    methodize() {
        this.methodizeParsers();
        this.methodizeRules();
    }
    methodizeParsers() {
        // console.log('methodizeParsers', this.name)
        if (!this.parsers) {
            throw new Error('methodize: missing parser');
        }
        // console.log('parserKeys', this.name, this.parserKeys)
        this.parsers.funs = this.parsers.funs || {};
        let self = this;
        this.parserKeys.map(key => {
            let inst = this.parsers[key];
            // console.log('parsers methodize', key)
            if (inst) {
                let fun = inst.resolve.bind(self);
                this.parsers.funs[key] = fun;
            }
            else {
                console.log('no parse inst', key);
            }
        });
        // console.log('parsers', this.parsers.funs)
    }
    methodizeRules() {
        // console.log('methodizeRules', this.name)
        if (!this.rules) {
            throw new Error('methodize: missing rules');
        }
        this.rules.funs = this.rules.funs || {};
        let self = this;
        return this.ruleKeys.map(key => {
            // console.log('rules methodize', key)
            let inst = this.rules[key];
            if (inst) {
                let fun = inst.resolve.bind(self);
                this.rules.funs[key] = fun;
            }
            else {
                console.log('no rule inst', key);
            }
        });
    }
    config(conf = {}) {
        this.configParser(conf);
        this.configRules(conf);
        this.methodize();
        this.funs = Object.assign(this.parsers.funs, this.rules.funs);
        Object.keys(this.funs).map(key => this[key] = this.funs[key]);
        return this;
    }
    configParser(conf = {}) {
        // console.log('BaseParser config parser')
        this.parsers = conf.parsers;
    }
    configRules(conf = {}) {
        // console.log('BaseParser config rules')
        this.rules = conf.rules;
    }
}
exports.BaseParser = BaseParser;
//# sourceMappingURL=base.js.map