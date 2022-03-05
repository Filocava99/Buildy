const spawn = require('child-process-promise').spawn;
const axios = require('axios').create({
    baseURL: 'https://api.github.com',
    timeout: 1000,
    headers: {'Authorization': 'token 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'}
});
const path = require("path");
const hbs = require("hbs");
const fs = require('fs')


function getProjects(){
    const data = fs.readFileSync('./projects.json', 'utf8')
    let projects = JSON.parse(data)
}

class Project {
    constructor(name, owner, mainBranch) {
        this.repository = new Repository(name, owner)
        this.mainBranch = mainBranch
    }
}

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
            this.license = data.license
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

function buildProject(project){
    let gradleBuildScript = path.resolve(`src/gradle_build.sh`)
    console.log(gradleBuildScript)
    let promise = spawn(gradleBuildScript,[project.repository.name])
    promise.childProcess.stdout.on('data', function (data) {
        console.log('[spawn] stdout: ', data.toString());
    });
    return promise

}

async function requestToGithub(endpoint, config) {
    return axios.get(endpoint, config)
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
    let string = fs.readFileSync("views/index.hbs", "utf8")
    //console.log(string)
    let template = hbs.compile(string)
    //console.log(template)
    let result = template({title: "Prova"})
    console.log(result)
}

module.exports = {
    test
}