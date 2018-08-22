# NodeJS Data Engine Seed

## Description
A configuration driven nodeJS data engine that runs data collection workers in separate processes, so multiple data collection routines can be ran concurrently. 

Complete with builtin logging, 
database support for [MySQL](https://www.npmjs.com/package/mysql2), [Postgres](https://www.npmjs.com/package/pg), and [MongoDB](https://www.npmjs.com/package/mongodb)

## To do list: 
- Add support for signalling when all jobs are done to trigger a flag in firebase or something similar to let others know.
- Custom configuration on where the logs are stored.
- Add status checking for a worker given a web server route
- Refactor `SQL` and `Postgres` support


## Starting
By default the data engine runs only on the users local computer, to store the data on another server `NODE_ENV` globals must be passed in. But to run on local it's as simple as...

1. `npm install` 
2. `node index.js -p YOUR_PORT_HERE`

Then, you're off collecting all the data you set up to collect. 

## How to use: 

### Starting a worker from the web-server
Within the project also comes with a miniature [express](https://www.npmjs.com/package/express) server. The purpose of this server is simply to start the worker up again before the scheduled time. If the engine has been set to run with this command `node index.js -p 4000` 

Then, one could start a worker with this command from their URL. 
`http://localhost:4000/start-job/<WORKER_NAME>

This will spin off another NodeJS process and start the data collection for that worker. 

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

    doWork(){
        // data collection code here
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

### Scheduling collections
Using the [node-schedule](https://www.npmjs.com/package/node-schedule) package one is able to schedule the recurrence of a job in a certain interval. Passed in via command line arguements, you can schedule jobs like 
`NODE_ENV=prod node index.js -m 5 -h 1 -p 4000`
Which will start the engine ever 1 hour and 5 minutes, more granularity can be added with `-day` and `-seconds`. 


### Using database methods.
By default, the data engine supports collecting data via `Mongo`, `Postgres`, and `SQL`. To use these methods to intereact with said database, one must first configure them in the config object of the worker. 

All methods can be used by their respective names as soon as the worker is initialized. For instance, 
to read all the documents within a MongoDB collection it's just `this.Mongo.read()`, similiarly with `SQL` it'd be `this.SQL.read()` and the same for `Postgres`
