import {useRef, useState} from "react";
import {clear} from "@testing-library/user-event/dist/clear";
const ENDPOINT = "http://localhost:3000";

export default function RegisterForm(hideModal){
    const [email, _setEmail] = useState("")
    const [password, _setPassword] = useState("")
    const [passwordCheck, _setPasswordCheck] = useState("")

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
    let passwordCheckRef = useRef(passwordCheck)
    let setPasswordCheck = (data) =>{
        passwordCheckRef.current = data
        _setPasswordCheck(data)
    }

    function onClick(event){
        event.preventDefault()
        const axios = require("axios")
        if(passwordCheckRef.current !== passwordRef.current){
            alert("The passwords don't match!")
            return
        }
        axios.post(ENDPOINT+"/register", {email: emailRef.current, password: passwordRef.current}, {withCredentials: true})
            .then((res) => {
                console.log(res.status)
                if(res.status === 200){
                    clearForm()
                    hideModal(true)
                }else{
                    alert("Email already used!")
                }
            }).catch(() => "Unexpected error! Contact support in case the error persists.")
    }

    function clearForm(){
        setEmail("")
        setPassword("")
        setPasswordCheck("")
    }

    return (
        <form className={"register-form"}>
            <link type="text/css" rel="stylesheet" href="stylesheets/modal.css" />
            <label>Email</label>
            <input type="text" onInput={(event) => setEmail(event.currentTarget.value)}/>
            <label>Password</label>
            <input type="password" onInput={(event) => setPassword(event.currentTarget.value)}/>
            <label>Confirm password</label>
            <input type="password" onInput={(event) => setPasswordCheck(event.currentTarget.value)}/>
            <button name={"submit"} value={"Login"} onClick={(event) => onClick(event)}>Register</button>
        </form>
    )
}