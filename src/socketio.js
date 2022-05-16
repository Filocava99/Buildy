const getProjects = require("./main").getProjects

function registerListeners(socketIO){
    socketIO.on('connection', (socket) => {
        socket.on('project-page-request', (message) => {
            let proj = getProjects().filter(it => it.projectName === message.projectName)[0]
            socketIO.emit('project-page-response', {project: proj, builds: [...proj.builds].reverse(), latestBuildId: proj.builds.slice(-1)[0].id})
            console.log(proj)
        })
        socket.on('index-page-request', ()=>{
            let authors = []
            let projects = getProjects()
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
            socketIO.emit('index-page-response', {authors: authors})
        })
    });
}

module.exports = {
    registerListeners
}