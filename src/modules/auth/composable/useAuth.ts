import api from "@/config/api";
import type { AuthRequest, AuthResponse } from "../interface/auth.iterfaces";
import { useCookies } from "vue3-cookies";

export const useAuth = () => {
    const URL = '/login';
    const { cookies } = useCookies();

    async function login(credentials: AuthRequest){
        try {
            const response = await api.post<AuthResponse>(URL, credentials);
            const { token } = response.data
            if(token){
                cookies.set('token', token)
            }
            
            return response
            
        } catch (error) {
            // just for debuggin
            console.log('Login: ', error)
        }
    } 

    return {
        // Functions
        login
    }
}