export interface Company {
  id: number;
  name: string;
  description?: string;
  cif: string;
  db_conexion: string;
  db_user: string;
  db_pwd: string;
  created_at: string | Date;
  updated_at: string | Date;
  deleted_at?: string | Date | null;
}

export interface GetCompaniesResponse {
  data: Company[];
}

export interface GetCompanyResponse {
  data: Company;
}

export interface PostCompanyResponse {
  data: Company;
}

export interface PutCompanyResponse {
  data: Company;
}

export interface DeleteCompanyResponse {
  message: string;
}

export interface CreateCompanyRequest {
  name: string;
  description?: string;
  cif: string;
  db_conexion: string;
  db_user: string;
  db_pwd: string;
}

export interface UpdateCompanyRequest extends Partial<CreateCompanyRequest> {}
