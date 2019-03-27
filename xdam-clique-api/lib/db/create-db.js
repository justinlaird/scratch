const Store = require('../../services/data-store');
const JsonApiService = require('../../services/json-api');

JsonApiService.initialize(null, true);
Store.populateDatabase();
