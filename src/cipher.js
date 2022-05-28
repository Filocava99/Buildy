const crypto = require("crypto")
const {createMongoClient} = require("./utils");

function encryptPassword(password){
    const salt = genRandomString(8)
    return sha512(password, salt)
}

function verifyPassword(passwordHash, password, salt){
    return sha512(password, salt).passwordHash === passwordHash
}

const genRandomString = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
};

const sha512 = function(password, salt){
    const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    const value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

const verifyToken = async function(token, email){
    const client = await createMongoClient()
    const db = await client.db("buildy")
    const collection = db.collection("token")
    const result = await collection.findOne({"token":token, "email":email})
    if(result === null){
        return false
    }
    const timestamp = Date.now()
    const expirationTime = 86400000*7 //7 days
    return timestamp - result.timestamp < expirationTime
}

module.exports = {
    encryptPassword,
    verifyPassword,
    genRandomString,
    verifyToken
}