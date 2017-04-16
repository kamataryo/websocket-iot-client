import jwt from 'jsonwebtoken'


export default (username, password) => {
  const token = jwt.sign({ username }, 'private Key sample')

  jwt.verify(token, 'private Key sample')

  return username === password && username !== ''
}
