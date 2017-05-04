 export default {
   // token alives..
   expiresIn: '10d',

   mongo: {
     dbname : 'WebSocket-IoT-UI',
     dbhost : 'localhost',
     dbport : 27017,
   },

   server: {
     port: 3001,
   },
   users : [
     { username: 'admin', password: 'admin' },
     { username: 'admin', password: 'admin' },
   ]
 }
