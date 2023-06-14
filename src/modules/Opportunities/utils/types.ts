import { exportFile } from 'quasar';

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

export interface ReadLeadFormat extends AttributesOpportunityResponse {
  id: string;
}

export interface CardInfoOpportunity {
  name?: string;
  modified_user_id?: string;
  created_by?: string;
  description?: string;
  estado_oportunidad_c?: string;
  assigned_user_id?: string;
  opportunity_type?: string;
  sales_stage?: string;
  probability?: string;
  date_closed?: string;
  currency_id?: string;
  amount?: number;
  amount_usdollar?: number;
  origen_c?: string;
  acuenta_de_c?: string;
  campaign_id?: string;
  campaign_name?: string;
  idgrupocliente_c?: string;
  iddivision_c?: string;
  idamercado_c?: string;
  region_c?: string;
  tipofinanciamiento_c?: string;

  lead_source?: string;
  next_step?: string;
  // CSTM
  campeon_descripcion_c?: string;
  caso_financiero_c?: string;
  cuce_c?: string;
  desafios_cliente_c?: string;
  descripcion_problema_c?: string;
  descripcion_solucion_c?: string;
  esta_presupuestado_c?: string;
  evento_cierre_c?: string;
  fuente_c?: string;
  historias_exito_c?: string;
  contact_id1_c?: string;
  contact_id2_c?: string;
  motivo_c?: string;
  prioridades_cliente_c?: string;
  prob_proyecto_c?: string;
  proceso_aprobacion_c?: string;
  provmunicipio_c?: string;
  tomador_descripcion_c?: string;
  monto_proyecto_c?: string;
  fecha_entrega_c?: string;
  faseventa_c?: string;
  jjwg_maps_lng_c?: string;
  jjwg_maps_lat_c?: string;
  jjwg_maps_geocode_status_c?: string;
  jjwg_maps_address_c?: string;
  ejecutivobanco_c?: string;
  entidadbancaria_c?: string;
  billing_address_state_list_c?: string;
  vendedor_c?: string;
  canal_c?: string;
  hano_competidor_id_c?: string;
  fp_events_id_c?: string;
  competidores_c?: string;
  efectividad_medio_c?: string;
  motivo_perdida_c?: string;
  marca_interes_c?: string;
}

export interface AdditionalInfoOpportunity {
  idamercado_c?: string;
  iddivision_c?: string;
  idgrupocliente_c?: string;
  region_c?: string;
  cuce_c?: string;
  prob_proyecto_c?: string;
  acuenta_de_c?: string;
  // account_id_c: string;
  // contact_id_c: string;
}

export interface ReadLeadResponse {
  status: number;
  statusText: string;
  data: DataLeadResponse;
}

export interface DataLeadResponse {
  type: string;
  id: string;
  attributes: AttributesOpportunityResponse;
  relationships?: RelationshipsLeadResponse;
}

export interface AttributesOpportunityResponse {
  name: string;
  date_entered: string;
  date_modified: string;
  modified_user_id: string;
  // modified_by_name: string;
  created_by: string;
  // created_by_name: string;
  description: string;
  deleted: number;
  assigned_user_id: string;
  opportunity_type: string;
  campaign_id: string;
  campaign_name: string;
  lead_source: string;
  amount: number;
  amount_usdollar: number;
  currency_id: string;
  date_closed: string;
  next_step: string;
  sales_stage: string;
  probability: string;
  number_c: string;
  acuenta_de_c: string;
  campeon_descripcion_c: string;
  caso_financiero_c: string;
  contact_id_c: string;
  cuce_c: string;
  desafios_cliente_c: string;
  descripcion_problema_c: string;
  descripcion_solucion_c: string;
  esta_presupuestado_c: string;
  estado_oportunidad_c: string;
  evento_cierre_c: string;
  fuente_c: string;
  historias_exito_c: string;
  idamercado_c?: string;
  contact_id1_c: string;
  iddivision_c: string;
  idgrupocliente_c: string;
  contact_id2_c: string;
  motivo_c: string;
  prioridades_cliente_c: string;
  prob_proyecto_c: string;
  proceso_aprobacion_c: string;
  provmunicipio_c: string;
  region_c: string;
  tomador_descripcion_c: string;
  monto_proyecto_c: string;
  fecha_entrega_c: string;
  faseventa_c: string;
  jjwg_maps_lng_c: string;
  jjwg_maps_lat_c: string;
  jjwg_maps_geocode_status_c: string;
  jjwg_maps_address_c: string;
  origen_c: string;
  ejecutivobanco_c: string;
  entidadbancaria_c: string;
  tipofinanciamiento_c: string;
  billing_address_state_list_c: string;
  vendedor_c: string;
  canal_c: string;
  hano_competidor_id_c: string;
  fp_events_id_c: string;
  competidores_c: string;
  efectividad_medio_c: string;
  motivo_perdida_c: string;
  marca_interes_c: string;

  // currency_name: string;
  // currency_symbol: string;
  // prioridad_c: string;
  // account_id_c: string;
  // interesado_c: string;
  // contactoper_c: string;
  // campaign_id: string;
  // campania_c: string;
  // lead_id_c: string;
  // lead_id1_c: string;
  // prospecto_id_c: string;
  // // created_by_link: string;
  // modified_user_link: string;
  // assigned_user_name: string;
  // assigned_user_link0: string;
  // SecurityGroups: string;
  // // hano_lead_type: string;
  // opportunity_id_c: string;
  // oportunity_id: string;
  // producto_c: string;
  // trackcode_c: string;
}

export interface OpportunityModel extends AttributesOpportunityResponse {
  id: string;
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

export type InfoOpportunity = {
  cardInfo: CardInfoOpportunity;
  cardInfoAdd: AdditionalInfoOpportunity; //agregar informacion adicional MARCADOR BECA
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
  currency_name?: string;
  currency_symbol: string;
  date_closed: string;
  next_step: string;
  sales_stage: string;
  probability: string;
  idamercado_c: string;
  idgrupocliente_c: string;
  iddivision_c: string;
  estado_oportunidad_c: string;
  prioridad_c: string;
  origen_c: string;
  account_id_c: string;
  interesado_c: string;
  contact_id_c: string;
  contactoper_c: string;
  campaign_id: string;
  campaign_name: string;
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

export interface OpportunitieTypePhasePercentageColor {
  _id: string;
  value: string;
  label: string;
  phase: [
    {
      value: string;
      label: string;
      prop: {
        percentage: string;
        color: string;
      };
    }
  ];
  div: string;
  amercado: [];
}
[];

export interface GroupClient {
  _id: string;
  div: string;
  grupo: [
    {
      value: string;
      label: string;
    }
  ];
}
[];

export interface RenderModel {
  value: string;
  label: string;
  color: string;
  prob: string;
  labelComponent: string;
}

export interface Phase {
  value: string;
  label: string;
  prop: {
    percentage: string;
    color: string;
  };
}

// Global service types

// Generated by https://quicktype.io

export interface OpportunityGlobal {
  id: string;
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
  opportunity_type: string;
  account_name: string;
  account_id: string;
  campaign_id: string;
  campaign_name: string;
  campaign_opportunities: object;
  lead_source: string;
  amount: number;
  amount_usdollar: number;
  currency_id: string;
  currency_name: string;
  currency_symbol: string;
  date_closed: string;
  next_step: string;
  sales_stage: string;
  probability: number;
  accounts: string;
  contacts: string;
  tasks: string;
  notes: string;
  meetings: string;
  calls: string;
  emails: string;
  documents: string;
  project: string;
  leads: string;
  campaigns: string;
  campaign_link: string;
  currencies: string;
  aos_quotes: string;
  aos_contracts: string;
  number_c: number;
  hano_competidores_opportunities: string;
  hans_callcenterst_opportunities: string;
  prob_proyecto_c: string;
  hano_boletas_opportunities: string;
  idtomador_c: string;
  tipofinanciamiento_c: string;
  desafios_cliente_c: string;
  cuce_c: string;
  events_c: string;
  efectividad_medio_c: string;
  motivo_perdida_c: string;
  esta_presupuestado_c: number;
  hanq_reservas_opportunities: string;
  competidores_c: string;
  evento_cierre_c: string;
  region_c: string;
  contact_id2_c: string;
  caso_financiero_c: string;
  vendedor_c: string;
  historias_exito_c: string;
  ejecutivobanco_c: string;
  canal_c: string;
  fecha_entrega_c: string;
  iddivision_c: string;
  prioridades_cliente_c: string;
  faseventa_c: string;
  campeon_descripcion_c: string;
  contact_id_c: string;
  descripcion_problema_c: string;
  hano_cronogramamantenimiento_opportunities: string;
  idcampeon_c: string;
  fp_events_id_c: string;
  provmunicipio_c: string;
  proceso_aprobacion_c: string;
  contacto_oportunidad_c: string;
  estado_oportunidad_c: string;
  contact_id1_c: string;
  hano_garantiascomplementarias_opportunities: string;
  entidadbancaria_c: string;
  motivo_c: string;
  hana_proyectocuenta_opportunities: string;
  hana_proyectocuenta_opportunities_name: string;
  hana_proyectocuenta_opportunitieshana_proyectocuenta_ida: string;
  origen_c: string;
  tomador_descripcion_c: string;
  billing_address_state_list_c: string;
  monto_proyecto_c: string;
  idamercado_c: string;
  marca_interes_c: string;
  descripcion_solucion_c: string;
  idgrupocliente_c: string;
  acuenta_de_c: string;
  fuente_c: string;
  jjwg_maps_lng_c: number;
  jjwg_maps_address_c: string;
  jjwg_maps_geocode_status_c: string;
  jjwg_maps_lat_c: number;
  country_c: string;
}
