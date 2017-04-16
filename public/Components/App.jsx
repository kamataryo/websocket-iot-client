import React, { Component } from 'react'
import cookie from 'react-cookie'

import AppBar           from 'material-ui/AppBar'
import CircularProgress from 'material-ui/CircularProgress'

import ControllerView from './ControllerView.jsx'
import LoginView      from './LoginView.jsx'

import auth from '../lib/auth'

import config from '../config'

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
      endpoint : 'http://localhost:3000',
      socket   : false,
      status   : config.StatusTypes.IS_LOADING,
      token    : cookie.load('token'),
      username : cookie.load('username'),
    }
  }

  async componentDidMount() {

    let result

    try {
      result = await auth({
        endpoint : this.state.endpoint,
        username : this.state.username,
        token    : this.state.token,
      })
    } catch (error) {
      this.onMount(() => this.setState(update(this.state, {
        status: { $set : config.StatusTypes.UNKNOWN_ERROR_OCCURED }
      })))
    }

    this.onMount(() => this.setState(update(this.state, {
      token  : { $set : result.token },
      socket : { $set : result.socket },
      status : { $set : result.status }
    })))
  }

  /**
   * optimizaion
   * @return {boolean} whether should update
   */
  shouldComponentUpdate() {
    return true
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

          { this.state.isLoading ?
            <CircularProgress
              innerStyle={ { margin: '50px' } }
              size={ 80 }
              thickness={ 5 }
            /> : this.state.isConnected ?
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
