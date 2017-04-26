import test from 'ava'
import { prepare } from './prepare'
import {
  allRules
} from './lib'

test('SUBRULE', t => {
    let options = {
        logging: true,
        logMap: {
            subrule: true
        }
    }
    let { parser, parsers, rules } = prepare(options)
    let rule = new allRules.Subrule(parser, options)
    rule.config({parsers, rules})

    let value = 'elseClause'
    let result = rule.resolve(value)
    let expected = /{$.SUBRULE: \(\) => {\s+elseClause\s+}}/
    console.log('result', result)
    t.regex(result.code, expected)
})
