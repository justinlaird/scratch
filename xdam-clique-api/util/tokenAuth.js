'use strict';

const tokenAuth = module.exports = {};
const jwt = require('jsonwebtoken');
const config = require('config');
const Store = require('../services/data-store');


tokenAuth.validateToken = (token) => {
  console.log("Validate token");

  let payload = jwt.verify(token, config.get('jwt.secret'));
  let currentUnixTimestamp =  Math.round((new Date()).getTime() / 1000);

  if (payload && payload.data && !payload.data.userId){
    throw new Error("Invalid access token");
  }

  if (payload && payload.exp && currentUnixTimestamp > payload.exp){
      throw new Error("Access token expired");
  }
}

tokenAuth.authorizeUser = async function(req, res) {
  let authUserId = null;

  let params =  {
    login: req.body.username,
    password: req.body.password,
  };

  try {
    let user = await Store.findOneResourceByFilter('users', params);
    authUserId  = user.id;
  } catch(error) {
    console.log("Error authorizing user " + error);
    return tokenAuth._generateErrorResponse(res);
  }

  if (!authUserId){
    return tokenAuth._generateErrorResponse(res);
  }

  tokenAuth._generateTokenResponse(authUserId, res);
}

tokenAuth._generateErrorResponse = ( res) => {
  res
    .status(401)
    .send();
}


tokenAuth._generateTokenResponse = (authUserId, res) => {
  let jwtPayload = {
    data: {
      userId: authUserId
    }
  };
  let jwtOptions = {
    expiresIn: config.get('jwt.expiration'), algorithm: config.get('jwt.algorithm')
  };

  let token = jwt.sign(jwtPayload, config.get('jwt.secret'), jwtOptions);

  let jsonResponse = {
    jwt: token,
    userId: authUserId
  }

  res
    .status(200)
    .send(jsonResponse);
}
