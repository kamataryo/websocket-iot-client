import React      from 'react'
import { render } from 'react-dom'
import App        from './Components/App.jsx'
import io         from 'socket.io-client'

const socket = io.connect("http://localhost:3000")

render(
  <App { ...{ socket } }/>,
  document.getElementById('app')
)
