import mongoose from 'mongoose'

const Schema = mongoose.Schema
// Use global Promise
mongoose.Promise = global.Promise

mongoose.model('User', new Schema({
  email    : String,
  username : String,
  password : String,
  isAdmin  : Boolean,
}))

export default mongoose.model('User')
