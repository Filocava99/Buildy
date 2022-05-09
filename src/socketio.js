const {socketIO} = require("../app");
const {projects} = require("./main")

function registerListeners(){
    socketIO.on('connection', (socket) => {
        socketIO.on('project-page-request', (project) => {
            let proj = projects.filter(it => it.projectName === project)[0]
            socketIO.emit('project-page-request', {proj: proj, builds: [...proj.builds].reverse(), latestBuildId: proj.getLatestBuild().id})
        })
        socketIO.on('index-page-request', ()=>{
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
            socketIO.emit('index-page-request', {authors: authors})
        })
    });
}

module.exports = {
    registerListeners
}