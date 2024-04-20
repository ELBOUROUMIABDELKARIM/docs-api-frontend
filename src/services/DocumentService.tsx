import axios from "axios";
import {DocumentResponse} from "../interfaces/document.ts";
import {userToken} from "./UserConnection.tsx";

const backendUrl = import.meta.env.VITE_API_URL;
const apiVersion = "api/documents";
export const getDocuments = async (): Promise<DocumentResponse[]> => {
    try {
        const response = await axios.get(`${backendUrl}/${apiVersion}`, userToken());
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to retrieve documents");
        }
    } catch (error) {
        throw new Error("Failed to retrieve documents");
    }
};

export const getDocumentsPage = async (page: number = 0, size: number = 10): Promise<any> => {
    try {
        const response = await axios.get(`${backendUrl}/${apiVersion}/page?page=${page}&size=${size}`, userToken());
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to retrieve documents");
        }
    } catch (error) {
        throw new Error("Failed to retrieve documents");
    }
};

export const uploadDocument = async (formData: FormData) => {
    const response = await axios.post(`${backendUrl}/${apiVersion}/upload`, formData, userToken());
    if (response.status === 200) {
        return response.data;
    }else{
        throw new Error("Failed to upload document");
    }
}

export const searchDocument = async (searchValue) => {
    try {
        const token = userToken(); // Get the token using userToken function
        const response = await axios.get(`${backendUrl}/${apiVersion}/search`, {
            params: { searchValue },
            headers: token.headers
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error("Error searching documents:", error);
        throw error;
    }
};

export const downloadDocument = async (documentId) => {
    try {
        const token = userToken(); // Get the token using userToken function
        const response = await axios.get(`${backendUrl}/${apiVersion}/download/${documentId}`,{
            headers: {
                ...token.headers,
                'Accept': 'application/octet-stream'
            },
            responseType: 'blob'
        })
        if (response.status === 200) {
            return response;
        }
    }
    catch (error) {
        console.error("Error searching documents:", error);
        throw error;
    }
}