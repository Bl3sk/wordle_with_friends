// load mongodb module
const MongoClient = require("mongodb").MongoClient;
const MONGO_CLIENT_OPTS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
class DbConnection {
    constructor() {
        this._connectionsMap = {};
    }  
    // create a new connection to the database
    async _connect(uri, opts = {}) {
        return await MongoClient.connect(uri, {...MONGO_CLIENT_OPTS, ...opts});
    }
 // returns the database client, if it does not exist for the specified database
 // it is created and stored to the connectionMap on the instance
    async getDbClient(uri) {
        let dbClient;
        if (this._connectionsMap[uri]) {
            dbClient = await this._connectionsMap[uri];
        } else {
            this._connectionsMap[uri] = await this._connect(uri);
            dbClient = this._connectionsMap[uri];
        }
        return dbClient;
    }
    async get(uri) {
        const dbClient = await this.getDbClient(uri);
        return dbClient.db();
    }
    // close all connections which are inside of connectionsMap
    async closeAllConnections() {
        let promises = Object.values(this._connectionsMap).map(async (dbClient) =>
        {
        (await dbClient).close();
        });
        await Promise.all(promises);
        this._connectionsMap = {};
    }
 // initialize the first connection
    init(uri, opts = {}) {
        if (!this._connectionsMap[uri]) {
            this._connectionsMap[uri] = this._connect(uri, opts);
            }
        }
}

module.exports = new DbConnection();