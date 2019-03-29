const serverless = require('serverless-http');

const {JsonApiController, TokenController} = require('xdam-clique-api/controllers');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');

const app = express();
app.use(bodyParser.json());

/*
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || '');
  if (Array.isArray(config.get('server.accessControlAllow'))) {

    if(config.get('server.accessControlAllow').includes('*')){
      res.setHeader('Access-Control-Allow-Origin', '*');
    } else {
      var origin = req.headers.origin;
      if(config.get('server.accessControlAllow').includes(origin)){
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
    }
  }
  return next();
});
*/

app.use(config.get('jwt.tokenRoute'), TokenController);
app.use('/', JsonApiController);
module.exports.handler = serverless(app);


//basic hello world with serverless
/*
const serverless = require('serverless-http');

const express = require('express');
const app = express();

app.get('/rest/users', function (req, res) {
  console.log("Got req :");
  console.log(req);
  res.send('Hello World!');
})

module.exports.handler = serverless(app);
*/


