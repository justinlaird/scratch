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
