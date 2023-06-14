/* eslint-disable @typescript-eslint/no-explicit-any */
export interface base {
  [key: string]: string;
}

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

export interface Columns {
  name: string;
  label: string;
  field: string;
  required?: boolean;
  align?: string;
  sortable?: boolean;
  sort?: (a: any, b: any, rowA: any, rowB: any) => number;
  sortOrder?: string;
  format?: (val: any, row: any) => any;
  style?: string;
  classes?: string;
  headerStyle?: string;
  headerClasses?: string;
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
  name?: string;
  description?: string;
  user_id?: string;
  status?: string;
  estimated_start_date?: string;
  estimated_end_date?: string;
  project_id_c?: string;
}

export interface TaskModel {
  id: string;
  description?: string;
  text: string;
  type?: string;
  unit?: string;
  duration?: number;
  start_date?: Date;
  end_date?: Date;
  date_finish?: string;
  date_start?: string;
  quantity?: number;
  incidence: number;
  parent?: string;
  color?: string;
  user_id?: string;
  status?: string;
  progress: number;
  task_number?: number;
  priority?: string;
  planification_id?: string;
  real_id?: string;
}
