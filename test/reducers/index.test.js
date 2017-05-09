// src/reducers.test.js
import test     from 'ava'
import reducers from 'client/reducers/index.js'

test('LOGIN reducer', t => {
  t.deepEqual(
    reducers(
      { isLoggedIn: false },
      { type: 'LOGIN', payload: { login: true } }
    ),
    { isLoggedIn: true }
  )
})

test('DISPLAY_LOADING reducer', t => {
  t.deepEqual(
    reducers(
      { isLoading: false },
      { type: 'DISPLAY_LOADING', payload: { loading: true } }
    ),
    { isLoading: true }
  )
})

test('UPDATE_PARAMS reducer', t => {
  t.deepEqual(
    reducers(
      {
        username : 'foo',
        password : 'bar',
        endpoint : 'baz',
        error    : 'foo',
        enableLocalStorage : false,
        __other  : 'should not be updated'
      },
      {
        type: 'UPDATE_PARAMS',
        payload: {
          username : 'foo!',
          password : 'bar!',
          endpoint : 'baz!',
          error    : 'foo!',
          enableLocalStorage : true,
          __other  : 'try update!'
        },
      }
    ),
    {
      username : 'foo!',
      password : 'bar!',
      endpoint : 'baz!',
      error    : 'foo!',
      enableLocalStorage : true,
      __other  : 'should not be updated'
    }
  )
})

test('UPDATE_BUTTON_STATE reducer', t => {
  t.deepEqual(
    reducers(
      {
        buttonState: {
          any     : 0,
          params  : 1,
          should  : 2,
          be      : 3,
          updated : 4
        }
      },
      {
        type: 'UPDATE_BUTTON_STATE',
        payload: {
          buttonState : {
            params  : -1,
            should  : -2,
            be      : -3,
            updated : -4
          }
        },

      }
    ),
    {
      buttonState: {
        any     : 0,
        params  : -1,
        should  : -2,
        be      : -3,
        updated : -4
      }
    },
  )
})

test('DEFINE_CALLBACK reducer', t => {
  /* eslint-disable require-jsdoc */
  const noop = x => x
  const callback = x => x + 1

  t.deepEqual(
    reducers(
      { callbacks: { noop } },
      { type: 'DEFINE_CALLBACK', payload: { name: 'do', callback } }
    ),
    { callbacks: { noop, do: callback } }
  )
})
