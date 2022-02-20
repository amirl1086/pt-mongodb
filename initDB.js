
const db = require('./lib/db');
const models = require('./lib/models');

(async () => {
    try {
        await db.connect("admin");
        await models.init();
        await db.closeConnection();
    }
    catch (e) {
        console.error(`error initializing mongodb, error: ${e}`)
        process.exit(1);
    }
})();
