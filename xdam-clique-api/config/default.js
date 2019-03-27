require('dotenv').config();

module.exports = {
  "server": {
    "protocol": "http",
    "hostname": "0.0.0.0",
    "port": 16006,
    "internalPort": 16006,
    "address": "0.0.0.0",
    "accessControlAllow": ["*"]
  },
  "jwt": {
    "algorithm": "HS512",
    "secret": "SooperSeekrit",
    "expiration": "72h",
    "tokenRoute": "/connect/token"
  },
  "database": {
    "dialect": "mysql",
    "dialectOptions": {"supportBigNumbers": true},
    "host": '127.0.0.1',
    "port": 3306,
    "databaseName": '',
    "username": '',
    "password": '',
    logging: require('../lib/logger').sqlLogger()
  },
  "redis":{
    "redisAddress" : '',
  },
  Serverless: {
    s3: {
      bucket: "",
      accessKeyId: "",
      secretAccessKey: "",
      region: "",
    }
  }
}
