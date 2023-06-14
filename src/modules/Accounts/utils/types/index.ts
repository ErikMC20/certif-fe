import {
  EmailModel,
  PhoneModel,
  PhoneContactModel,
  DirectionComponentModel,
} from '../../../../components/types/index';
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

export type AccountModel = 'Privada' | 'Empresa';

export type CardStatusModel = 'read' | 'edit';

export interface AccountForm {
  id?: string;
  tipocuenta_c: AccountModel;
  name: string;
  tipo_documento_c: string;
  nit_ci_c: string;
  account_type: string;
  regimen_tributario_c: string;
  industry: string;
  subindustry_c: string;
  billing_address_country: string;
  billing_address_state_list_c: string;
  billing_address_city: string;
  jjwg_maps_lat_c: number;
  jjwg_maps_lng_c: number;
  address_details_c: object;
  phones: PhoneFormModel[];
  celular_c: string;
  emails: EmailFormModel[];
  userGroup: UserGroupForm[];
}

export interface AccountFormBase {
  account_type_c: AccountModel;
  name: string;
  names_c: string;
  lastname_c: string;
  commercial_name: string;
  type_document_c: string;
  nit_ci_c: string;
  account_type: string;
  tax_regime: string;
  industry: string;
  subindustry_c: string;
  billing_address_country: string;
  billing_address_state_list_c: string;
  billing_address_city: string;
  jjwg_maps_lat_c: string;
  jjwg_maps_lng_c: string;
  address_details_c: string;
  phones: PhoneFormModel[];
  cellphone_c: string;
  emails: EmailFormModel[];
  userGroup: UserGroupForm[];
}

export interface AccountFormPrivate extends AccountForm {
  names_c?: string;
  lastname_c?: string;
}

export interface AccountFormCommercial extends AccountForm {
  nombre_comercial_c: string;
}

export interface FullForm extends AccountFormCommercial, AccountFormPrivate {}

export interface LabelModel {
  title: string;
  value: string | OptionBase[] | undefined;
}
[];

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
  billing_address_country: OptionWithChildren[];
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

// Account Model General
export interface DetailAccountModel {
  id?: string;
  account_type: string;
  billing_address_city: string;
  billing_address_country: string;
  billing_address_state: string;
  billing_address_state_list_c: string;
  shipping_address_state: string;
  shipping_address_state_list_c: string;
  industry: string;
  name: string;
  names_c?: string;
  lastname_c?: string;
  nombre_comercial_c?: string;
  tipo_documento_c: string;
  nit_ci_c: string;
  regimen_tributario_c: string;
  subindustry_c: string;
  tipocuenta_c: string;
  cod_aio?: string;
  created_by?: string;
  modified_user_id?: string;
  idcuentasap_c?: string;
  assigned_user_id?: string;
  celular_c?: string;
}
export interface DirectionAccountModel {
  billing_address_street: string;
  shipping_address_street: string;
  shipping_address_city: string;
  shipping_address_state: string;
  shipping_address_country: string;
  address_street_generated_c: string;
  jjwg_maps_lat_c: number;
  jjwg_maps_lng_c: number;
  jjwg_maps_address_c: string;
}

export interface DirectionAccountComponentModel {
  address_street_generated_c: string;
  latitude: number;
  longitude: number;
}
export interface EmailAccountModel {
  id?: string;
  primary_address: boolean;
  email_address: string;
}
export interface PhoneAccountModel {
  id?: string;
  principal: string;
  whatsapp: string;
  phone: string;
  country_code: string;
  country: string;
}
export interface AssignedUserAccountModel {
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
export interface CommentAccountModel {
  id?: string;
  module: string;
  idmodule: string;
  description: string;
  relevance: string;
  visualizacion_c: string;
  modulecoments: string;
  id_user?: string;
}
export interface RelatedAccountModel {
  idmodulo: string;
  relatedmodule: string;
  name?: string;
}

export interface AccountGeneralModel {
  info_account: {
    detail_account: DetailAccountModel;
    direction_account: DirectionAccountModel;
  };
  phone_email_account: {
    emails: EmailModel[];
    phones: PhoneModel[];
    celular_c: string;
    celular_cd_c: string;
    celular_wp_c: string;
    phone_office: string;
    phone_office_cd_c: string;
    phone_office_wp_c: string;
  };
  assigned_users: AssignedUserAccountModel[];
  comments: CommentAccountModel;
  related_accounts?: RelatedAccountModel[];
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
  visible: boolean;
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

export interface userModel {
  assigneed_user_id: string;
  principal: string;
  iddivision_c?: string;
  idamercado_c?: string;
  idgrupocliente_c?: string;
  idsector?: string;
  idregional_c?: string;
  idcanalvta_c?: string;
}

export type LegacyPhoneModel = {
  code: string;
  phone: string;
  whatsapp: string;
};

export type AccountDataModel = {
  infoData: DetailAccountModel;
  mainPhone: PhoneContactModel;
  officePhone: PhoneContactModel;
  emails: EmailModel[];
  phones: PhoneModel[];
  directionData: DirectionComponentModel;
};

//* Generated Code Response Get All
// Generated by https://quicktype.io

export interface AccountReadModel {
  resp: Resp;
}

export interface Resp {
  info_account: InfoAccount;
  phone_email_account: PhoneEmailAccount;
  comments: Comment[];
}

export interface Comment {
  fecha_creacion: string;
  descripcion: string;
  idcreado_por: string;
  creado_por: string;
  id: string;
  flag: string;
}

export interface InfoAccount {
  detail_account: { [key: string]: string };
  direction_account: DirectionAccount;
}

export interface DirectionAccount {
  billing_address_street: string;
  shipping_address_street: string;
  shipping_address_city: string;
  shipping_address_state: string;
  shipping_address_country: string;
  address_street_generated_c: string;
  jjwg_maps_lat_c: number;
  jjwg_maps_lng_c: number;
  jjwg_maps_address_c: string;
}

export interface PhoneEmailAccount {
  emails: Email[];
  phones: Phone[];
  celular_c: string;
  phone_office: string;
  phone_fax: string;
  phone_office_wp_c: string;
  phone_office_cd_c: string;
  celular_wp_c: string;
  celular_cd_c: string;
}

export interface Email {
  id: string;
  email_address: string;
  primary_item: boolean;
}

export interface Phone {
  id: string;
  phone: string;
  country: string;
  country_code: string;
  whatsapp: '0' | '1';
  primary_item: '0' | '1';
  description: string;
}

export interface FilterResponseModel {
  data: Datum[];
}

export interface Datum {
  id: string;
  nombre: string;
  ci: string;
  telefono: string;
  correo: null;
  fecha_nacimiento: null;
  genero: string;
  principal: boolean;
  padre: boolean;
  cuenta: null;
  id_cuenta: null;
}

export type AccountDataDraft = {
  infoDataLocal: DetailAccountModel;
  mainPhone: LegacyPhoneModel;
  officePhone: LegacyPhoneModel;
  phonesModel: PhoneModel[];
  emailsModel: EmailModel[];
  direction: DirectionComponentModel;
  directionCRM3: string;
  assignedUserId: string;
  moduleOrigin?: string;
  idModuleOrigin?: string;
};

// Generated by https://quicktype.io

export interface AccountsFiltered {
  data: { [key: string]: null | string }[];
}

export interface RepeatedNITCI {
  departamento: string;
  id: string;
  name: string;
  nit_ci: string;
  tipo_cuenta: string;
}
// Generated by https://quicktype.io

export interface RepeatedNITCIResponse {
  data: RepeatedNITCIData[];
}

export interface RepeatedNITCIData {
  nit_ci: string;
  name: string;
  id: string;
  tipo_cuenta: string;
  departamento: string;
}


export interface UserCRM {
  id:                    string;
  nombres:               string;
  apellidos:             string;
  iddivision:            string;
  division:              string;
  idamercado:            string;
  amercado:              string;
  idregional:            string;
  regional:              string;
  rol:                   string;
  estado:                string;
  activo:                string;
  codigo_empleado:       string;
  codigo_vendedor:       string;
  email:                 string;
  id_reponsable:         null;
  nombres_responsable:   null;
  apellidos_responsable: null;
  user_rol:              UserRol;
}

export interface UserRol {
  id_rol:      string;
  name:        string;
  description: null;
  main:        number;
}

export interface rolesAccounts  {
  module:       string;
  iduser:       string;
  iddivision_c: string;
  division:     string;
  amercado_c:   string;
  amercado:     string;
  view_detail:  ViewDetail;
}

export interface ViewDetail {
  subtab:               Subtab[];
  panel_subtab:         PanelSubtab[];
  panel_assigned_users: PanelAssignedUsers;
}

export interface PanelAssignedUsers {
  enabled: boolean;
  search:  number;
}

export interface PanelSubtab {
  label:   string;
  enabled: boolean;
}

export interface Subtab {
  label:   string;
  module:  string;
  enabled: boolean;
}
