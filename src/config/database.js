const { Pool } = require('pg');

const connectDatabase = new Pool({
  user: 'postgres',
  password: 'universal123',
  host: 'localhost',
  port: 5432,
  database: 'erp',
});

module.exports = connectDatabase;
