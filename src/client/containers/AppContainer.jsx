import React           from 'react'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider }    from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import reducers from '../reducers'
import LoginView      from '../Components/LoginView.jsx'
import ControllerView from '../Components/ControllerView.jsx'

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
  <Provider store={ store }>
    <Router history={ history }>
      <div>
        <Route component={ LoginView } path={ '/login' } exact />
        <Route component={ ControllerView } path={ '/' } exact />
      </div>
    </Router>
  </Provider>
)
