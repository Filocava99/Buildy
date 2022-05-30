import {useRef, useState} from "react";
import {HTTP_PORT, HTTP_PROTOCOL, NODE_URL} from "../settings";
const ENDPOINT = `${HTTP_PROTOCOL}://${NODE_URL}:${HTTP_PORT}`;

export default function AddProjectForm(hideModal){
    const [projectName, _setProjectName] = useState("")
    const [repositoryName, _setRepositoryName] = useState("")
    const [repositoryOwner, _setRepositoryOwner] = useState("")
    const [mainBranch, _setMainBranch] = useState("")

    let projectNameRef = useRef(projectName)
    let setProjectName = (value) => {
        projectNameRef.current = value
        _setProjectName(value)
    }
    let repositoryNameRef = useRef(repositoryName)
    let setRepositoryName = (value) => {
        repositoryNameRef.current = value
        _setRepositoryName(value)
    }
    let repositoryOwnerRef = useRef(repositoryOwner)
    let setRepositoryOwner = (value) => {
        repositoryOwnerRef.current = value
        _setRepositoryOwner(value)
    }
    let mainBranchRef = useRef(mainBranch)
    let setMainBranch = (value) => {
        mainBranchRef.current = value
        _setMainBranch(value)
    }

    function onSubmit(event){
        event.preventDefault()
        let project = {
            name: projectNameRef.current,
            repository: {
                name: repositoryNameRef.current,
                owner: repositoryOwnerRef.current,
            },
            mainBranch: mainBranchRef.current
        }
        const axios = require('axios')
        axios.post(ENDPOINT + '/addproject', project, {withCredentials: true})
            .then(res => {
                if(res.status === 200){
                    hideModal(true)
                }else{
                    alert("Error: " + res.status)
                }
            })
            .catch(err => {
                alert("Error: " + err)
            })
    }

    return (
        <form className={"login-form"}>
            <link type="text/css" rel="stylesheet" href="stylesheets/modal.css"/>
            <label>Project name</label>
            <input type="text" onInput={(event) => setProjectName(event.currentTarget.value)}/>
            <label>Repository name</label>
            <input type="text" onInput={(event) => setRepositoryName(event.currentTarget.value)}/>
            <label>Repository owner</label>
            <input type="text" onInput={(event) => setRepositoryOwner(event.currentTarget.value)}/>
            <label>Main branch</label>
            <input type="text" onInput={(event) => setMainBranch(event.currentTarget.value)}/>
            <button name={"submit"} value={"Login"} onClick={(event) => onSubmit(event)}>Add project</button>
        </form>
    )

}