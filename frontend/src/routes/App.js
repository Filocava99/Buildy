//import {Outlet, Link} from "react-router-dom";
import React, {useState, useEffect} from "react";
import io from "socket.io-client";
import Author from "../components/Author";
import Header from "../components/Header";
import {NODE_URL, SOCKET_IO_PORT} from "../settings";

const ENDPOINT = `${NODE_URL}:${SOCKET_IO_PORT}`;

export default function App() {
    console.log(process.env.REACT_APP_NODE_IP)
    const [authors, setAuthors] = useState([])
    let authorsArray = []
    useEffect(() => {
        document.title = "Projects list | Buildy"
        const socket = io(ENDPOINT);
        socket.emit("index-page-request")
        socket.on("index-page-response", data => {
            data.authors.map(value => Author(value)).forEach(it => authorsArray.push(it))
            console.log(data.authors)
            setAuthors(authorsArray)
        });
    }, []);

    return (
        <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
            <link type="text/css" rel="stylesheet" href="stylesheets/index.css" />
            { Header("/") }
            <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "row"}}>
                <div className="side-column"></div>
                <div className="central-column">
                    {authors}
                    <span className="copyright">© 2022 Filippo Cavallari</span>
                </div>
                <div className="side-column"></div>
            </div>
        </div>
    );
}