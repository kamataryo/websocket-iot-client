import React, { Component } from 'react'
import PropTypes            from 'prop-types'
import { connect }          from 'react-redux'
import AppBar       from 'material-ui/AppBar'
import Toggle       from 'material-ui/Toggle'
import IconMenu     from 'material-ui/IconMenu'
import MenuItem     from 'material-ui/MenuItem'
import IconButton   from 'material-ui/IconButton'
import Person       from 'material-ui/svg-icons/social/person'
import RaisedButton from 'material-ui/RaisedButton'
import Divider      from 'material-ui/Divider'
import config       from '../config'
import style        from '../style'
import { Link } from 'react-router-dom'

/**
 * mapStateToProps
 * @param  {State} state State
 * @return {Props}       mapping state
 */
const mapStateToProps = state => ({
  buttonState  : state.app.buttonState,
  buttonUpdate : state.app.callbacks.emitUpstream,
  isLoggedIn   : state.app.isLoggedIn,
  logout       : state.app.callbacks.logout,
})

/**
 * connect to redux
 * @type {Decorator}
 */
@connect(mapStateToProps)
/**
 * ControllerView
 * @type {ReactComponent}
 */
export default class ControllerView extends Component {

  static PropTypes = {
    buttonState  : PropTypes.object.isRequired,
    buttonUpdate : PropTypes.func.isRequired,
    isLoggedIn   : PropTypes.bool.isRequired,
    logout       : PropTypes.func.isRequired,
    history      : PropTypes.shape({ push: PropTypes.func }).isRequired
  }

  /**
   * Render
   * @return {ReactDomElement} React DOM Element
   */
  render() {

    const {
      buttonState,
      buttonUpdate,
      isLoggedIn,
      logout,
      history,
    } = this.props

    return (

      <main style={ style.mainWrap }>

        <header>
          <AppBar
            iconElementRight={
              <IconMenu
                iconButtonElement={ <IconButton tooltip={ 'menu' }><Person /></IconButton> }
                anchorOrigin={ { horizontal: 'left', vertical: 'bottom' } }
                targetOrigin={ { horizontal: 'left', vertical: 'bottom' } }
              >
                {
                  isLoggedIn ?
                    <MenuItem primaryText="logout" onTouchTap={ logout } /> :
                    <MenuItem primaryText="login" onTouchTap={ () => history.push('/login') } />
                }
              </IconMenu>
            }
            showMenuIconButton={ false }
            title={ config.title + ' | Controller' }
            onRightIconButtonTouchTap={ logout }
          />
        </header>

        <section>
          {
            isLoggedIn ?
              null :
              <p><Link to={ '/login' }>{ 'ログイン' }</Link>{ 'が必要です。' }</p>
          }
          <Toggle
            disabled={ !isLoggedIn }
            label={ 'スイッチ0' }
            style={ style.verticalMargin.x1 }
            toggled={ buttonState.toggle0 || false }
            onToggle={ (e, value) => buttonUpdate({ toggle0: value }) }
          />

          <Divider />

          <Toggle
            disabled={ !isLoggedIn }
            label={ 'スイッチ1' }
            style={ style.verticalMargin.x1 }
            toggled={ buttonState.toggle1 || false }
            onToggle={ (e, value) => buttonUpdate({ toggle1: value }) }
          />

          <Divider />

          <Toggle
            disabled={ !isLoggedIn }
            label={ 'スイッチ2' }
            style={ style.verticalMargin.x1 }
            toggled={ buttonState.toggle2 || false }
            onToggle={ (e, value) => buttonUpdate({ toggle2: value }) }
          />

          <div>
            <RaisedButton
              disabled={ !isLoggedIn }
              label={ 'OFF' }
              style={ { marginRight: 12 } }
              primary
              onTouchTap={ () => buttonUpdate({
                toggle0: false,
                toggle1: false,
                toggle2: false,
              }) }
            />

            <RaisedButton
              disabled={ !isLoggedIn }
              label={ 'ON' }
              primary
              onTouchTap={ () => buttonUpdate({
                toggle0: true,
                toggle1: true,
                toggle2: true,
              }) }
            />
          </div>

        </section>
      </main>
    )
  }

}
