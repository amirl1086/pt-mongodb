const mongoose = require("mongoose");

const Vote = mongoose.model(
    "Vote",
    new mongoose.Schema({
        "voteId": Number,
        "voteProtocolNo": Number,
        "voteDate": { type: Date, index: true },
        "voteType": String,
        "itemTitle": String,
        "knessetId": Number,
        "sessionId": Number
    })
);

module.exports = Vote;