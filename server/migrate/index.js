import mongoose from 'mongoose'
import User     from '../models/User'
import config   from '../config'


mongoose.connect(`mongodb://${config.mongo.dbhost}:${config.mongo.dbport}/${config.mongo.dbname}`)

const admin    = new User()
admin.email    = 'admin@example.com'
admin.username = 'admin'
admin.password = 'admin'
admin.isAdmin  = true
admin.save()

const guest    = new User()
guest.email    = 'guest@example.com'
guest.username = 'guest'
guest.password = 'guest'
guest.isAdmin  = false
guest.save()


mongoose.disconnect()
