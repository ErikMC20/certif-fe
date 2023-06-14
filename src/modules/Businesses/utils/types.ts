export interface BusinessModel {
  name: string;
  assigned_user_id: string;
  account_name: string;
  // fill with real data from backend and your components
}

export interface OpportunitiesResponse {
  id: string;
  id_division: string;
  id_amercado: string;
  oppt_status: string;
  nombre: string;
  monto: number;
  id_responsable: string;
  responsable: null | string;
  cuenta: null | string;
  account_id?: string;
  contact_name: string;
  contact_id?: string;
  user_avatar: null | string;
  creation_date: string;
  fechaCierre: string;
  faseDeVenta: string;
  Tasks: number;
  all_tasks: number;
  Meetings: number;
  all_meetings: number;
  Calls: number;
  all_calls: number;
  emails: number;
  all_emails: number;
  activities: number;
  expired_activities: number;
  last_completed_activity?: string;
  next_activity?: string;
}

export interface OpportunityType {
  label: string;
  value: string;
  salesPhases: SalesPhase[];
}

export interface SalesPhase {
  label: string;
  value: string;
  prop?: { color: string; rules: string[] };
}

export interface FilterForm {
  nameFilter: string;
  opportunityType: string;
  opportunityState: string;
  from: string;
  to: string;
}

export interface FilterFormat {
  term?: string;
  name?: string;
  iddivision_c?: string;
  idamercado_c?: string;
  idgrupocliente_c?: string;
  account_id?: string;
  option_amount?: string;
  from_amount?: string;
  to_amount?: string;
  operator_amount?: string;
  region_c?: string;
  opportunity_type?: string;
  faseventa_c?: string;
  option_date_entered?: string;
  from_date_entered?: string;
  to_date_entered?: string;
  operator_date_entered?: string;
  assigned_user_id?: string;
  origen_c?: string;
  campaign_id?: string;
  fp_events_id_c?: string;
  option_date_closed?: string;
  from_date_closed?: string;
  to_date_closed?: string;
  operator_date_closed?: string;
  estado_oportunidad_c?: string;
  created_by?: string;
  number_c?: string;
}
// TODO eliminar los option en los rangos

export interface StatValue {
  id: number;
  icon: string;
  title: string;
  amount: number;
  isPercentage?: boolean;
  color?: string;
  isMoney?: boolean;
  value: string;
}

export interface ExpiredActivitiesResponse {
  description: null | string;
  start_date: null | string;
  end_date: null | string;
  name: string;
  task_type: string;
  opp_name: string;
  opp_id: string;
  id: string;
}
