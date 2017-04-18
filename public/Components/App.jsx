import React, { Component } from 'react'
import { connect }          from 'react-redux'
import PropTypes            from 'prop-types'
import AppBar         from 'material-ui/AppBar'
import ControllerView from './ControllerView.jsx'
import LoginView      from './LoginView.jsx'

/**
 * mapStateToProps
 * @param  {State} state state
 * @return {Props}       mapping props
 */
const mapStateToProps = state => ({
  isLoggedIn: state.isLoggedIn,
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


    const { isLoggedIn } = this.props

    return (
      <div>
        <main className={ 'main-contianer' }>

          <AppBar
            showMenuIconButton={ false }
            title={ 'WebSocket IoT UI' }
            titleStyle={ { textAlign: 'center' } }
          />
          { isLoggedIn ? <ControllerView /> : <LoginView /> }

        </main>
      </div>
    )
  }

}
