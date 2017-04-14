import express from 'express'
import http from 'http'
import io from 'socket.io'

var app = express()

const PORT = process.env.PORT || 3000

const store = { data: {} }

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`)
})
console.log(`Server listening on port ${PORT}`)


app.use((req, res, next) => {
  console.log('error')
  console.log('%s %s', req.method, req.url)
  next()
})

io.listen(server).sockets.on('connection', socket => {

  socket.emit('initialize', store.data)

  socket.on('switch', data => {
    store.data = { ...store.data, ...data }
    socket.broadcast.emit('update', store.data)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})
