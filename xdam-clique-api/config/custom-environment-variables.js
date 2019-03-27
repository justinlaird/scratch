module.exports = {
  "database": {
    "host": "DB_HOST",
    "port": "DB_PORT",
    "databaseName": "DB_NAME",
    "username": "DB_USER",
    "password": "DB_PASSWORD",
  },
  "server": {
    "protocol": "SERVER_PROTOCOL",
    "hostname": "SERVER_HOSTNAME",
    "address": "SERVER_ADDRESS",
    "port": "SERVER_PORT",
    "internalPort": "INTERNAL_SERVER_PORT",
  },
  "redis" : {
    "redisAddress": "REDIS_ADDRESS"
  },
  Serverless: {
    s3: {
      bucket: "SERVERLESS_S3_BUCKET_NAME",
      accessKeyId: "SERVERLESS_AWS_ACCESS_KEY_ID",
      secretAccessKey: "SERVERLESS_AWS_SECRET_ACCESS_KEY",
      region: "SERVERLESS_AWS_REGION",
    }
  },
}
