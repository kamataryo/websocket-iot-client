import express  from 'express'
import http     from 'http'
import socketIO from 'socket.io'
import { yellow, red, blue, green } from 'chalk'

/**
 * message headers
 * @type {string}
 */
const USER       = yellow('USER')
const UPSTREAM   = blue('UPSTREAM')
const DOWNSTREAM = red('DOWNSTREAM')
const SYSTEM     = green('SYSTEM')

const app = express()

const PORT = process.env.PORT || 3000

/**
 * Store data
 * @type {Object}
 */
const store = { data: {} }

const server = http.createServer(app)

server.listen(PORT, () => process.stdout.write(`[${SYSTEM}] listening on *:${PORT}`))

app.use((req, res, next) => {
  process.stdout.write('error')
  next()
})

const io = socketIO.listen(server)

io.sockets.on('connection', socket => {

  // authenticate on connection
  socket.on('auth', data => {
    if (data.username === 'kamataryo') {
      socket.emit('permit', true)

      socket.emit('downstream', store.data)
      process.stdout.write(`[${USER}] ${data.usrname} connected\n`)

      socket.on('upstream', data => {
        process.stdout.write(`[${UPSTREAM}] ${JSON.stringify(data)}\n`)
        store.data = { ...store.data, ...data }
        socket.broadcast.emit('downstream', data)
        process.stdout.write(`[${DOWNSTREAM}] ${JSON.stringify(data)}\n`)
      })

      socket.on('disconnect', () => {
        process.stdout.write(`[${USER}] disconnected\n`)
      })

    } else {
      socket.emit('permit', false)
      socket.disconnect()
      console.log('disconnected')
    }
  })
})
