import jwt from 'jsonwebtoken'
import fs from 'fs'

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
      success: username === password && username !== '',
      token: jwt.sign({ username }, privateKey)
    }
  }
}
