const path = require("path");
const fs = require("fs")
const github = require("./github")
const Build = require("./build")
const settings = require("./settings")
const child_process= require('child_process').spawn

class Project {

    constructor(projectName, repository, mainBranch, latestCommitSha, builds, lastSuccessfulBuild) {
        this.projectName = projectName
        this.repository = repository
        this.mainBranch = mainBranch
        this.latestCommitSha = latestCommitSha
        this.builds = builds
        this.lastSuccessfulBuild = lastSuccessfulBuild
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
            let log= ""
            let child = child_process('bash', [gradleBuildScript, this.repository.name], {shell: true})
            child.stdout.on('data', (data) => log += data)
            child.stderr.on('data', (data) => log += data);
            child.on('close', (code) => {
                if(code === 0){
                    resolve(this.createBuild(latestCommit, true, log))
                }else{
                    resolve(this.createBuild(latestCommit, false, log))
                }
            });
        })
    }

    async createBuild(latestCommit, isSuccess, log) {
        let {getCommitterFromCommit, getShaFromCommit, getMessageFromCommit} = require("./github")
        let committer = getCommitterFromCommit(latestCommit)
        let sha = getShaFromCommit(latestCommit)
        let message = getMessageFromCommit(latestCommit)
        let buildStatus = settings.buildStatus[isSuccess]
        let buildId = this.getLatestBuild() == null ? 1 : this.getLatestBuild().id + 1
        if (isSuccess) this.lastSucsessfulBuild = buildId
        return new Build(buildId, isSuccess, buildStatus, this.projectName, committer.name, committer.date, sha, message, log)
    }

    getLatestBuild() {
        try {
            return this.builds.slice(-1)[0]
        } catch (e) {
            return null
        }
    }

    async saveBuild(build) {
        this.latestCommitSha = build.commitSha
        build.logFileName = `${this.projectName}-${build.id}.txt`
        this.builds.push(build)
        await fs.promises.mkdir(`builds/${this.projectName}/`, {recursive: true})
        if(build.isSuccess){
            let buildFolder = `projects/${this.repository.name}/build/libs/`
            let buildFile = (await fs.promises.readdir(buildFolder)).filter((allFilesPaths) =>
                allFilesPaths.match(/\.jar$/) !== null)[0]
            let buildPath = buildFolder + buildFile
            build.fileName = `${this.projectName}-${build.id}.jar`
            await fs.promises.rename(buildPath, `builds/${this.projectName}/${build.fileName}`)
        }
        await fs.promises.writeFile(`builds/${this.projectName}/${build.logFileName}`, build.log, "utf-8")
        await this.createBadge(build)
        return fs.promises.rm(`projects/`, {recursive: true, force: true})
    }

    async createBadge(build) {
        const {makeBadge} = require('badge-maker')
        const format = {
            label: 'build',
            message: build.isSuccess ? 'passed' : 'failed',
            color: build.isSuccess ? 'success' : 'critical',
            style: 'for-the-badge',
        }
        const svg = makeBadge(format)
        return fs.promises.writeFile(`builds/${this.projectName}/${this.projectName}-build.svg`, svg, 'utf-8')
    }

    async commitBuild(build) {
        let scriptPath = path.resolve(`src/commit_build.sh`)
        return new Promise((resolve) => {
            let child = child_process("bash", [scriptPath, this.repository.name, build.fileName, build.logFileName, process.env.MYTOKEN], {stdio: 'inherit', env: {...process.env}})
            child.on('close', (code) => {
                if (code === 0) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        })
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
