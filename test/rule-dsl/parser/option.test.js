import test from 'ava'
import { prepare } from './prepare'
import {
  allParsers
} from './lib'

test('OPTION', t => {
    let options = {
        logging: true,
        logMap: {
            option: true
        }
    }
    let { parser, parsers, rules } = prepare(options)

    let rule = new allParsers.OptionParser(parser, options)
    rule.config({parsers, rules})

    let value = '(If Else)?'
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