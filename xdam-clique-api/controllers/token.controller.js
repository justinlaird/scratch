const {Router} = require('express');
const tokenAuth = require('../util/tokenAuth');

const TokenController = Router();

TokenController.post('/', (req, res) => {
  tokenAuth.authorizeUser(req, res);
});

module.exports = TokenController;

