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

async function generatePage(proj){
    if(!customFunctionsAlreadyRegistered) {
        registerCustomFunctions()
        customFunctionsAlreadyRegistered = true
    }
    let string = fs.readFileSync("views/project.hbs", "utf8")
    let template = hbs.compile(string)
    let result = template({proj: proj, builds: [...proj.builds].reverse(), latestBuildId: proj.getLatestBuild().id})
    await createBadge(proj)
    return fs.promises.writeFile(`builds/${proj.projectName}/${proj.projectName}.html`, result)
}

async function createBadge(proj){
    const { makeBadge } = require('badge-maker')
    const lastBuild = proj.getLatestBuild()
    const format = {
        label: 'build',
        message: lastBuild.isSuccess ? 'passed' : 'failed',
        color: lastBuild.isSuccess ? 'green' : 'red',
    }
    const svg = makeBadge(format)
    return fs.promises.writeFile(`builds/${this.projectName}/${this.projectName}-build.svg`, svg, 'utf-8')
}

module.exports = {
    generatePage
}