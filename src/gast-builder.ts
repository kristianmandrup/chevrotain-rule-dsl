import { IRange, Range } from 'chevrotain/lib/src/text/range'
import { gast } from 'chevrotain/lib/src/parse/grammar/gast_public'
import { every, filter, forEach, isEmpty, isUndefined, partial, sortBy, uniq } from 'chevrotain/lib/src/utils/utils'
import { TokenConstructor } from 'chevrotain/lib/src/scan/lexer_public'
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
        return this.buildProdGast(this.json)
    }

    protected walkField(key) {
        return ['type', 'text', 'range'].indexOf(key) == -1
    }

    protected buildProdGast(value): gast.IProduction {
        if (typeof value === 'object') {
            let keys = Object.keys(value)
            return keys.filter(this.walkField).map(key => {
                let nextValue = value[key]
                return this.buildProdGast(nextValue)
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
                throw Error('non exhaustive match')
        }
    }


    buildProdWithOccurrence(
        prodInstance,
        prodRange: IProdRange) {
        let reResult = true
        let isImplicitOccurrenceIdx = reResult[1] === undefined
        prodInstance.occurrenceInParent = isImplicitOccurrenceIdx ? 1 : parseInt(reResult[1], 10)
        prodInstance.implicitOccurrenceIndex = isImplicitOccurrenceIdx

        let nestedName = reResult[2]
        if (!isUndefined(nestedName)) {
            (prodInstance as IOptionallyNamedProduction).name = nestedName
        }
        return this.buildAbstractProd(prodInstance, prodRange.range)
    }

    protected buildAtLeastOneProd(prodRange: IProdRange): gast.RepetitionMandatory {
        return this.buildProdWithOccurrence(new gast.RepetitionMandatory([]), prodRange)
    }

    protected buildAtLeastOneSepProd(prodRange: IProdRange): gast.RepetitionWithSeparator {
        return this.buildRepetitionWithSep(prodRange, gast.RepetitionMandatoryWithSeparator)
    }

    protected buildManyProd(prodRange: IProdRange): gast.Repetition {
        return this.buildProdWithOccurrence(new gast.Repetition([]), prodRange)
    }

    protected buildManySepProd(prodRange: IProdRange): gast.RepetitionWithSeparator {
        return this.buildRepetitionWithSep(prodRange, gast.RepetitionWithSeparator)
    }


    buildRepetitionWithSep(prodRange: IProdRange,
        repConstructor: Function): gast.RepetitionWithSeparator {
        let reResult = true
        let isImplicitOccurrenceIdx = reResult[1] === undefined
        let occurrenceIdx = isImplicitOccurrenceIdx ? 1 : parseInt(reResult[1], 10)

        let sepName = reResult[3]
        let separatorType = terminalNameToConstructor[sepName]
        if (!separatorType) {
            throw Error('Separator Terminal Token name: ' + sepName + ' not found')
        }

        let repetitionInstance: any = new (<any>repConstructor)([], separatorType, occurrenceIdx)
        repetitionInstance.implicitOccurrenceIndex = isImplicitOccurrenceIdx
        let nestedName = reResult[2]
        if (!isUndefined(nestedName)) {
            (repetitionInstance as IOptionallyNamedProduction).name = nestedName
        }
        return this.buildAbstractProd(repetitionInstance, prodRange.range)
    }

    buildOptionProd(prodRange: IProdRange): gast.Option {
        return this.buildProdWithOccurrence(new gast.Option([]), prodRange)
    }

    buildOrProd(prodRange: IProdRange): gast.Alternation {
        return this.buildProdWithOccurrence(new gast.Alternation([]), prodRange)
    }


    protected buildAbstractProd<T extends gast.AbstractProduction>(prod: T,
        topLevelRange: IRange): T {
        let secondLevelProds = [] // TODO
        let secondLevelInOrder = sortBy(secondLevelProds, (prodRng) => { return prodRng.range.start })

        let definition: gast.IProduction[] = []
        forEach(secondLevelInOrder, (prodRng) => {
            definition.push(this.buildProdGast(prodRng))
        })

        prod.definition = definition
        return prod
    }

    protected buildFlatProd(prodRange: IProdRange) {
        let prodInstance = new gast.Flat([])
    }

    protected buildRefProd(prodRange: IProdRange): gast.NonTerminal {
        let reResult = true
        let isImplicitOccurrenceIdx = reResult[1] === undefined
        let refOccurrence = isImplicitOccurrenceIdx ? 1 : parseInt(reResult[1], 10)
        let refProdName = reResult[2]
        let newRef = new gast.NonTerminal(refProdName, undefined, refOccurrence)
        newRef.implicitOccurrenceIndex = isImplicitOccurrenceIdx
        return newRef
    }

    protected buildTerminalProd(prodRange: IProdRange): gast.Terminal {
        let reResult = true
        let isImplicitOccurrenceIdx = reResult[1] === undefined
        let terminalOccurrence = isImplicitOccurrenceIdx ? 1 : parseInt(reResult[1], 10)
        let terminalName = reResult[2]
        let terminalType = terminalNameToConstructor[terminalName]
        if (!terminalType) {
            throw Error('Terminal Token name: ' + terminalName + ' not found')
        }

        let newTerminal = new gast.Terminal(terminalType, terminalOccurrence)
        newTerminal.implicitOccurrenceIndex = isImplicitOccurrenceIdx
        return newTerminal
    }
}

