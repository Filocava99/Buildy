import Modal from "./Modal";
import LoginForm from "./LoginForm";
import {useState} from "react";
import RegisterForm from "./RegisterForm";
import Cookies from 'js-cookie'
import {Link} from "react-router-dom";
import AddProjectForm from "./AddProjectForm";

export default function Header(path) {
    let [email, setEmail] = useState(Cookies.get("email"))
    let [modalHidden, hideModal] = useState(true)
    let [loginForm, setLoginForm] = useState(LoginForm(hideModal, setEmail))
    let [registerForm, setRegisterForm] = useState(RegisterForm(hideModal))
    let [addProjectForm, setAddProjectForm] = useState(AddProjectForm(hideModal))
    const [formType, setFormType] = useState("login")

    let backButton = path === "/" ? (<div/>) : (
        <a href="../../">
            <img className="centered-img inverted-img"
                 src="https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/arrow-left.svg" alt="bug icon"/></a>
    )

    function onLoginClick(event){
        event.preventDefault()
        setFormType("login")
        hideModal(false)
    }

    function onRegisterClick(event){
        event.preventDefault()
        setFormType("register")
        hideModal(false)
    }

    function onLogoutClick(event){
        event.preventDefault()
        setEmail(undefined)
        Cookies.remove("email")
    }

    function onAddProjectClick(event){
        event.preventDefault()
        setFormType("addProject")
        hideModal(false)
        console.log("triggered")
    }

    let content
    if(email !== undefined){
        content = (
            <div className="header">
                {backButton}
                <span className={"navbar-item"}>Logged in as: {email}</span>
                <span className={"navbar-separator"}></span>
                <a className={"navbar-item"} href={"/"} onClick={(event) => onAddProjectClick(event)}>Add project</a>
                <span className={"navbar-separator"}></span>
                <a className={"navbar-item"} href="/" onClick={(event) => onLogoutClick(event)}>Logout</a>
                {Modal(addProjectForm, modalHidden, hideModal)}
            </div>

        )
    }else{
        content = (
            <div className="header">
                {backButton}
                <a className={"navbar-item"} href="/" onClick={(event) => onLoginClick(event)}>Login</a>
                <span className={"navbar-separator"}></span>
                <a className={"navbar-item"} href="/" onClick={(event) => onRegisterClick(event)}>Register</a>
                {formType === "login" ? Modal(loginForm, modalHidden, hideModal) : Modal(registerForm, modalHidden, hideModal)}
            </div>
        )
    }

    return content
}