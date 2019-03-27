const cfnCR = require('cfn-custom-resource');
const jsonApiStore = require('xdam-clique-api/services/data-store');
const jsonApiService = require('xdam-clique-api//services/json-api');
const config = require('config');



exports.handler = async message => {
  console.log(message);
  try {
    console.log("Mr Magic Lambda");
    console.log("Environment : ");
    console.log(process.env);
    console.log(`DB HOST ${config.get('database.host')}`);
    console.log(`DB PORT ${config.get('database.port')}`);

    console.log("Initialize JSONAPI");
    jsonApiService.initialize(null, true);
    console.log("Initialize Populate DB");
    jsonApiStore.populateDatabase();
    console.log("Initialize Populate DB complete");

  } catch (error) {
    console.log(error);
    await cfnCR.sendFailure(error.message, message);
  } finally {
    await cfnCR.sendSuccess('UpdateMySQL completed', {}, message);
  }
  return {};
}


//exports.handler("THE message is this!");
