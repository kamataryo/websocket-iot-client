import React, { Component } from 'react'
import update from 'immutability-helper'
import cookie from 'react-cookie'

import AppBar           from 'material-ui/AppBar'
import CircularProgress from 'material-ui/CircularProgress'

import ControllerView from './ControllerView.jsx'
import LoginView      from './LoginView.jsx'

import auth from '../lib/auth'

import config from '../config'


const {
  StatusTypes : {
    AUTH_REQUIRED,
    CONNECTION_FAILED,
    IS_LOADING,
    IS_LOGGED_IN,
  },
  DEFAULT_ENDPOINT
} = config

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
      endpoint : DEFAULT_ENDPOINT,
      socket   : undefined,
      status   : {
        type    : IS_LOADING,
        message : 'Loading...',
        isError : false
      },
      token    : cookie.load('token'),
      username : cookie.load('username'),
    }
  }

  componentDidMount() {

    if (!this.username) {
      setTimeout(() => {
        this.setState(update(this.state, {
          status : {
            type    : { $set : AUTH_REQUIRED },
            message : { $set : '' },
            isError : { $set : false },
          }
        }))
      }, 1000) // just wait
      return
    }

    auth({
      endpoint : this.state.endpoint,
      username : this.state.username,
      token    : this.state.token,
    })
      .then(result => this.setState(update(this.state, {
        token  : { $set : result.token },
        socket : { $set : result.socket },
        status : { $set : result.status },
      })))
      .catch(() => this.setState(update(this.state, {
        status: {
          type    : { $set : CONNECTION_FAILED },
          message : { $set : '不明なエラーです。' },
          isError : { $set : true },
        }
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

    // for all
    const { status } = this.state

    // for ControllerView
    const {
      socket,
      token,
    } = this.state

    // for LoginView
    const {
      username,
      endpoint,
    } = this.state

    return (
      <div>
        <main className={ 'main-contianer' }>

          <AppBar
            showMenuIconButton={ false }
            title={ 'WebSocket IoT UI' }
            titleStyle={ { textAlign: 'center' } }
          />

          {
            (() => {
              switch (status.type) {

                case IS_LOADING:
                  return (
                    <CircularProgress
                      innerStyle={ { margin: '50px' } }
                      size={ 80 }
                      thickness={ 5 }
                    />
                  )

                case AUTH_REQUIRED:
                case CONNECTION_FAILED:
                  return (
                    <LoginView
                      endpoint={ endpoint }
                      isError={ status.isError }
                      message={ status.message }
                      statusType={ status.type }
                      username={ username }
                    />
                  )

                case IS_LOGGED_IN:
                  return (
                    <ControllerView
                      socket={ socket }
                      token={ token }
                    />
                  )
              }
            })()
          }

        </main>
      </div>
    )
  }

}
