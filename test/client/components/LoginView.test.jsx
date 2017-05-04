import test           from 'ava'
import React          from 'react'
import ReactDOM       from 'react-dom'
import { shallow }    from 'enzyme'
import configureStore from 'redux-mock-store'
import { Provider }   from 'react-redux'
import LoginView      from '../../../src/client/Components/LoginView.jsx'

const mockStore = configureStore()
const initialState = { foo: 'bar' }

test('renders without crashing', () => {

  const store = mockStore(initialState)
  ReactDOM.render(
    <Provider store={ store }>
      <LoginView />
    </Provider>,
    document.createElement('div')
  )
})
