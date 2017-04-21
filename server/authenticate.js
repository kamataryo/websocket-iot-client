import jwt    from 'jsonwebtoken'
import fs     from 'fs'
import config from './config'
import User   from './models/User'

const privateKey = fs.readFileSync(__dirname + '/../id_ecdsa')

export default (data, callback) => {

  const { username, password, token } = data
  const resultIn = typeof callback === 'function' ? callback : x => x

  if (token) {
    // token authorization
    jwt.verify(token, privateKey, (err, { username }) => {
      if (err) {
        return resultIn(err, { success: false })
      } else {
        return resultIn(undefined, {
          success: true,
          token: token,
          authuser: username,
        })
      }
    })
  } else {
    // username:password authentication
    return User
      .find({ username, password })
      .exec((err, docs) => {
        return resultIn(undefined, {
          // NOTE: this is simply sample of the authentication
          // you should replace this.
          success: docs.length === 1,
          token: jwt.sign(
            { username },
            privateKey,
            { expiresIn: config.expiresIn }
          )
        })
      })
  }
}
