import api from "@/config/api";
import type { 
    Admin,
    GetAdminsResponse,
    GetAdminResponse,
    PostAdminResponse,
    PutAdminResponse,
    DeleteAdminResponse,
    CreateAdminRequest,
    UpdateAdminRequest
} from "../interfaces/admin.interfaces";

export const useAdmins = () => {
    const URL = '/admins';

    const admin: Admin = {
        id: 0,
        email: '',
        name: '',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
    };

    const admins: Admin[] = [];

    async function getAdmins(){
        const response = await api.get<GetAdminsResponse>(URL);
        if(response.data){
            return response.data
        }
    }

    async function getAdminById(id: number){
        const response = await api.get<GetAdminResponse>(`${URL}/${id}`);
        if(response.data){
            return response.data
        }
    }

    async function postAdmin(data: CreateAdminRequest){
        const response = await api.post<PostAdminResponse>(URL, data);
        if(response.data){
            return response.data
        }
    }

    async function putAdmin(id: number, data: UpdateAdminRequest){
        const response = await api.put<PutAdminResponse>(`${URL}/${id}`, data);
        if(response.data){
            return response.data
        }
    }

    async function deleteAdmin(id: number){
        const response = await api.delete<DeleteAdminResponse>(`${URL}/${id}`);
        if(response.data){
            return response.data
        }
    }

    return {
        // Initial values
        admin,
        admins,
        // Functions
        getAdmins,
        getAdminById,
        postAdmin,
        putAdmin,
        deleteAdmin
    }
}