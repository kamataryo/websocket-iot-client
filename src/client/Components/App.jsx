import React, { Component } from 'react'
import { connect }          from 'react-redux'
import PropTypes            from 'prop-types'
import AppBar           from 'material-ui/AppBar'
import IconButton       from 'material-ui/IconButton'
import ExitToApp        from 'material-ui/svg-icons/action/exit-to-app'
import ControllerView   from './ControllerView.jsx'
import LoginView        from './LoginView.jsx'
import config           from '../config'
import style            from '../style'

/**
 * mapStateToProps
 * @param  {State} state state
 * @return {Props}       mapping props
 */
const mapStateToProps = state => ({
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

    const { isLoggedIn, logout } = this.props

    return (
      <div style={ style.mainWrap }>

        { isLoggedIn ?

          <main>
            <AppBar
              iconElementRight={ <IconButton tooltip={ 'logout' }><ExitToApp /></IconButton> }
              showMenuIconButton={ false }
              title={ config.title + ' | Controller' }
              onRightIconButtonTouchTap={ logout }
            />
            <ControllerView />
          </main> :

          <main>
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
