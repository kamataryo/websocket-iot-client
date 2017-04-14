import express from 'express'
import http from 'http'
import io from 'socket.io'

var app = express()

const PORT = process.env.PORT || 3000

const store = { data: {} }

const server = http.createServer(app)

server.listen(PORT, () => console.log(`listening on *:${PORT}`))

app.use((req, res, next) => {
  console.log('error')
  console.log('%s %s', req.method, req.url)
  next()
})

io.listen(server).sockets.on('connection', socket => {

  socket.emit('downstream', store.data)

  socket.on('upstream', data => {
    store.data = { ...store.data, ...data }

    socket.broadcast.emit('downstream', store.data)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})
