import test from 'ava'
import { prepare } from './prepare'
import {
  allRules
} from './lib'

test('OR', t => {
    let options = {
        logging: true
    }
    let { parser, parsers, rules } = prepare(options)

    let rule = new allRules.Or(parser, options)
    rule.config({parsers, rules})

    let value = 'If or Else'
    let result = rule.resolve(value)
    let expected = /\$\.OR\(\[{ALT: \(\) => {\s+\$\.CONSUME\(If\)\s+},\s+{ALT: \(\) => {\s+\$\.CONSUME\(Else\)\s+}\]\)/
    console.log('result', result)
    t.regex(result.code, expected)
})