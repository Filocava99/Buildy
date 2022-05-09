const crypto = require("crypto")

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

module.exports = {
    encryptPassword,
    verifyPassword,
    genRandomString
}

const { salt, passwordHash } = encryptPassword("cacca")
console.log(verifyPassword(passwordHash, "cacca", salt))