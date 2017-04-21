import { IRange, Range } from "chevrotain/lib/src/text/range"
import { gast } from "chevrotain/lib/src/parse/grammar/gast_public"
import { every, filter, forEach, isEmpty, isUndefined, partial, sortBy, uniq } from "chevrotain/lib/src/utils/utils"
import { TokenConstructor } from "chevrotain/lib/src/scan/lexer_public"
import IProduction = gast.IProduction
import Terminal = gast.Terminal
import NonTerminal = gast.NonTerminal
import AbstractProduction = gast.AbstractProduction
import IOptionallyNamedProduction = gast.IOptionallyNamedProduction

export enum ProdType {
    OPTION,
    OR,
    MANY,
    MANY_SEP,
    AT_LEAST_ONE,
    AT_LEAST_ONE_SEP,
    REF,
    TERMINAL,
    FLAT
}

export interface IProdRange {
    range: IRange
    text: string
    type: ProdType
}

export interface ITerminalNameToConstructor {
    [fqn: string]: TokenConstructor
}

export let terminalNameToConstructor: ITerminalNameToConstructor = {}

export class GastBuilder {
    terminals: ITerminalNameToConstructor
    json: object
    name: string

    constructor(json: object, name: string, terminals: ITerminalNameToConstructor) {
        this.terminals = terminals
        this.json = json
        this.name = name
    }

    public build() {
        let topLevelProd = new gast.Rule(this.name, [], this.json)
        return this.buildProdGast(topLevelProd)
    }

    protected buildProdGast(rule: gast.Rule): gast.IProduction {
        let prodRange = this.json['prodRange']
        let allRanges = this.json['allRanges']
        switch (prodRange.type) {
            case ProdType.AT_LEAST_ONE:
                return this.buildAtLeastOneProd(prodRange, allRanges)
            case ProdType.AT_LEAST_ONE_SEP:
                return this.buildAtLeastOneSepProd(prodRange, allRanges)
            case ProdType.MANY_SEP:
                return this.buildManySepProd(prodRange, allRanges)
            case ProdType.MANY:
                return this.buildManyProd(prodRange, allRanges)
            case ProdType.OPTION:
                return this.buildOptionProd(prodRange, allRanges)
            case ProdType.OR:
                return this.buildOrProd(prodRange, allRanges)
            case ProdType.FLAT:
                return this.buildFlatProd(prodRange, allRanges)
            case ProdType.REF:
                return this.buildRefProd(prodRange)
            case ProdType.TERMINAL:
                return this.buildTerminalProd(prodRange)
            /* istanbul ignore next */
            default:
                throw Error("non exhaustive match")
        }
    }

    buildAtLeastOneProd(prodRange: IProdRange, allRanges) {

    }

    buildAtLeastOneSepProd(prodRange: IProdRange, allRanges) {

    }

    buildManySepProd(prodRange, allRanges) {

    }

    buildManyProd(prodRange: IProdRange, allRanges) {

    }

    buildOptionProd(prodRange: IProdRange, allRanges) {

    }

    buildOrProd(prodRange: IProdRange, allRanges) {

    }

    buildFlatProd(prodRange: IProdRange, allRanges) {

    }

    buildRefProd(prodRange: IProdRange): gast.NonTerminal {
        let reResult = true
        let isImplicitOccurrenceIdx = reResult[1] === undefined
        let refOccurrence = isImplicitOccurrenceIdx ? 1 : parseInt(reResult[1], 10)
        let refProdName = reResult[2]
        let newRef = new gast.NonTerminal(refProdName, undefined, refOccurrence)
        newRef.implicitOccurrenceIndex = isImplicitOccurrenceIdx
        return newRef
    }

    buildTerminalProd(prodRange: IProdRange): gast.Terminal {
        let reResult = true
        let isImplicitOccurrenceIdx = reResult[1] === undefined
        let terminalOccurrence = isImplicitOccurrenceIdx ? 1 : parseInt(reResult[1], 10)
        let terminalName = reResult[2]
        let terminalType = terminalNameToConstructor[terminalName]
        if (!terminalType) {
            throw Error("Terminal Token name: " + terminalName + " not found")
        }

        let newTerminal = new gast.Terminal(terminalType, terminalOccurrence)
        newTerminal.implicitOccurrenceIndex = isImplicitOccurrenceIdx
        return newTerminal
    }
}

