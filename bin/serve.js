const express = require('express')
const app = express()

app
  .use(express.static('dist'))
  .listen(3000, () => process.stdout.write('server is listening..'))
