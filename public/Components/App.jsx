import React, { Component } from 'react'
import update from 'immutability-helper'
import io     from 'socket.io-client'

import AppBar       from 'material-ui/appbar'
import Toggle       from 'material-ui/toggle'
import Slider       from 'material-ui/slider'
import RaisedButton from 'material-ui/raisedbutton'

/**
 * Create Socket Connection
 * @type {Socket}
 */
const socket = io.connect('http://localhost:3000')

/**
 * App Container
 * @type {ReactComponent}
 */
export default class App extends Component {

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
   * @return {[type]} [description]
   */
  componentDidMount() {
    // set handler
    socket.on('downstream', data => this.setState({ ...data }))
  }

  /**
   * Create updating null state
   * @return {object} null state
   */
  createNullState() {
    return Object.keys(this.state).reduce((prev, slug) => {
      prev[slug] = false
      return prev
    }, {})
  }

  /**
   * Render
   * @return {ReactDomElement} React DOM Element
   */
  render() {

    /**
     * create Checkbox props
     * @param  {string} slug  giving slug for this component
     * @param  {string} label displaying label
     * @return {object}  spreading props for Checkbox component
     */
    const createToggleProps = (slug, label) => ({
      label,
      toggled: this.state[slug],
      // toggle: this.state[slug],
      onToggle: (e, isInputChecked) => {
        // do set state
        this.setState(update(this.state, { [slug]: { $set: isInputChecked } }))
        // websocket
        socket.emit('upstream', { [slug]: isInputChecked })
      }
    })

    /**
     * create props for slider component
     * @param  {string} slug [description]
     * @return {object}      [description]
     */
    const createSliderProps = slug => ({
      axis: 'x',
      max: 100,
      min: 0,
      step: 1,
      name: slug,
      onChange: (e, newValue) => {
        // do set state
        this.setState(update(this.state, { [slug]: { $set: newValue } }))
        // websocket
        socket.emit('upstream', { [slug]: newValue })
      },
      value: this.state[slug] ? this.state[slug] : 0
    })

    return (
      <div>
        <main className={ 'main-contianer' }>
          <AppBar
            showMenuIconButton={ false }
            title={ 'WebSocket IoT UI' }
            titleStyle={ { textAlign: 'center' } }
          />

          <section className={ 'controls' }>
            <Toggle className={ 'line' } { ...createToggleProps('a', 'スイッチ') } />
            <Toggle className={ 'line' } { ...createToggleProps('b', 'スイッチ') } />
            <Toggle className={ 'line' } { ...createToggleProps('c', 'スイッチ') } />
            <div className={ 'line slider-wrap' }>
              <label htmlFor={ 'd' }>{ 'スライダー ' }<strong>{ this.state.d || ' ' }</strong></label>
              <Slider { ...createSliderProps('d') } />
            </div>
            <div className={ 'line slider-wrap' }>
              <label htmlFor={ 'e' }>{ 'スライダー ' }<strong>{ this.state.e || ' ' }</strong></label>
              <Slider { ...createSliderProps('e') } />
            </div>
            <p>
              <RaisedButton
                label={ 'RESET' }
                primary
                onTouchTap={ () => {
                  const nullState = this.createNullState()
                  this.setState(nullState)
                  socket.emit('upstream', nullState)
                } }
              />
            </p>
            <footer><a href="https://github.com/kamataryo/websocket-iot-ui">{ 'Folk Me!' }</a></footer>
          </section>
        </main>
      </div>
    )
  }

}
