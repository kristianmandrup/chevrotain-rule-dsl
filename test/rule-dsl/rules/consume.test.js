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

    let rule = new allRules.Consume(parser, options)
    rule.config({parsers, rules})

    let value = 'If'
    let result = rule.resolve(value)
    let expected = '$.CONSUME(If)'
    console.log('result', result)
    t.deepEqual(result.code, expected)
})