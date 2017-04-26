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
    let expected = [
        /\$\.OR\(\[{ALT/,
        /ALT: \(\) =>/,
        /{\s+\$\.CONSUME\(If\)\s+}/,
        /{\s+\$\.CONSUME\(Else\)\s+}/
    ]
    console.log('result', result)
    expected.map(exp => {
        t.regex(result.code, exp)
    })
})