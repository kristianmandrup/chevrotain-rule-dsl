# Chevrotain Rule DSL

Chevrotain Rule DSL

## Example

```js
rule(this, 'selectClause', [
    'select',
    '(id ,)+'
])

rule(this, 'selectClause', [
    'selectClause',
    'fromClause'
    '(whereClause)?'
])
```

## Install

`npm i -S chevrotain-rule-dsl`

## Usage

The built-in *chevrotain* API feels a bit "cumbersome":

```js
$.RULE("qualifiedName", () => {
    $.CONSUME(Identifier)
    $.CONSUME(Dot)
    $.CONSUME2(Identifier)
})
```

This library lets you express the same with a neat wrapper DSL.
Here are some examples using the DSL.

```js
import { rule } from './chevrotain-rule-dsl'
import {
    allTokens,
    Comma,
    Identifier,
    // ...
} from './lexer'

// potentially filled with other/reusable rules (fx. from another Parser)
let myRegistry = {
  // ...
}

// alias mappings to tokens
const tokenMap = {
  ',': Comma,
  'else': Else,
  'id': Identifier
}

export class SelectParser extends Parser {
  registry = {} // to hold registered rules

  constructor(input) {
      super(input, allTokens)
      // must be called at the end of the constructor!
      Parser.performSelfAnalysis(this)
  }


  selectClause = rule(this, 'selectClause', [
      // auto-matically detect token and use consume:
      'Select', {
          // automatically detect REPEAT if min or sep
          min: 1,
          sep: ',', // using token alias ',' from tokenMap (option)
          def: 'id' // using token alias 'id' from tokenMap
      }
  ], {
    // options
    logging: true,
    registry: myRegistry,
    tokenMap // use alias mapping for this rule!
  })

  selectStatement = rule(this, 'selectStatement', [
      'selectClause fromClause', {
          option: 'whereClause'
      }
  ])

  fromClause = rule(this, 'fromClause', [{
      consume: From
  }, {
      consume: Identifier
  }])

  whereClause = rule(this, 'whereClause', ['Where', 'expression'])

  atomicExpression = rule(this, 'atomicExpression', {
      // automatically use alt for each OR rule
      or: [Integer, Identifier]
  })

  relationalOperator = rule(this, 'equalityOperator', 'Equal | NotEqual')
  relationalOperator = rule(this, 'relationalOperator', 'GreaterThan or LessThan')

  expression = rule(this, 'expression', [
      'atomicExpression',
      'relationalOperator',
      // auto-detect repeat!
      'atomicExpression'
  ])
```

## More usage examples

Please see [red-dragon](https://github.com/kristianmandrup/red-dragon) test cases for more usage examples.

## String rules

String rules allow for more concise rule expressions.

### Option expression

Traditional Option rule API:

```js
this.OPTION(() => {
  this.CONSUME(Identifier)
  this.CONSUME(Colon)
  this.CONSUME(Type)
})
```

Can now be expressed using `?` in RegExp like pattern `(...)?`

`(id : type)?`

### Repeat/Many expression

The following is a bit cumbersome

```js
{
    // automatically detect REPEAT if min or sep
    min: 1,
    sep: ',', // using token alias ',' from tokenMap (option)
    def: 'id' // using token alias 'id' from tokenMap
}
```

This can now be expressed more simply in this common string format:

`(id ,)+` or `(id : type ,)*`

Where the `+` or `*` is the cardinality, ie. 1 to many or 0 to many respectively.
The last word before the right parenthesis `)` is the separator.
The remainder text after the left `(` and before the separator is parsed as the rule definition `def`

```js
{
    min: 0,
    sep: ',',
    def: 'id : type'
}
```

Which the parser would resolve to the following:

```js
$.MANY_SEP({
    SEP: Comma,
    DEF: () => {
      $.Consume(Identifier)
      $.Consume(Colon)
      $.Consume(Type)
    }
})
```

## Status and TODO

Currently the DSL is parsed in order to build a function that when executed is equivalent
to using the standard chevrotain rule API. In turn we also generate textual code that mirrors using the standard API. This "hack" lets the chevrotain GAST parser walk the textual code via Regular expressions as usual.

Currently this [PR](https://github.com/SAP/chevrotain/pull/451) is needed in order for the GAST walker to work with the textual code generated.

The key is how the `implString` is resolved, here by trying from the config `code` option if present before using the function code.

```js
// only build the gast representation once.
if (!(this._productions.containsKey(name))) {
    let implString = (config && config.code) || implementation.toString()
    let gastProduction = buildTopProduction(implString, name, this.tokensMap)
```

You can also directly override the `RULE` method in your Parser as follows.
Ideally the GAST production step should be entirely customizabl.

```js
protected RULE<T>(name: string,
    implementation: (...implArgs: any[]) => T,
    // TODO: how to describe the optional return type of CSTNode? T|CstNode is not good because it is not backward
    // compatible, T|any is very general...
    config: IRuleConfig<T> = DEFAULT_RULE_CONFIG): (idxInCallingRule?: number, ...args: any[]) => T | any {

    let ruleErrors = validateRuleName(name)
    ruleErrors = ruleErrors.concat(validateRuleDoesNotAlreadyExist(name, this.definedRulesNames, this.className))
    this.definedRulesNames.push(name)
    this.definitionErrors.push.apply(this.definitionErrors, ruleErrors) // mutability for the win

    // only build the gast representation once.
    if (!(this._productions.containsKey(name))) {
        let implString = (config && config.code) || implementation.toString()
        let gastProduction = buildTopProduction(implString, name, this.tokensMap)
        this._productions.put(name, gastProduction)
    }
    else {
        let parserClassProductions = cache.getProductionsForClass(this.className)
        let cachedProduction = parserClassProductions.get(name)
        // in case of duplicate rules the cache will not be filled at this point.
        if (!isUndefined(cachedProduction)) {
            // filling up the _productions is always needed to inheriting grammars can access it (as an instance member)
            // otherwise they will be unaware of productions defined in super grammars.
            this._productions.put(name, cachedProduction)
        }
    }

    let ruleImplementation = this.defineRule(name, implementation, config)
    this[name] = ruleImplementation
    return ruleImplementation
}
```

Next step will be to (also) build the GAST directly (see below).

* Modify the `Parser` config object (passed at construction) not each `Rule` config object to accept a custom function that given some params (rule name / rule impel func/ ...) will create the GAST structure
* By default it will use the built in GAST Builder
* Custom use cases can implement their own logic, but won't have to be forced to generate strings.

If the `GastBuilder` string -> GAST method is exposed. Then a single generic function on the parser level can perform the conversion from a string you generated to the GAST using some ID (ruleName).

### CST

[Concrete Syntax Tree Creation](https://github.com/SAP/chevrotain/blob/master/docs/concrete_syntax_tree.md)

Chevrotain has the capability to automatically create a concrete syntax tree (CST) during parsing. A CST is a simple structure which represents the entire parse tree. It contains information on every token parsed.

The main advantage of using the automatic CST creation is that it enables writing "pure" grammars. This means that the semantic actions are not embedded into the grammar implementation but are instead completely separated from it.

This separation of concerns makes the grammar easier to maintain and makes it easier to implement different capabilities on the grammar, for example: separate logic for compilation and for IDE support.

CST is enabled by setting the `outputCst` flag.

```js
class MyParser extends chevrotain.Parser {
     constructor(input) {
        super(input, allTokens, {outputCst : true})
    }
}
```

Using:

```js
$.RULE("qualifiedName", () => {
    $.CONSUME(Identifier)
    $.CONSUME(Dot)
    $.CONSUME2(Identifier)
})

input = "foo.bar"

output = {
  name: "qualifiedName",
  children: {
      Dot : ["."],
      Identifier : ["foo", "bar"]
  }
}
```

Note: Basic CST Visitor for easy CST to AST conversion is coming real soon in *chevrotain* (ETA: April 2017)

## Transform CST to AST

[CST to AST example](https://github.com/kdex/chi/blob/master/src/Parser.js#L249)

## Contributing

Install dependency modules/packages

`npm i`

Install *ava* for testing

`npm i -g ava`

Add tests from [red-dragon](https://github.com/kristianmandrup/red-dragon)

`ava`

### Compile/Build

* Currently assumes VSC editor
* Run TypeScript build task in `.vscode`
* Alternatively use `tsc` directly in terminal

### Run Tests

`npm test` or simply `ava test`

## License

MIT Kristian Mandrup