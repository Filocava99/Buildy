const express = require('express');
const router = express.Router();
const cipher = require("../src/cipher")
const { MongoClient } = require("mongodb");
const {verifyPassword} = require("../src/cipher");
const uri = "mongodb://root:example@localhost:27017/?maxPoolSize=20&w=majority";
const client = new MongoClient(uri);

router.post('/register', async function(req, res, next) {
  const email = req.body.email
  const password = req.body.password
  console.log(req.body)
  try {
    await client.connect();
    const userTable = await client.db('buildy').collection('user');
    const result = await userTable.findOne({email: email})
    if(result === null){
      const {passwordHash, salt} = cipher.encryptPassword(password)
      await userTable.insertOne({email: email, password: passwordHash, salt: salt})
      res.sendStatus(200)
    }else{
      res.sendStatus(502)
    }
  } finally {
    await client.close();
  }
});

router.post('/login', async function(req, res, next) {
  const email = req.body.email
  const password = req.body.password
  try {
    await client.connect();
    const userTable = await client.db('buildy').collection('user');
    const result = await userTable.findOne({email: email})
    if(verifyPassword(result.passwordHash, password, result.salt)){
      const tokenTable = await client.db('buildy').collection('token');
      const token = cipher.genRandomString(32)
      const timestamp = Date.now()/1000
      await tokenTable.deleteMany({email: email})
      await tokenTable.insertOne({email: email, token: token, timestamp: timestamp})
      res.cookie('token', token, { maxAge: 900000, httpOnly: true })
      res.status(200)
    }else{
      res.status(503)
    }
  } finally {
    await client.close();
  }
});

router.post('addproject', function (req, res, next) {

});

module.exports = router;
