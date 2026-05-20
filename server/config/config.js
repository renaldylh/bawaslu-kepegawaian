require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'postgres';

const dbConfig = {
  dialect: dialect,
};

if (dialect === 'sqlite') {
  dbConfig.storage = process.env.DB_STORAGE || './database.sqlite';
  // SQLite memerlukan logging query di terminal (opsional) atau matikan jika terlalu bising
  dbConfig.logging = false; 
} else {
  dbConfig.username = process.env.DB_USERNAME || 'postgres';
  dbConfig.password = process.env.DB_PASSWORD || 'postgres';
  dbConfig.database = process.env.DB_NAME || 'employee_bio';
  dbConfig.host = process.env.DB_HOST || 'localhost';
  dbConfig.port = process.env.DB_PORT || 5432;
}

module.exports = {
  development: dbConfig,
  test: dbConfig,
  production: dbConfig
};
