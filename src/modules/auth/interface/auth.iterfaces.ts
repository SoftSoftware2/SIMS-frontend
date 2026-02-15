import type { Admin } from '@/modules/admin/interfaces/admin.interfaces';

export interface AuthRequest{
    email:       string
    password:    string
}


export interface AuthResponse {
    message: string;
    token:   string;
    admin:   Admin;
}
