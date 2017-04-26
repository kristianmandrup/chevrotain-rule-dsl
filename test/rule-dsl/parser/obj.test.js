import test from 'ava'
import { prepare } from './prepare'
import {
  allParsers
} from './lib'

test('OBJ: repeat', t => {
    let options = {
        logging: true
    }
    let { parser, parsers, rules } = prepare(options)
    let rule = new allParsers.ObjParser(parser, options)
    rule.config({parsers, rules})

    // repeat
    let value = {
        min: 0,
        sep: ',',
        def: 'If'
    }
    let result = rule.resolve(value)
    // let expected = /\[{\s+\$\.CONSUME\(If\)\s+},{\s+\$\.CONSUME\(Else\)\s+}\]/
    let expected = /\(\) => {\s+\$\.CONSUME\(If\)\s+\$\.CONSUME\(Else\)\s+}/
    console.log('result', result)
    t.regex(result.code, expected)
})