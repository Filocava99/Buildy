const path = require("path");
const fs = require("fs")
const github = require("./github")
const Build = require("./build")
const settings = require("./settings")
const child_process = require('child_process').spawn
const {createMongoClient} = require("./utils");

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
            let log = ""
            let child = child_process('bash', [gradleBuildScript, this.repository.name], {shell: true})
            child.stdout.on('data', (data) => log += data)
            child.stderr.on('data', (data) => log += data);
            child.on('close', (code) => {
                console.log(log)
                if (code === 0) {
                    resolve(this.createBuild(latestCommit, true, log))
                } else {
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
        if (isSuccess) this.lastSuccessfulBuild = buildId
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
        this.wasModified = true
        build.logFileName = `${this.projectName}-${build.id}.txt`
        this.builds.push(build)
        await fs.promises.mkdir(`builds/${this.projectName}/`, {recursive: true})
        if (build.isSuccess) {
            console.log(this.projectName)
            let buildFolder = `projects/${this.repository.name}/build/libs/`
            let buildFile = (await fs.promises.readdir(buildFolder)).filter((allFilesPaths) =>
                allFilesPaths.match(/\.jar$/) !== null)[0]
            let buildPath = buildFolder + buildFile
            let splintedBuildFileName = buildFile.split(".")
            build.fileName = `${splintedBuildFileName[0]}-${build.id}.${splintedBuildFileName[1]}`
            await fs.promises.rename(buildPath, `builds/${this.projectName}/${splintedBuildFileName}`)
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
            let child = child_process(scriptPath, [this.repository.name, build.fileName, build.logFileName, process.env.MYTOKEN], {shell: true})
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

async function getProjectsFromDb(){
    console.log("ok1")
    const client = await createMongoClient()
    console.log("ok2")
    const db = await client.db("buildy")
    console.log("ok3")
    const collection = await db.collection("project")
    console.log("ok4")
    const incompleteProjects = await collection.find().toArray()
    console.log("ok5")
    await client.close()
    console.log("ok6")
    return parseProjectArray(incompleteProjects)
}

async function parseProjectArray(parsedProjects) {
    return new Promise((resolve) => {
        let projects = []
        parsedProjects.forEach((p) => projects.push(fromJson(JSON.stringify(p))))
        resolve(projects)
    })
}

async function saveProjectArray(projects) {
    const client = await createMongoClient()
    const db = client.db("buildy")
    const collection = await db.collection('projects')
    return new Promise(async (resolve) => {
        for (const project of (await trimProjects(await filterModifiedProjects(projects)))) {
            await collection.updateOne({name: project.name}, {$set:project}, {upsert: true})
        }
        await client.close()
        resolve()
    })
}

async function addProject(project){
    const client = await createMongoClient()
    const db = client.db("buildy")
    const collection = await db.collection('project')
    await collection.insertOne(await trimProjects(project))
    console.log("added project to db")
    return client.close()
}

async function trimProjects(projects){
    return new Promise((resolve) => {
        resolve(JSON.parse(JSON.stringify(projects)))
    })
}

async function filterModifiedProjects(projects) {
    return new Promise((resolve) => {
        resolve(projects.filter(proj => proj.wasModified === true))
    })
}

module.exports = {
    Project,
    getProjectsFromDb,
    saveProjectArray,
    addProject
}
