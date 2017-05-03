import React, { Component } from 'react'
import { connect }          from 'react-redux'
import PropTypes            from 'prop-types'
import AppBar               from 'material-ui/AppBar'
import Checkbox             from 'material-ui/Checkbox'
import CircularProgress     from 'material-ui/CircularProgress'
import RaisedButton         from 'material-ui/RaisedButton'
import TextField            from 'material-ui/TextField'
import io                   from 'socket.io-client'
import config               from '../config'
import style                from '../style'

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
  isLoading          : state.app.isLoading,
  isLoggedIn         : state.app.isLoggedIn,
  endpoint           : state.app.endpoint,
  username           : state.app.username,
  password           : state.app.password,
  error              : state.app.error,
  enableLocalStorage : state.app.enableLocalStorage,
})

/**
 * mapDispatchToProps
 * @param  {Dispatch} dispatch dispatcher
 * @param  {Props}    props props
 * @return {Props}             Mapping props
 */
const mapDispatchToProps = (dispatch, props) => ({
  startLoad    : () => dispatch({ type: 'DISPLAY_LOADING', payload: { loading: true } }),
  updateParams : kvs => dispatch({ type: 'UPDATE_PARAMS', payload: kvs }),

  connect      : ({ endpoint, username, password, token, enableLocalStorage }) => {
    // display loading
    dispatch({ type: 'DISPLAY_LOADING', payload: { loading: true } })
    // initialize local storage
    if (!enableLocalStorage) {
      localStorage.clear()
    }

    /**
     * Socket.IO instance
     * @type {Socket}
     */
    const socket = io.connect(endpoint)

    socket.on('connect', () => {

      // try auth
      socket.emit('auth', { username, password, token })

      // add Event Listener on authentication success/failure
      socket.on('permit', ({ permission, token }) => {

        if (permission) {
          // save token in local storage
          if (enableLocalStorage) {
            localStorage.setItem(ACCESS_TOKEN, token)
          }

          setTimeout(() => {
            // disable loading display
            dispatch({ type: 'DISPLAY_LOADING', payload: { loading: false } })
            // login
            dispatch({ type: 'LOGIN', payload: { login: true } })
            // clean up username and password
            dispatch({ type: 'UPDATE_PARAMS', payload: { username: '', password: '' } })
            // go!
            props.history.push('/')
          }, config.loadingDelay)

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
                localStorage.removeItem(ACCESS_TOKEN)
                // do logout
                dispatch({ type: 'LOGIN', payload: { login: false } })
              }
            }
          })

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
      socket.disconnect()
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

/**
 * connect to redux
 * @type {Decorator}
 */
@connect(mapStateToProps, mapDispatchToProps)
/**
 * LoginView
 * @return {ReactComponent} login view
 */
export default class LoginView extends Component {

  static PropTypes = {
    isLoading    : PropTypes.boolean,
    isLoggedIn   : PropTypes.boolean,
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
    enableLocalStorage : PropTypes.bool.isRequired,
  }

  static defaultProps = {
    isLoading    : false,
    isLoggedIn   : false,
    endpoint     : '',
    username     : '',
    password     : '',
    error        : false,
    enableLocalStorage : false,
  }

  /**
   * componentWillMount
   * @return {void}
   */
  componentWillMount() {
    const token = localStorage.getItem(ACCESS_TOKEN)
    if (token) {
      if (this.props.error) {
        // token should be revoked
        this.props.updateParams({ error: false })
        localStorage.removeItem(ACCESS_TOKEN)
      } else {
        // display loading
        this.props.startLoad()
        this.props.connect({
          token,
          endpoint           : this.props.endpoint,
          enableLocalStorage : true,
        })
      }
    }
  }

  /**
   * render login view
   * @return {void}
   */
  render() {

    const  {
      isLoading,
      isLoggedIn,
      endpoint,
      username,
      password,
      connect,
      error,
      enableLocalStorage,
      updateParams,
    } = this.props

    return (
      <main style={ style.mainWrap }>

        <header>
          <AppBar
            showMenuIconButton={ false }
            title={ config.title + '- Login' }
          />
        </header>

        <section>

          {
            isLoggedIn ?
              <p>{ 'ログインしています。' }</p> :
              <div>
                <div style={ style.verticalMargin.x1 }>
                  <TextField
                    errorText={ error === 'CONN_ERROR' ? '接続できませんでした' : false }
                    hintText={ 'Socket.IO Endpoint URL' }
                    value={ endpoint }
                    onChange={ e => updateParams({ endpoint : e.target.value }) }
                    onFocus={ () => updateParams({ error    : false }) }
                  /><br />

                  <TextField
                    errorText={ error === 'AUTH_ERROR' ? '認証に失敗しました' : false }
                    hintText={ 'username' }
                    value={ username }
                    onChange={ e => updateParams({ username : e.target.value }) }
                    onFocus={ () => updateParams({ error    : false }) }
                  /><br />

                  <TextField
                    errorText={ error === 'AUTH_ERROR' ? '認証に失敗しました' : false }
                    hintText={ 'password' }
                    type={ 'password' }
                    value={ password }
                    onChange={ e => updateParams({ password : e.target.value }) }
                    onFocus={ () => updateParams({ error    : false }) }
                  /><br />
                </div>

                <Checkbox
                  checked={ enableLocalStorage }
                  label={ '自動でログインする' }
                  style={ style.verticalMargin.x1 }
                  onCheck={ (e, value) => updateParams({ enableLocalStorage: value }) }
                />

                <RaisedButton
                  label={ 'LOGIN' }
                  primary
                  onTouchTap={ () => connect({ endpoint, username, password, enableLocalStorage }) }
                />

                { isLoading ?
                  <CircularProgress
                    size={ 30 }
                    style={ style.loading }
                    thickness={ 4 }
                  /> : null
                }
              </div>

          }
        </section>

      </main>
    )
  }
}
