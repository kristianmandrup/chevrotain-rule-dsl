import test from 'ava'
import {
    Abstract
} from '../../lib/src/common/abstract'

test('Abstract', t => {
    let abstr = new Abstract(null, {
        logging: true
    })
    t.true(abstr.logging)
})