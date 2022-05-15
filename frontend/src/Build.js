export function BuildSidebar(build) {
    return (
        <div className={build.id % 2 === 0 ? "build build-even" : "build build-odd"}>
            <svg className="build-state" height="25" width="25">
                {build.isSuccess ? (
                    <circle cx="15" cy="24" r="12" stroke="rgb(60, 100, 60)" stroke-width="2"
                            fill="rgb(20, 255, 20)"></circle>
                ) : (
                    <circle cx="15" cy="24" r="12" stroke="rgb(100, 60, 60)" stroke-width="2"
                            fill="rgb(255, 20, 20)"></circle>
                )
                }
            </svg>
            <a href="#" data-build-id={build.id} className="build-id-link">#{build.id}</a>
            <a href="#" data-build-id={build.id} className="build-timestamp-link">{build.commitTimestamp}</a>
        </div>
    )
}

export function BuildContent(build, proj) {
    let latestBuild = proj.latestBuildId
    return (
        <div className={build.id === latestBuild ? "build-content" : "build-content hidden"}
             id={build.id === latestBuild ? "selected-build" : ""} data-build-id={build.id}>
            <div className="content-header">
                <svg preserveAspectRatio="xMidYMid meet" width="15%" height="100%">
                    {build.isSuccess ? (
                        <circle cx="50%" cy="50%" r="25%" stroke="rgb(60, 100, 60)" stroke-width="2%"
                                fill="rgb(20, 255, 20)"></circle>
                    ) : (
                        <circle cx="50%" cy="50%" r="25%" stroke="rgb(100, 60, 60)" stroke-width="2%"
                                fill="rgb(255, 20, 20)"></circle>
                    )}
                </svg>
                <div className="content-header-title">
                    {build.buildStatus}
                </div>
            </div>
            <table className="build-info">
                {build.isSuccess ? (
                    <tr className="build-info-header">
                        <td><img className="centered-img inverted-img" alt="download"
                                 src="https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/cloud-download.svg"/>
                        </td>
                        <td>Download (.jar)</td>
                        <td><a
                            href={`https://github.com/Filocava99/Buildy/tree/master/builds/${proj.projectName}/${build.fileName}`}>{build.fileName}</a>
                        </td>
                    </tr>
                ) : (
                    <div></div>
                )}
                <tr className="build-info-row">
                    <td><img className="centered-img inverted-img" alt="download"
                             src="https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/file.svg"></td>
                    <td>Build Log</td>
                    <td><a
                        href="https://github.com/Filocava99/Buildy/tree/master/builds/{{../proj.projectName}}/{{this.logFileName}}">{{
                        this
                        .logFileName
                    }}</a></td>
                </tr>
                <tr className="build-info-row">
                    <td><img className="centered-img inverted-img" alt="download"
                             src="https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/file-code.svg"></td>
                    <td>Source Code</td>
                    <td><a
                        href="https://github.com/{{../proj.repository.owner}}/{{../proj.repository.name}}/tree/{{this.commitSha}}">GitHub</a>
                    </td>
                </tr>
                <tr className="build-info-row">
                    <td><img className="centered-img inverted-img" alt="download"
                             src="https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/law.svg"></td>
                    <td>License</td>
                    <td><a
                        href="https://github.com/{{../proj.repository.owner}}/{{../proj.repository.name}}/blob/{{this.commitSha}}/LICENSE">{{
                        proj
                        .repository.license
                    }}</a></td>
                </tr>
            </table>
        </div>
    )
}