import express  from 'express'
import http     from 'http'
import socketIO from 'socket.io'
import auth     from 'socketio-auth'
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

/**
 * Create Server
 * @type {Server}
 */
const server = http.createServer(app)

server.listen(PORT, () => process.stdout.write(`[${SYSTEM}] listening on *:${PORT}`))

app.use((req, res, next) => {
  process.stdout.write('error')
  next()
})

const io = socketIO.listen(server)
auth(io, {
  authenticate: (socket, data, callback) => {
    console.log('aaa')
    const { username, password } = data
    callback(true)
  }
})

io.sockets.on('connection', socket => {

  socket.emit('downstream', store.data)
  process.stdout.write(`[${USER}] connected\n`)

  socket.on('upstream', data => {
    process.stdout.write(`[${UPSTREAM}] ${JSON.stringify(data)}\n`)
    store.data = { ...store.data, ...data }
    socket.broadcast.emit('downstream', data)
    process.stdout.write(`[${DOWNSTREAM}] ${JSON.stringify(data)}\n`)
  })

  socket.on('disconnect', () => {
    process.stdout.write(`[${USER}] disconnected\n`)
  })
})
