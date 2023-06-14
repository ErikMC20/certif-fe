export type ProspectModel = 'Privada' | 'Empresa';
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

export interface PaginationTable {
  sortBy: string;
  descending: boolean;
  page: number;
  rowsPerPage: number;
  rowsNumber?: number;
}

export interface ReadLeadFormat extends AttributesLeadResponse {
  id: string;
}

export interface CardInfoLead {
  name: string;
  idamercado_c: string;
  iddivision_c?: string;
  idgrupocliente_c: string;
  origen_c: string;
  campaign_id_c: string;
  campania_c?: string;
  estado_c: string;
  motivo_c: string;
  producto_c: string;
  date_closed: string;
  description: string;
  currency_id: string;
  currency_name?: string;
  currency_symbol?: string;
  region_c: string;
  prioridad_c: string;
  amount: number;
  assigned_user_id?: string;
  created_by?: string;
  modified_user_id?: string;
  opportunity_id_c?: string;
  country_c?: string;
  probability?: string;
}

export interface RelationInfoLead {
  account_id_c: string;
  contact_id_c: string;
  lead_id1_c: string;
}

export interface ReadLeadResponse {
  status: number;
  statusText: string;
  data: DataLeadResponse;
}

export interface DataLeadResponse {
  type: string;
  id: string;
  attributes: AttributesLeadResponse;
  relationships: RelationshipsLeadResponse;
}

export interface AttributesLeadResponse {
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
  hano_lead_type: string;
  lead_source: string;
  amount: number;
  amount_usdollar: number;
  currency_id: string;
  currency_name: string;
  currency_symbol: string;
  date_closed: string;
  next_step: string;
  sales_stage: string;
  probability: string;
  idamercado_c: string;
  idgrupocliente_c: string;
  iddivision_c: string;
  estado_c: string;
  prioridad_c: string;
  origen_c: string;
  account_id_c: string;
  interesado_c: string;
  contact_id_c: string;
  contactoper_c: string;
  campaign_id_c: string;
  campania_c: string;
  lead_id_c: string;
  lead_id1_c: string;
  prospecto_id_c: string;
  region_c: string;
  opportunity_id_c: string;
  oportunity_id: string;
  producto_c: string;
  motivo_c: string;
  cuce_c: string;
  hano_lead_documents: string;
  hano_lead_activities_notes: string;
  hano_lead_aos_quotes: string;
  hano_lead_activities_tasks: string;
  hano_lead_activities_emails: string;
  hano_lead_activities_meetings: string;
  hano_lead_activities_calls: string;
  country_c: string;
  trackcode_c: string;
}

export interface RelationshipsLeadResponse {
  AOS_Quotes: AosQuotes;
  Calls: AosQuotes;
  Documents: AosQuotes;
  Emails: AosQuotes;
  Meetings: AosQuotes;
  Notes: AosQuotes;
  SecurityGroups: AosQuotes;
  Tasks: AosQuotes;
  Users: AosQuotes;
}

export interface AosQuotes {
  links: Links;
}

export interface Links {
  related: string;
}

export type InfoLead = {
  cardInfo: CardInfoLead;
  relationInfo: RelationInfoLead;
};

export interface ContactFiltered {
  id: string;
  nombre: string;
  ci: string;
  telefono: string;
  correo: string;
  fecha_nacimiento: string;
  genero: string;
  principal: boolean;
  padre: boolean;
  cuenta: string;
  id_cuenta: string;
}

export interface CountriesResponse {
  id: string;
  cod_pais: string;
  label: string;
  regiones: RegionesResponse[];
}

export interface RegionesResponse {
  cod_region: string;
  label: string;
}

export interface LeadCreationResponse {
  status: number;
  statusText: string;
  data: LeadDataResponse;
  data_comment: DataCommentCreationResponse;
}

export interface LeadDataResponse {
  type: string;
  id: string;
  attributes: DataAttributesCreationResponse;
}

export interface DataAttributesCreationResponse {
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
  hano_lead_type: string;
  lead_source: string;
  amount: number;
  amount_usdollar: string;
  currency_id: string;
  currency_name: string;
  currency_symbol: string;
  date_closed: string;
  next_step: string;
  sales_stage: string;
  probability: string;
  idamercado_c: string;
  idgrupocliente_c: string;
  iddivision_c: string;
  estado_c: string;
  prioridad_c: string;
  origen_c: string;
  account_id_c: string;
  interesado_c: string;
  contact_id_c: string;
  contactoper_c: string;
  campaign_id_c: string;
  campania_c: string;
  lead_id_c: string;
  lead_id1_c: string;
  prospecto_id_c: string;
  region_c: string;
  opportunity_id_c: string;
  oportunity_id: string;
  producto_c: string;
  motivo_c: string;
  cuce_c: string;
  hano_lead_documents: string;
  hano_lead_activities_notes: string;
  hano_lead_aos_quotes: string;
  hano_lead_activities_tasks: string;
  hano_lead_activities_emails: string;
  hano_lead_activities_meetings: string;
  hano_lead_activities_calls: string;
  country_c: string;
  trackcode_c: string;
}

export interface DataCommentCreationResponse {
  type: string;
  id: string;
  attributes: DataCommentAttributesCreationResponse;
}

export interface DataCommentAttributesCreationResponse {
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
  visualizacion_c: string;
  bean_module: string;
  bean_id: string;
  relevance: string;
  hanpc_comentarios_cases: string;
  hanpc_comentarios_cases_name: string;
  hanpc_comentarios_casescases_ida: string;
}

export interface productForDivAndAM {
  cod_div: string,
  amercado: [{
    cod_amercado: string,
    productos: [{
      label?: string,
      velue?: string
    }]
  }],
  allAmercado?: []
}[]
