import update from 'immutability-helper'


const initialState = {
  endpoint     : 'http://localhost:3000',
  username     : '',
  password     : '',
  error        : false,
  enableCookie : false,
  buttonState  : {},
  callbacks    : {},
  isLoggedIn   : false,
}

export default (state = initialState, action) => {

  switch (action.type) {

    case 'LOGIN':
      const { login } = action.payload
      return update(state, { isLoggedIn: { $set : login } })

    case 'UPDATE_PARAMS':
      const kvs = action.payload
      const paramUpdator = Object.keys(kvs)
        .filter(key => ['username', 'password', 'endpoint', 'error', 'enableCookie'].includes(key))
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
