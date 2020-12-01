const http = require('http');
const querystring = require('querystring');
const PORT = 3000;
const serverHandle = require('../app')
const server = http.createServer(serverHandle);

server.listen(PORT);
console.log('OK')