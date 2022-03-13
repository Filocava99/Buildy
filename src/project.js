const path = require("path");
const spawn = require('child-process-promise').spawn;
const fs = require("fs")
const github = require("./github")
const util = require('util')
const rename = util.promisify(fs.rename)
const rm = util.promisify(fs.rm)

function getProjects(){
    const data = fs.readFileSync('./projects.json', 'utf8')
    let projects = JSON.parse(data)
}

function saveProject(projects){
    fs.writeFileSync('./projects.json', JSON.stringify(projects), 'utf8')
}

class Project {

    constructor(projectName, repository, mainBranch, latestCommitSha) {
        this.projectName = projectName
        this.repository = repository
        this.mainBranch = mainBranch
        this.latestCommitSha = latestCommitSha
    }

    toJSON() {
        return {
            name: this.projectName,
            repository: {
                name: this.repository.name,
                owner: this.repository.owner
            },
            mainBranch: this.mainBranch,
            latestCommitSha: this.latestCommitSha
        }
    }

    async build(){
        let gradleBuildScript = path.resolve(`src/gradle_build.sh`)
        let promise = spawn(gradleBuildScript,[this.repository.name])
        let log = ""
        promise.childProcess.stdout.on('data', function (data) {
           log += data
        });
        return promise
    }

    async clone(){
        return rm(`projects/${this.repository.name}`, {recursive: true, force: true}).then(()=>github.cloneProject(this))
    }

    async save(){
        let buildFolder = `projects/${this.repository.name}/build/libs/`
        let buildFile = fs.readdirSync(buildFolder).filter((allFilesPaths) =>
            allFilesPaths.match(/\.jar$/) !== null)[0]
        let buildPath = buildFolder + buildFile
        return rename(buildPath, `builds/${this.projectName}/${buildFile}`).then(()=>this.commitBuild())
    }

    async commitBuild(){
        let scriptPath = path.resolve(`src/commit_build.sh`)
        return spawn(scriptPath)
    }
}

function fromJson(json){
    let parsedProject = JSON.parse(json, reviver)
    return new Project(parsedProject.name, parsedProject.repository, parsedProject.mainBranch, parsedProject.latestCommitSha)
}

function reviver(key, value){
    if(key === "repository"){
        return new github.Repository(value.name, value.owner)
    }else{
        return value
    }
}

function parseProjectArray(json){
    let parsedProjects = JSON.parse(fs.readFileSync('./projects.json', 'utf8'))
    let projects = []
    parsedProjects.forEach((p) => projects.push(fromJson(JSON.stringify(p))))
    return projects
}

module.exports = {
    Project,
    fromJson,
    parseProjectArray
}
