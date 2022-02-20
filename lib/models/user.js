const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { 
        type : String, 
        required : true
    },
    email: { 
        type : String, 
        required : true
    },
    password: String,
    salt: String,
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }]
});

module.exports = mongoose.model('User', UserSchema);
