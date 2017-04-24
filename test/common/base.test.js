import test from 'ava'
import {
    Base
} from '../../lib/src/common/base'

test('Base', t => {
    let base = new Base(null, {
        logging: true
    })
    t.true(abstr.logging)
})