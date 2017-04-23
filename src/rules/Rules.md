## Rules

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
```
