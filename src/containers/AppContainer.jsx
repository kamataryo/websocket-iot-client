import React           from 'react'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider as ReduxProvider }    from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import reducers from '../reducers'
import LoginView      from '../Components/LoginView.jsx'
import ControllerView from '../Components/ControllerView.jsx'

import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()


const history = createHistory()
const middleWare = routerMiddleware(history)
const store = createStore(
  combineReducers({
    app     : reducers,
    routing : routerReducer,
  }),
  applyMiddleware(middleWare)
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
