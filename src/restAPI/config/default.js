module.exports = {
  "server": {
    "protocol": "http",
    "hostname": "0.0.0.0",
    "port": 80,
    "internalPort": 80,
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
    "databaseName": 'clique',
    "username": '',
    "password": '',
    logging: console.log
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
