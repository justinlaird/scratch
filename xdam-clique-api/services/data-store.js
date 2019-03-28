const JsonApiService = require('./json-api');
const Promise = require('bluebird');
const Seeds = require('clique-seeds');
//const FilterNormalizer = require('jsonapi-server').filter;


const Store = {};

Store.resourceKeys = function () {
  return Object.keys(JsonApiService.resourceDataStores());
}

Store.resourceForKey = function(resourceName) {
  const dataStores = JsonApiService.resourceDataStores();
  return dataStores[resourceName];
}

Store.findResourceDataById = async function(resourceName, id) {
  const resource = this.resourceForKey(resourceName)
  const findFunction = Promise.promisify(resource.find, { context: resource });
  return await findFunction( { params: { id : id } } );
}

Store.findOneResourceByFilter = async function(resourceName, filter) {
  return await this.resourceForKey(resourceName).findOne(filter);
}

Store.initializeDataForResource = function(resourceName, seeds) {
  const exampleData = require(`../sample-data/${require('path').basename(resourceName, '.js')}`);
  console.log(`initialize data for resource ${resourceName} sample data: ${exampleData}`);
  const resource = this.resourceForKey(resourceName);
  resource.resourceConfig.examples = exampleData.concat(seeds.serialize(resourceName));
}


Store.populateDatabase = async function () {
  const _this = this;

  const seeds = new Seeds();
  seeds.init();

  await this.resourceKeys().forEach(async function(resourceName) {
      _this.initializeDataForResource(resourceName, seeds);
      const resource = _this.resourceForKey(resourceName);
      console.log(`Resource for ${resource}`);
      console.log(resource);
      const populateAsync = Promise.promisify(resource.populate, { context: resource });
      try {
        await populateAsync({force: true});
        //await resource.populate2({force: true});
        console.log(`store.populate ${resourceName} completed`);
      } catch (error) {
        console.log(`store.populate ${resourceName} error:`);
        console.log(error);
      }
  });
}


module.exports = Store;


/*  WIP, filter params need to be normalized
Store.searchResourceData = async function(resourceName, filter) {

  filter.type = resourceName;
  FilterNormalizer.parseAndValidate(filter);
  let searchFunction = Promise.promisify(JsonApi.JsonApiDataStores[resourceName].search, { context: JsonApi.JsonApiDataStores[resourceName] } );
  return await searchFunction( { processedFilter:  request }, { params: { filter: filter } } );

}
*/
