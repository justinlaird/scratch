const cfnCR = require('cfn-custom-resource');
const jsonApiStore = require('xdam-clique-api/services/data-store');
const jsonApiService = require('xdam-clique-api//services/json-api');


exports.handler = async message => {
  console.log(message);
  try {
    console.log("Mr Magic Lambda");

   // jsonApiService.initialize(null, true);
   // jsonApiStore.populateDatabase();
  } catch (error) {
    console.log(error);
    await cfnCR.sendFailure(error.message, message);
  } finally {
    await cfnCR.sendSuccess('UpdateMySQL completed', {}, message);
  }
  return {};
}

 exports.handler("THE message is this!");
