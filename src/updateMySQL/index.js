const cfnCR = require('cfn-custom-resource');
const jsonApiStore = require('xdam-clique-api/services/data-store');
const jsonApiService = require('xdam-clique-api//services/json-api');
const config = require('config');
const delay = require('delay');
const Sequelize = require('sequelize');

exports.handler = async message => {
  console.log(message);
  try {
    console.log(process.env);

    const sequelize = new Sequelize(
      'mysql',
      config.get('database.username'),
      config.get('database.password'),
      {
        host: config.get('database.host'),
        dialect: config.get('database.dialect')
      }
    );
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${config.get('database.databaseName')}`);

    jsonApiService.initialize(null, true);
    jsonApiStore.populateDatabase();
    await delay(10 * 60 * 1000);
    console.log("Finished Delay");

  } catch (error) {
    console.log("Error during UpdateMySQL");
    console.log(error);
    await cfnCR.sendFailure(error.message, message);
  } finally {
    await cfnCR.sendSuccess('UpdateMySQL process completed', {}, message);
  }
  return {};
}
