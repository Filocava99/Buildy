const fs = require("fs")
const {getLatestCommit} = require("./github");
const handlebar = require("./handlebar")
const settings = require("./settings")
const {saveProjectArray, Project, parseProjectArray} = require("./project");

async function main(){
    let projectsJson = await fs.promises.readFile(settings.projectsPath, settings.projectsEncoding)
    let projects = await parseProjectArray(projectsJson)
    for (const proj of projects) {
        let latestCommit = await getLatestCommit(proj)
        let sha = latestCommit.sha
        if(sha !== proj.latestCommitSha){
            await proj.repository.getInformation()
            await proj.clone()
            let build = await proj.build(latestCommit)
            await proj.saveBuild(build)
            await proj.commitBuild(build)
            await handlebar.generatePage(proj)
        }
    }
    await saveProjectArray(projects, settings.projectsPath, settings.projectsEncoding)
}

module.exports = {
    main
}