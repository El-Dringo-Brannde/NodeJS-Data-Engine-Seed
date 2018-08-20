# NodeJS Data Engine Seed

## Description
A configuration driven nodeJS data engine that runs data collection workers in separate processes, so multiple data collection routines can be ran concurrently. 

Complete with builtin logging, 
database support for [MySQL](https://www.npmjs.com/package/mysql2), [Postgres](https://www.npmjs.com/package/pg), and [MongoDB](https://www.npmjs.com/package/mongodb)

## To do list: 
- Add support for signalling when all jobs are done to trigger a flag in firebase or something similar to let others know.
- Custom configuration on where the logs are stored.


## How to use: 

### Adding workers
Each worker should be contained within the `./workers/` folder. Along with each worker having it's own folder for any utility files or dependencies it might have. The entry point is the `index.js` within the respective folder. Which might leave a directory structure like...

```
workers
 |
  -> someWorker
      |
       -> index.js
      |
       -> utility.js (optional)
```

The idea here is that each folder underneath the `workers/` directory should be completely self sustaining and componetized and shouldn't need to rely on code outside it's folder. 

Secondly, the index file of the worker must extend off the `Databases` class, along with it's own custom configuration file that contains all the information for the connection to the databases and the default database and table/collection. Then said configuration object must be passed down via `super` method call in the constructor such that they're inherited properly. 

For instance, the code below would connect one to all databases (Mongo, SQL, and Postgres). To not use a database simply remove the key/value from the `defaultConfig` object.

``` javascript 
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

module.exports = class ProductCostAndRevenueController extends Databases {
    constructor() {
        super(defaultConfig);
    }
    ...
}
```

Afterwards, the controller/component should be able to connect to the correct databases should all configuration options be valid. 

The entry point of each `worker` should be in a class method called `startJob`. This method is an `async` method that allows for it to be waited upon as it collects data.


### Logging Information
Should the need arise to log errors, information, or warnings to a file, each controller through inheritance of the `Databases` class come with their own loggers that by default dump to `src/logs/` folder. 

To log information it's as simple as: 
```javascript 
this.logInfo('some message here')
```

To log errors which by default just log the message and don't crash the entire nodeJS process: 
```javascript 
this.logError('some message here')
```

To log warnings: 
```javascript 
this.logWarning('some message here')
```
