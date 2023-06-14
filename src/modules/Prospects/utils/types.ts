import {
  PhoneModel,
  EmailModel,
  DirectionComponentModel,
} from '../../../components/types/index';
export type ProspectModel = 'Privada' | 'Empresa';
export interface OptionBase {
  [key: string]: string;
}

export interface CampaignFilter {
  name: string;
  type: string;
  status: string;
  assigned_to: [];
}

export type Option = string | OptionBase[];
export interface OptionsExtended {
  [key: string]: Option;
}

export interface OptionWithChildren {
  [key: string]: string | OptionBase[];
}

export interface PaginationTable {
  sortBy: string;
  descending: boolean;
  page: number;
  rowsPerPage: number;
  rowsNumber?: number;
}

export interface InfoProspectModel {
  salutation: string;
  first_name: string;
  last_name: string;
  title: string;
  ci_c?: string;
  primary_address_city: string;
  primary_address_state_list_c: string;
  primary_address_country: string;
  alt_address_city?: string;
  alt_address_state_list_c?: string;
  alt_address_country?: string;
  phone_mobile?: string;
  status: string;
  lead_source?: string;
  phone_mobile_cd_c?: string;
  phone_mobile_wp_c?: string;
  phone_work?: string;
  phone_work_cd_c?: string;
  phone_work_wp_c?: string;
  description?: string;
  assigned_user_id?: string;
  created_by_name?: string;
  modified_by_name?: string;
  date_entered?: string;
  date_modified?: string;
}

export interface ContactProspectModel {
  phone_work: string;
  phone_mobile: string;
  phones: PhoneModel;
  emails: EmailModel;
}

export interface DirectionProspectModel {
  primary_address_street: string;
}

export interface ProspectMdoel {
  info_prospect: InfoProspectModel;
  contact_prospect: ContactProspectModel;
  direction_prospect: DirectionProspectModel;
}

export interface prospectInfoDataModel {
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
  campaign_leads: object;
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
  jjwg_maps_address_c: string;
  jjwg_maps_geocode_status_c: string;
  jjwg_maps_lat_c: number;
  jjwg_maps_lng_c: number;
  alt_address_state_list_c: string;
  ci_c: string;
  phone_mobile_cd_c: string;
  phone_mobile_wp_c: string;
  phone_work_cd_c: string;
  phone_work_wp_c: string;
  primary_address_state_list_c: string;
  promocion_c: 0 | 1;
  address_street_generated_c: string;
}

export interface ProspectResponseModel {
  status: string;
  statusText: string;
  data: {
    type: string;
    id: string;
    attributes: prospectInfoDataModel;
  };
  data_emails: {
    type: string;
    attributes_emails: EmailModel[];
  };
  data_phones: {
    type: string;
    attributes_phones: PhoneModel[];
  };
  data_comments: {
    type: string;
    attributes_comments: {
      fecha_creacion: string;
      descripcion: string;
      idcreado_por: string;
      creado_por: string;
      id: string;
      flag: string;
    };
  };
}

export type PhoneContactModel = {
  code: string;
  phone: string;
  whatsapp: string;
};

export type ProspectInfoModel = {
  infoData: InfoProspectModel;
  mainPhone: PhoneContactModel;
  officePhone: PhoneContactModel;
  emails: EmailModel[];
  phones: PhoneModel[];
  directionData: DirectionComponentModel;
  assignedUser?: string;
  comment?: string;
};

//* Store types

// Generated by https://quicktype.io

//* ReadProspectModel
export interface ReadProspectModel {
  data: Data;
}

export interface Data {
  type: string;
  id: string;
  attributes: Attributes;
  relationships: Relationships;
}

export interface Attributes {
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
  campaign_leads: object;
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
  promocion_c: number;
  hana_atributosmarketing_leads: string;
  jjwg_maps_lng_c: string;
  phone_work_wp_c: string;
  phone_mobile_cd_c: string;
  phone_work_cd_c: string;
  address_street_generated_c: string;
  jjwg_maps_address_c: string;
  phone_mobile_wp_c: string;
  jjwg_maps_geocode_status_c: string;
  jjwg_maps_lat_c: string;
  alt_address_state_list_c: string;
  primary_address_state_list_c: string;
}

export interface Relationships {
  CampaignLog: CampaignLog;
  Contacts: CampaignLog;
  EmailAddress: CampaignLog;
  HANA_AtributosMarketing: CampaignLog;
  HANA_Relaciones: CampaignLog;
  ProspectLists: CampaignLog;
  SecurityGroups: CampaignLog;
  Users: CampaignLog;
}

export interface CampaignLog {
  links: Links;
}

export interface Links {
  related: string;
}

//* End ProspectResponseModel Generated

export type FaiiSubmitModel = {
  messageAction1?: string;
  messageAction2?: string;
  action?: () => void;
  action2?: () => void;
};

// Generated by https://quicktype.io

export interface CreationBodyProspect {
  attributes: AttributesC;
  attributes_phones: AttributesPhones;
  attributes_emails: AttributesEmails;
  attributes_comment: AttributesComment;
}

export interface AttributesC {
  status: string;
  salutation: string;
  first_name: string;
  last_name: string;
  title: string;
  ci_c: string;
  primary_address_country: string;
  primary_address_state_list_c: string;
  primary_address_city: string;
  lead_source: string;
  alt_address_city: string;
  alt_address_state_list_c: string;
  alt_address_country: string;
  phone_mobile: string;
  phone_mobile_wp_c: string;
  phone_mobile_cd_c: string;
  phone_work: string;
  phone_work_wp_c: string;
  phone_work_cd_c: string;
  assigned_user_id: string;
  modified_user_id: string;
  address_street_generated_c: string;
  jjwg_maps_lat_c: number;
  jjwg_maps_lng_c: number;
  primary_address_street: string;
  alt_address_street: string;
  created_by: string;
  description?: string;
  created_by_name?: string;
  modified_by_name?: string;
  date_modified?: string;
}

export interface AttributesComment {
  bean_module: string;
  bean_id: string;
  created_by: string;
  visualizacion_c: string;
  relevance: string;
  description: string;
}

export interface AttributesEmails {
  items: AttributesEmailsItem[];
}

export interface AttributesEmailsItem {
  id: string;
  email_address: string;
  email_address_caps: string;
  primary_item: string;
}

export interface AttributesPhones {
  items: AttributesPhonesItem[];
}

export interface AttributesPhonesItem {
  id: string;
  phone: string;
  country: string;
  country_code: string;
  whatsapp: string;
  primary_item: string;
  description: string;
}
