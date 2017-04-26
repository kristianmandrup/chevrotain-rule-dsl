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

    let rule = new allRules.Option(parser, options)
    rule.config({parsers, rules})

    let value = '(If Else)?'
    let result = rule.resolve(value)
    let expected = /\$\.OPTION\(\[{If}, {Else}\]\)/
    console.log('result', result)
    t.regex(result.code, expected)
})