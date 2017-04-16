import React, { Component } from 'react'
import update               from 'immutability-helper'

import Toggle       from 'material-ui/Toggle'
import Slider       from 'material-ui/Slider'
import RaisedButton from 'material-ui/RaisedButton'
import Divider      from 'material-ui/Divider'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'


/**
 * Create Socket Connection
 * @type {Socket}
 */
// const socket = io.connect('http://localhost:3000')

/**
 * ControllerView
 * @type {ReactComponent}
 */
export default class ControllerView extends Component {

  /**
   * Constructor
   * @param  {Props} props Props
   * @return {void}
   */
  constructor(props) {
    super(props)
    this.state = {} // initialize
  }

  /**
   * Did Mount
   * @return {void}
   */
  componentDidMount() {
    // set handler
    this.props.socket.on('downstream', data => this.setState({ ...this.state, ...data }))
  }

  /**
   * create onChang callback
   * @param  {string} slug id for element recognition
   * @param  {Event}  e     [description]
   * @param  {object} value [description]
   * @return {function}       [description]
   */
  onChange(slug) {
    return (e, value) => {
      // do set state
      this.setState(update(this.state, { [slug]: { $set: value } }))
      // websocket
      this.props.socket.emit('upstream', { [slug]: value })
    }
  }

  /**
   * Create updating null state
   * @return {object} null state
   */
  createNegativeState() {
    return Object.keys(this.state).reduce((prev, slug) => {
      prev[slug] = false
      return prev
    }, {})
  }

/**
 * Create updating positive state
 * @return {object} [description]
 */
  createPositiveState() {
    return Object.keys(this.state).reduce((prev, slug) => {
      prev[slug] = true
      return prev
    }, {})
  }

  /**
   * Render
   * @return {ReactDomElement} React DOM Element
   */
  render() {

    return (
      <section className={ 'controls' }>

        <Toggle
          className={ 'margin-one-half ' }
          label={ 'スイッチ' }
          toggled={ this.state.switch }
          onToggle={ this.onChange('switch') }
        />

        <Divider />

        <div className={ 'margin-three' }>
          <label htmlFor={ 'e' }>{ 'スライダー ' }<strong>{ this.state.e || ' ' }</strong></label>
          <Slider
            axis={ 'x' }
            max={ 100 }
            min={ 0 }
            name={ 'slider' }
            step={ 1 }
            value={ this.state.slider ? this.state.slider : 0 }
            onChange={ this.onChange('slider') }
          />
        </div>

        <Divider />

        <RadioButtonGroup
          className={ 'margin-one-half radios' }
          name={ 'radio' }
          valueSelected={ this.state.radio }
          onChange={ this.onChange('radio') }
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
          onTouchTap={ () => {
            const negativeState = this.createNegativeState()
            this.setState(negativeState)
            this.props.socket.emit('upstream', negativeState)
          } }
        />

      </section>
    )
  }

}
