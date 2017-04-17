import jwt from 'jsonwebtoken'


export default ({ username, password, token }) => new Promise(resolve => {

  // check token and authorize
  if (token) {
    jwt.verify(token, 'private Key sample', (err, x) => {
      if (!err) {
        resolve({ permission: 'ok', token })
      } else {
        resolve({ permission: 'ng' })
      }
    })
    return
  }

  // authenticate with username and password
  if (username === password && username !== '') {
    jwt.sign({ username }, 'private Key sample', (err, token) => {
      if (!err) {
        resolve({ permission: 'ok', token })
      } else {
        resolve({ permission: 'ng' })
      }
    })
  }


})
