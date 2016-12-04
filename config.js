// Require the .env file and loads it.
require('dotenv').config();

// Exports the configuration.
module.exports = {
  // MongoDB
  // Url of the Mongodb server
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost/',
  // Database name
  MONGO_DB: process.env.MONGO_DB || 'hypercode',
};
