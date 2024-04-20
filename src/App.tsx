import { useState, useEffect } from "react";
import {Route, Routes, Navigate, useNavigate} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import UploadDocument from "./pages/UploadDocument.tsx";

interface DecodedToken {
    sub: string;
}
export default function App() {
    const [user, setUser] = useState<string | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = jwtDecode<DecodedToken>(token);
            setUser(decodedToken.sub);
            navigate("/upload")
        }
    }, []);

    const handleLogin = (token: string) => {
        const decodedToken = jwtDecode<DecodedToken>(token);
        console.log(decodedToken)
        setUser(decodedToken.sub);
        localStorage.setItem("token", token);
        navigate("/upload")
    };
    const handleSignup = () => {
        navigate("/login")
    };


    return (
        <>
            <Routes>
                <Route path="/" element={<Navigate to="/upload" />} />
                <Route path="/login" element={<Login onLogin={handleLogin}/>}/>
                <Route path="/signup" element={<Signup onSignup={handleSignup}/>}/>
                <Route path="/upload" element={<PrivateRoute user={user} Component={UploadDocument}/>}/>
                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
        </>
    );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
function PrivateRoute({ user, Component }) {
    return user ? <Component /> : <Navigate to="/login" />;
}
