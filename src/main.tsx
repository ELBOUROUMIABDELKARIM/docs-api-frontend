// Frontend Developed By Me (Karim)
import React from "react";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import {createRoot} from "react-dom/client";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);