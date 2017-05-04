import mongoose from 'mongoose'
import User     from '../models/User'
import config   from '../config'


mongoose.connect(`mongodb://${config.mongo.dbhost}:${config.mongo.dbport}/${config.mongo.dbname}`)

config.users.forEach(({ username, password }) => {
  const user    = new User()
  user.email    = `${username}@example.com`
  user.username = username
  user.password = password
  user.isAdmin  = true
  user.save()
})


mongoose.disconnect()
