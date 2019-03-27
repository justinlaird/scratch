module.exports = {
  h: {
    description: 'Show help',
    alias: 'help',
    type: 'help'
  },
  'db-host': {
    description: 'MySql host',
    require: true,
    type: 'string',
  },
  'db-user': {
    description: 'MySql user',
    require: true,
    type: 'string',
  },
  'db-password': {
    description: 'MySql password',
    require: true,
    type: 'string',
  },
  'db-name': {
    description: 'MySql database name',
    require: true,
    type: 'string',
    default: process.env.DB_NAME || 'clique',
  }
};
