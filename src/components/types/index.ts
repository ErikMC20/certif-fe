export type StatusCard = 'read' | 'edit';

export type CardStatusModel = 'read' | 'edit';

export interface LabelModel {
  title: string;
  value: any;
}

export interface AssignedUserModel {
  a_mercado: string;
  assigned_user_id: string;
  avatar: string;
  cargo: string;
  division: string;
  email: string;
  employee_status?: string;
  fecha_modificacion?: string;
  hora_modificacion?: string;
  id: string;
  idamercado_c: string;
  idcanalvta_c?: string;
  iddivision_c: string;
  idgrupocliente_c?: string;
  idregional_c?: string;
  idsector_c?: string;
  principal: string;
  user_name: string;
}

export interface ReponsibleUserModel extends AssignedUserModel {
  rol: string;
  status: string;
  res_id: string;
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

export interface OptionInfo {
  tipo_documento_c: OptionBase[];
  account_type: OptionBase[];
  regimen_tributario_c: OptionBase[];
  industry: OptionWithChildren[];
  billing_address_country?: OptionWithChildren[];
}
export interface SelectOptionsModel {
  infoClient: OptionInfo;
  infoDirections: DirectionValueModel[];
  infoCodeCountry: CountryOptions[];
}
export interface OptionListModel {
  [key: string]: Option | OptionsExtended[];
}
export interface PayloadModels {
  [key: string]: string | number | object | null;
}

// Direction
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
export interface CountryBaseModel {
  phone: string;
  number?: string; // auxiliar phone
  country_code: string;
  country: string;
  code?: string; // auxiliar country
  description?: string;
}
export interface Country extends CountryBaseModel {
  id?: string;
  primary_item: string;
  principal?: string;
  whatsapp: string;
}
export interface CountryLocal extends CountryBaseModel {
  id: string;
  created: boolean;
  principal: boolean;
  whatsapp: boolean;
}
// End direction contacts

// Email
export interface EmailBaseModel {
  email_address: string;
  email?: string;
}

export interface EmailExternalModel extends EmailBaseModel {
  id?: string;
  primary_item: boolean;
}

export interface EmailLocalModel extends EmailBaseModel {
  id?: string;
  primary_address: boolean;
  isLocal: boolean;
}
export interface DirectionModel {
  primary_address_street: string;
  address_street_generated_c: string;
  jjwg_maps_lat_c: number;
  jjwg_maps_lng_c: number;
  jjwg_maps_address_c: string;
}

export interface DirectionComponentModel {
  address_street_generated_c: string;
  latitude: number;
  longitude: number;
}
export interface EmailModel {
  id?: string;
  primary_item: boolean;
  email_address: string;
  email_address_caps?: string;
  inherited?: boolean;
}
export interface PhoneModel {
  id?: string;
  phone: string;
  country: string;
  country_code: string;
  whatsapp: '0' | '1';
  primary_item: '0' | '1';
  description: string;
  inherited?: boolean;
}

export interface CommentModel {
  id?: string;
  module: string;
  idmodule: string;
  description: string;
  relevance: string;
  visualizacion_c: string;
  modulecoments: string;
  id_user?: string;
}
export interface RelatedModel {
  idmodulo: string;
  relatedmodule: string;
  name?: string;
}

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
  departamento?: string;
  nit_ci: string;
  name: string;
  id: string;
  tipo_cuenta: string;
}
export interface RowTableCINITContactModel {
  ci: string;
  name: string;
  id: string;
  departamento: string;
}

// End Table Dialog Model
export interface DynamicObjectModel {
  [key: string]: string;
}

export interface NestedDynamicModel {
  [key: string]: string | DynamicObjectModel[];
}

export interface OptionInfoModel {
  tipo_documento_c?: DynamicObjectModel[];
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

export interface RepeatedPhonesModel {
  id: string;
  modulo: string;
  nombre: string;
  celular: string;
  telefono: string;
  email: string;
  idLead: string;
  fcreacion: string;
  nameLead: string;
  estadoLead: string;
  nameCampania: string;
  asignado: string;
  nro_principal: string;
  whatsapp: string;
}

export type DescriptionModel = {
  id: string;
  label: string;
  cod_tel: string;
};

export interface PaisListModel {
  id: string;
  cod_pais: string;
  label: string;
  regiones: StatePaisListModel[];
}

export interface StatePaisListModel {
  cod_region: string;
  label: string;
}

export interface SalutationModel {
  id: string;
  label: string;
  value: string;
}

export type phonesUpdateModel = {
  newPhones: PhoneModel[] | undefined;
  currentPhones: PhoneModel[] | undefined;
  deletedPhones: PhoneModel[] | undefined;
  activePhones: PhoneModel[] | undefined;
};

export type emailsUpdateModel = {
  newEmails: EmailModel[] | undefined;
  currentEmails: EmailModel[] | undefined;
  deletedEmails: EmailModel[] | undefined;
};

export type ContactRequestModel = {
  idUser: string;
  emails: EmailModel[];
  phones: PhoneModel[];
};

//* Activities
export type ModuleActivity =
  | 'prospects'
  | 'accounts'
  | 'Leads'
  | 'users'
  | 'ProjectTask'
  | 'HANO_Lead';
export interface MeetingModel {
  meeting: Meeting;
  user_invitees: string[];
  contact_invitees: string[];
  lead_invitees: string[];
  prospect_invitees: string[];
  reminders_data: RemindersDatum[];
  attributes_comment?: { [key: string]: string };
}

export type InfoDataMeetingModel = {
  contacts?: string;
  name: string;
  modified_user_id: string;
  created_by: string;
  description: string;
  assigned_user_id: string;
  location: string;
  duration_hours: string | number;
  duration_minutes: string | number;
  date_start: string;
  parent_type: ModuleActivity;
  status: string;
  parent_id: string;
};

export interface Meeting {
  type: string;
  attributes: InfoDataMeetingModel;
}

export interface RemindersDatum {
  idx: number;
  id: string;
  popup: boolean;
  email: boolean;
  timer_popup: string;
  timer_email: string;
  invitees: Invitee[];
}

export interface Invitee {
  id: string;
  module: string;
  module_id: string;
  value?: string;
}

// Generated by https://quicktype.io

export interface RecordsModule {
  status: number;
  statusText: string;
  data: Data;
}

export interface Data {
  meta: Meta;
  data: Datum[];
  links: Links;
}

export interface Datum {
  type: Type;
  id: string;
  attributes: Attributes;
}

export interface Attributes {
  name: string;
}

export enum Type {
  User = 'User',
}

export interface Links {
  first: string;
  prev: string;
  next: string;
  last: string;
}

export interface Meta {
  'total-pages': number;
  'records-on-this-page': number;
}

//* Record Per module
export interface RecordInfoModel {
  status: number;
  statusText: string;
  data: RecordInfoModelData;
}

export interface RecordInfoModelData {
  data: DataData;
}

export interface DataData {
  type: string;
  id: string;
  attributes: { [key: string]: string | number };
  relationships: { [key: string]: Relationship };
}

export interface Relationship {
  links: LinksRelation;
}

export interface LinksRelation {
  related: string;
}

// Generated by https://quicktype.io

export interface GuestsRecordResponse {
  status: string;
  statusText: string;
  search_users: SearchUser[];
}

export interface SearchUser {
  module?: string;
  id?: string;
  date_entered?: string;
  fullname?: string;
  email_address?: string;
  phone?: string;
  email?: string; // "0" : "1"
  whatsapp?: string; // "0" : "1"
  title?: string;
  primary_item?: boolean;
}

export enum TableName {
  Contacts = 'contacts',
  Leads = 'leads',
}

// Generated by https://quicktype.io

export interface UserSuiteModel {
  status: number;
  statusText: string;
  data: UsersData;
}

export interface UsersData {
  type: string;
  id: string;
  attributes: UsersAttributes;
  relationships: UsersRelationships;
}

export interface UsersAttributes {
  user_name: string;
  user_hash: string;
  system_generated_password: number;
  pwd_last_changed: string;
  authenticate_id: string;
  sugar_login: number;
  first_name: string;
  last_name: string;
  full_name: string;
  name: string;
  is_admin: number;
  external_auth_only: number;
  receive_notifications: number;
  description: string;
  date_entered: string;
  date_modified: string;
  modified_user_id: string;
  modified_by_name: string;
  created_by: string;
  created_by_name: string;
  title: string;
  photo: string;
  department: string;
  phone_home: string;
  phone_mobile: string;
  phone_work: string;
  phone_other: string;
  phone_fax: string;
  status: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_country: string;
  address_postalcode: string;
  UserType: string;
  deleted: number;
  portal_only: number;
  show_on_employees: number;
  employee_status: string;
  messenger_id: string;
  messenger_type: string;
  calls: string;
  meetings: string;
  contacts_sync: string;
  reports_to_id: string;
  reports_to_name: string;
  reports_to_link: string;
  reportees: string;
  email1: string;
  email_addresses: string;
  email_addresses_primary: string;
  email_link_type: string;
  editor_type: string;
  aclroles: string;
  is_group: number;
  c_accept_status_fields: string;
  m_accept_status_fields: string;
  accept_status_id: string;
  accept_status_name: string;
  prospect_lists: string;
  emails_users: string;
  eapm: string;
  oauth_tokens: string;
  project_resource: string;
  project_users_1: string;
  am_projecttemplates_resources: string;
  am_projecttemplates_users_1: string;
  SecurityGroups: string;
  securitygroup_noninher_fields: string;
  securitygroup_noninherit_id: string;
  securitygroup_noninheritable: string;
  securitygroup_primary_group: string;
  factor_auth: boolean;
  factor_auth_interface: string;
  account_id_c: string;
  activo_whatsapp_c: boolean;
  areas_atencion_c: string;
  aspose_code_c: string;
  cliente_c: string;
  contact_id_c: string;
  contacto_c: string;
  delegated_c: string;
  descripcion_fuera_oficina_c: string;
  estado_fuera_oficina_c: boolean;
  estado_whatsapp_c: boolean;
  fecha_fin_c: string;
  fecha_inicio_c: string;
  firma_digitalizada_c: string;
  fp_event_locations_id_c: string;
  idamercado_c: string;
  iddivision_c: string;
  idempleado_c: string;
  idgrupocliente_c: string;
  idregional_c: string;
  idvendedor_c: string;
  iniciales_c: string;
  is_digital_c: boolean;
  linkedin_c: string;
  marcas_venta_c: string;
  nombre_mostrar_c: string;
  office365_c: number;
  rol_whatsapp_c: string;
  sync_calendar_c: boolean;
  sync_hbm_c: boolean;
  ubicacion_trabajo_c: string;
  user_id_c: string;
  uso_firma_cotizacion_c: boolean;
}

export interface UsersRelationships {
  AM_ProjectTemplates: AmProjectTemplates;
  EmailAddress: AmProjectTemplates;
  Emails: AmProjectTemplates;
  OAuthTokens: AmProjectTemplates;
  Project: AmProjectTemplates;
  ProspectLists: AmProjectTemplates;
  SecurityGroups: AmProjectTemplates;
}

export interface AmProjectTemplates {
  links: Links;
}

export interface Links {
  related: string;
}

// Generated by https://quicktype.io

export interface AssignedUsersModel {
  status: string;
  statusText: string;
  data: DataUsersAssigned;
}

export interface DataUsersAssigned {
  type: string;
  id: string;
  attributes: { [key: string]: string }[];
}

export interface RecordOptionsModel {
  module?: string;
  user_iddivision?: string;
  user_idamercado?: string;
  user_idgrupocliente?: string;
}

//*Meetings Response Info
export interface MeetingInfoModel {
  status: number;
  statusText: string;
  data: DataResponse;
}

export interface DataResponse {
  code: number;
  meeting: MeetingResponse;
  user_invitees: UserInviteeResponse[];
  contact_invitees: ContactInviteeResponse[];
  lead_invitees: LeadInviteeResponse[];
  prospect_invitees: ProspectInviteeResponse[];
  reminders_data: RemindersDatumResponse[];
}

export interface ContactInviteeResponse {
  type: string;
  id: string;
  attributes: ContactInviteeAttributes;
}

export interface ContactInviteeAttributes {
  name: string;
  date_entered: string;
  date_modified: string;
  modified_user_id: string;
  modified_by_name: string;
  created_by: string;
  created_by_name: string;
  description: string;
  deleted: number;
  created_by_link: string;
  modified_user_link: string;
  assigned_user_id: string;
  assigned_user_name: string;
  assigned_user_link: string;
  SecurityGroups: string;
  salutation: string;
  first_name: string;
  last_name: string;
  full_name: string;
  title: string;
  photo: string;
  department: string;
  do_not_call: number;
  phone_home: string;
  email: string;
  phone_mobile: string;
  phone_work: string;
  phone_other: string;
  phone_fax: string;
  email1: string;
  email2: string;
  invalid_email: string;
  email_opt_out: string;
  lawful_basis: string;
  date_reviewed: string;
  lawful_basis_source: string;
  primary_address_street: string;
  primary_address_street_2: string;
  primary_address_street_3: string;
  primary_address_city: string;
  primary_address_state: string;
  primary_address_postalcode: string;
  primary_address_country: string;
  alt_address_street: string;
  alt_address_street_2: string;
  alt_address_street_3: string;
  alt_address_city: string;
  alt_address_state: string;
  alt_address_postalcode: string;
  alt_address_country: string;
  assistant: string;
  assistant_phone: string;
  email_addresses_primary: string;
  email_addresses: string;
  email_addresses_non_primary: string;
  email_and_name1: string;
  lead_source: string;
  account_name: string;
  account_id: string;
  opportunity_role_fields: string;
  opportunity_role_id: string;
  opportunity_role: string;
  reports_to_id: string;
  report_to_name: string;
  birthdate: string;
  accounts: string;
  reports_to_link: any[];
  opportunities: string;
  bugs: string;
  calls: string;
  cases: string;
  direct_reports: string;
  emails: string;
  documents: string;
  leads: string;
  meetings: string;
  notes: string;
  project: string;
  project_resource: string;
  am_projecttemplates_resources: string;
  am_projecttemplates_contacts_1: string;
  tasks: string;
  tasks_parent: string;
  notes_parent: string;
  user_sync: any[];
  campaign_id: string;
  campaign_name: string;
  campaigns: string;
  campaign_contacts: any[];
  c_accept_status_fields: string;
  m_accept_status_fields: string;
  accept_status_id: string;
  accept_status_name: string;
  prospect_lists: string;
  sync_contact: string;
  fp_events_contacts: string;
  aos_quotes: string;
  aos_invoices: string;
  aos_contracts: string;
  e_invite_status_fields: string;
  event_status_name: string;
  event_invite_id: string;
  e_accept_status_fields: string;
  event_accept_status: string;
  event_status_id: string;
  project_contacts_1: string;
  aop_case_updates: string;
  joomla_account_id: string;
  portal_account_disabled: boolean;
  joomla_account_access: string;
  portal_user_type: string;
  alt_address_state_list_c: string;
  is_parents_c: number;
  hanc_familiares_contacts: string;
  primary_address_state_list_c: string;
  proceso_compra_c: string;
  hanc_actividades_contacts: string;
  ci_c: string;
  genero_c: string;
  relacion_c: string;
  estado_civil_c: string;
  promocion_c: number;
  principal_c: number;
  googlemaps_c: string;
  subindustry_c: string;
  hanc_academicos_contacts: string;
  industry_c: string;
  jjwg_maps_lng_c: number;
  phone_work_wp_c: string;
  phone_mobile_cd_c: string;
  phone_work_cd_c: string;
  address_street_generated_c: string;
  jjwg_maps_address_c: string;
  phone_mobile_wp_c: string;
  jjwg_maps_geocode_status_c: string;
  jjwg_maps_lat_c: number;
}

export interface LeadInviteeResponse {
  type: string;
  id: string;
  attributes: LeadInviteeAttributesResponse;
}

export interface LeadInviteeAttributesResponse {
  name: string;
  date_entered: string;
  date_modified: string;
  modified_user_id: string;
  modified_by_name: string;
  created_by: string;
  created_by_name: string;
  description: string;
  deleted: number;
  created_by_link: string;
  modified_user_link: string;
  assigned_user_id: string;
  assigned_user_name: string;
  assigned_user_link: string;
  SecurityGroups: string;
  salutation: string;
  first_name: string;
  last_name: string;
  full_name: string;
  title: string;
  photo: string;
  department: string;
  do_not_call: number;
  phone_home: string;
  email: string;
  phone_mobile: string;
  phone_work: string;
  phone_other: string;
  phone_fax: string;
  email1: string;
  email2: string;
  invalid_email: string;
  email_opt_out: string;
  lawful_basis: string;
  date_reviewed: string;
  lawful_basis_source: string;
  primary_address_street: string;
  primary_address_street_2: string;
  primary_address_street_3: string;
  primary_address_city: string;
  primary_address_state: string;
  primary_address_postalcode: string;
  primary_address_country: string;
  alt_address_street: string;
  alt_address_street_2: string;
  alt_address_street_3: string;
  alt_address_city: string;
  alt_address_state: string;
  alt_address_postalcode: string;
  alt_address_country: string;
  assistant: string;
  assistant_phone: string;
  email_addresses_primary: string;
  email_addresses: string;
  email_addresses_non_primary: string;
  converted: number;
  refered_by: string;
  lead_source: string;
  lead_source_description: string;
  status: string;
  status_description: string;
  reports_to_id: string;
  report_to_name: string;
  reports_to_link: string;
  reportees: string;
  contacts: string;
  account_name: string;
  accounts: string;
  account_description: string;
  contact_id: string;
  contact: string;
  account_id: string;
  opportunity_id: string;
  opportunity: string;
  opportunity_name: string;
  opportunity_amount: string;
  campaign_id: string;
  campaign_name: string;
  campaign_leads: any[];
  c_accept_status_fields: string;
  m_accept_status_fields: string;
  accept_status_id: string;
  accept_status_name: string;
  webtolead_email1: string;
  webtolead_email2: string;
  webtolead_email_opt_out: string;
  webtolead_invalid_email: string;
  birthdate: string;
  portal_name: string;
  portal_app: string;
  website: string;
  tasks: string;
  notes: string;
  meetings: string;
  calls: string;
  oldmeetings: string;
  oldcalls: string;
  emails: string;
  campaigns: string;
  prospect_lists: string;
  fp_events_leads_1: string;
  e_invite_status_fields: string;
  event_status_name: string;
  event_invite_id: string;
  e_accept_status_fields: string;
  event_accept_status: string;
  event_status_id: string;
  hana_relaciones_leads: string;
  ci_c: string;
  promocion_c: boolean | number;
  hana_atributosmarketing_leads: string;
  jjwg_maps_lng_c: number;
  phone_work_wp_c: string;
  phone_mobile_cd_c: string;
  phone_work_cd_c: string;
  converted_user_id_c: string;
  address_street_generated_c: string;
  jjwg_maps_address_c: string;
  phone_mobile_wp_c: string;
  jjwg_maps_geocode_status_c: string;
  jjwg_maps_lat_c: number;
  alt_address_state_list_c: string;
  primary_address_state_list_c: string;
}

export interface MeetingResponse {
  type: string;
  id: string;
  attributes: MeetingAttributesResponse;
}

export interface MeetingAttributesResponse {
  name: string;
  date_entered: string;
  date_modified: string;
  modified_user_id: string;
  modified_by_name: string;
  created_by: string;
  created_by_name: string;
  description: string;
  deleted: number;
  created_by_link: string;
  modified_user_link: string;
  assigned_user_id: string;
  assigned_user_name: string;
  assigned_user_link: string;
  SecurityGroups: string;
  accept_status: string;
  set_accept_links: string;
  location: string;
  password: string;
  join_url: string;
  host_url: string;
  displayed_url: string;
  creator: string;
  external_id: string;
  duration_hours: number;
  duration_minutes: number;
  date_start: string;
  date_end: string;
  parent_type: string;
  status: string;
  type: string;
  direction: string;
  parent_id: string;
  reminder_checked: boolean;
  reminder_time: number;
  email_reminder_checked: boolean;
  email_reminder_time: number;
  email_reminder_sent: number;
  reminders: string;
  outlook_id: string;
  sequence: number;
  contact_name: string;
  contacts: any[];
  parent_name: string;
  users: string;
  accounts: string;
  leads: string;
  opportunity: string;
  case: string;
  aos_contracts: string;
  notes: string;
  contact_id: string;
  repeat_type: string;
  repeat_interval: number;
  repeat_dow: string;
  repeat_until: string;
  repeat_count: string;
  repeat_parent_id: string;
  recurring_source: string;
  duration: string;
  gsync_id: string;
  gsync_lastsync: string;
  revisado_c: string;
  facturas_c: string;
  fecha_inicio_real_c: string;
  hano_lead_activities_meetings: string;
  prospects: string;
  fecha_fin_real_c: string;
  hana_visitas_activities_meetings: string;
  jjwg_maps_lng_c: number;
  priority_meeting_c: string;
  jjwg_maps_address_c: string;
  jjwg_maps_geocode_status_c: string;
  jjwg_maps_lat_c: number;
  outlook_id_c: string;
}

export interface ProspectInviteeResponse {
  type: string;
  id: string;
  attributes: ProspectInviteeAttributes;
}

export interface ProspectInviteeAttributes {
  name: string;
  date_entered: string;
  date_modified: string;
  modified_user_id: string;
  modified_by_name: string;
  created_by: string;
  created_by_name: string;
  description: string;
  deleted: number;
  created_by_link: string;
  modified_user_link: string;
  assigned_user_id: string;
  assigned_user_name: string;
  assigned_user_link: string;
  SecurityGroups: string;
  salutation: string;
  first_name: string;
  last_name: string;
  full_name: string;
  title: string;
  photo: string;
  department: string;
  do_not_call: number;
  phone_home: string;
  email: string;
  phone_mobile: string;
  phone_work: string;
  phone_other: string;
  phone_fax: string;
  email1: string;
  email2: string;
  invalid_email: number;
  email_opt_out: number;
  lawful_basis: string;
  date_reviewed: string;
  lawful_basis_source: string;
  primary_address_street: string;
  primary_address_street_2: string;
  primary_address_street_3: string;
  primary_address_city: string;
  primary_address_state: string;
  primary_address_postalcode: string;
  primary_address_country: string;
  alt_address_street: string;
  alt_address_street_2: string;
  alt_address_street_3: string;
  alt_address_city: string;
  alt_address_state: string;
  alt_address_postalcode: string;
  alt_address_country: string;
  assistant: string;
  assistant_phone: string;
  email_addresses_primary: string;
  email_addresses: string;
  email_addresses_non_primary: string;
  tracker_key: number;
  birthdate: string;
  lead_id: string;
  account_name: string;
  campaign_id: string;
  campaigns: string;
  prospect_lists: string;
  calls: string;
  meetings: string;
  notes: string;
  tasks: string;
  emails: string;
  fp_events_prospects_1: string;
  e_invite_status_fields: string;
  event_status_name: string;
  event_invite_id: string;
  e_accept_status_fields: string;
  event_accept_status: string;
  event_status_id: string;
  prospects: string;
  jjwg_maps_lng_c: number;
  jjwg_maps_address_c: string;
  jjwg_maps_geocode_status_c: string;
  jjwg_maps_lat_c: number;
  alt_address_state_list_c: string;
  primary_address_state_list_c: string;
}

export interface RemindersDatumResponse {
  id: string;
  popup: number;
  email: number;
  timer_popup: string;
  timer_email: string;
  invitees: InviteeResponse[];
}

// Delete this because It's already in use
// export interface RemindersDatum {
//   idx: number;
//   id: string;
//   popup: boolean;
//   email: boolean;
//   timer_popup: string;
//   timer_email: string;
//   invitees: Invitee[];
// }

export interface InviteeResponse {
  id: string;
  module: string;
  module_id: string;
  value?: string;
}

export interface UserInviteeResponse {
  type: string;
  id: string;
  attributes: UserInviteeAttributes;
}

export interface UserInviteeAttributes {
  user_name: string;
  user_hash: string;
  system_generated_password: number;
  pwd_last_changed: string;
  authenticate_id: string;
  sugar_login: number;
  first_name: string;
  last_name: string;
  full_name: string;
  name: string;
  is_admin: number;
  external_auth_only: number;
  receive_notifications: number;
  description: string;
  date_entered: string;
  date_modified: string;
  modified_user_id: string;
  modified_by_name: string;
  created_by: string;
  created_by_name: string;
  title: string;
  photo: string;
  department: string;
  phone_home: string;
  phone_mobile: string;
  phone_work: string;
  phone_other: string;
  phone_fax: string;
  status: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_country: string;
  address_postalcode: string;
  UserType: string;
  deleted: number;
  portal_only: number;
  show_on_employees: number;
  employee_status: string;
  messenger_id: string;
  messenger_type: string;
  calls: string;
  meetings: string;
  contacts_sync: string;
  reports_to_id: string;
  reports_to_name: string;
  reports_to_link: string;
  reportees: string;
  email1: string;
  email_addresses: string;
  email_addresses_primary: string;
  email_link_type: string;
  editor_type: string;
  aclroles: string;
  is_group: number;
  c_accept_status_fields: string;
  m_accept_status_fields: string;
  accept_status_id: string;
  accept_status_name: string;
  prospect_lists: string;
  emails_users: string;
  eapm: string;
  oauth_tokens: string;
  project_resource: string;
  project_users_1: string;
  am_projecttemplates_resources: string;
  am_projecttemplates_users_1: string;
  SecurityGroups: string;
  securitygroup_noninher_fields: string;
  securitygroup_noninherit_id: string;
  securitygroup_noninheritable: string;
  securitygroup_primary_group: string;
  factor_auth: boolean;
  factor_auth_interface: string;
  account_id_c: string;
  activo_whatsapp_c: number;
  areas_atencion_c: string;
  aspose_code_c: string;
  cliente_c: string;
  contact_id_c: string;
  contacto_c: string;
  delegated_c: string;
  descripcion_fuera_oficina_c: string;
  estado_fuera_oficina_c: number;
  estado_whatsapp_c: number;
  fecha_fin_c: string;
  fecha_inicio_c: string;
  firma_digitalizada_c: string;
  fp_event_locations_id_c: string;
  idamercado_c: string;
  iddivision_c: string;
  idempleado_c: string;
  idgrupocliente_c: string;
  idregional_c: string;
  idvendedor_c: string;
  iniciales_c: string;
  is_digital_c: boolean;
  linkedin_c: string;
  marcas_venta_c: string;
  nombre_mostrar_c: string;
  office365_c: number;
  rol_whatsapp_c: string;
  sync_calendar_c: number;
  sync_hbm_c: number;
  ubicacion_trabajo_c: string;
  user_id_c: string;
  uso_firma_cotizacion_c: number;
}

//* End Meetings info

//* AssignedUser types
export interface AssignedUserModelResponse {
  status: string;
  statusText: string;
  data: DataAssginedUser;
}

export interface DataAssginedUser {
  type: string;
  id: string;
  attributes: AssignedUserModel[];
}

//* AssignedUsers types end
