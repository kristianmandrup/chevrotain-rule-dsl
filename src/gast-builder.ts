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
        return this.buildProdGast(topLevelProd, this.json)
    }

    protected buildProdGast(rule: gast.Rule, value): gast.IProduction {
        if (typeof value === 'object') {
            let keys = Object.keys(value)
            return keys.map(key => {
                return this.buildProdGast(rule, key)
            })
        }
        
        switch (value.type) {
            case ProdType.AT_LEAST_ONE:
                return this.buildAtLeastOneProd(value)
            case ProdType.AT_LEAST_ONE_SEP:
                return this.buildAtLeastOneSepProd(value)
            case ProdType.MANY_SEP:
                return this.buildManySepProd(value)
            case ProdType.MANY:
                return this.buildManyProd(value)
            case ProdType.OPTION:
                return this.buildOptionProd(value)
            case ProdType.OR:
                return this.buildOrProd(value)
            case ProdType.FLAT:
                return this.buildFlatProd(value)
            case ProdType.REF:
                return this.buildRefProd(value)
            case ProdType.TERMINAL:
                return this.buildTerminalProd(value)
            /* istanbul ignore next */
            default:
                throw Error("non exhaustive match")
        }
    }

    buildAtLeastOneProd(prodRange: IProdRange) {

    }

    buildAtLeastOneSepProd(prodRange: IProdRange) {

    }

    buildManySepProd(prodRange) {

    }

    buildManyProd(prodRange: IProdRange) {

    }

    buildOptionProd(prodRange: IProdRange) {

    }

    buildOrProd(prodRange: IProdRange) {

    }

    buildFlatProd(prodRange: IProdRange) {

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

