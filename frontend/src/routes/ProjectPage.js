import { useParams } from "react-router-dom";

export default function ProjectPage(){
    return (
        <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "row"}}>
            <link type="text/css" rel="stylesheet" href="public/stylesheets/projects.css" />
            <div className="page">
                <div className="sidebar">
                    <span className="sidebar-header">Project Info</span>
                    <div className="sidebar-content">
                        <table>
                            <tr>
                                <td>
                                    <img className="centered-img inverted-img"
                                         src="https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/mark-github.svg"
                                         alt="bug icon" />
                                </td>
                                <td><a href={`https://github.com/${proj.repository.owner}/${proj.repository.name}`}>GitHub
                                    repository</a></td>
                            </tr>
                            <tr>
                                <td>
                                    <img className="centered-img inverted-img"
                                         src="https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/bug.svg"
                                         alt="bug icon" />
                                </td>
                                <td><a
                                    href={`https://github.com/${proj.repository.owner}/${proj.repository.name}/issues`}>Issues</a>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <img className="centered-img inverted-img"
                                         src="https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/checklist.svg"
                                         alt="bug icon" />
                                </td>
                                <td><a href="#" id="last-successful-build-link" data-build-id=""{
                                    proj
                                        .lastSuccessfulBuild
                                }>Last successful build</a></td>
                            </tr>
                            <tr>
                                <td>
                                    <img className="centered-img inverted-img"
                                         src="https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/check.svg"
                                         alt="bug icon" />
                                </td>
                                <td><img
                                    src={`https://raw.githubusercontent.com/Filocava99/Buildy/master/builds/${proj.projectName}/${proj.projectName}-build.svg`}
                                    alt={`Last build status: ${builds[0].isSuccess}`} /></td>
                            </tr>
                        </table>
                    </div>
                    <span className="sidebar-header">Builds</span>

                </div>
            </div>
        </div>
    )
}