import mongoose from 'mongoose'

const Schema = mongoose.Schema

mongoose.model('User', new Schema({
  email    : String,
  username : String,
  password : String,
  isAdmin  : Boolean,
}))

export default mongoose.model('User')
