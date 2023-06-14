import { EmailModel, PhoneModel } from '../../../../components/types/index';
export type StatusCard = 'read' | 'edit';

interface PhoneFormModel {
  code: string;
  number: string;
  whatsapp: number;
  type_number: string;
}

interface EmailFormModel {
  email_address_id: string;
  primary_address: number;
  bean_module: string;
}

interface UserGroupForm {
  iduser: string;
  bean_module: string;
  primary_user: number;
  idmercado_c: string;
}

export type CardStatusModel = 'read' | 'edit';

export interface LabelModel {
  title: string;
  value: any;
}

export interface FieldsModels {
  class?: string;
  component: string;
  childrenName?: string;
  childrenFrom?: string;
  clearable?: boolean;
  dense?: boolean;
  disable?: boolean;
  extraField?: boolean;
  field: string;
  id: string;
  isValid?: boolean;
  label: string;
  loading?: boolean;
  outlined?: boolean;
  rules?: string[];
  options?: object[] | string[];
  optionsdense?: boolean;
  type?: string;
}

//export interface Fields

// using in Accounts/pages/viewList

export interface OptionBase {
  [key: string]: string;
}

export type Option = string | OptionBase[];
export interface OptionsExtended {
  [key: string]: Option;
}

export interface OptionWithChildren {
  [key: string]: string | OptionBase[];
}

export interface OptionAccountInfo {
  tipo_documento_c: OptionBase[];
  account_type: OptionBase[];
  regimen_tributario_c: OptionBase[];
  industry: OptionWithChildren[];
  billing_address_country?: OptionWithChildren[];
}
export interface SelectOptionsModel {
  infoClient: OptionAccountInfo;
  infoDirectionsAccount: DirectionValueModel[];
  infoCodeCountry: CountryOptions[];
}
export interface OptionListModel {
  [key: string]: Option | OptionsExtended[];
}
export interface PayloadModels {
  [key: string]: string | number | object | null;
}

// end using in Accounts/pages/viewList

// Direction Contacts
export interface DirectionValueModel {
  id: string;
  label: string;
  cod_dir: string;
  value?: string;
}
export interface CountryOptions {
  _id: string;
  id: string;
  name_en: string;
  name_es: string;
  code: string;
  type: string;
}
export interface CountryContactsBaseModel {
  phone: string;
  number?: string;
  country_code: string;
  country: string;
}
export interface CountryContact extends CountryContactsBaseModel {
  id?: string;
  principal: string;
  whatsapp: string;
}
export interface CountryContactsLocal extends CountryContactsBaseModel {
  id: string;
  created: boolean;
  principal: boolean;
  whatsapp: boolean;
}
// End direction contacts

// Email Contacts
export interface EmailAccountBaseModel {
  email_address: string;
  email?: string;
}

export interface EmailAccountExternalModel extends EmailAccountBaseModel {
  id?: string;
  primary_address: boolean;
}

export interface EmailAccountLocalModel extends EmailAccountBaseModel {
  id?: string;
  primary_address: boolean;
  isLocal: boolean;
}
// End email contacts

// Contact Model General
export interface DetailContactModel {
  id?: string;
  assigned_user_id?: string;
  account_name?: string;
  account_id?: string;
  birthdate?: string;
  ci_c: string;
  created_by?: string;
  first_name: string;
  last_name?: string;
  modified_user_id?: string;
  name?: string;
  alt_address_state_list_c: string;
  alt_address_state: string;
  primary_address_country: string;
  primary_address_state?: string;
  primary_address_city: string;
  salutation?: string;
  celular_c?: string;
  estado_civil_c: string;
  genero_c: string;
  industry_c: string;
  principal_c: 0 | 1;
  phone_fax?: string;
  phone_mobile?: string;
  primary_address_state_list_c: string;
  regimen_tributario_c?: string;
  subindustry_c: string;
  tipo_documento_c?: string;
  description?: string;
  title?: string;
  is_parents_c?: 0 | 1 | null;
  inherited?: boolean;
}
export interface DirectionContactModel {
  primary_address_street?: string;
  address_street_generated_c: string;
  jjwg_maps_lat_c: number;
  jjwg_maps_lng_c: number;
  jjwg_maps_address_c: string;
}

export interface DirectionContactComponentModel {
  address_street_generated_c: string;
  latitude: number;
  longitude: number;
}
export interface EmailContactModel {
  id?: string;
  primary_item: boolean;
  email_address: string;
}
export interface PhoneContactModel {
  id?: string;
  primary_item: string;
  whatsapp: string;
  phone: string;
  country_code: string;
  country: string;
}
export interface AssignedUserContactModel {
  id?: string;
  assigned_user_id: string;
  principal: string;
  iddivision_c: string;
  idamercado_c?: string;
  idgrupocliente_c: string;
  idsector_c: string;
  idregional_c: string;
  idcanalvta_c: string;
}
export interface CommentContactModel {
  id?: string;
  module: string;
  idmodule?: string;
  description: string;
  relevance: string;
  visualizacion_c: string;
  modulecoments: string;
  id_user?: string;
}
export interface RelatedContactModel {
  idmodulo: string;
  relatedmodule: string;
  name?: string;
}

export interface ContactGeneralModel {
  info_contact: {
    detail_contact: DetailContactModel;
    direction_contact: DirectionContactModel;
  };
  phone_email_contact: {
    emails: EmailModel[];
    phones: PhoneModel[];
  };
  assigned_users?: AssignedUserContactModel[];
  comments: CommentContactModel;
  related_contact?: RelatedContactModel[];
}
// End Account Model General

// Table dialog model
export interface RowTableModel {
  id: string;
  modulo: string;
  module: string;
  nombre: string;
  celular: string;
  telefono: string;
  email: string;
  idLead?: null;
  fcreacion?: null;
  nameLead?: null;
  estadoLead?: null;
  idCampania?: null;
  nameCampania?: null;
  asignado?: null;
  nro_principal?: string;
  whatsapp: '1' | '0';
  actions?: string;
}

export interface RowTableCINITModel {
  nit_ci: string;
  name: string;
  id: string;
  tipo_cuenta: string;
}

// End Table Dialog Model
export interface DynamicObjectModel {
  [key: string]: string;
}

export interface NestedDynamicModel {
  [key: string]: string | DynamicObjectModel[];
}

export interface OptionContactInfoModel {
  tipo_documento_c: DynamicObjectModel[];
  account_type: DynamicObjectModel[];
  regimen_tributario_c: DynamicObjectModel[];
  industry: NestedDynamicModel[];
  billing_address_country: NestedDynamicModel[];
}

export interface FormFilterAdvanced {
  input: string;
  label: string;
  clearable: boolean;
  field: string;
  visible: boolean;
  options?: { label: string; value: number }[];
  use_input?: boolean;
  multiple?: boolean;
  use_chips?: boolean;
  debounce?: number;
  option_value?: string;
  option_label?: string;
  options_dense?: boolean;
  selected_class?: string;
  emit_value?: boolean;
  map_options?: boolean;
  filter_function?: (
    val: string,
    update: (callback: () => void) => void
  ) => void;
  with_avatar?: boolean;
  type?: string;
}

export interface ColumnTable {
  name: string;
  label: string;
  align: string;
  field: string;
  sortable: boolean;
}

export interface RowTable {
  id: string;
  name: string;
  label: string;
}

export interface PaginationTable {
  sortBy: string;
  descending: boolean;
  page: number;
  rowsPerPage: number;
  rowsNumber?: number;
}

export interface onrequest {
  pagination: PaginationTable;
  filter: {
    type: object;
    easyFilter: string;
  };
  //getCellValue?:(col:object, row:object)=>void
  //getCellValue: (col: any, row: any) => any;

  // pagination: { sortBy: string; descending: boolean; page: number; rowsPerPage: number; };
  // filter: (rows: readonly any[], terms: any, cols?: readonly any[] | undefined, getCellValue?: ((col: any, row: any) => any) | undefined) => readonly any[];
  // getCellValue: (col: any, row: any) => any;
}

//* Generated
// CreationModel
export interface ContactCreationModel {
  info_contact: InfoContact;
  phone_email_contact: PhoneEmailContact;
  comments: Comments;
}

export interface Comments {
  module: string;
  idmodule: null;
  visualizacion_c: string;
  description: string;
  relevance: string;
  modulecoments: string;
  id_user: string;
}

export interface InfoContact {
  detail_contact: DetailContact;
  direction_contact: DirectionContact;
}

export interface DetailContact {
  industry_c: string;
  subindustry_c: string;
  principal_c: number;
  is_parents_c: number;
  salutation: string;
  genero_c: string;
  birthdate: string;
  first_name: string;
  last_name: string;
  ci_c: string;
  primary_address_country: string;
  primary_address_state_list_c: string;
  estado_civil_c: string;
  primary_address_city: string;
  primary_address_state: string;
  modified_user_id: string;
  assigned_user_id: string;
  phone_mobile: string;
  phone_mobile_wp_c: string;
  phone_mobile_cd_c: string;
  phone_work: string;
  phone_work_wp_c: string;
  phone_work_cd_c: string;
  account_id?: string;
  inherited?: boolean;
}

export interface DirectionContact {
  address_street_generated_c: string;
  primary_address_street: string;
  jjwg_maps_lat_c: number;
  jjwg_maps_lng_c: number;
  jjwg_maps_address_c: string;
}

export interface PhoneEmailContact {
  phones: Phone[];
  emails: Email[];
}

export interface Email {
  id: string;
  email_address: string;
  email_address_caps: string;
  primary_item: string;
}

export interface Phone {
  id: string;
  phone: string;
  country: string;
  country_code: string;
  whatsapp: string;
  primary_item: string;
  description: string;
}
// End creation model
