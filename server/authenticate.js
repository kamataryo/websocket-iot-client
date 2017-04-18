import jwt from 'jsonwebtoken'


export default ({ username, password, token }) => {
  if (token) {
    try {
      jwt.verify(token, 'some privata key')
    } catch (e) {
      return {
        success: false
      }
    }
    return {
      success: true,
      token: token,
    }
  } else {
    return {
      success: username === password && username !== '',
      token: jwt.sign({ username }, 'some privata key')
    }
  }
}
