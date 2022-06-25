const path = require('path');

module.exports = {
  rootPath: path.resolve(__dirname, '..'),
  serviceName: process.env.SERVICE_NAME,
  dbUrl: process.env.MONGO_URI,
  jwtKey: process.env.JWT_SECRET,
};
