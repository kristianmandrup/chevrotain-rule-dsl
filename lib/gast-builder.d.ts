import { IRange } from 'chevrotain/lib/src/text/range';
import { RepetitionMandatory, RepetitionWithSeparator, Repetition, IProduction, Terminal, Rule, Option, Alternation, NonTerminal, AbstractProduction } from 'chevrotain/lib/src/parse/grammar/gast_public';
import { TokenConstructor } from 'chevrotain/lib/src/scan/lexer_public';
import { ProdType } from './gast';
export interface IOccurrence {
    refRule?: Rule;
    name: string;
    idx: boolean;
    sepName?: string;
    repeatCount?: number;
}
export interface IProdValue {
    range?: IRange;
    order?: number;
    occurrence: IOccurrence;
    text?: string;
    type: ProdType;
    definition?: IProduction[];
    children?: IProdValue[];
}
export interface ITerminalNameToConstructor {
    [fqn: string]: TokenConstructor;
}
export declare class GastBuilder {
    terminals: ITerminalNameToConstructor;
    value: IProdValue;
    name: string;
    constructor(value: IProdValue, name: string, terminals: ITerminalNameToConstructor);
    configure(options: any): this;
    protected terminalNameToConstructor(name: string): any;
    build(): any;
    protected walkField(key: any): boolean;
    protected regExFor(value: any, type: any): RegExp;
    protected decorate(value: any, type?: string): any;
    protected typeFor(value: IProdValue): string;
    protected buildProdGast(value: IProdValue): IProduction;
    buildProdWithOccurrence(prodInstance: any, prodValue: IProdValue): IProdValue;
    protected buildAtLeastOneProd(prodValue: IProdValue): RepetitionMandatory;
    protected buildAtLeastOneSepProd(prodValue: IProdValue): RepetitionWithSeparator;
    protected buildManyProd(prodValue: IProdValue): Repetition;
    protected buildManySepProd(prodValue: IProdValue): RepetitionWithSeparator;
    buildRepetitionWithSep(prodValue: IProdValue, repConstructor: Function): RepetitionWithSeparator;
    buildOptionProd(prodValue: IProdValue): Option;
    buildOrProd(prodValue: IProdValue): Alternation;
    protected nested(prodValue: IProdValue): IProdValue[];
    protected buildAbstractProd<T extends AbstractProduction>(prodValue: IProdValue): IProdValue;
    protected buildFlatProd(prodValue: IProdValue): void;
    protected buildRefProd(prodValue: IProdValue): NonTerminal;
    protected buildTerminalProd(prodValue: IProdValue): Terminal;
}
