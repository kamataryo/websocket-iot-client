import React, { Component } from 'react'
import update from 'immutability-helper'
import io     from 'socket.io-client'
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
    socket.on('initialize', data => this.setState({ ...data }))
  }

  /**
   * Render
   * @return {ReactDomElement} React DOM Element
   */
  render() {


    socket.on('update', data => this.setState({ ...data }))

    return <div>
      <header
        className={ 'header' }
        id={ 'header' }
      >{ 'header' }</header>

      <main id={ 'app_main' }>
        <h1>{ this.state.a }</h1>
        <input
          type={ 'check' }
          onChange={ e => {
            this.setState(update(this.state, { a: { $set: e.target.value } }))
            socket.emit('switch', { a: e.target.value })
          } }
        />
      </main>

      <footer
        className={ 'footer' }
        id={ 'footer' }
      >{ 'footer' }</footer>
    </div>
  }

}
