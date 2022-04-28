const path = require("path");
const spawn = require('child-process-promise').spawn;
const fs = require("fs")
const github = require("./github")
const Build = require("./build")
const settings = require("./settings")
const {makeBadge} = require("badge-maker");

class Project {

    constructor(projectName, repository, mainBranch, latestCommitSha, builds, lastSuccessfulBuild) {
        this.projectName = projectName
        this.repository = repository
        this.mainBranch = mainBranch
        this.latestCommitSha = latestCommitSha
        this.builds = builds
        this.lastSucessfulBuild = lastSuccessfulBuild
    }

    toJSON() {
        return {
            name: this.projectName,
            repository: {
                name: this.repository.name,
                owner: this.repository.owner,
            },
            mainBranch: this.mainBranch,
            latestCommitSha: this.latestCommitSha,
            builds: this.builds,
            lastSuccessfulBuild: this.lastSuccessfulBuild
        }
    }

    async clone() {
        return fs.promises.rm(`projects/${this.repository.name}`, {
            recursive: true,
            force: true
        }).then(() => github.cloneProject(this))
    }

    async build(latestCommit) {
        await fs.promises.chmod(`projects/${this.repository.name}/gradlew`, 0o777)
        let gradleBuildScript = path.resolve(`src/gradle_build.sh`)
        return new Promise((resolve, reject) => {
            let processPromise = spawn(gradleBuildScript, [this.repository.name], {stdio: "inherit"})
            let childProcess = processPromise.childProcess
            processPromise.then((result) => {
                console.log("INIT DEBUG")
                console.log(result.stdout)
                console.log(result.output)
                console.log(childProcess.output)
                console.log(result.stdio)
                console.log("END DEBUG")
                let isSuccess = result.code === 0;
                resolve(this.createBuild(latestCommit, isSuccess, "Empty log"))
            }, (error) => {
                console.log(error)
                resolve(this.createBuild(latestCommit, false))
            }).catch((error) => {
                console.log(error)
                resolve(this.createBuild(latestCommit, false))
            })
        })
    }

    async createBuild(latestCommit, isSuccess, log) {
        let {getCommitterFromCommit, getShaFromCommit, getMessageFromCommit} = require("./github")
        let committer = getCommitterFromCommit(latestCommit)
        let sha = getShaFromCommit(latestCommit)
        let message = getMessageFromCommit(latestCommit)
        let buildStatus = settings.buildStatus[isSuccess]
        let buildId = this.getLatestBuild() == null ? 1 : this.getLatestBuild().id + 1
        if(isSuccess) this.lastSucessfulBuild = buildId
        return new Build(buildId, isSuccess, buildStatus, this.projectName, committer.name, committer.date, sha, message, log)
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
        let splintedBuildFileName = buildFile.split(".")
        build.fileName = `${splintedBuildFileName[0]}-${build.id}.${splintedBuildFileName[1]}`
        build.logFileName = `${splintedBuildFileName[0]}-${build.id}.txt`
        build.badgeFileName = `${splintedBuildFileName[0]}-${build.id}.svg`
        this.builds.push(build)
        await fs.promises.mkdir(`builds/${this.projectName}/`, {recursive: true})
        await fs.promises.rename(buildPath, `builds/${this.projectName}/${splintedBuildFileName}`)
        await fs.promises.writeFile(`builds/${this.projectName}/${logFileName}`, build.log, "utf-8")
        await this.createBadge(build)
        return fs.promises.rm(`projects/`, {recursive: true, force: true})
    }

    async createBadge(build){
        const { makeBadge } = require('badge-maker')
        const format = {
            label: 'build',
            message: build.isSuccess ? 'passed' : 'failed',
            color: build.isSuccess ? 'green' : 'red',
        }
        const svg = makeBadge(format)
        return fs.promises.writeFile(`builds/${this.projectName}/${build.badgeFileName}`, svg, 'utf-8')
    }

    async commitBuild(build) {
        let scriptPath = path.resolve(`src/commit_build.sh`)
        return spawn(scriptPath, [this.repository.name, build.fileName, build.logFileName, build.badgeFileName, process.env.MYTOKEN], { stdio: 'inherit' })
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
