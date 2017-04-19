import React, { Component } from 'react'
import { connect }          from 'react-redux'
import cookie               from 'react-cookie'
import PropTypes            from 'prop-types'
import RaisedButton         from 'material-ui/RaisedButton'
import Checkbox             from 'material-ui/Checkbox'
import TextField            from 'material-ui/TextField'
import io                   from 'socket.io-client'

const ERRORs = {
  AUTH_ERROR: '認証に失敗しました',
  CONN_ERROR: 'サーバーとの接続に失敗しました',
}

const ACCESS_TOKEN = 'access_token'

/**
 * mapStateToProps
 * @param  {State} state State
 * @return {Props}       mapping props
 */
const mapStateToProps = state => ({
  endpoint     : state.endpoint,
  username     : state.username,
  password     : state.password,
  error        : state.error,
  enableCookie : state.enableCookie,
})

/**
 * mapDispatchToProps
 * @param  {Dispatch} dispatch dispatcher
 * @return {Props}             Mapping props
 */
const mapDispatchToProps = dispatch => ({

  startLoad  : () => dispatch({ type: 'DISPLAY_LOADING', payload: { loading: true } }),

  updateParams: kvs => dispatch({ type: 'UPDATE_PARAMS', payload: kvs }),

  connect: ({ endpoint, username, password, token, enableCookie }) => {

    dispatch({ type: 'DISPLAY_LOADING', payload: { loading: true } })

    const socket = io.connect(endpoint)
    socket.on('connect', () => {

      // try auth
      socket.emit('auth', { username, password, token })

      // add Event Listener on authentication success/failure
      socket.on('permit', ({ permission, token }) => {
        if (permission) {
          // save token as a cookie
          if (enableCookie) {
            cookie.save(ACCESS_TOKEN, token)
          }

          // login
          dispatch({
            type: 'LOGIN',
            payload: { login: true }
          })

          // clean up username and password
          dispatch({ type: 'UPDATE_PARAMS', payload: { username: '', password: '' } })

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
            type: 'DEFINE_CALLBACK',
            payload: {
              name: 'emitUpstream',
              callback: buttonState => {
                socket.emit('upstream', buttonState)
                dispatch({ type: 'UPDATE_BUTTON_STATE', payload: { buttonState } })
              }
            }
          })

          // add Logout callback
          dispatch({
            type: 'DEFINE_CALLBACK',
            payload: {
              name: 'logout',
              callback: () => {
                cookie.remove(ACCESS_TOKEN)
                // do logout
                dispatch({ type: 'LOGIN', payload: { login: false } })
              }
            }
          })

          // disable loading display
          setTimeout(() => {
            dispatch({ type: 'DISPLAY_LOADING', payload: { loading: false } })
          }, enableCookie ? 500 : 700)

        } else {
          // remove unnecessary event handler for safety
          socket.off('disconnect')
          // auth failed and close connection
          socket.disconnect()
          dispatch({ type: 'UPDATE_PARAMS', payload: { error: 'AUTH_ERROR' } })
          dispatch({ type: 'DISPLAY_LOADING', payload: { loading: false } })
        }
      })
    })

    // maybe serverside panic
    socket.on('disconnect', () => {
      dispatch({ type: 'UPDATE_PARAMS', payload: { error: 'CONN_ERROR' } })
      dispatch({ type: 'LOGIN', payload: { login: false } })
      dispatch({ type: 'DISPLAY_LOADING', payload: { loading: false } })
    })

    socket.on('connect_error', () => {
      socket.disconnect()
      dispatch({ type: 'UPDATE_PARAMS', payload: { error: 'CONN_ERROR' } })
      dispatch({ type: 'DISPLAY_LOADING', payload: { loading: false } })
    })

  },
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
    updateParams : PropTypes.func.isRequried,
    startLoad    : PropTypes.func.isRequired,
    finishLoad   : PropTypes.func.isRequired,
    enableCookie : PropTypes.bool.isRequired,
  }

  static defaultProps = {
    endpoint     : '',
    username     : '',
    password     : '',
    error        : false,
    enableCookie : false,
  }

  /**
   * componentDidMount
   * @return {void}
   */
  componentDidMount() {

    const token = cookie.load(ACCESS_TOKEN)
    if (token) {
      // display loading
      this.props.startLoad()
      this.props.updateParams({
        username: 'automatically logging in...',
        password: 'xxxxxxxxxxxxxxxx' // simply put a place holder
      })
      this.props.connect({
        token,
        endpoint     : this.props.endpoint,
        enableCookie : true,
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
      enableCookie,
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

        <Checkbox
          checked={ enableCookie }
          className={ 'margin-one-half' }
          label={ '自動でログインする' }
          onCheck={ (e, value) => updateParams({ enableCookie: value }) }
        />

        <RaisedButton
          label={ 'LOGIN' }
          primary
          onTouchTap={ () => connect({ endpoint, username, password, enableCookie }) }
        />

      </section>
    )
  }
}
