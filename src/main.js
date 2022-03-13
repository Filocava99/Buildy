const fs = require("fs")
const project = require("./project")
const {getLatestCommitSha} = require("./github");

function main(){
    let projects = project.parseProjectArray(fs.readFileSync('./projects.json', 'utf8'))
    projects.forEach(proj => {
        getLatestCommitSha(proj).then(function (response) {
           let latestSha = response.data[0].sha
            if(latestSha !== proj.latestCommitSha){
                proj.repository.getInformation().then(()=>proj.clone()).then(()=>proj.build()).then(()=>proj.save())
            }
        })
    })
}

module.exports = {
    main
}