import test from 'ava'
import { prepare } from './prepare'
import {
  allParsers
} from './lib'

test('LIST', t => {
    let options = {
        logging: true
    }
    let { parser, parsers, rules } = prepare(options)
    let rule = new allParsers.ListParser(parser, options)
    rule.config({parsers, rules})

    let value = [
        'If', 'Else'
    ]
    let result = rule.resolve(value)
    // let expected = /\[{\s+\$\.CONSUME\(If\)\s+},{\s+\$\.CONSUME\(Else\)\s+}\]/
    let expected = /\(\) => {\s+\$\.CONSUME\(If\)\s+\$\.CONSUME\(Else\)\s+}/
    console.log('result', result)
    t.regex(result.code, expected)
})