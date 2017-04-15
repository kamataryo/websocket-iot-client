import React, { Component } from 'react'
import PropTypes            from 'prop-types'
import update               from 'immutability-helper'
import RaisedButton         from 'material-ui/RaisedButton'
import TextField            from 'material-ui/TextField'
import io                   from 'socket.io-client'

/**
 * LoginView
 * @return {ReactComponent} login view
 */
export default class LoginView extends Component {

  static PropTypes = {
    onConnect: PropTypes.func.isRequired
  }

  /**
   * [constructor description]
   * @param {Props} props Props
   * @return {void}
   */
  constructor(props) {
    super(props)
    this.state = {
      username : '',
      endpoint : 'http://localhost:3000',
      password : '',
    }
  }

  /**
   * create callback to update Certification infomation
   * @param  {string} param username, endpoint, password
   * @return {void}
   */
  updateCertification(param) {
    return (e, value) => this.setState(update(this.state, { [param]: { $set: value } }))
  }

  /**
   * [tryConnect description]
   * @return {void} [description]
   */
  tryConnect = () => {
    const socket = io.connect(this.state.endpoint)
    socket.on('connect', () => {
      socket.emit('authentication', {
        username: this.state.username,
        password: this.state.password
      })
      this.props.onConnect(socket)
    })
  }

  /**
   * [render description]
   * @return {void}
   */
  render() {

    return (
      <section className={ 'login' }>

        <div className={ 'margin-one-half' }>

          <TextField
            hintText={ 'Socket.IO endpoint URL' }
            value={ this.state.endpoint }
            onChange={ this.updateCertification('endpoint') }
          />

          <TextField
            hintText={ 'username' }
            onChange={ this.updateCertification('username') }
          />

          <TextField
            hintText={ 'password' }
            type={ 'password' }
            onChange={ this.updateCertification('password') }
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
