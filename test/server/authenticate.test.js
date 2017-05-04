import test from 'ava'
import authenticate from '../../src/server/authenticate'

test('authenticate with password and username', async t => {
  const result = await authenticate({ username: 'admin', password: 'admin' })
  t.true(result.success)
})
