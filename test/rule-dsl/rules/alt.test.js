import test from 'ava'
import {
  Parser
} from 'chevrotain'
import {
  allRules
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
    altRule.config()
    let value = 'If'
    let result = altRule.resolve(value)
    let expected = '{ALT: () => If}'
    console.log('result', result)
    t.deepEqual(result.code, expected)
})