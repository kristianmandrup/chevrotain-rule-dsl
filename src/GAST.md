## GAST

The (first) `value` argument of the GASTBuilder constructor expects a nested structure, where each node
implements the interface `IProdValue`.

```js
export interface IOccurrence {
    refRule?:Rule
    name: string // use for: nestedName, prodName and refProdName
    idx: boolean
    sepName?: string
    repeatCount?: number // occurrenceInParent (how many times repeated)
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

export declare enum ProdType {
    OPTION = 0,
    OR = 1,
    MANY = 2,
    MANY_SEP = 3,
    AT_LEAST_ONE = 4,
    AT_LEAST_ONE_SEP = 5,
    REF = 6,
    TERMINAL = 7,
    FLAT = 8,
}
```
## Decorate Value

The method `decorate` can be used to return a fully formed `IProdValue` instance, in case you need to, such
as parsing text to create the values required.

```js
protected decorate(value, type?: string) {
    return value
}
```

The legacy `buildRefProd`: 

```js
buildRefProd(prodRange:IProdRange): NonTerminal {
    let reResult = refRegEx.exec(prodRange.text)
    let isImplicitOccurrenceIdx = reResult[1] === undefined
    let refOccurrence = isImplicitOccurrenceIdx ? 1 : parseInt(reResult[1], 10)
    let refProdName = reResult[2]
    let newRef = new NonTerminal(refProdName, undefined, refOccurrence)
    newRef.implicitOccurrenceIndex = isImplicitOccurrenceIdx
    return newRef
}
```

### RegExp pattern matching

```js
const optionPrefixRegEx = /\.\s*OPTION(\d)?\s*\(/
const optionRegEx = new RegExp(optionPrefixRegEx.source + namePropRegExp.source)
const optionRegExGlobal = new RegExp(optionPrefixRegEx.source, "g")

const manyPrefixRegEx = /\.\s*MANY(\d)?\s*\(/
const manyRegEx = new RegExp(manyPrefixRegEx.source + namePropRegExp.source)
```

```js
const regExConfig = {
    option: new RegExp(regExConfig.optionPrefix.source + regExConfig.nameProp.source),
    optionPrefix: /\.\s*OPTION(\d)?\s*\(/,
    // ...
}
```

### Decorator

```js
protected regExFor(value, type) {
    // return dedicated regular expression with match groups
    return regExConfig[type]
}

protected decorate(value, type?: string) {
    if (!value.text) return value
    
    // if text on value, use pattern matching to extract occurence object props
    let regEx = this.regExFor(value, type)
    let reResult = regEx.exec(value.text)
    let idx = reResult[1] === undefined  
     
    let repeatCount = idx ? 1 : parseInt(reResult[1], 10)
    let sepName = reResult[3]
    let name = sepName || type === 'prod' ? reResult[2] : reResult[1]

    value.occurrence = {
        idx,
        repeatCount,
        name,
        sepName
    }
    return value
}
```

## Production Value

The incoming `value` could look something like this:

```js
{
    // text: 'OR([ ... ]),
    order: 0, // used as range alternative for sorting/ordering children
    // range: [15..21] // for text (ie. position and span)
    type: OR,
    occurrence: {
        name: 'or'
        refRule: 'orRule',
        separator: '||'
    },
    children: [
        {
            order: 0
            type: ALT,
            // ...
        },
        {
            order: 1
            type: ALT,
            // ...
        }        
    ]
}
```

The legacy GAST builder, that uses the source code to generate the `occurence` object.
To duplicate this or similar logic, you can use `configure` to pass an `options` object with the 
source code.

```js
new GASTBuilder(prodValue, 'myRule', allTokens)
    .configure({impelText: sourceCode})
    .build()
```

The legacy config would be sth like this:

```js
public configure(options) {
    // let spacedImpelText = " " + options.impelText
    // let txtWithoutComments = this.removeComments(" " + spacedImpelText)
    // let textWithoutCommentsAndStrings = this.removeStringLiterals(txtWithoutComments)
    // this.prodRanges = this.createRanges(textWithoutCommentsAndStrings)
    return this
}
```

## Building the GAST

The GAST to be built must be created from instanced of the following GAST classes

```js
    class NonTerminal extends AbstractProduction implements IProductionWithOccurrence {
        constructor(public nonTerminalName:string,
                    public referencedRule:Rule = undefined,
                    public occurrenceInParent:number = 1,
                    public implicitOccurrenceIndex:boolean = false) { super([]) }

 
    }
    export class Rule extends AbstractProduction {
        constructor(public name:string, definition:IProduction[], public orgText:string = "") { super(definition) }
    }

    export class Flat extends AbstractProduction implements IOptionallyNamedProduction {
        // A named Flat production is used to indicate a Nested Rule in an alternation
        constructor(definition:IProduction[], public name?:string) { super(definition) }
    }

    export class Option extends AbstractProduction implements IProductionWithOccurrence, IOptionallyNamedProduction {
        constructor(definition:IProduction[],
                    public occurrenceInParent:number = 1,
                    public name?:string,
                    public implicitOccurrenceIndex:boolean = false) { super(definition) }
    }

    export class RepetitionMandatory extends AbstractProduction implements IProductionWithOccurrence, IOptionallyNamedProduction {
        constructor(definition:IProduction[],
                    public occurrenceInParent:number = 1,
                    public name?:string,
                    public implicitOccurrenceIndex:boolean = false) { super(definition) }
    }

    export class RepetitionMandatoryWithSeparator extends AbstractProduction
        implements IProductionWithOccurrence, IOptionallyNamedProduction {
        constructor(definition:IProduction[],
                    public separator:TokenConstructor,
                    public occurrenceInParent:number = 1,
                    public name?:string,
                    public implicitOccurrenceIndex:boolean = false) { super(definition) }
    }

    export class Repetition extends AbstractProduction implements IProductionWithOccurrence, IOptionallyNamedProduction {
        constructor(definition:IProduction[],
                    public occurrenceInParent:number = 1,
                    public name?:string,
                    public implicitOccurrenceIndex:boolean = false) { super(definition) }
    }

    export class RepetitionWithSeparator extends AbstractProduction implements IProductionWithOccurrence, IOptionallyNamedProduction {
        constructor(definition:IProduction[],
                    public separator:TokenConstructor,
                    public occurrenceInParent:number = 1,
                    public name?:string,
                    public implicitOccurrenceIndex:boolean = false) { super(definition) }
    }

    export class Alternation extends AbstractProduction implements IProductionWithOccurrence, IOptionallyNamedProduction {
        constructor(definition:Flat[],
                    public occurrenceInParent:number = 1,
                    public name?:string,
                    public implicitOccurrenceIndex:boolean = false) { super(definition) }
    }

    export class Terminal implements IProductionWithOccurrence {
        constructor(public terminalType:TokenConstructor,
                    public occurrenceInParent:number = 1,
                    public implicitOccurrenceIndex:boolean = false) {}

        accept(visitor:GAstVisitor):void {
            visitor.visit(this)
        }
    }
```