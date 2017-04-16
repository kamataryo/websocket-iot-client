import React, { Component } from 'react'

import AppBar from 'material-ui/AppBar'

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
      isLoginSuccessed : false,
      socket           : false,
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
   * @param  {boolean} isLoginSuccessed is login successed
   * @return {void}
   */
  onConnect = (socket, isLoginSuccessed) => {
    this.setState({ socket, isLoginSuccessed })
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

          { this.state.isLoginSuccessed ?
            <ControllerView
              socket={ this.state.socket }
            /> :
            <LoginView
              onConnect={ this.onConnect }
            />
          }

        </main>
      </div>
    )
  }

}
