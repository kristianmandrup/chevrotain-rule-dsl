import { IRange, Range } from 'chevrotain/lib/src/text/range'
import { 
    gast, 
    RepetitionMandatory, 
    RepetitionWithSeparator,
    RepetitionMandatoryWithSeparator,
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
    refRule?:Rule
    name: string
    index: boolean
    separator?: string
    parent?: number
}

export interface IProdValue {
    range?: IRange
    order?: number
    occurrence: IOccurrence
    text?: string
    type: ProdType
    definition?: IProduction[]
    children?:  IProdValue[]
}

export interface ITerminalNameToConstructor {
    [fqn: string]: TokenConstructor
}

export class GastBuilder {
    terminals: ITerminalNameToConstructor = {}
    value: IProdValue
    name: string

    constructor(value: IProdValue, name: string, terminals: ITerminalNameToConstructor) {
        this.terminals = terminals
        this.value = value
        this.name = name
    }

    protected terminalNameToConstructor(name: string) {
        return this.terminals[name]
    }

    public build() {
        let topLevelProd = new Rule(this.name, [], this.value)
        return this.buildProdGast(this.value)
    }

    protected walkField(key) {
        return ['type', 'text', 'range', 'occurrence'].indexOf(key) < 0
    }

    // can f.ex be used to take the text and parse it into an occurence
    protected decorate(value) {
        return value
    }

    protected buildProdGast(value: IProdValue): IProduction {
        if (typeof value === 'object') {
            let keys = Object.keys(value)
            return keys.filter(this.walkField).map(key => {
                let nextValue = value[key]
                return this.buildProdGast(nextValue)
            })
        }

        value = this.decorate(value)

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
        prodInstance.occurrenceInParent = prodValue.occurrence.parent
        prodInstance.implicitOccurrenceIndex = prodValue.occurrence.index

        let nestedName = prodValue.occurrence.name
        if (!isUndefined(nestedName)) {
            (prodInstance as IOptionallyNamedProduction).name = nestedName
        }
        return this.buildAbstractProd(prodInstance)
    }

    protected buildAtLeastOneProd(prodValue: IProdValue): RepetitionMandatory {
        return this.buildProdWithOccurrence(new RepetitionMandatory([]), prodValue)
    }

    protected buildAtLeastOneSepProd(prodValue: IProdValue): RepetitionWithSeparator {
        return this.buildRepetitionWithSep(prodValue, RepetitionMandatoryWithSeparator)
    }

    protected buildManyProd(prodValue: IProdValue): Repetition {
        return this.buildProdWithOccurrence(new Repetition([]), prodValue)
    }

    protected buildManySepProd(prodValue: IProdValue): RepetitionWithSeparator {
        return this.buildRepetitionWithSep(prodValue, RepetitionWithSeparator)
    }


    buildRepetitionWithSep(prodValue: IProdValue,
        repConstructor: Function): RepetitionWithSeparator {
        let occurrence = prodValue.occurrence
        let occurrenceIdx = occurrence.index

        let sepName = occurrence.separator
        let separatorType = this.terminalNameToConstructor(sepName)
        if (!separatorType) {
            throw Error('Separator Terminal Token name: ' + sepName + ' not found')
        }

        let repetitionInstance: any = new (<any>repConstructor)([], separatorType, occurrenceIdx)
        repetitionInstance.implicitOccurrenceIndex = occurrenceIdx
        let nestedName = occurrence.name
        if (!isUndefined(nestedName)) {
            (repetitionInstance as IOptionallyNamedProduction).name = nestedName
        }
        return this.buildAbstractProd(repetitionInstance)
    }

    buildOptionProd(prodValue: IProdValue): Option {
        return this.buildProdWithOccurrence(new Option([]), prodValue)
    }

    buildOrProd(prodValue: IProdValue): Alternation {
        return this.buildProdWithOccurrence(new Alternation([]), prodValue)
    }

    protected nested(prodValue: IProdValue): IProdValue[]  {
        return prodValue.children
    }

    protected buildAbstractProd<T extends AbstractProduction>(prodValue: IProdValue): IProdValue {
        let secondLevelProds = this.nested(prodValue)
        let secondLevelInOrder = sortBy(secondLevelProds, (prodVal) => { 
            return prodVal.order ? prodVal.order : prodVal.range.start 
        })

        let definition: IProduction[] = []
        forEach(secondLevelInOrder, (prodRng) => {
            definition.push(this.buildProdGast(prodRng))
        })

        prodValue.definition = definition
        return prodValue
    }

    protected buildFlatProd(prodValue: IProdValue) {
        let prodInstance = new Flat([])
    }

    protected buildRefProd(prodValue: IProdValue): NonTerminal {
        let occurrence = prodValue.occurrence
        let refOccurrence = occurrence.refRule
        let refProdName = occurrence.name
        let newRef = new NonTerminal(refProdName, undefined, refOccurrence)
        newRef.implicitOccurrenceIndex = occurrence.index
        return newRef
    }

    protected buildTerminalProd(prodValue: IProdValue): Terminal {
        let occurrence = prodValue.occurrence
        let index = occurrence.index
        let terminalOccurrence = occurrence.refRule
        let terminalName = occurrence.name
        let terminalType = this.terminalNameToConstructor(terminalName)
        if (!terminalType) {
            throw Error('Terminal Token name: ' + terminalName + ' not found')
        }

        let newTerminal = new Terminal(terminalType, terminalOccurrence)
        newTerminal.implicitOccurrenceIndex = index
        return newTerminal
    }
}

