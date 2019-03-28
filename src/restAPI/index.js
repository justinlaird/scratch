const serverless = require('serverless-http');

//const jsonApiServer = require('xdam-clique-api/jsonapi-server');
//exports.handler = serverless(jsonApiServer);



/*
const {JsonApiController} = require('xdam-clique-api/controllers');
const express = require('express');
const bodyParser = require('body-parser');



const app = express();
app.use(bodyParser.json());
app.use('/', JsonApiController);
module.exports.handler = serverless(app);
*/




const express = require('express');
const app = express();

app.get('/rest/users', function (req, res) {
  console.log("Got req :");
  console.log(req);
  res.send('Hello World!');
})

module.exports.handler = serverless(app);


/*
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const {JsonApiController, WelcomeController, TokenController} = require('./controllers');

const app = express();

app.use(bodyParser.json());
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


app.use('/welcome', WelcomeController); //sample controller
app.use(config.get('jwt.tokenRoute'), TokenController);
app.use('/', JsonApiController);

module.exports = app;
*/
