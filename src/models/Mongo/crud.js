const mongoClient = require('mongodb').MongoClient;

// base CRUD functionality to the DB
module.exports = class CRUD {
	constructor(defaultConfig) {
		this.jobName = defaultConfig.jobName;

		this.defaultDB = defaultConfig.db;
		this.defaultCollection = defaultConfig.collection;
		this.mongoURL = defaultConfig.url;
		this.user = defaultConfig.user;
		this.password = defaultConfig.password;

		this.mongo = null;
		this.database = null;
		this.connection = null;

		this.errorLogger = null;
		this.infoLogger = null;
	}

	async init() {
		try {
			return await this.connectToDB(
				this.defaultDB,
				this.defaultCollection
			);
		} catch (err) {
			return err;
		}
	}

	async connectToDB(databaseName, collName) {
		this.database = await mongoClient.connect(this.mongoURL);
		this.connection = this.database;

		this.database = this.database.db(databaseName); // copy db for mongo v3+
		this.mongo = this.database;
		this.mongo = this.mongo.collection(collName);
	}

	aggregate(aggregation) {
		return new Promise((res, rej) => {
			this.mongo.aggregate(aggregation).toArray((err, docs) => {
				if (!err) {
					res(docs);
				} else {
					rej(err);
				}
			});
		});
	}

	async freeQuery(queryObj) {
		return this.mongo.find(queryObj);
	}

	async delete(selector) {
		try {
			return this.mongo.deleteMany(selector);
		} catch (err) {
			return err;
		}
	}

	async createOne(insertObj) {
		try {
			return this.mongo.insertOne(insertObj);
		} catch (err) {
			return err;
		}
	}

	async createMany(insertObjects) {
		try {
			return this.mongo.insertMany(insertObjects);
		} catch (err) {
			return err;
		}
	}

	async read(searchObj) {
		try {
			return this.mongo.find(searchObj).toArray();
		} catch (err) {
			return err;
		}
	}

	async updateOne(searchObj, updateVal) {
		try {
			return this.mongo.updateOne(
				searchObj,
				{ $set: updateVal },
				{
					upsert: true
				}
			);
		} catch (err) {
			return err;
		}
	}

	async updateMany(searchObj, updateVal) {
		try {
			return this.mongo.updateMany(
				searchObj,
				{ $set: updateVal },
				{
					upsert: true
				}
			);
		} catch (err) {
			return err;
		}
	}

	async deleteOne(searchObj) {
		try {
			return this.mongo.deleteOne(searchObj);
		} catch (err) {
			return err;
		}
	}

	async deleteMany(searchObj) {
		try {
			return this.mongo.deleteMany(searchObj);
		} catch (err) {
			return err;
		}
	}
};
