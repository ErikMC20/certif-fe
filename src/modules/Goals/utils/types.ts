export interface GenericModel {
  [key: string]: string;
}

type DateBase = {
  from: string;
  to: string;
  operator: string;
  option: string;
};

export interface GoalModel {
  nombre_obetivo: string;
  nombre_tarea: string;
  fecha_inicio: string;
  fecha_fin: string;
  version_c_objetivo: string;
  nombre_instalacion: string;
  unidad_medida_c: string;
  cantidad_c: number;
  id_tarea: string;
  id_instalacion: string;
  id_planificacion: string;
  cantidad: string;
  fecha_inicio_c: string;
  fecha_fin_c: string;
  version_c_planificacion: string;
  user_id: string;
}

export interface Filter {
  account?: string;
  name?: string;
  pst_code?: string;
  aio_code?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  country?: string;
  state?: string;
  city?: string;
  created_by?: string[];
  modified_by?: string[];
  assigned_to?: string[];
  creation_date?: DateBase;
}
export interface Params {
  page: number;
  rowsPerPage: number;
  sortBy: string;
  order: string;
  filter: Filter;
}

export interface Pagination {
  page: number;
  sortBy: string;
  descending: boolean;
  rowsPerPage: number;
  rowsNumber: number;
}

export interface BasicInformation {
  id?: string;
  code_c?: string;
  name?: string;
  description?: string;
  idregion_c?: string;
  pais_c?: string;
  iddivision_c?: string;
  idamercado_c?: string;
  user_id?: string;
  project_id?: string;
  supervisors?: string[];
  comments?: string[];
}
