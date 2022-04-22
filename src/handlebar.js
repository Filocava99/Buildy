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
    let result = template({builds: [...proj.builds].reverse(), latestBuildId: proj.getLatestBuild().id})
    return fs.promises.writeFile("public/projects_auto.html", result)
}

module.exports = {
    generatePage
}