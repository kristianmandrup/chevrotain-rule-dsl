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

console.log('RulesParser', RulesParser)

export class SelectParser extends Parser {
  registry = {}

  constructor(input, options = {}) {
    super(input, allTokens)
  }
}

const defaultOptions = {
    // logging: true
}

function createParser(text, options) {
  let lexingResult = SelectLexer.tokenize(text)
  return new SelectParser(lexingResult)
}

const parser = createParser('If')

test('alt', t => {
    let altRule = new allRules.Alt(parser)
    let value = 'If'
    let result = altRule.resolve(value)
    let expected = '{ALT: () => If}'
    t.deepEqual(result.code, expected)
})