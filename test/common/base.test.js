import test from 'ava'
import {
    Base
} from '../../lib/src/common/base'
import {
    Parser
} from 'chevrotain'
import {
  allTokens,
  SelectLexer
} from '../lexer'

test('Base', t => {
    let lexingResult = SelectLexer.tokenize('ALT')
    let parser = new Parser(lexingResult, allTokens)
    let base = new Base(parser, {
        logging: true
    })
    t.true(base.logging)
})