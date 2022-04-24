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
        console.log(`Retrieving last commit for project ${proj.projectName}`)
        let latestCommit = await getLatestCommit(proj)
        let sha = latestCommit.sha
        console.log(sha !== proj.latestCommitSha)
        if(sha !== proj.latestCommitSha){
            console.log(`Retrieving repository data for project ${proj.projectName}`)
            await proj.repository.getInformation()
            console.log(`Cloning  project ${proj.projectName}`)
            await proj.clone()
            console.log(fs.readdirSync("projects/").toString())
            console.log(`Building project ${proj.projectName}`)
            let build = await proj.build(latestCommit)
            console.log(`Saving build ${build.id} for project ${proj.projectName}`)
            await proj.saveBuild(build)
            console.log(`Generating page for project ${proj.projectName}`)
            await handlebar.generatePage(proj)
            console.log(`Pushing build ${build.id} for project ${proj.projectName}`)
            await proj.commitBuild(build)
        }
    }
    console.log("Saving projects on projects.json")
    await saveProjectArray(projects, settings.projectsPath, settings.projectsEncoding)
    console.log("Compiling sass")
    await compileSass()
    console.log("Pushing updated static files")
    await commitStaticFiles()
    process.exit(0)
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
    return spawn(scriptPath, [process.env.MYTOKEN])
}

module.exports = {
    main
}