import React, { Component } from 'react'
import update from 'immutability-helper'
import RaisedButton         from 'material-ui/RaisedButton'
import TextField            from 'material-ui/TextField'

/**
 * LoginView
 * @return {ReactComponent} login view
 */


export default class LoginView extends Component {

  /**
   * [constructor description]
   * @return {void}
   */
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  /**
   * create callback to update Certification infomation
   * @param  {[type]} param [description]
   * @return {[type]}       [description]
   */
  updateCertification(param) {
    return (e, value) => this.setState(update(this.state, { [param]: { $set: value } }))
  }

  /**
   * [render description]
   * @return {void}
   */
  render() {

    const { onTryLogin } = this.props

    console.log(this.state)

    return (
      <section className={ 'login' }>

        <div className={ 'margin-one-half' }>
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
          onTouchTap={ () => {} }
        />

      </section>
    )
  }
}
