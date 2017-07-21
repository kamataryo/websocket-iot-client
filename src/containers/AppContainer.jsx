import React from 'react'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider as ReduxProvider }    from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import appReducer from '../reducers/appReducer'
import LoginView      from '../Components/LoginView.jsx'
import ControllerView from '../Components/ControllerView.jsx'

import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'


import io from 'socket.io-client'
import config from '../config'
const ACCESS_TOKEN = config.constants.ACCESS_TOKEN

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()


/**
 * socketIOMiddleware
 * @param  {Store} store Redux store
 * @return {void}
 */
const socketIOMiddleware = history => store => next => action => {

  if (action.type === 'CONNECT_SOCKET') {

    // parse verification
    const { endpoint, username, password, token, enableLocalStorage } = action.payload

    // display loading
    store.dispatch({ type: 'DISPLAY_LOADING', payload: { loading: true } })

    // initialize local storage
    if (!enableLocalStorage) {
      localStorage.clear()
    }

    /**
     * Socket.IO instance
     * @type {Socket}
     */
    const socket = io.connect(`//${endpoint}`)

    socket.on('connect', () => {

      // try auth
      socket.emit('auth', { username, password, token })

      // add Event Listener on authentication success/failure
      socket.on('permit', ({ permission, token }) => {

        if (permission) {
          // save token in local storage
          if (enableLocalStorage) {
            localStorage.setItem(ACCESS_TOKEN, token)
          }

          setTimeout(() => {
            // disable loading display
            store.dispatch({ type: 'DISPLAY_LOADING', payload: { loading: false } })
            // login
            store.dispatch({ type: 'LOGIN', payload: { login: true } })
            // clean up username and password
            store.dispatch({ type: 'UPDATE_PARAMS', payload: { username: '', password: '' } })
            // go!
            console.log('aaa')
            history.push('/')
          }, config.constants.loadingDelay)

          // this client doesn't need permitation from now
          socket.off('permit')

          // add Event Listener of downstream
          socket.on('downstream', buttonState => {
            store.dispatch({
              type: 'UPDATE_BUTTON_STATE',
              payload: { buttonState }
            })
          })

          // add Event Listener of upstream as callback
          store.dispatch({
            type: 'DEFINE_CALLBACK',
            payload: {
              name: 'emitUpstream',
              callback: buttonState => {
                socket.emit('upstream', buttonState)
                store.dispatch({ type: 'UPDATE_BUTTON_STATE', payload: { buttonState } })
              }
            }
          })

          // add Logout callback
          store.dispatch({
            type: 'DEFINE_CALLBACK',
            payload: {
              name: 'logout',
              callback: () => {
                localStorage.removeItem(ACCESS_TOKEN)
                // do logout
                store.dispatch({ type: 'LOGIN', payload: { login: false } })
                // clean state
                store.dispatch({ type: 'UPDATE_PARAMS', payload: { enableLocalStorage: false } })
              }
            }
          })

        } else {
          // remove unnecessary event handler for safety
          socket.off('disconnect')
          // auth failed and close connection
          socket.disconnect()
          store.dispatch({ type: 'UPDATE_PARAMS', payload: { error: 'AUTH_ERROR' } })
          store.dispatch({ type: 'DISPLAY_LOADING', payload: { loading: false } })
        }
      })
    })

    // maybe serverside panic
    socket.on('disconnect', () => {
      socket.disconnect()
      store.dispatch({ type: 'UPDATE_PARAMS', payload: { error: 'CONN_ERROR' } })
      store.dispatch({ type: 'LOGIN', payload: { login: false } })
      store.dispatch({ type: 'DISPLAY_LOADING', payload: { loading: false } })
    })

    socket.on('connect_error', () => {
      socket.disconnect()
      store.dispatch({ type: 'UPDATE_PARAMS', payload: { error: 'CONN_ERROR' } })
      store.dispatch({ type: 'DISPLAY_LOADING', payload: { loading: false } })
    })

  }

  next(action)
}

const history = createHistory()
const middleWares = [routerMiddleware(history), socketIOMiddleware(history)]
const store = createStore(
  combineReducers({
    app     : appReducer,
    routing : routerReducer,
  }),
  applyMiddleware(...middleWares)
)

/**
 * Render AppContainer
 * @return {ReactComponent} App Container
 */
export default () => (
  <MuiThemeProvider>
    <ReduxProvider store={ store }>
      <Router history={ history }>
        <div>
          <Route component={ LoginView } path={ '/login' } exact />
          <Route component={ ControllerView } path={ '/' } exact />
        </div>
      </Router>
    </ReduxProvider>
  </MuiThemeProvider>
)
