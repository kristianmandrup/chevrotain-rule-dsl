import test from 'ava'
import {
  Parser
} from 'chevrotain'
import {
  allRules,
  Rules,
  Parsers
} from './lib'

import {
  allTokens,
  SelectLexer
} from '../../lexer'


const defaultOptions = {
    // logging: true
}

function createParser(text) {
  let lexingResult = SelectLexer.tokenize(text)
  return new Parser(lexingResult, allTokens)
}

test('alt', t => {
    let options = {
        logging: true
    }
    const parser = createParser('If')
    let altRule = new allRules.Alt(parser, options)

    console.log('Rules', Rules)
    let rules = new Rules(parser, options).configure()
    let parsers = new Parsers(parser, options).configure()
    
    console.log('parsers config')
    parsers.config({parsers, rules})
    console.log('rules config')
    rules.config({parsers, rules})

    altRule.config({parsers, rules})

    let value = 'If'
    let result = altRule.resolve(value)
    let expected = '{ALT: () => { $.CONSUME(If) }}'
    console.log('result', result)
    t.deepEqual(result.code, expected)
})