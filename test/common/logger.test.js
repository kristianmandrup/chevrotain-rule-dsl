import test from 'ava'
import {
    Logger
} from '../../lib/src/common/logger'

test('Logger', t => {
    let logger = new Logger({
        logging: true
    })
    t.true(logger.logging)
})