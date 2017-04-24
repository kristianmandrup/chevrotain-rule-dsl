"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gast_public_1 = require("chevrotain/lib/src/parse/grammar/gast_public");
const utils_1 = require("chevrotain/lib/src/utils/utils");
const gast_1 = require("./gast");
class GastBuilder {
    constructor(value, name, terminals) {
        this.terminals = {};
        this.terminals = terminals;
        this.value = value;
        this.name = name;
    }
    configure(options) {
        // let spacedImpelText = " " + options.impelText
        // let txtWithoutComments = this.removeComments(" " + spacedImpelText)
        // let textWithoutCommentsAndStrings = this.removeStringLiterals(txtWithoutComments)
        // this.prodRanges = this.createRanges(textWithoutCommentsAndStrings)
        return this;
    }
    terminalNameToConstructor(name) {
        return this.terminals[name];
    }
    build() {
        let topLevelProd = new gast_public_1.Rule(this.name, [], this.value);
        return this.buildProdGast(this.value);
    }
    walkField(key) {
        return ['type', 'text', 'range', 'occurrence'].indexOf(key) < 0;
    }
    regExFor(value, type) {
        return /\s*/;
        // return dedicated regular expression with match groups
        // return this.regExConfig[type]
    }
    // can f.ex be used to take the text and parse it into an occurence
    decorate(value, type) {
        if (!value.text)
            return value;
        let regEx = this.regExFor(value, type);
        let reResult = regEx.exec(value.text);
        let idx = reResult[1] === undefined;
        let repeatCount = idx ? 1 : parseInt(reResult[1], 10);
        let sepName = reResult[3];
        let name = sepName || type === 'ref' ? reResult[2] : reResult[1];
        value.occurrence = {
            idx,
            repeatCount,
            name,
            sepName
        };
        return value;
    }
    typeFor(value) {
        switch (value.type) {
            case gast_1.ProdType.AT_LEAST_ONE:
                return 'at-least-one';
            case gast_1.ProdType.AT_LEAST_ONE_SEP:
                return 'at-least-one-sep';
            case gast_1.ProdType.MANY_SEP:
                return 'many-sep';
            case gast_1.ProdType.MANY:
                return 'many';
            case gast_1.ProdType.OPTION:
                return 'option';
            case gast_1.ProdType.OR:
                return 'or';
            case gast_1.ProdType.FLAT:
                return 'flat';
            case gast_1.ProdType.REF:
                return 'ref';
            case gast_1.ProdType.TERMINAL:
                return 'terminal';
            default:
                throw new Error(`unknown type ${value.type}`);
        }
    }
    buildProdGast(value) {
        if (typeof value === 'object') {
            let keys = Object.keys(value);
            return keys.filter(this.walkField).map(key => {
                let nextValue = value[key];
                return this.buildProdGast(nextValue);
            });
        }
        let type = this.typeFor(value);
        value = this.decorate(value, type);
        switch (value.type) {
            case gast_1.ProdType.AT_LEAST_ONE:
                return this.buildAtLeastOneProd(value);
            case gast_1.ProdType.AT_LEAST_ONE_SEP:
                return this.buildAtLeastOneSepProd(value);
            case gast_1.ProdType.MANY_SEP:
                return this.buildManySepProd(value);
            case gast_1.ProdType.MANY:
                return this.buildManyProd(value);
            case gast_1.ProdType.OPTION:
                return this.buildOptionProd(value);
            case gast_1.ProdType.OR:
                return this.buildOrProd(value);
            case gast_1.ProdType.FLAT:
                return this.buildFlatProd(value);
            case gast_1.ProdType.REF:
                return this.buildRefProd(value);
            case gast_1.ProdType.TERMINAL:
                return this.buildTerminalProd(value);
            /* istanbul ignore next */
            default:
                throw Error('non exhaustive match');
        }
    }
    buildProdWithOccurrence(prodInstance, prodValue) {
        prodInstance.occurrenceInParent = prodValue.occurrence.repeatCount;
        prodInstance.implicitOccurrenceIndex = prodValue.occurrence.idx;
        let nestedName = prodValue.occurrence.name;
        if (!utils_1.isUndefined(nestedName)) {
            prodInstance.name = nestedName;
        }
        return this.buildAbstractProd(prodInstance);
    }
    buildAtLeastOneProd(prodValue) {
        return this.buildProdWithOccurrence(new gast_public_1.RepetitionMandatory([]), prodValue);
    }
    buildAtLeastOneSepProd(prodValue) {
        return this.buildRepetitionWithSep(prodValue, gast_public_1.RepetitionMandatoryWithSeparator);
    }
    buildManyProd(prodValue) {
        return this.buildProdWithOccurrence(new gast_public_1.Repetition([]), prodValue);
    }
    buildManySepProd(prodValue) {
        return this.buildRepetitionWithSep(prodValue, gast_public_1.RepetitionWithSeparator);
    }
    buildRepetitionWithSep(prodValue, repConstructor) {
        let occurrence = prodValue.occurrence;
        let occurrenceIdx = occurrence.idx;
        let sepName = occurrence.sepName;
        let separatorType = this.terminalNameToConstructor(sepName);
        if (!separatorType) {
            throw Error('Separator Terminal Token name: ' + sepName + ' not found');
        }
        let repetitionInstance = new repConstructor([], separatorType, occurrenceIdx);
        repetitionInstance.implicitOccurrenceIndex = occurrenceIdx;
        let nestedName = occurrence.name;
        if (!utils_1.isUndefined(nestedName)) {
            repetitionInstance.name = nestedName;
        }
        return this.buildAbstractProd(repetitionInstance);
    }
    buildOptionProd(prodValue) {
        return this.buildProdWithOccurrence(new gast_public_1.Option([]), prodValue);
    }
    buildOrProd(prodValue) {
        return this.buildProdWithOccurrence(new gast_public_1.Alternation([]), prodValue);
    }
    nested(prodValue) {
        return prodValue.children;
    }
    buildAbstractProd(prodValue) {
        let secondLevelProds = this.nested(prodValue);
        let secondLevelInOrder = utils_1.sortBy(secondLevelProds, (prodVal) => {
            return prodVal.order ? prodVal.order : prodVal.range.start;
        });
        let definition = [];
        utils_1.forEach(secondLevelInOrder, (prodRng) => {
            definition.push(this.buildProdGast(prodRng));
        });
        prodValue.definition = definition;
        return prodValue;
    }
    buildFlatProd(prodValue) {
        let prodInstance = new gast_public_1.Flat([]);
    }
    buildRefProd(prodValue) {
        let occurrence = prodValue.occurrence;
        let refOccurrence = occurrence.repeatCount;
        let refProdName = occurrence.name;
        let newRef = new gast_public_1.NonTerminal(refProdName, undefined, refOccurrence);
        newRef.implicitOccurrenceIndex = occurrence.idx;
        return newRef;
    }
    buildTerminalProd(prodValue) {
        let occurrence = prodValue.occurrence;
        let idx = occurrence.idx;
        let terminalOccurrence = occurrence.refRule;
        let terminalName = occurrence.name;
        let terminalType = this.terminalNameToConstructor(terminalName);
        if (!terminalType) {
            throw Error('Terminal Token name: ' + terminalName + ' not found');
        }
        let newTerminal = new gast_public_1.Terminal(terminalType, terminalOccurrence);
        newTerminal.implicitOccurrenceIndex = idx;
        return newTerminal;
    }
}
exports.GastBuilder = GastBuilder;
//# sourceMappingURL=gast-builder.js.map