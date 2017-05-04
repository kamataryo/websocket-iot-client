import jwt    from 'jsonwebtoken'
import fs     from 'fs'
import config from './config'
import User   from './models/User'

const privateKey = fs.readFileSync(__dirname + '/../../id_ecdsa')

/**
 * do authentication
 * @param  {{username:string,password:string,token:string}} data    data for authentication
 * @param  {Function} callback callback after auth
 * @return {object}            return result of callback
 */
export default (data, callback) => {

  const { username, password, token } = data
  /**
   * type fallback
   * @param {object} noop noop
   * @return {function} falled back function with noop
   */
  const resultIn = typeof callback === 'function' ? callback : noop => noop

  if (token) {
    // token authorization
    jwt.verify(token, privateKey, (err, data) => {
      if (err) {
        return resultIn(err, { success: false })
      } else {
        const { username } = data
        return resultIn(undefined, {
          success  : true,
          token    : token,
          authuser : username,
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
          success: docs.length > 0,
          token: jwt.sign(
            { username },
            privateKey,
            { expiresIn: config.expiresIn }
          )
        })
      })
  }
}
