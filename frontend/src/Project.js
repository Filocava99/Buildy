export default function Project(project){
    return (
        <tr className="table-row">
            <td>
                <img className="inverted-img centered-img" alt="repository icon"
                     src="https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/repo.svg" />&nbsp;
                    <a href={`projects/${project.name}`}>{project.name}</a>
            </td>
            <td>
                <img className="build-badge" alt="build-badge"
                     src={`https://raw.githubusercontent.com/Filocava99/Buildy/master/builds/${project.name}/${project.name}-build.svg`} />
            </td>
        </tr>
    )
}