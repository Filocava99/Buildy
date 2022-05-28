import {useRef, useState} from "react";

const ENDPOINT = "http://localhost:3000";

export default function LoginForm(hideModal, setHeaderEmail) {

    const [email, _setEmail] = useState("")
    const [password, _setPassword] = useState("")

    let emailRef = useRef(email)
    let setEmail = (data) => {
        emailRef.current = data
        _setEmail(data)
    }

    let passwordRef = useRef(password)
    let setPassword = (data) => {
        passwordRef.current = data
        _setPassword(data)
    }

    function onLoginClick(event) {
        event.preventDefault()
        const axios = require("axios")
        axios.post(ENDPOINT + "/login", {
            email: emailRef.current,
            password: passwordRef.current
        }, {withCredentials: true})
            .then((res) => {
                if(res.status === 200){
                    setHeaderEmail(emailRef.current)
                    hideModal(true)
                    clearForm()
                }else{
                    alert("Wrong credentials!")
                }
            }).catch(() => alert("Unexpected error! Check your credentials."))
    }

    function clearForm(){
        setEmail("")
        setPassword("")
    }

    return (
        <form className={"login-form"}>
            <link type="text/css" rel="stylesheet" href="stylesheets/modal.css"/>
            <label>Email</label>
            <input type="text" onInput={(event) => setEmail(event.currentTarget.value)}/>
            <label>Password</label>
            <input type="password" onInput={(event) => setPassword(event.currentTarget.value)}/>
            <button name={"submit"} value={"Login"} onClick={(event) => onLoginClick(event)}>Login</button>
        </form>
    )
}

