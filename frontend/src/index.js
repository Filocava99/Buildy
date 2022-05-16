import ReactDOM from "react-dom/client";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import App from "./App";
import ProjectPage from "./routes/ProjectPage";

const root = ReactDOM.createRoot(
    document.getElementById("root")
);
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="projects" element={<ProjectPage />} >
                <Route path=":projectName" element={<ProjectPage />} />
            </Route>
        </Routes>
    </BrowserRouter>
);