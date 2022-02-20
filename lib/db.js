
const config = require("config");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;


const connect = async (dbName) => {
    try {
        const dbURL = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${config.db.host}:${config.db.port}/${dbName}`;
        await mongoose.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('successfully connected to db');
    }
    catch (e) {
        console.error(`error connecting to db, error: ${e}`);
        process.exit(1);
    }
}

const closeConnection = async () => {
    try {
        await mongoose.connection.close();
    } catch (e) {
        console.error(`error closing connection to db, error: ${e}`);
    }
}

module.exports = {
    connect,
    closeConnection
}