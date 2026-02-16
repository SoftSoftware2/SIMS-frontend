<<<<<<< HEAD
export interface Admin {
    id:         number;
    email:      string;
    name:       string;
    created_at: Date;
    updated_at: Date;
    deleted_at: null;
=======
export interface Admin {
    id:         number;
    email:      string;
    name:       string;
    created_at: Date;
    updated_at: Date;
    deleted_at: null;
}

export interface GetAdminsResponse{
    data: Admin[];
}

export interface GetAdminResponse{
    data: Admin;
}
export interface PostAdminResponse{
    data: Admin;
}

export interface PutAdminResponse{
    message: string;
    data:    Admin;
}

export interface DeleteAdminResponse{
    message: string;
}

export interface CreateAdminRequest{
    email: string;
    name: string;
    password: string;
}

export interface UpdateAdminRequest{
    email?: string;
    name?: string;
    password?: string;
>>>>>>> ce2c756203c1f21dc64eddaf0ce60e5c439b2cfb
}