const serverless = require('serverless-http');

const {JsonApiController} = require('xdam-clique-api/controllers');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
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


