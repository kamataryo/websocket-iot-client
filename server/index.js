import express from 'express'
import http from 'http'
import io from 'socket.io'
import { yellow, red, blue, green } from 'chalk'

/**
 * message headers
 * @type {string}
 */
const USER       = yellow('USER')
const UPSTREAM   = blue('UPSTREAM')
const BROADCAST  = red('BROADCAST')
const SYSTEM     = green('SYSTEM')

var app = express()

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

io.listen(server).sockets.on('connection', socket => {

  socket.emit('downstream', store.data)
  process.stdout.write(`[${USER}] connected\n`)

  socket.on('upstream', data => {
    process.stdout.write(`[${UPSTREAM}] ${JSON.stringify(data)}\n`)
    store.data = { ...store.data, ...data }
    socket.broadcast.emit('downstream', store.data)
    process.stdout.write(`[${BROADCAST}] ${JSON.stringify(store.data)}\n`)
  })

  socket.on('disconnect', () => {
    process.stdout.write(`[${USER}] disconnected\n`)
  })
})
