
const db = require('./db');
const models = require('./models');

module.exports = async () => {
    try {
        await db.connect("admin");
        await models.init();
        await db.closeConnection();
    }
    catch (err) {
        console.error(`error initializing mongodb, ${err}`)
        process.exit(1);
    }
}
