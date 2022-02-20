

const config = require("config");

const User = require("./user");
const Role = require("./role");

const Vote = require("./vote");


const init = async () => {
    const count = await Role.estimatedDocumentCount();
    if (count == 0) {
        for (const role of config.auth.roles) {
            try {
                const newUserRole = new Role({ name: role });
                await newUserRole.save();
                // console.log(`added ${role} to roles collection`);
            } catch (e) {
                console.error(`error creating user role ${role}, message: ${e}`);
                process.exit(1);
            }
        }
    }
}

module.exports = {
    User,
    Role,
    Vote,
    init
};
