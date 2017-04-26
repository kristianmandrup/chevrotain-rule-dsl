import test from 'ava'
import { prepare } from './prepare'
import {
  allRules
} from './lib'

test('alt', t => {
    let options = {
        logging: true
    }
    let { parser, parsers, rules } = prepare(options)
    let rule = new allRules.Alt(parser, options)
    rule.config({parsers, rules})

    let value = 'If'
    let result = rule.resolve(value)
    let expected = /{ALT: \(\) => {\s+\$\.CONSUME\(If\)\s+}}/
    console.log('result', result)
    t.regex(result.code, expected)
})