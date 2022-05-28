const {getLatestCommit} = require("./github");
const {saveProjectArray, getProjectsFromDb} = require("./project");
const {spawn} = require("child-process-promise");

let projects = [];

async function main(){
    projects = await getProjectsFromDb()
    console.log(projects);
    await setGitIdentity()
    for (const project of projects) {
        await analyzeProject(project)
        console.log("test")
    }
    console.log("Saving projects on db")
    await saveProjectArray(projects)
}

async function analyzeProject(project){
    console.log(`Retrieving last commit for project ${project.projectName}`)
    let latestCommit = await getLatestCommit(project)
    let sha = latestCommit.sha
    console.log(`Retrieving repository data for project ${project.projectName}`)
    await project.repository.getInformation()
    if(sha !== project.latestCommitSha){
        console.log(`Cloning  project ${project.projectName}`)
        await project.clone()
        console.log(`Building project ${project.projectName}`)
        let build = await project.build(latestCommit)
        console.log(`Saving build ${build.id} for project ${project.projectName}`)
        await project.saveBuild(build)
        console.log(`Pushing build ${build.id} for project ${project.projectName}`)
        await project.commitBuild(build)
    }
}

async function setGitIdentity(){
    console.log("Setting git identity")
    await spawn("git", ["config", "--global", "user.email", "\"filippo.cavallari99@gmail.com\""])
    return spawn("git", ["config", "--global", "user.name", "\"Build\""])
}

function getProjects(){
    return projects
}

module.exports = {
    main,
    getProjects,
    analyzeProject
}