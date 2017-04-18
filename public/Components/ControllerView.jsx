import React, { Component } from 'react'
import PropTypes            from 'prop-types'
import { connect }          from 'react-redux'

import Toggle       from 'material-ui/Toggle'
import Slider       from 'material-ui/Slider'
import RaisedButton from 'material-ui/RaisedButton'
import Divider      from 'material-ui/Divider'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'

/**
 * mapStateToProps
 * @param  {State} state State
 * @return {Props}       mapping state
 */
const mapStateToProps = state => ({
  buttonState  : state.buttonState,
  buttonUpdate : state.callbacks.emitUpstream
})

@connect(mapStateToProps)
/**
 * ControllerView
 * @type {ReactComponent}
 */
export default class ControllerView extends Component {

  static PropTypes = {
    buttonState  : PropTypes.object.isRequired,
    buttonUpdate : PropTypes.func.isRequired,
  }

  /**
   * Render
   * @return {ReactDomElement} React DOM Element
   */
  render() {

    const { buttonState, buttonUpdate } = this.props

    return (
      <section className={ 'controls' }>

        <Toggle
          className={ 'margin-one-half ' }
          label={ 'トグル' }
          toggled={ buttonState.toggle || false }
          onToggle={ (e, value) => buttonUpdate({ toggle: value }) }
        />

        <Divider />

        <div className={ 'margin-three' }>
          <label htmlFor={ 'e' }>{ 'スライダー ' }<strong>{ buttonState.slider || ' ' }</strong></label>
          <Slider
            axis={ 'x' }
            max={ 100 }
            min={ 0 }
            name={ 'slider' }
            step={ 1 }
            value={ buttonState.slider ? buttonState.slider : 0 }
            onChange={ (e, value) => buttonUpdate({ slider: value }) }
          />
        </div>

        <Divider />

        <RadioButtonGroup
          className={ 'margin-one-half radios' }
          name={ 'radio' }
          valueSelected={ buttonState.radio || false }
          onChange={ (e, value) => buttonUpdate({ radio: value }) }
        >
          <RadioButton
            label="ラジオ1"
            value="radio1"
          />
          <RadioButton
            label="ラジオ2"
            value="radio2"
          />
          <RadioButton
            label="ラジオ3"
            value="radio3"
          />
        </RadioButtonGroup>

        <RaisedButton
          label={ 'OFF' }
          primary
          onTouchTap={ () => buttonUpdate({ toggle: false, slider: false, radio: false }) }
        />

      </section>
    )
  }

}
