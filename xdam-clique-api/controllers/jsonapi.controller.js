
const {Router} = require('express');
const JsonApiService = require('../services/json-api');


const router = Router();

JsonApiService.initialize(router);

module.exports = router;
