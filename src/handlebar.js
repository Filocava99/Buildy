const hbs = require("hbs");
const fs = require("fs");

function registerCustomFunctions(){
    hbs.registerHelper('isEven', function (value) {
        return value%2===0;
    });
    hbs.registerHelper('isLatestBuild', function (latestBuildId, buildId) {
        return latestBuildId === buildId;
    });
}

let customFunctionsAlreadyRegistered = false

async function generateProjectPage(proj){
    if(!customFunctionsAlreadyRegistered) {
        registerCustomFunctions()
        customFunctionsAlreadyRegistered = true
    }
    let string = fs.readFileSync("views/project.hbs", "utf8")
    let template = hbs.compile(string)
    let result = template({proj: proj, builds: [...proj.builds].reverse(), latestBuildId: proj.getLatestBuild().id})
    return fs.promises.writeFile(`builds/${proj.projectName}/${proj.projectName}.html`, result)
}

async function generateIndex(projects){
    let authors = []
    for(const proj of projects){
        let authorName = proj.repository.owner
        let filterResult = authors.filter((author) => author.name === authorName)[0]
        if(filterResult === undefined){
            let author = {name: authorName, projects: [proj]}
            authors.push(author)
        }else{
            filterResult.projects.push(proj)
        }
    }
    let string = fs.readFileSync("views/index.hbs", "utf8")
    let template = hbs.compile(string)
    let result = template({authors: authors})
    return fs.promises.writeFile(`index.html`, result)
}

module.exports = {
    generateProjectPage: generateProjectPage,
    generateIndex: generateIndex
}