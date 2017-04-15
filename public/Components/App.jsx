import React, { Component } from 'react'
import update from 'immutability-helper'
import AppBar       from 'material-ui/AppBar'

import ControllerView from './ControllerView.jsx'
import LoginView      from './LoginView.jsx'

/**
 * Create Socket Connection
 * @type {Socket}
 */

/**
 * App Container
 * @type {ReactComponent}
 */
export default class App extends Component {

  /**
   * constructor
   * @return {void}
   */
  constructor() {
    super()
    this.state = {
      isLoginSuccess: false,
    }
  }

  /**
   * [onLoginSuccess description]
   * @param {boolean} result whether login success
   * @return {void} [description]
   */
  onTryLogin(result) {
    this.setState(update(this.state, { isLoginSuccess: { $set: result } }))
  }

  /**
   * Render
   * @return {ReactDomElement} React DOM Element
   */
  render() {

    return (
      <div>
        <main className={ 'main-contianer' }>

          <AppBar
            showMenuIconButton={ false }
            title={ 'WebSocket IoT UI' }
            titleStyle={ { textAlign: 'center' } }
          />

          { this.state.isLoginSuccess ?
            <ControllerView /> :
            <LoginView onTryLogin={ this.onTryLogin } />
          }

        </main>
      </div>
    )
  }

}
