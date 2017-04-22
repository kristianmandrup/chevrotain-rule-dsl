import { Parser } from 'chevrotain';
import { exceptions } from "chevrotain/lib/src/parse/exceptions_public";
import { HashTable } from "chevrotain/lib/src/lang/lang_extensions";
import { IToken } from "chevrotain/lib/src/scan/tokens_public";
import { IMultiModeLexerDefinition, TokenConstructor } from "chevrotain/lib/src/scan/lexer_public";
import { gast } from "chevrotain/lib/src/parse//grammar/gast_public";
import { CstNode } from "chevrotain/lib/src/parse/cst/cst_public";
export declare enum ParserDefinitionErrorType {
    INVALID_RULE_NAME = 0,
    DUPLICATE_RULE_NAME = 1,
    INVALID_RULE_OVERRIDE = 2,
    DUPLICATE_PRODUCTIONS = 3,
    UNRESOLVED_SUBRULE_REF = 4,
    LEFT_RECURSION = 5,
    NONE_LAST_EMPTY_ALT = 6,
    AMBIGUOUS_ALTS = 7,
    CONFLICT_TOKENS_RULES_NAMESPACE = 8,
    INVALID_TOKEN_NAME = 9,
    INVALID_NESTED_RULE_NAME = 10,
    DUPLICATE_NESTED_NAME = 11,
    NO_NON_EMPTY_LOOKAHEAD = 12,
    AMBIGUOUS_PREFIX_ALTS = 13,
}
export declare type IgnoredRuleIssues = {
    [dslNameAndOccurrence: string]: boolean;
};
export declare type IgnoredParserIssues = {
    [ruleName: string]: IgnoredRuleIssues;
};
export declare type TokenMatcher = (token: IToken, tokClass: TokenConstructor) => boolean;
export declare type TokenInstanceIdentityFunc = (tok: IToken) => string;
export declare type TokenClassIdentityFunc = (tok: TokenConstructor) => string;
export interface IParserConfig {
    /**
     * Is the error recovery / fault tolerance of the Chevrotain Parser enabled.
     */
    recoveryEnabled?: boolean;
    /**
     * Maximum number of tokens the parser will use to choose between alternatives.
     */
    maxLookahead?: number;
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
    ignoredIssues?: IgnoredParserIssues;
    /**
     * Enable This Flag to to support Dynamically defined Tokens via inheritance.
     * This will disable performance optimizations which cannot work if the whole Token vocabulary is not known
     * During Parser initialization.
     */
    dynamicTokensEnabled?: boolean;
    /**
     * Enable automatic Concrete Syntax Tree creation
     * For in-depth docs:
     * {@link https://github.com/SAP/chevrotain/blob/master/docs/concrete_syntax_tree.md}
     */
    outputCst?: boolean;
}
export interface IRuleConfig<T> {
    implText?: string;
    buildTopProduction?: Function;
    /**
     * The function which will be invoked to produce the returned value for a production that have not been
     * successfully executed and the parser recovered from.
     */
    recoveryValueFunc?: () => T;
    /**
     * Enable/Disable re-sync error recovery for this specific production.
     */
    resyncEnabled?: boolean;
}
export interface IParserDefinitionError {
    message: string;
    type: ParserDefinitionErrorType;
    ruleName?: string;
}
export interface IParserDuplicatesDefinitionError extends IParserDefinitionError {
    dslName: string;
    occurrence: number;
    parameter?: string;
}
export interface IParserEmptyAlternativeDefinitionError extends IParserDefinitionError {
    occurrence: number;
    alternative: number;
}
export interface IParserAmbiguousAlternativesDefinitionError extends IParserDefinitionError {
    occurrence: number;
    alternatives: number[];
}
export interface IParserUnresolvedRefDefinitionError extends IParserDefinitionError {
    unresolvedRefName: string;
}
export interface IFollowKey {
    ruleName: string;
    idxInCallingRule: number;
    inRule: string;
}
/**
 * OR([
 *  {ALT:XXX },
 *  {ALT:YYY },
 *  {ALT:ZZZ }
 * ])
 */
export interface IOrAlt<T> {
    ALT: () => T;
}
/**
 * OR([
 *  { GATE:condition1, ALT:XXX },
 *  { GATE:condition2, ALT:YYY },
 *  { GATE:condition3, ALT:ZZZ }
 * ])
 */
export interface IOrAltWithGate<T> extends IOrAlt<T> {
    NAME?: string;
    GATE: () => boolean;
    ALT: () => T;
}
export declare type IAnyOrAlt<T> = IOrAlt<T> | IOrAltWithGate<T>;
export interface IParserState {
    errors: exceptions.IRecognitionException[];
    lexerState: any;
    RULE_STACK: string[];
    CST_STACK: CstNode[];
    LAST_EXPLICIT_RULE_STACK: number[];
}
export interface DSLMethodOpts<T> {
    /**
     * in-lined method name
     */
    NAME?: string;
    /**
     * The Grammar to process in this method.
     */
    DEF: GrammarAction<T>;
    /**
     * A semantic constraint on this DSL method
     * @see https://github.com/SAP/chevrotain/blob/master/examples/parser/predicate_lookahead/predicate_lookahead.js
     * For farther details.
     */
    GATE?: Predicate;
}
export interface DSLMethodOptsWithErr<T> extends DSLMethodOpts<T> {
    /**
     *  Short title/classification to what is being matched.
     *  Will be used in the error message,.
     *  If none is provided, the error message will include the names of the expected
     *  Tokens sequences which start the method's inner grammar
     */
    ERR_MSG?: string;
}
export interface OrMethodOpts<T> {
    NAME?: string;
    /**
     * The set of alternatives,
     * See detailed description in @link {Parser.OR1}
     */
    DEF: IAnyOrAlt<T>[];
    /**
     * A description for the alternatives used in error messages
     * If none is provided, the error message will include the names of the expected
     * Tokens sequences which may start each alternative.
     */
    ERR_MSG?: string;
}
export interface ManySepMethodOpts<T> {
    NAME?: string;
    /**
     * The Grammar to process in each iteration.
     */
    DEF: GrammarAction<T>;
    /**
     * The separator between each iteration.
     */
    SEP: TokenConstructor;
}
export interface AtLeastOneSepMethodOpts<T> extends ManySepMethodOpts<T> {
    /**
     *  Short title/classification to what is being matched.
     *  Will be used in the error message,.
     *  If none is provided, the error message will include the names of the expected
     *  Tokens sequences which start the method's inner grammar
     */
    ERR_MSG?: string;
}
export declare type Predicate = () => boolean;
export declare type GrammarAction<OUT> = () => OUT;
export declare type ISeparatedIterationResult<OUT> = {
    values: OUT[];
    separators: IToken[];
};
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
export declare function EMPTY_ALT<T>(value?: T): () => T;
export declare class DslParser extends Parser {
    protected definedRulesNames: string[];
    protected definitionErrors: IParserDefinitionError[];
    protected _productions: HashTable<gast.Rule>;
    constructor(input: IToken[], tokensDictionary: {
        [fqn: string]: TokenConstructor;
    } | TokenConstructor[] | IMultiModeLexerDefinition, config?: IParserConfig);
    /**
     * @See RULE
     * Same as RULE, but should only be used in "extending" grammars to override rules/productions
     * from the super grammar.
     */
    protected OVERRIDE_RULE<T>(name: string, impl: (...implArgs: any[]) => T, config?: IRuleConfig<T>): (idxInCallingRule?: number, ...args: any[]) => T;
    protected RULE<T>(name: string, impl: (...implArgs: any[]) => T, config?: IRuleConfig<T>): (idxInCallingRule?: number, ...args: any[]) => T | any;
    protected doRule<T>(name: string, impl: (...implArgs: any[]) => T, config?: IRuleConfig<T>): (idxInCallingRule?: number, ...args: any[]) => T;
}
