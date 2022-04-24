class Build{

    constructor(id, isSuccess, buildStatus, projectName, committer, commitTimestamp, commitSha, commitMessage, log) {
        this.id = id
        this.isSuccess = isSuccess
        this.buildStatus = buildStatus
        this.projectName = projectName
        this.committer = committer
        this.commitTimestamp = commitTimestamp
        this.commitSha = commitSha
        this.commitMessage = commitMessage
        this.log = log
    }

}

module.exports = Build