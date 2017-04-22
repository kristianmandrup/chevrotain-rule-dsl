## GAST

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