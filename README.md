<div style="text-align: center;">

![Build status](https://img.shields.io/github/workflow/status/filocava99/Buildy/Build/master?style=flat-square)
![Github license](https://img.shields.io/github/license/filocava99/buildy?style=flat-square)
![Github stars](https://img.shields.io/github/stars/filocava99/Buildy?style=flat-square)
![Github forks](https://img.shields.io/github/forks/filocava99/Buildy?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues-raw/filocava99/Buildy?style=flat-square)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/filocava99/Buildy?style=flat-square)
![GitHub contributors](https://img.shields.io/github/contributors/filocava99/Buildy?style=flat-square)
![Codiga code quality](https://api.codiga.io/project/33237/status/svg)

</div>
<!--![(https://img.shields.io/codacy/grade/0f2d702e7c8a4372bf106d96bd693ac8/master)]-->

# <center>Buildy (standalone version)</center>

Buildy (standalone version) is a simple continuous deployment platform, easy to use and yet still a powerful tool, for building and deploying your Java projects.
# Table of contents

1. [Design](#par1)
   1. [React](#par1.1)
   2. [MongoDB](#par1.2)
   3. [NodeJS+Express](#par1.3)
      1. [Project building](#par1.4.1)
      2. [User authentication](#par1.4.2)
      3. [Data requests](#par1.4.3)
   4. [Docker](#par1.4)
2. [Installation instructions](#par2)
## Design <a name="par1"></a>

Buildy is based on the MERN stack, which means it is based on three main components: React, MongoDB and NodeJS+Express; all of them have been carefully designed to be deployed as Docker containers, for improved scalability and portability.

### React
The React component is the front-end of Buildy; it is responsible for rendering the application and handling the user input.

### MongoDB
MongoDB is used for storing the build history and the build status, as well as the user data (e.g. the user's credentials) and the list of tracked projects.

### NodeJS+Express
The NodeJS+Express component is the back-end of Buildy; it is responsible for handling the build process as well as exchanging data with React using socket.io and Express endpoints.  
More in depth it performs the following steps:

#### Project building
1. Every 10 minutes it checks every tracked project[^1] to see if there are new commits;
2. If there are new commits, it will clone the project and then build it;
3. The build artifacts and the SVG badge are pushed to the GitHub repository that was provided as ENV variable;
4. The build status is updated in MongoDB.

#### User authentication
1. User credentials are received from an HTTP POST request (using `axios`) so that data can be encrypted using TLS.;  
2. Passwords are not stored in plain text, but instead are encrypted using a salt stored in the MongoDB database;
3. If the provided username and password are correct, the user is authenticated and a new authentication token is returned;
4. The authentication will be set in an HTTP only cookie (for security reasons) and will expire after sever days;
5. For every request, the authentication token is checked and if it is valid, the user request will be satisfied.
#### Data requests
1. Data requests that don't require authentication are performed using `socket.io`;
2. When the main page is loaded, React will request the list of tracked projects and the last build badge;
3. When a specific project page is requested, React will request the build history of such project;

### Docker
All the components of Buildy have been dockerized and can be easily started using the `docker-compose` command.

## How to install <a name="par2"></a>
**Requirements:** [*Docker*, *Docker-compose*]  

You can easily install a copy of Buildy by cloning the repository and running the command `docker-compose up --build -d`.
Before running the command, you will need to create a `.env` file with the following variables:
```
MYTOKEN=<your_github_personal_access_token>
MONGO_URL=mongodb #You can leave that unchanged, unless you modify the MongoDB container's name
```
You might also want to edit the MongoDB root credentials in the `docker-compose.yml` file.