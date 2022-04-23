const path = require("path");
const spawn = require('child-process-promise').spawn;
const fs = require("fs")
const github = require("./github")
const Build = require("./build")
const settings = require("./settings")

class Project {

    constructor(projectName, repository, mainBranch, latestCommitSha, builds) {
        this.projectName = projectName
        this.repository = repository
        this.mainBranch = mainBranch
        this.latestCommitSha = latestCommitSha
        this.builds = builds
    }

    toJSON() {
        return {
            name: this.projectName,
            repository: {
                name: this.repository.name,
                owner: this.repository.owner
            },
            mainBranch: this.mainBranch,
            latestCommitSha: this.latestCommitSha,
            builds: this.builds
        }
    }

    async clone() {
        return fs.promises.rm(`projects/${this.repository.name}`, {
            recursive: true,
            force: true
        }).then(() => github.cloneProject(this))
    }

    async build(latestCommit) {
        let gradleBuildScript = path.resolve(`src/gradle_build.sh`)
        let log = ""
        return new Promise((resolve, reject) => {
            let processPromise = spawn(gradleBuildScript, [this.repository.name])
            processPromise.childProcess.stdout.on('data', function (data) {
                log += data
                console.log(data)
            });
            processPromise.then((result) => {
                let isSuccess = result.stderr === undefined;
                resolve(this.createBuild(latestCommit, isSuccess))
            }, (error) => {
                console.log(error)
                resolve(this.createBuild(latestCommit, false))
            }).catch((error) => {
                console.log(error)
                resolve(this.createBuild(latestCommit, false))
            })
        })
    }

    async createBuild(latestCommit, isSuccess) {
        let {getCommitterFromCommit, getShaFromCommit, getMessageFromCommit} = require("./github")
        let committer = getCommitterFromCommit(latestCommit)
        let sha = getShaFromCommit(latestCommit)
        let message = getMessageFromCommit(latestCommit)
        let buildStatus = settings.buildStatus[isSuccess]
        let buildId = this.getLatestBuild() == null ? 1 : this.getLatestBuild().id + 1
        console.log(buildId)
        return new Build(buildId, isSuccess, buildStatus, this.projectName, committer.name, committer.date, sha, message)
    }

    getLatestBuild() {
        return this.builds.slice(-1)[0]
    }

    async saveBuild(build) {
        this.latestCommitSha = build.commitSha
        let buildFolder = `projects/${this.repository.name}/build/libs/`
        let buildFile = (await fs.promises.readdir(buildFolder)).filter((allFilesPaths) =>
            allFilesPaths.match(/\.jar$/) !== null)[0]
        let buildPath = buildFolder + buildFile
        let newBuildFileName = buildFile.split(".")
        newBuildFileName = `${newBuildFileName[0]}-${build.id}.${newBuildFileName[1]}`
        build.fileName = newBuildFileName
        this.builds.push(build)
        await fs.promises.mkdir(`builds/${this.projectName}/`, {recursive: true})
        await fs.promises.rename(buildPath, `builds/${this.projectName}/${newBuildFileName}`)
        return fs.promises.rm(`projects/`, {recursive: true, force: true})
    }

    async commitBuild(build) {
        let scriptPath = path.resolve(`src/commit_build.sh`)
        return spawn(scriptPath, [this.repository.name, build.fileName])
    }

}

function fromJson(json) {
    let parsedProject = JSON.parse(json, reviver)
    return new Project(parsedProject.name, parsedProject.repository, parsedProject.mainBranch, parsedProject.latestCommitSha, parsedProject.builds)
}

//private
function reviver(key, value) {
    if (key === "repository") {
        return new github.Repository(value.name, value.owner)
    } else {
        return value
    }
}

async function parseProjectArray(json) {
    return new Promise((resolve, reject) => {
        let parsedProjects = JSON.parse(json)
        let projects = []
        parsedProjects.forEach((p) => projects.push(fromJson(JSON.stringify(p))))
        resolve(projects)
    })
}

async function saveProjectArray(projects, path, encoding) {
    return fs.promises.writeFile(path, JSON.stringify(projects), encoding)
}

module.exports = {
    Project,
    fromJson,
    parseProjectArray,
    saveProjectArray
}
