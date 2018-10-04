const http = require('http');
const express = require('express');
const log = require('gulplog');

function serve(dir) {
  var app = express();
  app.use(express.static(dir, {
    extensions: ['html'],
    setHeaders: function(res, path, stat) {
      res.set('cache-control', 'no-cache');
    }
  }));
  return new Promise((ok, fail) => {
    let server = http.createServer(app);
    server.on('close', () => ok());
    server.on('error', fail);
    server.on('listening', () => {
      log.info('server listening at http://localhost:4000');
    })
    server.listen(4000);
  })
}

module.exports = serve;