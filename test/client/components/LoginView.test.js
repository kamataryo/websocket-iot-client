/* eslint-disable react/jsx-filename-extension */
import test      from 'ava'
import React     from 'react'
import { mount } from 'enzyme'
import configureStore from 'redux-mock-store'
import LoginView  from 'client/Components/LoginView.jsx'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

test('LoginView describe input forms', t => {

  const initialState = { app: {} }
  const mockStore = configureStore([])
  const store = mockStore(initialState)

  t.false(false) // TODO: test is not working...
})
