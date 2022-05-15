import Project from "./Project"

export default function Author(author) {
    let projects = []
    author.projects.map(value => Project(value)).forEach(it => projects.push(it))
    return (
        <table className="projects-table">
            <tr className="author-row">
                <td colSpan="2"><img className="inverted-img centered-img" alt="Person silhouette"
                                     src="https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/person.svg"/>
                    {author.name}</td>
            </tr>
            {projects}
        </table>
    )
}