import { Parser } from 'chevrotain'

import * as cache from "chevrotain/lib/src/parse/cache"
import {CLASS_TO_ALL_RULE_NAMES, CLASS_TO_BASE_CST_VISITOR, CLASS_TO_BASE_CST_VISITOR_WITH_DEFAULTS} from "chevrotain/lib/src/parse/cache"
import {exceptions} from "chevrotain/lib/src/parse/exceptions_public"
import {classNameFromInstance, HashTable} from "chevrotain/lib/src/lang/lang_extensions"
import {resolveGrammar} from "chevrotain/lib/src/parse/grammar/resolver"
import {validateGrammar, validateRuleDoesNotAlreadyExist, validateRuleIsOverridden, validateRuleName} from "chevrotain/lib/src/parse/grammar/checks"
import {
    cloneArr,
    cloneObj,
    contains,
    dropRight,
    every,
    find,
    first,
    flatten,
    forEach,
    has,
    isArray,
    isEmpty,
    isFunction,
    isObject,
    isUndefined,
    map,
    NOOP,
    reduce,
    some,
    uniq,
    values
} from "chevrotain/lib/src/utils/utils"
import {computeAllProdsFollows} from "chevrotain/lib/src/parse/grammar/follow"
import {createTokenInstance, EOF, getTokenConstructor, hasTokenLabel, IToken, Token, tokenLabel, tokenName} from "chevrotain/lib/src/scan/tokens_public"
import {
    buildLookaheadForAtLeastOne,
    buildLookaheadForAtLeastOneSep,
    buildLookaheadForMany,
    buildLookaheadForManySep,
    buildLookaheadForOption,
    buildLookaheadFuncForOr,
    getLookaheadPathsForOptionalProd,
    getLookaheadPathsForOr,
    PROD_TYPE
} from "chevrotain/lib/src/parse/grammar/lookahead"
import {IMultiModeLexerDefinition, TokenConstructor} from "chevrotain/lib/src/scan/lexer_public"
import {buildTopProduction} from "chevrotain/lib/src/parse/gast_builder"
import {
    AbstractNextTerminalAfterProductionWalker,
    NextAfterTokenWalker,
    nextPossibleTokensAfter,
    NextTerminalAfterAtLeastOneSepWalker,
    NextTerminalAfterAtLeastOneWalker,
    NextTerminalAfterManySepWalker,
    NextTerminalAfterManyWalker
} from "chevrotain/lib/src/parse/grammar/interpreter"
import {IN} from "chevrotain/lib/src/parse//constants"
import {gast} from "chevrotain/lib/src/parse//grammar/gast_public"
import {cloneProduction} from "chevrotain/lib/src/parse//grammar/gast"
import {ISyntacticContentAssistPath, ITokenGrammarPath} from "chevrotain/lib/src/parse//grammar/path_public"
import {augmentTokenClasses, isExtendingTokenType, tokenStructuredIdentity, tokenStructuredMatcher} from "chevrotain/lib/src/scan/tokens"
import {CstNode, ICstVisitor} from "chevrotain/lib/src/parse/cst/cst_public"
import {addNoneTerminalToCst, addTerminalToCst, analyzeCst} from "chevrotain/lib/src/parse/cst/cst"
import {
    AT_LEAST_ONE_IDX,
    AT_LEAST_ONE_SEP_IDX,
    BITS_FOR_METHOD_IDX,
    BITS_FOR_OCCURRENCE_IDX,
    getKeyForAltIndex,
    getKeyForAutomaticLookahead,
    MANY_IDX,
    MANY_SEP_IDX,
    OPTION_IDX,
    OR_IDX
} from "chevrotain/lib/src/parse/grammar/keys"
import {createBaseSemanticVisitorConstructor, 
    createBaseVisitorConstructorWithDefaults} from "chevrotain/lib/src/parse/cst/cst_visitor"
import ISerializedGast = gast.ISerializedGast
import serializeGrammar = gast.serializeGrammar

export enum ParserDefinitionErrorType {
    INVALID_RULE_NAME,
    DUPLICATE_RULE_NAME,
    INVALID_RULE_OVERRIDE,
    DUPLICATE_PRODUCTIONS,
    UNRESOLVED_SUBRULE_REF,
    LEFT_RECURSION,
    NONE_LAST_EMPTY_ALT,
    AMBIGUOUS_ALTS,
    CONFLICT_TOKENS_RULES_NAMESPACE,
    INVALID_TOKEN_NAME,
    INVALID_NESTED_RULE_NAME,
    DUPLICATE_NESTED_NAME,
    NO_NON_EMPTY_LOOKAHEAD,
    AMBIGUOUS_PREFIX_ALTS,
}

export type IgnoredRuleIssues = { [dslNameAndOccurrence:string]:boolean }
export type IgnoredParserIssues = { [ruleName:string]:IgnoredRuleIssues }

const IN_RULE_RECOVERY_EXCEPTION = "InRuleRecoveryException"
const END_OF_FILE = createTokenInstance(EOF, "", NaN, NaN, NaN, NaN, NaN, NaN)
Object.freeze(END_OF_FILE)

export type TokenMatcher = (token:IToken, tokClass:TokenConstructor) => boolean
export type TokenInstanceIdentityFunc = (tok:IToken) => string
export type TokenClassIdentityFunc = (tok:TokenConstructor) => string

export interface IParserConfig {
    /**
     * Is the error recovery / fault tolerance of the Chevrotain Parser enabled.
     */
    recoveryEnabled?:boolean,

    /**
     * Maximum number of tokens the parser will use to choose between alternatives.
     */
    maxLookahead?:number

    /**
     * Used to mark parser definition errors that should be ignored.
     * For example:
     *
     * {
     *   myCustomRule : {
     *                   OR3 : true
     *                  },
     *
     *   myOtherRule : {
     *                  OPTION1 : true,
     *                  OR4 : true
     *                 }
     * }
     *
     * Be careful when ignoring errors, they are usually there for a reason :).
     */
    ignoredIssues?:IgnoredParserIssues

    /**
     * Enable This Flag to to support Dynamically defined Tokens via inheritance.
     * This will disable performance optimizations which cannot work if the whole Token vocabulary is not known
     * During Parser initialization.
     */
    dynamicTokensEnabled?:boolean

    /**
     * Enable automatic Concrete Syntax Tree creation
     * For in-depth docs:
     * {@link https://github.com/SAP/chevrotain/blob/master/docs/concrete_syntax_tree.md}
     */
    outputCst?:boolean
}

const DEFAULT_PARSER_CONFIG:IParserConfig = Object.freeze({
    recoveryEnabled:      false,
    maxLookahead:         5,
    ignoredIssues:        <any>{},
    dynamicTokensEnabled: false,
    // TODO: Document this breaking change, can it be mitigated?
    // TODO: change to true
    outputCst:            false
})

export interface IRuleConfig<T> {
    implText?: string
    buildTopProduction?: Function
    /**
     * The function which will be invoked to produce the returned value for a production that have not been
     * successfully executed and the parser recovered from.
     */
    recoveryValueFunc?:() => T

    /**
     * Enable/Disable re-sync error recovery for this specific production.
     */
    resyncEnabled?:boolean
}

const DEFAULT_RULE_CONFIG:IRuleConfig<any> = Object.freeze({
    recoveryValueFunc: () => undefined,
    resyncEnabled:     true
})

export interface IParserDefinitionError {
    message:string
    type:ParserDefinitionErrorType
    ruleName?:string
}

export interface IParserDuplicatesDefinitionError extends IParserDefinitionError {
    dslName:string
    occurrence:number
    parameter?:string
}

export interface IParserEmptyAlternativeDefinitionError extends IParserDefinitionError {
    occurrence:number
    alternative:number
}

export interface IParserAmbiguousAlternativesDefinitionError extends IParserDefinitionError {
    occurrence:number
    alternatives:number[]
}

export interface IParserUnresolvedRefDefinitionError extends IParserDefinitionError {
    unresolvedRefName:string
}

// parameters needed to compute the key in the FOLLOW_SET map.
export interface IFollowKey {
    ruleName:string
    idxInCallingRule:number
    inRule:string
}

/**
 * OR([
 *  {ALT:XXX },
 *  {ALT:YYY },
 *  {ALT:ZZZ }
 * ])
 */
export interface IOrAlt<T> {
    ALT:() => T
}

/**
 * OR([
 *  { GATE:condition1, ALT:XXX },
 *  { GATE:condition2, ALT:YYY },
 *  { GATE:condition3, ALT:ZZZ }
 * ])
 */
export interface IOrAltWithGate<T> extends IOrAlt<T> {
    NAME?:string
    GATE:() => boolean
    ALT:() => T
}

export type IAnyOrAlt<T> = IOrAlt<T> | IOrAltWithGate<T>

export interface IParserState {
    errors:exceptions.IRecognitionException[]
    lexerState:any
    RULE_STACK:string[]
    CST_STACK:CstNode[]
    LAST_EXPLICIT_RULE_STACK:number[]
}

export interface DSLMethodOpts<T> {
    /**
     * in-lined method name
     */
    NAME?:string

    /**
     * The Grammar to process in this method.
     */
    DEF:GrammarAction<T>
    /**
     * A semantic constraint on this DSL method
     * @see https://github.com/SAP/chevrotain/blob/master/examples/parser/predicate_lookahead/predicate_lookahead.js
     * For farther details.
     */
    GATE?:Predicate
}

export interface DSLMethodOptsWithErr<T> extends DSLMethodOpts<T> {
    /**
     *  Short title/classification to what is being matched.
     *  Will be used in the error message,.
     *  If none is provided, the error message will include the names of the expected
     *  Tokens sequences which start the method's inner grammar
     */
    ERR_MSG?:string
}

export interface OrMethodOpts<T> {

    NAME?:string
    /**
     * The set of alternatives,
     * See detailed description in @link {Parser.OR1}
     */
    DEF:IAnyOrAlt<T>[]
    /**
     * A description for the alternatives used in error messages
     * If none is provided, the error message will include the names of the expected
     * Tokens sequences which may start each alternative.
     */
    ERR_MSG?:string
}

export interface ManySepMethodOpts<T> {

    NAME?:string
    /**
     * The Grammar to process in each iteration.
     */
    DEF:GrammarAction<T>
    /**
     * The separator between each iteration.
     */
    SEP:TokenConstructor
}

export interface AtLeastOneSepMethodOpts<T> extends ManySepMethodOpts<T> {
    /**
     *  Short title/classification to what is being matched.
     *  Will be used in the error message,.
     *  If none is provided, the error message will include the names of the expected
     *  Tokens sequences which start the method's inner grammar
     */
    ERR_MSG?:string
}

export type Predicate = () => boolean
export type GrammarAction<OUT> = () => OUT

export type ISeparatedIterationResult<OUT> =
    {
        values:OUT[], // The aggregated results of the values returned by each iteration.
        separators:IToken[] // the separator tokens between the iterations
    }

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
export function EMPTY_ALT<T>(value:T = undefined):() => T {
    return function () {
        return value
    }
}


export class DslParser extends Parser {
    protected definedRulesNames:string[] = []
    protected definitionErrors:IParserDefinitionError[]
    protected _productions:HashTable<gast.Rule> = new HashTable<gast.Rule>()

    constructor(input:IToken[], tokensDictionary:{ [fqn:string]:TokenConstructor } | TokenConstructor[] | IMultiModeLexerDefinition,
                config:IParserConfig = DEFAULT_PARSER_CONFIG) {
        super(input, tokensDictionary, config)
    }

    /**
     * @See RULE
     * Same as RULE, but should only be used in "extending" grammars to override rules/productions
     * from the super grammar.
     */
    protected OVERRIDE_RULE<T>(name: string,
        impl: (...implArgs: any[]) => T,
        config: IRuleConfig<T> = DEFAULT_RULE_CONFIG): (idxInCallingRule?: number, ...args: any[]) => T {
        return this.doRule(name, impl, config)
    }

    protected RULE<T>(name: string,
        impl: (...implArgs: any[]) => T,
        // TODO: how to describe the optional return type of CSTNode? T|CstNode is not good because it is not backward
        // compatible, T|any is very general...
        config: IRuleConfig<T> = DEFAULT_RULE_CONFIG): (idxInCallingRule?: number, ...args: any[]) => T | any {

        return this.doRule(name, impl, config)
    }

    protected doRule<T>(name: string,
        impl: (...implArgs: any[]) => T,
        config: IRuleConfig<T> = DEFAULT_RULE_CONFIG): (idxInCallingRule?: number, ...args: any[]) => T {

        let ruleErrors = validateRuleName(name)
        ruleErrors = ruleErrors.concat(validateRuleDoesNotAlreadyExist(name, this.definedRulesNames, this.className))
        this.definedRulesNames.push(name)
        this.definitionErrors.push.apply(this.definitionErrors, ruleErrors) // mutability for the win

        // allow custom GAST builder
        let _buildTopProduction = config.buildTopProduction || buildTopProduction

        // only build the gast representation once.
        if (!(this._productions.containsKey(name))) {
            let implString = (config && config.implText) || impl.toString()
            let gastProduction = _buildTopProduction(implString, name, this.tokensMap, config)
            this._productions.put(name, gastProduction)
        }
        else {
            let parserClassProductions = cache.getProductionsForClass(this.className)
            let cachedProduction = parserClassProductions.get(name)
            // in case of duplicate rules the cache will not be filled at this point.
            if (!isUndefined(cachedProduction)) {
                // filling up the _productions is always needed to inheriting grammars can access it (as an instance member)
                // otherwise they will be unaware of productions defined in super grammars.
                this._productions.put(name, cachedProduction)
            }
        }

        let ruleImplementation = this['defineRule'](name, impl, config)
        this[name] = ruleImplementation
        return ruleImplementation
    }
}

