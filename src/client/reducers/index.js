import update from 'immutability-helper'
import config from '../config'

const tokenExists = !!localStorage.getItem(config.constants.ACCESS_TOKEN)
const initialState = {
  endpoint           : 'http://localhost:3001',
  username           : '',
  password           : tokenExists ? 'just a place holder' : '',
  error              : false,
  enableLocalStorage : tokenExists,
  buttonState        : {},
  callbacks          : {},
  isLoading          : false,
  isLoggedIn         : false,
}

export default (state = initialState, action) => {

  switch (action.type) {

    case 'LOGIN':
      const { login } = action.payload
      return update(state, { isLoggedIn: { $set : login } })

    case 'DISPLAY_LOADING':
      const { loading } = action.payload
      return update(state, { isLoading: { $set: loading } })

    case 'UPDATE_PARAMS':
      const kvs = action.payload
      const paramUpdator = Object.keys(kvs)
        .filter(key => ['username', 'password', 'endpoint', 'error', 'enableLocalStorage'].includes(key))
        .reduce((prev, key) => {
          const value = kvs[key]
          prev[key] = { $set: value }
          return prev
        }, {})
      return update(state, paramUpdator)

    case 'UPDATE_BUTTON_STATE':
      const { buttonState } = action.payload
      const buttonStateUpdator = Object.keys(buttonState)
        .reduce((prev, key) => {
          const value = buttonState[key]
          prev.buttonState[key] = { $set: value }
          return prev
        }, { buttonState: {} })
      return update(state, buttonStateUpdator)

    case 'DEFINE_CALLBACK':
      const { name, callback } = action.payload
      return update(state, { callbacks: { [name]: { $set: callback } } })

    default:
      return state
  }
}
