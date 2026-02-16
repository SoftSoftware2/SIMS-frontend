export interface Company {
  id: number;
  name: string;
  description?: string;
  cif: string;
  db_conexion: string;
  db_user: string;
  created_at?: string;
  updated_at?: string;
}
