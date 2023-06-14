export interface GenericModel {
  [key: string]: string;
}

type DateBase = {
  from: string;
  to: string;
  operator: string;
  option: string;
};

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
  codigo: string;
  area: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}
