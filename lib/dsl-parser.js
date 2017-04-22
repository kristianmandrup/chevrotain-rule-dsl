"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chevrotain_1 = require("chevrotain");
const cache = require("chevrotain/lib/src/parse/cache");
const lang_extensions_1 = require("chevrotain/lib/src/lang/lang_extensions");
const checks_1 = require("chevrotain/lib/src/parse/grammar/checks");
const utils_1 = require("chevrotain/lib/src/utils/utils");
const tokens_public_1 = require("chevrotain/lib/src/scan/tokens_public");
const gast_builder_1 = require("chevrotain/lib/src/parse/gast_builder");
var ParserDefinitionErrorType;
(function (ParserDefinitionErrorType) {
    ParserDefinitionErrorType[ParserDefinitionErrorType["INVALID_RULE_NAME"] = 0] = "INVALID_RULE_NAME";
    ParserDefinitionErrorType[ParserDefinitionErrorType["DUPLICATE_RULE_NAME"] = 1] = "DUPLICATE_RULE_NAME";
    ParserDefinitionErrorType[ParserDefinitionErrorType["INVALID_RULE_OVERRIDE"] = 2] = "INVALID_RULE_OVERRIDE";
    ParserDefinitionErrorType[ParserDefinitionErrorType["DUPLICATE_PRODUCTIONS"] = 3] = "DUPLICATE_PRODUCTIONS";
    ParserDefinitionErrorType[ParserDefinitionErrorType["UNRESOLVED_SUBRULE_REF"] = 4] = "UNRESOLVED_SUBRULE_REF";
    ParserDefinitionErrorType[ParserDefinitionErrorType["LEFT_RECURSION"] = 5] = "LEFT_RECURSION";
    ParserDefinitionErrorType[ParserDefinitionErrorType["NONE_LAST_EMPTY_ALT"] = 6] = "NONE_LAST_EMPTY_ALT";
    ParserDefinitionErrorType[ParserDefinitionErrorType["AMBIGUOUS_ALTS"] = 7] = "AMBIGUOUS_ALTS";
    ParserDefinitionErrorType[ParserDefinitionErrorType["CONFLICT_TOKENS_RULES_NAMESPACE"] = 8] = "CONFLICT_TOKENS_RULES_NAMESPACE";
    ParserDefinitionErrorType[ParserDefinitionErrorType["INVALID_TOKEN_NAME"] = 9] = "INVALID_TOKEN_NAME";
    ParserDefinitionErrorType[ParserDefinitionErrorType["INVALID_NESTED_RULE_NAME"] = 10] = "INVALID_NESTED_RULE_NAME";
    ParserDefinitionErrorType[ParserDefinitionErrorType["DUPLICATE_NESTED_NAME"] = 11] = "DUPLICATE_NESTED_NAME";
    ParserDefinitionErrorType[ParserDefinitionErrorType["NO_NON_EMPTY_LOOKAHEAD"] = 12] = "NO_NON_EMPTY_LOOKAHEAD";
    ParserDefinitionErrorType[ParserDefinitionErrorType["AMBIGUOUS_PREFIX_ALTS"] = 13] = "AMBIGUOUS_PREFIX_ALTS";
})(ParserDefinitionErrorType = exports.ParserDefinitionErrorType || (exports.ParserDefinitionErrorType = {}));
const IN_RULE_RECOVERY_EXCEPTION = "InRuleRecoveryException";
const END_OF_FILE = tokens_public_1.createTokenInstance(tokens_public_1.EOF, "", NaN, NaN, NaN, NaN, NaN, NaN);
Object.freeze(END_OF_FILE);
const DEFAULT_PARSER_CONFIG = Object.freeze({
    recoveryEnabled: false,
    maxLookahead: 5,
    ignoredIssues: {},
    dynamicTokensEnabled: false,
    // TODO: Document this breaking change, can it be mitigated?
    // TODO: change to true
    outputCst: false
});
const DEFAULT_RULE_CONFIG = Object.freeze({
    recoveryValueFunc: () => undefined,
    resyncEnabled: true
});
/**
 * Convenience used to express an empty alternative in an OR (alternation).
 * can be used to more clearly describe the intent in a case of empty alternation.
 *
 * For example:
 *
 * 1. without using EMPTY_ALT:
 *
 *    this.OR([
 *      {ALT: () => {
 *        this.CONSUME1(OneTok)
 *        return "1"
 *      }},
 *      {ALT: () => {
 *        this.CONSUME1(TwoTok)
 *        return "2"
 *      }},
 *      {ALT: () => { // implicitly empty because there are no invoked grammar rules (OR/MANY/CONSUME...) inside this alternative.
 *        return "666"
 *      }},
 *    ])
 *
 *
 * 2. using EMPTY_ALT:
 *
 *    this.OR([
 *      {ALT: () => {
 *        this.CONSUME1(OneTok)
 *        return "1"
 *      }},
 *      {ALT: () => {
 *        this.CONSUME1(TwoTok)
 *        return "2"
 *      }},
 *      {ALT: EMPTY_ALT("666")}, // explicitly empty, clearer intent
 *    ])
 *
 */
function EMPTY_ALT(value = undefined) {
    return function () {
        return value;
    };
}
exports.EMPTY_ALT = EMPTY_ALT;
class DslParser extends chevrotain_1.Parser {
    constructor(input, tokensDictionary, config = DEFAULT_PARSER_CONFIG) {
        super(input, tokensDictionary, config);
        this.definedRulesNames = [];
        this._productions = new lang_extensions_1.HashTable();
    }
    /**
     * @See RULE
     * Same as RULE, but should only be used in "extending" grammars to override rules/productions
     * from the super grammar.
     */
    OVERRIDE_RULE(name, impl, config = DEFAULT_RULE_CONFIG) {
        return this.doRule(name, impl, config);
    }
    RULE(name, impl, 
        // TODO: how to describe the optional return type of CSTNode? T|CstNode is not good because it is not backward
        // compatible, T|any is very general...
        config = DEFAULT_RULE_CONFIG) {
        return this.doRule(name, impl, config);
    }
    doRule(name, impl, config = DEFAULT_RULE_CONFIG) {
        let ruleErrors = checks_1.validateRuleName(name);
        ruleErrors = ruleErrors.concat(checks_1.validateRuleDoesNotAlreadyExist(name, this.definedRulesNames, this.className));
        this.definedRulesNames.push(name);
        this.definitionErrors.push.apply(this.definitionErrors, ruleErrors); // mutability for the win
        // allow custom GAST builder
        let _buildTopProduction = config.buildTopProduction || gast_builder_1.buildTopProduction;
        // only build the gast representation once.
        if (!(this._productions.containsKey(name))) {
            let implString = (config && config.implText) || impl.toString();
            let gastProduction = _buildTopProduction(implString, name, this.tokensMap);
            this._productions.put(name, gastProduction);
        }
        else {
            let parserClassProductions = cache.getProductionsForClass(this.className);
            let cachedProduction = parserClassProductions.get(name);
            // in case of duplicate rules the cache will not be filled at this point.
            if (!utils_1.isUndefined(cachedProduction)) {
                // filling up the _productions is always needed to inheriting grammars can access it (as an instance member)
                // otherwise they will be unaware of productions defined in super grammars.
                this._productions.put(name, cachedProduction);
            }
        }
        let ruleImplementation = this['defineRule'](name, impl, config);
        this[name] = ruleImplementation;
        return ruleImplementation;
    }
}
exports.DslParser = DslParser;
//# sourceMappingURL=dsl-parser.js.map