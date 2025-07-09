import httpClient from "@/api/httpClient";
import { LoginFormData } from "@/interfaces";

export const login = async (data: LoginFormData) => {
    const response = await httpClient.post("/auth/login", data);
    return response.data;
}