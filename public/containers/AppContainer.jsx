import React           from 'react'
import { createStore } from 'redux'
import { Provider }    from 'react-redux'

import App     from '../Components/App.jsx'
import reducer from '../reducers'

/**
 * Render AppContainer
 * @return {ReactComponent} App Container
 */
export default () => (
  <Provider store={ createStore(reducer) }>
    <App />
  </Provider>
)
