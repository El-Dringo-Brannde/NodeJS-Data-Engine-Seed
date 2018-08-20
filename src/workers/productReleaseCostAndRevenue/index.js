/* eslint-disable */

const Databases = require('./../../models/databases');
const {
   mongoHostURL,
   mongoHostPass,
   mongoHostUser
} = require('./../../config/mongoDB.js');

const defaultConfig = {
   workerName: 'ProductCostAndRevenueController',
   MongoDB: {
      db: 'catalog',
      collection: 'masterSuitesAndProducts',
      url: mongoHostURL,
      user: mongoHostUser,
      password: mongoHostPass
   },
   SQL: {
      host: 'localhost',
      password: '123456789',
      port: 3306,
      user: 'root',
      database: 'Cloud'
   },
   PG: {
      user: 'dbuser',
      host: 'database.server.com',
      database: 'mydb',
      password: 'secretpassword',
      port: 3211
   }
};

module.exports = class DummyWorker extends Databases {
   constructor() {
      super(defaultConfig);
   }

   async startJob() {
      this.logInfo(`Starting ${this.workerName}`);

      process.send({ workerName: this.workerName });

      process.send({ done: true, workerName: this.workerName });
   }
};

// Last edited: 2018/06/25
