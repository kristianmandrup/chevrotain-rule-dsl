# Chevrotain Rule DSL

[![Greenkeeper badge](https://badges.greenkeeper.io/kristianmandrup/chevrotain-rule-dsl.svg)](https://greenkeeper.io/)

Chevrotain Rule DSL

## Install

`npm i -S chevrotain-rule-dsl`

## Usage

The usual approach:

```js
$.RULE("qualifiedName", () => {
    $.CONSUME(Identifier)
    $.CONSUME(Dot)
    $.CONSUME2(Identifier)
})
```

Much cleaner expressiveness with the DSL

```js
import { rule } from './rule-parser'
import {
    allTokens,
    Comma,
    Identifier,
    // ...
} from './lexer'

export class SelectParser extends Parser {
  registry = {} // to hold registered rules

  constructor(input) {
      super(input, allTokens)
      // must be called at the end of the constructor!
      Parser.performSelfAnalysis(this)
  }


  selectClause = rule(this, 'selectClause', [
      // auto-matically detect token and use consume:
      Select, {
          // automatically detect REPEAT if min or sep
          min: 1,
          sep: Comma,
          def: Identifier
      }
  ])

  selectStatement = rule(this, 'selectStatement', [
      'selectClause', 'fromClause', {
          option: ['whereClause']
      }
  ])

  fromClause = rule(this, 'fromClause', [{
      consume: From
  }, {
      consume: Identifier
  }])

  whereClause = rule(this, 'whereClause', [Where, 'expression'])

  atomicExpression = rule(this, 'atomicExpression', {
      // automatically use alt for each OR rule
      or: [Integer, Identifier]
  })

  relationalOperator = rule(this, 'relationalOperator', [{
      or: [GreaterThan, LessThan]
  }])

  expression = rule(this, 'expression', [
      'atomicExpression',
      'relationalOperator',
      // auto-detect repeat!
      'atomicExpression'
  ])
```

## Status

Currently the DSL is parsed in order to build a function that when executed is equivalent
to using the standard API. In turn we also generate code that mirrors using the standard API, so that the built in GAST parser works (walking over the code using Regular expressions).

Next step will be to also build the GAST directly (see below).

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

## Transform CST to AST

[CST to AST example](https://github.com/kdex/chi/blob/master/src/Parser.js#L249)

## Contributing

Install dependency modules/packages

`npm i`

### Compile/Build

The project includes a `gulpfile` configured to use Babel 6.
All `/src` files are compiled to `/dist` including source maps.

Scripts:

- start: `npm start`
- build: `npm run build` (ie. compile)
- watch and start: `npm run watch`
- watch and build: `npm run watch:b`

### Run Tests

`npm test` or simply `ava test`

## License

MIT Kristian Mandrup