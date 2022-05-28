const express = require('express');
const router = express.Router();
const cipher = require("../src/cipher")
const { MongoClient } = require("mongodb");
const {verifyPassword, verifyToken} = require("../src/cipher");
const {Project, addProject, saveProjectArray} = require("../src/project");
const {analyzeProject, main} = require("../src/main");
const {createMongoClient} = require("../src/utils");
const {Repository} = require("../src/github");

router.post('/register', async function(req, res, next) {
  const email = req.body.email
  const password = req.body.password
  console.log(req.body)
  let client
  try {
    client = await createMongoClient()
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
  let client
  try {
    client = await createMongoClient()
    const userTable = await client.db('buildy').collection('user');
    const result = await userTable.findOne({email: email})
    if(verifyPassword(result.password, password, result.salt)){
      const tokenTable = await client.db('buildy').collection('token');
      const token = cipher.genRandomString(32)
      const timestamp = Date.now()
      await tokenTable.deleteMany({email: email})
      await tokenTable.insertOne({email: email, token: token, timestamp: timestamp})
      res.cookie('token', token, { maxAge: 900000, httpOnly: true })
      res.cookie('email', email, { maxAge: 900000})
      res.status(200)
      res.end()
    }else{
      res.sendStatus(401)
    }
  } finally {
    await client.close();
  }
});

router.post('/addproject', async function (req, res, next) {
  if(await verifyToken(req.cookies.token, req.cookies.email)){
    console.log("token verified")
    const projectData = req.body
    const project = new Project(projectData.name, new Repository(projectData.repository.name, projectData.repository.owner), projectData.mainBranch, "", [], -1)
    await addProject(project)
    await main()
    res.status(200)
    res.end()
  }else{
    res.status(401)
    res.end()
  }
});

module.exports = router;
