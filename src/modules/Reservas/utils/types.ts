
export interface PaginationTable {
  sortBy: string;
  descending: boolean;
  page: number;
  rowsPerPage: number;
  rowsNumber?: number;
}

export interface OptionBase {
  [key: string]: string;
}
export interface OptionWithChildren {
  [key: string]: string | OptionBase[];
}


export interface ReadLeadFormat extends AttributesLeadResponse {
  id: string;
}

export interface CardInfoOpportunities {
      type: string;
      id: string;
      attributes: {
        modified_user_id?: '1';
        name?: string | '';
      };
}

export interface dataOp {
  modified_user_id: '1';
  name: string;
  };


export interface CardInfo {
  name: string;
  iddivision_c?: string;
  created_by?:string;
  idamercado_c: string;
  idgrupocliente_c: string;
  description: string;
  currency_id: string;
  currency_name?: string;
  currency_symbol?: string;
  region_c: string;
  fecha_venc_c?: string;
  assigned_user_id?: string;
  reser_stage_c?: string;
  modified_user_id?: string;
}

export interface RelationInfoLead {
  reser_stage_c?:string;
  hanq_reservas_accountsaccounts_ida: string;
  hanq_reservas_contactscontacts_ida: string;
  hanq_reservas_opportunitiesopportunities_ida: string;
  hanq_reservas_aos_quotesaos_quotes_idb: string;
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
  reser_stage_c: string;
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
  hanq_reservas_accountsaccounts_ida: string;
  interesado_c: string;
  hanq_reservas_contactscontacts_ida: string;
  contactoper_c: string;
  campaign_id_c: string;
  campania_c: string;
  lead_id_c: string;
  hanq_reservas_opportunitiesopportunities_ida: string;
  hanq_reservas_aos_quotesaos_quotes_idb:string;
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
  trackcode_c: string;
  fecha_venc_c?:string;
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
  cardInfo: CardInfo;
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
  reser_stage_c: string;
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
  hanq_reservas_accountsaccounts_ida: string;
  interesado_c: string;
  hanq_reservas_contactscontacts_ida: string;
  contactoper_c: string;
  campaign_id_c: string;
  campania_c: string;
  lead_id_c: string;
  hanq_reservas_opportunitiesopportunities_ida: string;
  hanq_reservas_aos_quotesaos_quotes_idb:string;
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
  reser_stage_c: string;
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
