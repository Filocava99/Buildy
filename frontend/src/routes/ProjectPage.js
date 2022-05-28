import { useParams } from "react-router-dom";
import {useEffect, useState} from "react";
import io from "socket.io-client";
import {BuildContent, BuildSidebar} from "../components/Build";

const ENDPOINT = "127.0.0.1:3001";

export default function ProjectPage(){
    const projectName = useParams().projectName
    const [sidebarBuilds, setSBBuilds] = useState([])
    const [contentBuilds, setContentBuilds] = useState([])
    const [selectedBuild, setSelectedBuild] = useState(1)
    const [builds, setBuilds] = useState([{isSuccess: true}])
    const [proj, setProj] = useState({
        repository: {
            owner: "",
            name: ""
        },
        lastSuccessfulBuild: 0
    })

    const onClick = (buildId) => {setSelectedBuild(buildId); console.log("clicked")}

    let sidebarBuildsArray = []
    let contentBuildsArray = []

    useEffect(() => {
        document.title = `${projectName} | Buildy`
        const socket = io(ENDPOINT);
        socket.emit("project-page-request", {projectName: projectName})
        socket.on("project-page-response", data => {
            data.builds.forEach(it => {
                sidebarBuildsArray.push(BuildSidebar(it, onClick))
                contentBuildsArray.push(BuildContent(it, data.project, data.latestBuildId))
            })
            setProj(data.project)
            setBuilds(data.builds)
            setSelectedBuild(data.latestBuildId)
            setSBBuilds(sidebarBuildsArray)
            setContentBuilds(contentBuildsArray)
            console.log(data.project)
        });
    }, []);

    useEffect( () => {
        contentBuildsArray = []
        builds.forEach(it => {
            contentBuildsArray.push(BuildContent(it, proj, selectedBuild))
        })
        setContentBuilds(contentBuildsArray)
    }, [selectedBuild])

    return (
        <div style={{width: "100%", height: "100%"}}>
            <link type="text/css" rel="stylesheet" href="../stylesheets/projects.css" />
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
                                <td><a href="#" id="last-successful-build-link" data-build-id={proj.lastSuccessfulBuild}>Last successful build</a></td>
                            </tr>
                            <tr>
                                <td>
                                    <img className="centered-img inverted-img"
                                         src="https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/check.svg"
                                         alt="bug icon" />
                                </td>
                                <td><img
                                    src={`https://raw.githubusercontent.com/Filocava99/Buildy/master/builds/${proj.name}/${proj.name}-build.svg`}
                                    alt={`Last build status: ${builds[0].isSuccess}`} /></td>
                            </tr>
                        </table>
                    </div>
                    <span className="sidebar-header">Builds</span>
                    <div className="builds">
                        {sidebarBuilds}
                    </div>
                </div>
                <div className="content">
                        {contentBuilds}
                </div>
            </div>
            <span className="copyright">© 2022 Filippo Cavallari</span>
        </div>
    )
}