import React, { Component } from 'react'
import { connect }          from 'react-redux'
import PropTypes            from 'prop-types'
import AppBar           from 'material-ui/AppBar'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton       from 'material-ui/IconButton'
import ExitToApp        from 'material-ui/svg-icons/action/exit-to-app'
import ControllerView   from './ControllerView.jsx'
import LoginView        from './LoginView.jsx'
import config           from '../config'

/**
 * mapStateToProps
 * @param  {State} state state
 * @return {Props}       mapping props
 */
const mapStateToProps = state => ({
  isLoading  : state.isLoading,
  isLoggedIn : state.isLoggedIn,
  logout     : state.callbacks.logout,
})

@connect(mapStateToProps)
/**
 * App Container
 * @type {ReactComponent}
 */
export default class App extends Component {

  static PropTypes = {
    isLoading  : PropTypes.bool.isRequired,
    isLoggedIn : PropTypes.bool.isRequired,
    logout     : PropTypes.func.isRequired,
  }

  /**
   * shouldComponentUpdate
   * @param  {[type]} state State
   * @return {boolean}      should component update
   */
  shouldComponentUpdate(state) {
    const prev = { ...state }
    if (!prev) {
      return true
    } else {

    }
    return prev
  }

  /**
   * Render
   * @return {ReactDomElement} React DOM Element
   */
  render() {

    const { isLoading, isLoggedIn, logout } = this.props

    return (
      <div>


        { isLoading ?

          <main className={ 'main-contianer wrap-loading' }>
            <AppBar
              showMenuIconButton={ false }
              title={ config.title + ' | logging in..' }
            />
            <CircularProgress
              size={ 40 }
              style={ { color: 'white' } }
              thickness={ 5 }
            />
          </main>

          : isLoggedIn ?

            <main className={ 'main-contianer wrap-controller' }>
              <AppBar
                iconElementRight={ <IconButton tooltip={ 'logout' }><ExitToApp /></IconButton> }
                showMenuIconButton={ false }
                title={ config.title + ' | Controller' }
                onRightIconButtonTouchTap={ logout }
              />
              <ControllerView />
            </main> :

            <main className={ 'main-contianer wrap-login' }>
              <AppBar
                showMenuIconButton={ false }
                title={ config.title + '- Login' }
              />
              <LoginView />
            </main>
        }
      </div>
    )
  }

}
