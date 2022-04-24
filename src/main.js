const fs = require("fs")
const {getLatestCommit} = require("./github");
const handlebar = require("./handlebar")
const settings = require("./settings")
const {saveProjectArray, parseProjectArray} = require("./project");
const path = require("path");
const {spawn} = require("child-process-promise");

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
            await handlebar.generatePage(proj)
            await proj.commitBuild(build)
        }
    }
    await saveProjectArray(projects, settings.projectsPath, settings.projectsEncoding)
    await compileSass()
    await commitStaticFiles()
}

async function compileSass(){
    let sass = require("./node-sass-promise");
    let result = await sass.render({
        file:"public/stylesheets/style.sass",
        indentedSyntax: true,
        outputStyle : 'expanded'
    })
    return fs.promises.writeFile("public/stylesheets/style.css", result.css.toString(), "utf-8")
}

async function commitStaticFiles(){
    let scriptPath = path.resolve(`src/commit_static_files.sh`)
    return spawn(scriptPath, [process.env.TOKEN])
}

module.exports = {
    main
}