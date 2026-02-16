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