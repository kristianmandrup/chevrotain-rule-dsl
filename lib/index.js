"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dsl_parser_1 = require("./dsl-parser");
exports.DslParser = dsl_parser_1.DslParser;
var gast_builder_1 = require("./gast-builder");
exports.GastBuilder = gast_builder_1.GastBuilder;
const rules_1 = require("./rules");
exports.Rules = rules_1.Rules;
const parser_1 = require("./parser");
exports.RulesParser = parser_1.RulesParser;
var legacy_1 = require("./legacy");
exports.RuleParser = legacy_1.RuleParser;
exports.rule = legacy_1.rule;
const base_1 = require("./common/base");
class NewRuleParser extends base_1.Base {
    constructor(parser, options = { logging: false, logMap: {}, registry: null, tokenMap: {} }) {
        super(parser, options);
        this.parser = new parser_1.RulesParser(parser, options);
        this.rules = new rules_1.Rules(parser, options);
    }
    rule(name, rule, config) {
        this.log('rule', name, rule);
        if (typeof name !== 'string') {
            throw new Error(`rule name must be a valid name (string), was ${name}`);
        }
        let $ = this.$;
        let parserRule = () => $.RULE(name, rule, config).bind($);
        return parserRule;
    }
    createRule(name, rules, options) {
        options = options || {};
        this.configureLog(options);
        let parsed = this.parser.parse(rules, options);
        this.log('createRule', 'parsed.rule', parsed.rule);
        options.code = options.code || parsed.code;
        this.codeStr = parsed.code;
        this.log('createRule', 'parsed.code', parsed.code);
        let parsedRule = this.rule(name, parsed.rule, options);
        this.log('createRule', 'parsedRule', parsedRule);
        this.register(name, parsedRule);
        return parsedRule;
    }
}
exports.NewRuleParser = NewRuleParser;
function createRule(parser, name, rules, options) {
    return new NewRuleParser(parser, options).createRule(name, rules, options);
}
exports.createRule = createRule;
//# sourceMappingURL=index.js.map