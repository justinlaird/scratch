const config = require('config');
const SqlStore = require("./sqlHandler/sqlHandler");

module.exports = function(){

    let instance = new SqlStore({
      dialect: config.get('database.dialect'),
      dialectOptions: config.get('database.dialectOptions'),
      host: config.get('database.host'),
      port: config.get('database.port'),
      database: config.get('database.databaseName'),
      username: config.get('database.username'),
      password: config.get('database.password'),
      logging: config.get('database.logging')
    });

    return instance;
}
