
const config = require("config");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const models = require('./models');


const connect = async (dbName) => {
    try {
        const dbURL = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${config.server.host}:${config.server.port}/${dbName}`;
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

const close = async () => {
    try {
        await mongoose.connection.close();
    } catch (e) {
        console.error(`error closing connection to db, error: ${e}`);
    }
}

const initDB = async () => {
    try {
        await connect("admin");
        await models.init();
        await close();
    }
    catch (err) {
        console.error(`error initializing mongodb, ${err}`)
        process.exit(1);
    }
}

module.exports = {
    connect,
    close, 
    initDB
}