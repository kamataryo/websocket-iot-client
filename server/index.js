import io      from 'socket.io'
import express from 'express'
import http    from 'http'

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.static('public'))

const server = http.Server(app)

io(server).on('connection', socket => {
  socket.on('chat message', msg => {
    console.log('message: ' + msg)
  })
})

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`)
})
