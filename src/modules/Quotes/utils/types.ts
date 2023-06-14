export type AccountModel = 'Privada' | 'Empresa';

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

export interface grupoCli {
  label: string;
  value: string;
}

export interface IdQuotes {
  idquotes: string;
}

export interface objStageSelect {
  label: string;
  value: string;
}

export interface IdQuotesBulk {
  id: string;
}

export interface bulkDeleteQuotes {
  module: string;
  id_user: string;
  list_id_modules: Array<IdQuotesBulk>;
}

export interface cardsInfos {
  cardInfo: CardInfoQuotes;
}

export interface CardInfoQuotes {
  iddivision_c: string | undefined;
  idamercado_c: string | undefined;
  region_c: string | undefined;
  idgrupocliente_c: string | undefined;
  name: string | undefined;
  opportunity_id: string | undefined;
  opportunity: string | undefined;
  stage: string | undefined;
  emision_c: string | undefined;
  limite_fecha_c: string | undefined;
  expiration: string | undefined;
  fp_events_id_c: string | undefined;
  events_c: string | undefined;
  description: string | undefined;
}

export interface Quotesbodydata {
  type?: string;
  id?: string;
  attributes?: Quotesbodydata;
}

export interface Quotesbodydata {
  name?: string;
  date_entered?: string;
  date_modified?: string;
  modified_user_id?: string;
  modified_by_name?: string;
  created_by?: string;
  created_by_name?: string;
  description?: string;
  deleted?: number;
  created_by_link?: string;
  modified_user_link?: string;
  assigned_user_id?: string;
  assigned_user_name?: string;
  assigned_user_link?: string;
  SecurityGroups?: string;
  approval_issue?: string;
  billing_account_id?: string;
  billing_account?: string;
  billing_contact_id?: string;
  billing_contact?: string;
  billing_address_street?: string;
  billing_address_city?: string;
  billing_address_state?: string;
  billing_address_postalcode?: string;
  billing_address_country?: string;
  shipping_address_street?: string;
  shipping_address_city?: string;
  shipping_address_state?: string;
  shipping_address_postalcode?: string;
  shipping_address_country?: string;
  expiration?: string;
  number?: number;
  opportunity_id?: string;
  opportunity?: string;
  template_ddown_c?: string;
  line_items?: string;
  total_amt?: string;
  total_amt_usdollar?: string;
  subtotal_amount?: string;
  subtotal_amount_usdollar?: string;
  discount_amount?: string;
  discount_amount_usdollar?: string;
  tax_amount?: string;
  tax_amount_usdollar?: string;
  shipping_amount?: string;
  shipping_amount_usdollar?: string;
  shipping_tax?: string;
  shipping_tax_amt?: string;
  shipping_tax_amt_usdollar?: string;
  total_amount?: string;
  total_amount_usdollar?: string;
  currency_id?: string;
  stage?: string;
  term?: string;
  terms_c?: string;
  approval_status?: string;
  invoice_status?: string;
  subtotal_tax_amount?: string;
  subtotal_tax_amount_usdollar?: string;
  accounts?: string;
  contacts?: string;
  opportunities?: string;
  aos_quotes_project?: string;
  aos_quotes_aos_invoices?: string;
  aos_quotes_aos_contracts?: string;
  aos_products_quotes?: string;
  aos_line_item_groups?: string;
  fecha_confirmacion_c?: string;
  referencia_c?: string;
  estado_pedido_crm_compras_c?: string;
  respuesta_integraciones_compras_c?: string;
  transaccion_estado_c?: string;
  descripcion_transaccion_c?: string;
  error_transaccion_c?: string;
  fecha_envio_transaccion_c?: string;
  condicion_pago_c?: string;
  mostrar_desc_c?: 0;
  hani_ordencompra_aos_quotes?: string;
  tiempo_entrega_c?: string;
  cond_generales_venta_c?: string;
  hans_callcenterst_aos_quotes?: string;
  hans_callcenterst_aos_quotes_name?: string;
  hans_callcenterst_aos_quoteshans_callcenterst_ida?: string;
  hano_lead_aos_quotes?: string;
  hano_lead_aos_quotes_name?: string;
  hano_lead_aos_quoteshano_lead_ida?: string;
  emision_c?: string;
  agente_seguro_c?: string;
  forma_pago_c?: string;
  garantia_c?: string;
  region_c?: string;
  transaccion_orden_compra_c?: string;
  fechacierre_c?: string;
  hanb_base_id_c?: string;
  description_opt_c?: string;
  iddivision_c?: string;
  servicio_post_venta_c?: string;
  fp_events_id_c?: string;
  condiciones_legales_c?: 0;
  lugar_entrega_c?: string;
  mostrar_codigos_c?: 0;
  sales_stage_c?: string;
  origen_c?: string;
  limite_fecha_c?: string;
  datos_seguro_c?: string;
  idamercado_c?: string;
  hanq_reservas_aos_quotes?: string;
  hanq_reservas_aos_quotes_name?: string;
  hanq_reservas_aos_quoteshanq_reservas_ida?: string;
  idgrupocliente_c?: string;
  motivo_etapa_c?: string;
  opportunity_type_c?: string;
  shipping_address_state_list_c?: string;
  lead_id_c?: string;
  base_instalada_c?: string;
  billing_address_state_list_c?: string;
  events_c?: string;
  prospecto_c?: string;
  address_street_generated_c?: string;
  jjwg_maps_lat_c?: string;
  jjwg_maps_lng_c?: string;
}

export interface FPEventsFilterAdvanced {
  pagina: number;
  numregistros: number;
  sortBy: string;
  order: string;
  filter: string;
  name: string;
  campaign: string;
  creation_date: {
    from: string;
    to: string;
    operator: string;
  };
  iddivision: string;
  idamercado: string;
}

export interface articles {
  idquotes?: string | undefined;
  idapq?: string | undefined;
  product_qty?: number | undefined;
  name?: string | undefined;
  part_number?: string | undefined;
  nombre_color_c?: string | undefined;
  gestion?: number | undefined;
  almacen_c?: string | undefined;
  Value?: string | undefined;
  product_list_price?: number | undefined;
  product_list_price_usdollar?: number | undefined;
  product_discount?: number | undefined;
  product_discount_usdollar?: number | undefined;
  discount?: string | undefined;
  currency_id?: string | undefined;
  product_unit_price?: number | undefined;
  product_unit_price_usdollar?: number | undefined;
  product_total_price?: number | undefined;
  product_total_price_usdollar?: number | undefined;
  group_id?: string | undefined;
  product_procedencia?: string | undefined;
  product_delivery_time?: string | undefined;
  product_confirmed_c?: boolean | undefined;
}

export interface arrayArticles {
  [index: number]: articles | undefined;
}

export interface getOpportunityType {
  idOpportunity: string;
  isCardInfoEdited: boolean | undefined;
}

export interface serviceProducts {
  service_product_qty?: number | undefined;
  service_name?: string | undefined;
  service_product_list_price?: number | undefined;
  service_product_discount?: number | undefined;
  service_discount?: string | undefined;
  service_product_unit_price?: number | undefined;
  service_product_total_price?: number | undefined;
  service_number?: number | undefined;
  service_id?: string | undefined;
  service_procedencia?: string | undefined;
  service_delivery_time?: string | undefined;
  service_flag_chasis_c?: number | undefined;
  service_parent_type_c?: string | undefined;
}

export interface productoProducts {
  product_product_qty?: string | undefined;
  product_name?: string | undefined;
  product_part_number?: string | undefined;
  product_product_list_price?: string | undefined;
  product_product_discount?: string | undefined;
  product_discount?: string | undefined;
  product_product_unit_price?: string | undefined;
  product_product_total_price?: string | undefined;
  product_item_description?: string | undefined;
  product_description?: string | undefined;
  product_proveedores_c?: string | undefined;
  product_hanp_proveedores_id_c?: string | undefined;
  product_product_delivery_time?: string | undefined;
  product_number?: number | undefined;
  product_id?: string | undefined;
  product_procedencia?: string | undefined;
  product_delivery_time?: string | undefined;
  product_flag_chasis_c?: number | undefined;
  product_parent_type_c?: string | undefined;
}

export interface MonedaType {
  id: string;
  name: string;
  symbol: string;
  iso4217: string;
  conversion_rate: number;
  status: string;
  deleted: boolean;
  conversion_rate_sale: number;
  conversion_rate_official: number;
}

export interface modeloContrat {
  id: string;
  name: string;
  total_amount: string;
  currency_id: string;
  region_c: string;
  iddivision_c: string;
  idamercado_c: string;
  idgrupocliente_c: string;
}

export interface modeloInvoice {
  id?: string;
  iddivision_c?: string;
  idamercado_c?: string;
  idgrupocliente_c?: string;
  idregional_c?: string;
  name?: string;
  billing_account?: string;
  billing_account_id?: string;
  billing_contact?: string;
  billing_contact_id?: string;
  currency_id?: string;
}

export interface modeloProyect {
  id?: string;
  iddivision_c?: string;
  idamercado_c?: string;
  idgrupocliente_c?: string;
  idregional_c?: string;
}

export interface modeloOrderBuy {
  name?: string;
}
