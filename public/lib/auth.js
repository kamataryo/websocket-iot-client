import io     from 'socket.io-client'
import config from '../config'

const {
  AUTH_REQUIRED,
  CONNECTION_FAILED,
  IS_LOGGED_IN,
} = config.StatusTypes

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
  const authinfo = token ? { username, token } : { username, password }

  // create connection
  const socket = io.connect(endpoint)

  socket
    .on('connect', () => {
      // try authentication
      socket.emit('auth', authinfo)
      // wait response
      socket.on('permit', ({ permittion, token }) => {
        if (permittion === 'OK') {
          resolve({
            token,
            socket,
            status : {
              type: IS_LOGGED_IN,
              message: '',
              isError: false,
            }
          })
        } else if (permittion === 'expired') {
          socket.disconnect()
          resolve({ status: {
            type    : AUTH_REQUIRED,
            message : 'ログインが必要です。',
            isError : false
          } })
        } else {
          socket.disconnect()
          resolve({ status: {
            type    : AUTH_REQUIRED,
            message : 'ログインできませんでした。',
            isError : true,
          } })
        }
      })
    })
    .on('connect_error', () => {
      socket.disconnect()
      resolve({
        status: {
          type    :CONNECTION_FAILED,
          message :'サーバーと接続できませんでした。',
          isError : true,
        }
      })
    })
})
