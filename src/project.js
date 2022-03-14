const path = require("path");
const spawn = require('child-process-promise').spawn;
const fs = require("fs")
const github = require("./github")

function getProjects() {
    const data = fs.readFileSync('./projects.json', 'utf8')
    let projects = JSON.parse(data)
}

function saveProject(projects) {
    fs.writeFileSync('./projects.json', JSON.stringify(projects), 'utf8')
}

class Project {

    constructor(projectName, repository, mainBranch, latestCommitSha, buildsCount) {
        this.projectName = projectName
        this.repository = repository
        this.mainBranch = mainBranch
        this.latestCommitSha = latestCommitSha
        this.buildsCount = buildsCount
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
            buildsCount: this.buildsCount
        }
    }

    async build() {
        let gradleBuildScript = path.resolve(`src/gradle_build.sh`)
        let promise = spawn(gradleBuildScript, [this.repository.name])
        let log = ""
        promise.childProcess.stdout.on('data', function (data) {
            log += data
        });
        return promise
    }

    async clone() {
        return fs.promises.rm(`projects/${this.repository.name}`, {
            recursive: true,
            force: true
        }).then(() => github.cloneProject(this))
    }

    async save() {
        let buildFolder = `projects/${this.repository.name}/build/libs/`
        let buildFile = fs.readdirSync(buildFolder).filter((allFilesPaths) =>
            allFilesPaths.match(/\.jar$/) !== null)[0]
        let buildPath = buildFolder + buildFile
        let fileExtension = path.extname(buildFile)
        let newBuildFile = `${this.projectName}-${this.buildsCount++}.${fileExtension}`
        return fs.promises.mkdir(`builds/${this.projectName}/`, {recursive: true})
            .then(() => fs.promises.rename(buildPath, `builds/${this.projectName}/${newBuildFile}`)
                .then(() => fs.promises.rm(`projects/`, {recursive: true, force: true}))
                    .then(() => this.commitBuild(newBuildFile)))
    }

    async commitBuild(buildName) {
        let scriptPath = path.resolve(`src/commit_build.sh`)
        return spawn(scriptPath, [this.repository.name, buildName])
    }
}

function fromJson(json) {
    let parsedProject = JSON.parse(json, reviver)
    return new Project(parsedProject.name, parsedProject.repository, parsedProject.mainBranch, parsedProject.latestCommitSha, parsedProject.buildsCount)
}

function reviver(key, value) {
    if (key === "repository") {
        return new github.Repository(value.name, value.owner)
    } else {
        return value
    }
}

function parseProjectArray(json) {
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
