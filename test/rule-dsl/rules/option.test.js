import test from 'ava'
import { prepare } from './prepare'
import {
  allRules
} from './lib'

test('OPTION', t => {
    let options = {
        logging: true
    }
    let { parser, parsers, rules } = prepare(options)

    let rule = new allRules.Option(parser, options)
    rule.config({parsers, rules})

    let value = 'If Else'
    let result = rule.resolve(value)
    let expected = [
        /\$\.OPTION\(/,
        /\$\.CONSUME\(If\)/,
        /\$\.CONSUME\(Else\)/
    ]        
    console.log('result', result)
    expected.map(exp => {
        t.regex(result.code, exp)
    })
})