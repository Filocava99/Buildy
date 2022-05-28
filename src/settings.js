module.exports = {
    buildStatus: {
        true: "Success",
        false: "Failure"
    },
    projectsPath: './projects.json',
    projectsEncoding: 'utf-8',
    mongodb_uri: `mongodb://root:example@${process.env.MONGO_URL}:27017/?maxPoolSize=20&w=majority`
}