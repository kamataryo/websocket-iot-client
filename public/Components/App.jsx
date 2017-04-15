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
      isLoginSuccess : false,
      socket         : false,
    }
  }

  /**
   * optimizaion
   * @return {boolean} whether should update
   */
  shouldComponentUpdate() {
    return true
  }

  /**
   * onConnect callback
   * @param  {Socket} socket Socket.IO ibject
   * @return {void}
   */
  onConnect = socket => {
    console.log(socket)
    this.setState({ socket, isLoginSuccess: true })
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
            <ControllerView
              socket={ this.state.socket }
            /> :
            <LoginView
              onConnect={ this.onConnect }
              onTryLogin={ this.onTryLogin }
            />
          }

        </main>
      </div>
    )
  }

}
