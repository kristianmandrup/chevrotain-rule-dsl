import { IRange, Range } from 'chevrotain/lib/src/text/range'
import { 
    gast, 
    RepetitionMandatory, 
    RepetitionWithSeparator, 
    Repetition,
    IProduction,
    Terminal,
    Rule,
    Flat,
    Option,
    Alternation,
    NonTerminal,
    AbstractProduction,
    IOptionallyNamedProduction
} from 'chevrotain/lib/src/parse/grammar/gast_public'
import { 
    every, 
    filter, 
    forEach, 
    isEmpty, 
    isUndefined, 
    partial, 
    sortBy, 
    uniq 
} from 'chevrotain/lib/src/utils/utils'
import { TokenConstructor } from 'chevrotain/lib/src/scan/lexer_public'

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

export interface IOccurrence {
    idx: boolean
    refRule:Rule
    name: string
    occurrence: number
    separator: string
    parent: number
}

export interface IProdValue {
    range: IRange
    occurrence: IOccurrence
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
        return ['type', 'text', 'range', 'occurrence'].indexOf(key) < 0
    }

    protected buildProdGast(value): IProduction {
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
        prodValue: IProdValue) {
        let isImplicitOccurrenceIdx = prodValue.occurrence.idx
        prodInstance.occurrenceInParent = prodValue.occurrence.parent
        prodInstance.implicitOccurrenceIndex = isImplicitOccurrenceIdx

        let nestedName = prodValue.occurrence.name
        if (!isUndefined(nestedName)) {
            (prodInstance as IOptionallyNamedProduction).name = nestedName
        }
        return this.buildAbstractProd(prodInstance, prodValue.range)
    }

    protected buildAtLeastOneProd(prodValue: IProdValue): RepetitionMandatory {
        return this.buildProdWithOccurrence(new RepetitionMandatory([]), prodValue)
    }

    protected buildAtLeastOneSepProd(prodValue: IProdValue): RepetitionWithSeparator {
        return this.buildRepetitionWithSep(prodValue, gast.RepetitionMandatoryWithSeparator)
    }

    protected buildManyProd(prodValue: IProdValue): Repetition {
        return this.buildProdWithOccurrence(new Repetition([]), prodValue)
    }

    protected buildManySepProd(prodValue: IProdValue): RepetitionWithSeparator {
        return this.buildRepetitionWithSep(prodValue, gast.RepetitionWithSeparator)
    }


    buildRepetitionWithSep(prodValue: IProdValue,
        repConstructor: Function): RepetitionWithSeparator {
        let occurrence = prodValue.occurrence
        let occurrenceIdx = occurrence.idx

        let sepName = occurrence.separator
        let separatorType = terminalNameToConstructor[sepName]
        if (!separatorType) {
            throw Error('Separator Terminal Token name: ' + sepName + ' not found')
        }

        let repetitionInstance: any = new (<any>repConstructor)([], separatorType, occurrenceIdx)
        repetitionInstance.implicitOccurrenceIndex = occurrenceIdx
        let nestedName = occurrence.name
        if (!isUndefined(nestedName)) {
            (repetitionInstance as IOptionallyNamedProduction).name = nestedName
        }
        return this.buildAbstractProd(repetitionInstance, prodValue.range)
    }

    buildOptionProd(prodValue: IProdValue): Option {
        return this.buildProdWithOccurrence(new Option([]), prodValue)
    }

    buildOrProd(prodValue: IProdValue): Alternation {
        return this.buildProdWithOccurrence(new Alternation([]), prodValue)
    }


    protected buildAbstractProd<T extends AbstractProduction>(prod: T,
        topLevelRange: IRange): T {
        let secondLevelProds = [] // TODO
        let secondLevelInOrder = sortBy(secondLevelProds, (prodRng) => { return prodRng.range.start })

        let definition: IProduction[] = []
        forEach(secondLevelInOrder, (prodRng) => {
            definition.push(this.buildProdGast(prodRng))
        })

        prod.definition = definition
        return prod
    }

    protected buildFlatProd(prodValue: IProdValue) {
        let prodInstance = new Flat([])
    }

    protected buildRefProd(prodValue: IProdValue): NonTerminal {
        let occurrence = prodValue.occurrence
        let isImplicitOccurrenceIdx = occurrence.idx
        let refOccurrence = occurrence.refRule
        let refProdName = occurrence.name
        let newRef = new NonTerminal(refProdName, undefined, refOccurrence)
        newRef.implicitOccurrenceIndex = isImplicitOccurrenceIdx
        return newRef
    }

    protected buildTerminalProd(prodValue: IProdValue): Terminal {
        let occurrence = prodValue.occurrence
        let isImplicitOccurrenceIdx = occurrence.idx
        let terminalOccurrence = occurrence.refRule
        let terminalName = occurrence.name
        let terminalType = terminalNameToConstructor[terminalName]
        if (!terminalType) {
            throw Error('Terminal Token name: ' + terminalName + ' not found')
        }

        let newTerminal = new Terminal(terminalType, terminalOccurrence)
        newTerminal.implicitOccurrenceIndex = isImplicitOccurrenceIdx
        return newTerminal
    }
}

