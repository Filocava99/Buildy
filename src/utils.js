const {MongoClient} = require("mongodb");
const {mongodb_uri: uri} = require("./settings");

async function createMongoClient(){
    const client = new MongoClient(uri)
    return client.connect()
}

module.exports = {
    createMongoClient
}