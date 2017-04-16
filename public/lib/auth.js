import io     from 'socket.io-client'
import config from '../config'

/**
 * [description]
 * @param  {object} opts [description]
 * @return {Promise}      [description]
 */
export default opts => new Promise(resolve => {

  // parse options
  const {
    endpoint,
    username,
    password,
    token
  } = opts
  const authinfo = token ? { token } : { username, password }

  // create connection
  const socket = io.connect(endpoint)

  socket
    .on('connect', () => {
      // try authentication
      socket.emit('auth', authinfo)
      // wait response
      socket.on('permit', permittion => {
        if (permittion === 'OK') {
          resolve({ token, socket, status: config.StatusTypes.IS_LOGGED_IN })
        } else if (permittion === 'expired') {
          socket.disconnect()
          resolve({ status: config.StatusTypes.IS_TOKEN_EXPIRED })
        } else {
          socket.disconnect()
          resolve({ status: config.StatusTypes.AUTH_FAILED })
        }
      })
    })
    .on('connect_error', () => {
      socket.disconnect()
      resolve({ status: config.StatusTypes.CONNECTION_FAILED })
    })
})
