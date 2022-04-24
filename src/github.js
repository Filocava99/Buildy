const spawn = require('child-process-promise').spawn;
const axios = require('axios').create({
    baseURL: 'https://api.github.com',
    timeout: 10000,
    headers: {'Authorization': `token ${process.env.MYTOKEN}`}
});
const hbs = require("hbs");
const fs = require('fs')
const Build = require("./build");

class Repository {
    constructor(name, owner) {
        this.name = name;
        this.owner = owner;
        this.branches = {}
        this.getInformation().then(() => {})
    }

    getInformation() {
        return requestToGithub(`/repos/${this.owner}/${this.name}`).then((response) => {
            let data = response.data
            this.id = data.id
            this.url = data.html_url
            this.description = data.description
            this.sshUrl = data.ssh_url
            this.cloneUrl = data.clone_url
            this.stargazers = data.stargazers_count
            this.language = data.language
            this.license = data.license.name
            this.updatedAt = data.updated_at
            return requestToGithub(`/repos/${this.owner}/${this.name}/branches`)
        }).then((res) => {
            res.data.forEach((branch) => {
                this.branches[branch.name] = branch.commit
            })
        })
    }
}

function cloneProject(project){
    return spawn("git", ["clone", "-b", project.mainBranch, project.repository.cloneUrl, `projects/${project.repository.name}`])
}

async function requestToGithub(endpoint, config) {
    return axios.get(endpoint, config)
}

async function getLatestCommit(project){
    let newString = ""
    process.env.MYTOKEN.split('').forEach((char) => {
        newString = newString + char + " "
    })
    console.log("--------------------------------------prova speciale:   " + newString)
    return new Promise((resolve, reject) => {
        requestToGithub(`/repos/${project.repository.owner}/${project.repository.name}/commits`, {
            params: {
                per_page: 1,
                sha: project.mainBranch
            }
        }).then(response => resolve(response.data[0]))
    })
}

function getShaFromCommit(commit){
    return commit.sha
}

function getCommitterFromCommit(commit){
    return commit.commit.committer
}

function getMessageFromCommit(commit){
    return commit.commit.message;
}

function test() {
    // requestToGithub("/repos/filocava99/KotlinLib/commits", {
    //     params: {
    //         per_page: 1,
    //         sha: 'master'
    //     }
    // }).then(function (response) {
    //     console.log(response.data[0].sha)
    // })
    /*
    let repo = new Repository("Fortress", "filocava99")
    let project = new Project("Fortress", "filocava99", "master")
    project.repository.getInformation().then(()=>{
        cloneProject(project).then(()=>buildProject(project)).then(()=>console.log("Build successful"))
    })
    fs.writeFileSync('./projects.json', JSON.stringify([project]), 'utf8')*/
    let string = fs.readFileSync("views/project.hbs", "utf8")
    //console.log(string)
    hbs.registerHelper('isEven', function (value) {
        return value%2===0;
    });
    hbs.registerHelper('isLatestBuild', function (latestBuildId, buildId) {
        return latestBuildId === buildId;
    });
    let builds = [
        new Build(1, true, "Success", "MyCoolProject", "filocava99", "2022-03-08 (15:03:30)", "348576", "Add cool stuff to the project"),
        new Build(2, false, "Failure", "MyCoolProject", "filocava99", "2022-03-08 (15:03:30)", "348576", "Add cool stuff to the project")
    ]

    let template = hbs.compile(string)
    //console.log(template)
    let result = template({builds: builds, latestBuildId: 2})
    fs.writeFileSync("public/projects_auto.html", result)
}

module.exports = {
    Repository,
    cloneProject,
    requestToGithub,
    getLatestCommit,
    getShaFromCommit,
    getCommitterFromCommit,
    getMessageFromCommit
}