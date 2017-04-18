import React, { Component } from 'react'
import { connect }          from 'react-redux'
import PropTypes            from 'prop-types'
import AppBar         from 'material-ui/AppBar'
import IconButton     from 'material-ui/IconButton'
import ExitToApp      from 'material-ui/svg-icons/action/exit-to-app'
import ControllerView from './ControllerView.jsx'
import LoginView      from './LoginView.jsx'

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
    isLoggedIn: PropTypes.bool.isRequired
  }

  /**
   * Render
   * @return {ReactDomElement} React DOM Element
   */
  render() {


    const { isLoggedIn, logout } = this.props

    return (
      <div>

        { isLoggedIn ?

          <main className={ 'main-contianer' }>
            <AppBar
              iconElementRight={ <IconButton tooltip={ 'logout' }><ExitToApp /></IconButton> }
              showMenuIconButton={ false }
              title={ 'WebSocket IoT UI - Controller' }
              onRightIconButtonTouchTap={ logout }
            />
            <ControllerView />
          </main> :

          <main className={ 'main-contianer' }>
            <AppBar
              showMenuIconButton={ false }
              title={ 'WebSocket IoT UI - Login' }
            />
            <LoginView />
          </main>
        }
      </div>
    )
  }

}
