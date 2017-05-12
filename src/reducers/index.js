// @flow

type AppState = {
  endpoint: string,
  username: string,
  password: string,
  error: false | Error,
  enableLocalStorage: boolean,
  buttonState: Object,
  callbacks: Object,
  isLoading: boolean,
  isLoggedIn: boolean,
}

type Action = {
  type: string,
  payload: Object,
}

type $set<T> = { $set: T }

type ParamUpdator = {
  endpoint?: $set<string>,
  username?: $set<string>,
  password?: $set<string>,
  error?: $set<false | string>,
  enableLocalStorage?: $set<boolean>,
}

type EnumAcceptableUpdateKey =
  | 'username'
  | 'password'
  | 'endpoint'
  | 'error'
  | 'enableLocalStorage'

import update from 'immutability-helper'
import switz  from 'switz'
import config from '../config'

const tokenExists: boolean = !!localStorage.getItem(config.constants.ACCESS_TOKEN)
const initialState: AppState = {
  endpoint           : `${config.socketHostDefault}`,
  username           : '',
  password           : '',
  error              : false,
  enableLocalStorage : tokenExists,
  buttonState        : {},
  callbacks          : {},
  isLoading          : false,
  isLoggedIn         : false,
}

export default (state: AppState = initialState, action: Action): AppState => {

  return switz(action.type, s => s

    .case('LOGIN', () => {
      const { login }: { login?: boolean } = action.payload.login
      return update(state, { isLoggedIn: { $set : !!login } })
    })

    .case('DISPLAY_LOADING', () => {
      const { loading }: { loading?: boolean } = action.payload
      return update(state, { isLoading: { $set: !!loading } })
    })

    .case('UPDATE_PARAMS', () => {
      const kvs: Object = action.payload
      const keys: Array<EnumAcceptableUpdateKey> = Object.keys(kvs)
        .filter((key: string) => ['username', 'password', 'endpoint', 'error', 'enableLocalStorage'].includes(key))
      const paramUpdator: ParamUpdator = keys
        .reduce((prev: ParamUpdator, key: EnumAcceptableUpdateKey) => {
          const value: any = kvs[key]
          prev[key] = { $set: value }
          return prev
        }, {})

      // const paramUpdator: ParamUpdator = Object.keys(kvs)
      //   .filter((key: string) => ['username', 'password', 'endpoint', 'error', 'enableLocalStorage'].includes(key))
      //   .reduce((prev: ParamUpdator, key: EnumAcceptableUpdateKey) => {
      //     const value: any = kvs[key]
      //     prev[key] = { $set: value }
      //     return prev
      //   }, {})
      return update(state, paramUpdator)
    })

    .case('UPDATE_BUTTON_STATE', () => {
      const { buttonState } = action.payload
      const buttonStateUpdator = Object.keys(buttonState)
        .reduce((prev, key) => {
          const value = buttonState[key]
          prev.buttonState[key] = { $set: value }
          return prev
        }, { buttonState: {} })
      return update(state, buttonStateUpdator)
    })

    .case('DEFINE_CALLBACK', () => {
      const { name, callback }: { name: string, callback: Function } = action.payload
      return update(state, { callbacks: { [name]: { $set: callback } } })
    })

    .default(() => state)
  )
}
