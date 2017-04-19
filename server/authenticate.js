import jwt from 'jsonwebtoken'
import fs  from 'fs'
import config from './config'

const privateKey = fs.readFileSync(__dirname + '/../id_ecdsa')

export default ({ username, password, token }) => {
  if (token) {
    let username
    try {
      username = jwt.verify(token, privateKey).username
    } catch (e) {
      return {
        success: false
      }
    }
    return {
      success: true,
      token: token,
      authuser: username,
    }
  } else {
    return {
      // NOTE: this is simply sample of the authentication
      // you should replace this.
      success: username === password && username !== '',
      token: jwt.sign(
        { username },
        privateKey,
        { expiresIn: config.expiresIn }
      )
    }
  }
}
