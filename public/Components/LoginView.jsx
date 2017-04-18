import React, { Component } from 'react'
import { connect }          from 'react-redux'
import cookie               from 'react-cookie'
import PropTypes            from 'prop-types'
import RaisedButton         from 'material-ui/RaisedButton'
import TextField            from 'material-ui/TextField'
import io                   from 'socket.io-client'

const ERRORs = {
  AUTH_ERROR: '認証に失敗しました',
  CONN_ERROR: 'サーバーとの接続に失敗しました',
}

/**
 * mapStateToProps
 * @param  {State} state State
 * @return {Props}       mapping props
 */
const mapStateToProps = state => ({
  endpoint : state.endpoint,
  username : state.username,
  password : state.password,
  error    : state.error,
})

/**
 * mapDispatchToProps
 * @param  {Dispatch} dispatch dispatcher
 * @return {Props}             Mapping props
 */
const mapDispatchToProps = dispatch => ({
  connect: ({ endpoint, username, password, token }) => {

    const socket = io.connect(endpoint)
    socket.on('connect', () => {

      // try auth
      socket.emit('auth', { username, password, token })

      // add Event Listener on authentication success/failure
      socket.on('permit', ({ permission, token }) => {
        if (permission) {
          // save token as a cookie
          cookie.save('access_token', token)

          // login
          dispatch({
            type: 'LOGIN',
            payload: { login: true }
          })

          // this client doesn't need permitation from now
          socket.off('permit')

          // add Event Listener of downstream
          socket.on('downstream', buttonState => {
            dispatch({
              type: 'UPDATE_BUTTON_STATE',
              payload: { buttonState }
            })
          })

          // add Event Listener of upstream as callback
          dispatch({
            type: 'SET_UPSTREAM_CALLBACK',
            payload: { callback: buttonState => {
              socket.emit('upstream', buttonState)
              dispatch({ type: 'UPDATE_BUTTON_STATE', payload: { buttonState } })
            } }
          })

        } else {
          // auth failed and close connection
          socket.disconnect()
          dispatch({ type: 'UPDATE_PARAMS', payload: { error: 'AUTH_ERROR' } })
        }
      })
    })

    socket.on('connect_error', () => {
      socket.disconnect()
      dispatch({ type: 'UPDATE_PARAMS', payload: { error: 'CONN_ERROR' } })
    })

  },
  updateParams: kvs => dispatch({ type: 'UPDATE_PARAMS', payload: kvs }),
})


@connect(mapStateToProps, mapDispatchToProps)
/**
 * LoginView
 * @return {ReactComponent} login view
 */
export default class LoginView extends Component {

  static PropTypes = {
    endpoint     : PropTypes.string,
    username     : PropTypes.string,
    password     : PropTypes.string,
    connect      : PropTypes.func.isRequired,
    error        : PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.oneOf(Object.keys(ERRORs)),
    ]),
    updateParams : PropTypes.func.isRequried
  }

  static defaultProps = {
    endpoint : '',
    username : '',
    password : '',
    error    : false,
  }

  /**
   * componentDidMount
   * @return {void}
   */
  componentDidMount() {

    const token = cookie.load('access_token')
    if (token) {
      this.props.connect({
        endpoint: this.props.endpoint,
        token
      })
    }

  }

  /**
   * render login view
   * @return {void}
   */
  render() {

    const  {
      endpoint,
      username,
      password,
      connect,
      error,
      updateParams,
    } = this.props

    return (
      <section className={ 'login' }>

        <div className={ 'margin-one-half' }>

          <TextField
            errorText={ error === 'CONN_ERROR' ? '接続できませんでした' : false }
            hintText={ 'Socket.IO Endpoint URL' }
            value={ endpoint }
            onChange={ e => updateParams({ endpoint : e.target.value }) }
            onFocus={ () => updateParams({ error    : false }) }
          />

          <TextField
            errorText={ error === 'AUTH_ERROR' ? '認証に失敗しました' : false }
            hintText={ 'username' }
            value={ username }
            onChange={ e => updateParams({ username : e.target.value }) }
            onFocus={ () => updateParams({ error    : false }) }
          />

          <TextField
            errorText={ error === 'AUTH_ERROR' ? '認証に失敗しました' : false }
            hintText={ 'password' }
            type={ 'password' }
            value={ password }
            onChange={ e => updateParams({ password : e.target.value }) }
            onFocus={ () => updateParams({ error    : false }) }
          />
        </div>

        <RaisedButton
          label={ 'LOGIN' }
          primary
          onTouchTap={ () => connect({ endpoint, username, password }) }
        />

      </section>
    )
  }
}
