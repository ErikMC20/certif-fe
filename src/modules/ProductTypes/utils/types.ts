/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PaginationTable {
  sortBy: string;
  descending: boolean;
  page: number;
  rowsPerPage: number;
  rowsNumber?: number;
}
export interface base {
  [key: string]: string;
}

export interface Costo {
  porcentaje: number;
  contrato: number;
  costo_total: number;
  costo_real: number;
}

export interface Tiempo {
  dias: number;
  porcentaje: number;
  transcurrido: number;
  total: number;
}

export interface Alcance {
  avance: number;
  completada: number;
  total: number;
}
export interface IndicatorsModel {
  costo: Costo;
  tiempo: Tiempo;
  alcance: Alcance;
}

export interface Columns {
  name: string;
  label: string;
  field: string | ((row: any) => any);
  required?: boolean;
  align?: string;
  sortable?: boolean;
  sort?: (a: any, b: any, rowA: any, rowB: any) => number;
  sortOrder?: string;
  format?: (val: any, row: any) => any;
  style?: string | ((row: any) => string);
  classes?: string | ((row: any) => string);
  headerStyle?: string;
  headerClasses?: string;
}

type DateBase = {
  from: string;
  to: string;
  operator: string;
  option: string;
};

export interface InputBase {
  input: string;
  label: string;
  clearable?: boolean;
  field: string;
  visible: boolean;
}

export interface FormInputs extends InputBase {
  with_avatar?: boolean;
  option_value?: string;
  option_label?: string;
  options_dense?: boolean;
  selected_class?: string;
  use_chips?: boolean;
  multiple?: boolean;
  options?: base[];
  use_input?: boolean;
  debounce?: number;
  emit_value?: boolean;
  map_options?: boolean;
  filter_function?: (
    val: string,
    update: (callback: () => void) => void
  ) => void;
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
  numeropst_c?: string;
  codigoaio_c?: string;
  name?: string;
  description?: string;
  ubicacion_c?: string;
  estimated_start_date?: string;
  estimated_end_date?: string;
  real_start_date_c?: string;
  real_end_date_c?: string;
  account_id_c?: string;
  contact_id_c?: string;
  pais_c?: string;
  priority?: string;
  status?: string;
  override_busines_hours?: number;
  numero_licitacion_c?: string;
  tipo_proyecto_c?: string;
  sync_projectserver_c: number;
  idamercado_c?: string;
  iddivision_c: string;
  idgrupocliente_c?: string;
  idregional_c?: string;

  // estado_proyecto_c?: string;
}

export interface ClientInformation {
  account_id_c: string;
  contact_id_c?: string;
  account_c: string;
  contact_c?: string;
}
export interface UpdateMassiveModel {
  pais_c?: string;
  priority?: string;
  status?: string;
}

export interface FinancialInformation {
  monto_contrato_c: number;
  monto_costo_c: number;
  monto_utilidad_c: number;
  diferencia: number;
}

export interface ReponsibleUserModel {
  user_name: string;
  id: string;
  division: string;
  cargo: string;
  avatar: string;
  a_mercado: string;
  idamercado_c: string;
  iddivision_c: string;
  idregional_c?: string;
  idgrupocliente_c?: string;
  principal: string;
  assigned_user_id: string;
  idsector_c?: string;
  idcanalvta_c?: string;
  employee_status?: string;
  fecha_modificacion?: string;
  hora_modificacion?: string;
  rol?: string;
  status?: string;
  res_id?: string;
}

export interface Columns {
  name: string;
  label: string;
  field: string | ((row: any) => any);
  required?: boolean;
  align?: string;
  sortable?: boolean;
  headerStyle?: string;
  headerClasses?: string;
}

export interface ClientData {
  account: [];
  contact: [];
  oportunities: [];
}

export interface ProductType {
  id?: string;
  name: string;
  description?: string;
  iddivision_c: string;
  idamercado_c: string;
  idregional_c: string;
  idgrupocliente_c: string;
  //requerimientos: ProductRequirement[];
  //requerimientos_eliminados?: string[];
}
