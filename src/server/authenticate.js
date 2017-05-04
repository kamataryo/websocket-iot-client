import jwt    from 'jsonwebtoken'
import fs     from 'fs'
import config from './config'
import User   from './models/User'

const privateKey = fs.readFileSync(__dirname + '/../../id_ecdsa')

/**
 * Promise user authentication
 * @param  {{username:string,password:string,token:string}} data data for authentication
 * @return {Promise} do authentication
 */
export default data => new Promise((resolve, reject) => {

  /**
   * parse the argument
   * @type {object}
   */
  const { username, password, token } = data

  if (token) {
    // token authorization
    return jwt.verify(token, privateKey, (err, data) => {
      if (err) {
        reject(err ? err : data)
      } else {
        const { username } = data
        resolve({
          token    : token,
          authuser : username,
        })
      }
    })
  } else {
    // username:password authentication
    return User
      .find({ username, password })
      .then(docs => {
        if (docs.length > 1) {
          const username = docs[0].username
          jwt.sign({ username }, privateKey, { expiresIn: config.expiresIn }, (err, token) => {
            resolve({
              token: token,
              authuser: username
            })
          })
        } else {
          reject()
        }
      })
      .catch(e => console.log(e))
  }
})
