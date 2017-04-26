import {
  Parser
} from 'chevrotain'
import {
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

export function prepare(options) {
    const parser = createParser('If')

    console.log('Rules', Rules)
    let rules = new Rules(parser, options).configure()
    let parsers = new Parsers(parser, options).configure()
    
    console.log('parsers config')
    parsers.config({parsers, rules})
    console.log('rules config')
    rules.config({parsers, rules})
    return {rules, parsers, parser}
}

