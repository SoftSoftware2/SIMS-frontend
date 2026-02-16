import api from "@/config/api";
import type { 
    Company,
    GetCompaniesResponse,
    GetCompanyResponse,
    PostCompanyResponse,
    PutCompanyResponse,
    DeleteCompanyResponse,
    CreateCompanyRequest,
    UpdateCompanyRequest
} from "../interfaces/company.interface";

export const useCompanies = () => {
    const URL = '/companies';

    const company: Company = {
        id: 0,
        name: '',
        description: '',
        cif: '',
        db_conexion: '',
        db_user: '',
        created_at: new Date(),
        updated_at: new Date(),
    };

    const companies: Company[] = [];

    async function getCompanies(){
        const response = await api.get<GetCompaniesResponse>(URL);
        if(response.data){
            // If the API returns { data: [...] } we return the array
            return Array.isArray(response.data) ? response.data : response.data.data;
        }
    }

    async function getCompanyById(id: number){
        const response = await api.get<GetCompanyResponse>(`${URL}/${id}`);
        if(response.data){
            return response.data
        }
    }

    async function postCompany(data: CreateCompanyRequest){
        const response = await api.post<PostCompanyResponse>(URL, data);
        if(response.data){
            return response.data
        }
    }

    async function putCompany(id: number, data: UpdateCompanyRequest){
        const response = await api.put<PutCompanyResponse>(`${URL}/${id}`, data);
        if(response.data){
            return response.data
        }
    }

    async function deleteCompany(id: number){
        const response = await api.delete<DeleteCompanyResponse>(`${URL}/${id}`);
        if(response.data){
            return response.data
        }
    }

    return {
        // Initial values
        company,
        companies,
        // Functions
        getCompanies,
        getCompanyById,
        postCompany,
        putCompany,
        deleteCompany
    }
}
