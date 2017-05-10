export default {
  constants    : {
    title        : 'WebSocket IoT UI',
    // key for Local Storage
    ACCESS_TOKEN : 'access_token',
    // wait until logging in
    loadingDelay : 800,
  },
  socketHostDefault: __PROD__ ? 'socket.biwako.io' : 'localhost:3001',
}
