import React, { Component } from 'react'
import update from 'immutability-helper'
import io     from 'socket.io-client'
import Checkbox from './Checkbox.jsx'
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
   * Render
   * @return {ReactDomElement} React DOM Element
   */
  render() {

    /**
     * create Checkbox props
     * @param  {string} slug  giving slug for this component
     * @param  {string} label displaying label
     * @return {{value:object,update:function}}  spreading props for Checkbox component
     */
    const createProps = (slug, label) => ({
      slug,
      label,
      checked: this.state[slug],
      update: e => {
        // do set state
        this.setState(update(this.state, { [slug]: { $set: e.target.checked } }))
        // websocket
        socket.emit('upstream', { [slug]: e.target.checked })
      }
    })

    console.log(this.state)

    return <div>
      <header
        className={ 'header' }
        id={ 'header' }
      >{ '' }</header>

      <main id={ 'app_main' }>

        <Checkbox { ...createProps('a', 'スイッチA') } />
        <Checkbox { ...createProps('b', 'スイッチB') } />

      </main>

      <footer
        className={ 'footer' }
        id={ 'footer' }
      >{ '' }</footer>
    </div>
  }

}
