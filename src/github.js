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
            this.license = data.license !== null ? data.license.name : "NO LICENSE"
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
    const token = process.env.MYTOKEN;
    const authenticatedUrl = project.repository.cloneUrl.replace('https://', `https://${token}@`);
    return spawn("git", ["clone", "-b", project.mainBranch, authenticatedUrl, `projects/${project.repository.name}`], { stdio: 'inherit' })
}

async function requestToGithub(endpoint, config) {
    return axios.get(endpoint, config)
}

async function getLatestCommit(project){
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

module.exports = {
    Repository,
    cloneProject,
    requestToGithub,
    getLatestCommit,
    getShaFromCommit,
    getCommitterFromCommit,
    getMessageFromCommit
}