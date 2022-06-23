class Build{

    constructor(id, isSuccess, buildStatus, projectName, committer, commitTimestamp, commitSha, commitMessage, log, logFileName, fileName) {
        this.id = id
        this.isSuccess = isSuccess
        this.buildStatus = buildStatus
        this.projectName = projectName
        this.committer = committer
        this.commitTimestamp = commitTimestamp
        this.commitSha = commitSha
        this.commitMessage = commitMessage
        this.log = log
        this.logFileName = logFileName
        this.fileName = fileName
    }

    toJSON() {
        return {
            id: this.id,
            isSuccess: this.isSuccess,
            buildStatus: this.buildStatus,
            projectName: this.projectName,
            committer: this.committer,
            commitTimestamp: this.commitTimestamp,
            commitSha: this.commitSha,
            commitMessage: this.commitMessage,
            logFileName: this.logFileName,
            fileName: this.fileName
        }
    }
}

module.exports = Build