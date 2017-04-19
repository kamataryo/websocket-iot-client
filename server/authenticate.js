import jwt from 'jsonwebtoken'


export default ({ username, password, token }) => {
  if (token) {
    let username
    try {
      username = jwt.verify(token, 'some privata key').username
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
      token: jwt.sign({ username }, 'some privata key')
    }
  }
}
