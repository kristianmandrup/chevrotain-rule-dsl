import test from 'ava'
import { prepare } from './prepare'
import {
  allRules
} from './lib'

test('REPEAT: MANY', t => {
    let options = {
        logging: true,
        logMap: {
            repeat: true
        }
    }
    let { parser, parsers, rules } = prepare(options)
    let rule = new allRules.Repeat(parser, options)
    rule.config({parsers, rules})

    let value = {
        min: 0,
        def: 'Else'
    }
    let result = rule.resolve(value)
    let expected = /{MANY: {DEF: \(\) => {\s+\$\.CONSUME\(Else\)\s+}}}/
    console.log('result', result)
    t.regex(result.code, expected)
})

test.skip('REPEAT: AT_LEAST_ONE', t => {
    let options = {
        logging: true
    }
    let { parser, parsers, rules } = prepare(options)
    let rule = new allRules.Repeat(parser, options)
    rule.config({parsers, rules})

    let value = '(Else)+'
    let result = rule.resolve(value)
    let expected = /{AT_LEAST_ONE: {DEF: \(\) => {\s+\$\.CONSUME\(Else\)\s+}}}/
    console.log('result', result)
    t.regex(result.code, expected)
})

test.skip('REPEAT: MANY_SEP', t => {
    let options = {
        logging: true
    }
    let { parser, parsers, rules } = prepare(options)
    let rule = new allRules.Repeat(parser, options)
    rule.config({parsers, rules})

    let value = '(Else ,)*'
    let result = rule.resolve(value)
    let expected = /{MANY: {DEF: \(\) => {\s+\$\.CONSUME\(Else\)\s+}}}/
    console.log('result', result)
    t.regex(result.code, expected)
})

test.skip('REPEAT: AT_LEAST_ONE_SEP', t => {
    let options = {
        logging: true
    }
    let { parser, parsers, rules } = prepare(options)
    let rule = new allRules.Repeat(parser, options)
    rule.config({parsers, rules})

    let value = '(Else ,)+'
    let result = rule.resolve(value)
    let expected = /{AT_LEAST_ONE: {SEP: Comma, DEF: \(\) => {\s+\$\.CONSUME\(Else\)\s+}}}/
    console.log('result', result)
    t.regex(result.code, expected)
})