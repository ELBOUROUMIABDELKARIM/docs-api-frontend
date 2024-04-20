import axios from "axios";
import {UserLoginRequest, UserSignUpRequest} from "../interfaces/user.ts";

const backendUrl = import.meta.env.VITE_API_URL;
const apiVersion = "api/auth";


export const userToken = () =>{
    const token = localStorage.getItem('token');

    return {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    }
}

export const loginUser = async (user: UserLoginRequest): Promise<string> => {
    const response = await axios.post(`${backendUrl}/${apiVersion}/login`, user);
    if (response.status === 200) {
        return response.data.token;
    } else {
        throw new Error("Invalid username or password");
    }
};

export const signupUser = async (user: UserSignUpRequest): Promise<string> => {
    const response = await axios.post(`${backendUrl}/${apiVersion}/signup`, user);
    if (response.status >= 200 && response.status <= 300) {
        return response.data;
    } else {
        throw new Error("Signup failed. Please try again later.");
    }
};

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    if (token) {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = tokenData.exp * 1000;
        if (Date.now() < expirationTime) {
            return true
        }
    }
    return false
}

export const logout = () => {
    localStorage.removeItem("token");
}

export const getConnectedUser = (): string | null => {
    const token = localStorage.getItem('token');
    if (token) {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        if(tokenData.sub) return tokenData.sub
    }
    logout();
    return null;
}
