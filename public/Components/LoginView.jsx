import React, { Component } from 'react'
import PropTypes            from 'prop-types'
import update               from 'immutability-helper'
import RaisedButton         from 'material-ui/RaisedButton'
import TextField            from 'material-ui/TextField'

import config from '../config'

// parse constants
const STATUS_TYPES = Object.keys(config.StatusTypes)

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
 * LoginView
 * @return {ReactComponent} login view
 */
export default class LoginView extends Component {

  static PropTypes = {
    isError    : PropTypes.bool,
    message    : PropTypes.string,
    statusType : PropTypes.oneOf(STATUS_TYPES),
    endpoint   : PropTypes.endpoint,
    username   : PropTypes.string,
  }

  static defaultProps = {
    isError    : false,
    message    : '',
    statusType : IS_LOADING,
    endpoint   : DEFAULT_ENDPOINT,
    username   : '',
  }

  /**
   * [constructor description]
   * @param {Props} props Props
   * @return {void}
   */
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     username         : this.props.username,
  //     endpoint         : 'http://localhost:3000',
  //     password         : '',
  //     authFailed       : undefined,
  //     connectionFailed : undefined
  //   }
  // }

  /**
   * create callback to update Certification infomation
   * @param  {string} param username, endpoint, password
   * @return {void}
   */
  // updateCertification(param) {
  //   return (e, value) => this.setState(update(this.state, { [param]: { $set: value } }))
  // }

  /**
   * [tryConnect description]
   * @return {void} [description]
   */
  // tryConnect = () => {
  //   const socket = io.connect(this.state.endpoint)
  //   socket
  //     .on('connect', () => {
  //       // try authentication
  //       socket.emit('auth', {
  //         username: this.state.username,
  //         password: this.state.password
  //       })
  //       // wait response
  //       socket.on('permit', permitted => {
  //         if (permitted) {
  //           this.props.onConnect(socket, permitted)
  //         }
  //         this.setState(update(this.state, {
  //           authFailed       : { $set: !permitted },
  //           connectionFailed : { $set: false },
  //         }))
  //       })
  //     })
  //     .on('connect_error', () => {
  //       this.setState(update(this.state, { connectionFailed: { $set: true } }))
  //       socket.disconnect()
  //     })
  // }

  /**
   * [render description]
   * @return {void}
   */
  render() {

    const {
      isError,
      message,
      statusType,
      endpoint,
      username,
    } = this.props

    return (
      <section className={ 'login' }>

        <div className={ 'margin-one-half' }>

          <TextField
            errorText={ this.state.connectionFailed === true ? 'エンドポイントとの接続に失敗しました。URLが間違っているか、サーバーが死んだのでしょう' : false }
            hintText={ 'Socket.IO Endpoint URL' }
            value={ this.props.endpoint }
            onChange={ this.updateCertification('endpoint') }
            onFocus={ () => this.setState(update(this.state, { connectionFailed: { $set: undefined } })) }
          />

          <TextField
            errorText={ this.state.authFailed === true ? 'ユーザー名が間違っているかもしれません' : false }
            hintText={ 'username' }
            onChange={ this.updateCertification('username') }
            onFocus={ () => this.setState(update(this.state, { authFailed: { $set: undefined } })) }
          />

          <TextField
            errorText={ this.state.authFailed === true ? 'パスワードが間違っているかもしれません' : false }
            hintText={ 'password' }
            type={ 'password' }
            onChange={ this.updateCertification('password') }
            onFocus={ () => this.setState(update(this.state, { authFailed: { $set: undefined } })) }
          />
        </div>

        <RaisedButton
          label={ 'LOGIN' }
          primary
          onTouchTap={ this.tryConnect }
        />

      </section>
    )
  }
}
