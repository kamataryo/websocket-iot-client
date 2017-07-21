import React, { PureComponent } from 'react'
import { connect }              from 'react-redux'
import PropTypes                from 'prop-types'

import AppBar           from 'material-ui/AppBar'
import Checkbox         from 'material-ui/Checkbox'
import CircularProgress from 'material-ui/CircularProgress'
import RaisedButton     from 'material-ui/RaisedButton'
import TextField        from 'material-ui/TextField'

import config from '../config'
import style  from '../style'

const ERRORs = {
  AUTH_ERROR: '認証に失敗しました',
  CONN_ERROR: 'サーバーとの接続に失敗しました',
}

const ACCESS_TOKEN = config.constants.ACCESS_TOKEN

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
 * @return {Props}             Mapping props
 */
const mapDispatchToProps = dispatch => ({
  startLoad    : () => dispatch({ type: 'DISPLAY_LOADING', payload: { loading: true } }),
  updateParams : kvs => dispatch({ type: 'UPDATE_PARAMS', payload: kvs }),
  connect      : verification => dispatch({ type: 'CONNECT_SOCKET', payload: verification })
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
export default class LoginView extends PureComponent {

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
    let expired
    try {
      expired = JSON.parse(atob(token.split('.')[1])).exp < new Date().getTime() / 1000
    } catch (e) {
      expired = true
    }

    if (token && !expired) {

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
            title={ config.constants.title + '- Login' }
          />
        </header>

        <section>

          {
            isLoggedIn ?
              <p>{ 'ログインしています。' }</p> :
              <div style={ config.formWrap }>
                <div style={ style.verticalMargin.x1 }>
                  <TextField
                    errorText={ error === 'CONN_ERROR' ? '接続できませんでした' : false }
                    hintText={ 'socket.example.com' }
                    floatingLabelText={ 'Socket host name' }
                    value={ endpoint }
                    onChange={ e => updateParams({ endpoint : e.target.value }) }
                    onFocus={ () => updateParams({ error    : false }) }
                  /><br />

                  <TextField
                    errorText={ error === 'AUTH_ERROR' ? '認証に失敗しました' : false }
                    hintText={ 'username' }
                    floatingLabelText={ 'User Name' }
                    value={ username }
                    onChange={ e => updateParams({ username : e.target.value }) }
                    onFocus={ () => updateParams({ error    : false }) }
                  /><br />

                  <TextField
                    errorText={ error === 'AUTH_ERROR' ? '認証に失敗しました' : false }
                    hintText={ 'password' }
                    floatingLabelText={ 'Password' }
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

                <div>
                  <RaisedButton
                    label={ 'LOGIN' }
                    primary
                    onTouchTap={ () => connect({ endpoint, username, password, enableLocalStorage }) }
                  />

                  { isLoading ?
                    <span><CircularProgress
                      size={ 25 }
                      thickness={ 3 }
                      style={ style.loading }
                    />{ 'ログインしています...' }</span> : null
                  }
                </div>

              </div>

          }
        </section>

      </main>
    )
  }
}
