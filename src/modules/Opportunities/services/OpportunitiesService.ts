import {
  GrupoClienteResponse,
  CurrencyResponse,
} from 'src/components/types/index';
import {
  axios_LB_03,
  axios_LB_05,
  axios_GLOBAL,
} from 'src/conections/axiosCRM';
import { userStore } from 'src/modules/Users/store/UserStore';
import { LeadDataResponse } from '../utils/types';
import Notification from 'src/modules/Accounts/utils/notify';
import { axios_LB_04 } from 'src/conections/axiosCRM';
import * as type from '../utils/types';

const { userCRM } = userStore();

export const useOpportunitiesService = () => {
  const createOpportunity = async (
    opportunityInfo: type.CardInfoOpportunity,
    relationInfo: type.AdditionalInfoOpportunity,
    firstComment: string,
    assignedUser: string
  ) => {
    opportunityInfo.assigned_user_id = assignedUser;
    opportunityInfo.created_by = userCRM.id;
    const attributes = { ...opportunityInfo, ...relationInfo };
    // adding first description from the first comment
    attributes.description = firstComment;
    const attributes_comment = {
      created_by: userCRM.id,
      visualizacion_c: 'interno',
      description: firstComment,
      relevance: 'medium',
    };
    const body = { attributes, attributes_comment };
    const { data } = await axios_LB_04.post<type.LeadCreationResponse>(
      '/opportunities-new',
      body
    );
    return { id: data.data.id, ...data.data.attributes };
  };
  const updateLead = async (
    leadId: string,
    opportunityInfo: type.CardInfoOpportunity,
    relationInfo: type.AdditionalInfoOpportunity
  ) => {
    opportunityInfo.modified_user_id = userCRM.id;
    const attributes = { ...opportunityInfo, ...relationInfo };
    const { data } = await axios_LB_04.patch<type.LeadDataResponse>(
      `/opportunities-update/${leadId}`,
      {
        attributes,
      }
    );
    return { id: data.id, ...data.attributes };
  };
  const getOpportunity = async (id: string) => {
    try {
      const response = await axios_LB_04.get<type.ReadLeadResponse>(
        `opportunities-get/${id}`
      );

      return { id: response.data.data.id, ...response.data.data.attributes };
    } catch (error) {
      throw error;
    }
  };

  const getLeadFormatted = async (
    id: string
  ): Promise<type.InfoOpportunity> => {
    const {
      name,
      modified_user_id,
      probability,
      idgrupocliente_c,
      iddivision_c,
      idamercado_c,
      created_by,
      assigned_user_id,
      opportunity_type,
      sales_stage,
      origen_c,
      estado_oportunidad_c,
      motivo_c,
      date_closed,
      description,
      currency_id,
      region_c,
      amount,
      contact_id_c,
      amount_usdollar,
      acuenta_de_c,
      campaign_id,
      campaign_name,
      tipofinanciamiento_c,
      lead_source,
      next_step,
      // CSTM
      campeon_descripcion_c,
      caso_financiero_c,
      cuce_c,
      desafios_cliente_c,
      descripcion_problema_c,
      descripcion_solucion_c,
      esta_presupuestado_c,
      evento_cierre_c,
      fuente_c,
      historias_exito_c,
      contact_id1_c,
      contact_id2_c,
      prioridades_cliente_c,
      prob_proyecto_c,
      proceso_aprobacion_c,
      provmunicipio_c,
      tomador_descripcion_c,
      monto_proyecto_c,
      fecha_entrega_c,
      faseventa_c,
      jjwg_maps_lng_c,
      jjwg_maps_lat_c,
      jjwg_maps_geocode_status_c,
      jjwg_maps_address_c,
      ejecutivobanco_c,
      entidadbancaria_c,
      billing_address_state_list_c,
      vendedor_c,
      canal_c,
      hano_competidor_id_c,
      fp_events_id_c,
      competidores_c,
      efectividad_medio_c,
      motivo_perdida_c,
      marca_interes_c,
    } = await getOpportunity(id);
    return {
      cardInfo: {
        name,
        created_by,
        assigned_user_id,
        opportunity_type,
        sales_stage,
        origen_c,
        estado_oportunidad_c,
        motivo_c,
        date_closed,
        description,
        currency_id,
        region_c,
        amount,
        modified_user_id,
        probability,
        idgrupocliente_c,
        iddivision_c,
        idamercado_c,
        next_step,
        // CSTM
        campeon_descripcion_c,
        caso_financiero_c,
        cuce_c,
        desafios_cliente_c,
        descripcion_problema_c,
        descripcion_solucion_c,
        esta_presupuestado_c,
        evento_cierre_c,
        fuente_c,
        historias_exito_c,
        contact_id1_c,
        contact_id2_c,
        prioridades_cliente_c,
        prob_proyecto_c,
        proceso_aprobacion_c,
        provmunicipio_c,
        tomador_descripcion_c,
        monto_proyecto_c,
        fecha_entrega_c,
        faseventa_c,
        jjwg_maps_lng_c,
        jjwg_maps_lat_c,
        jjwg_maps_geocode_status_c,
        jjwg_maps_address_c,
        ejecutivobanco_c,
        entidadbancaria_c,
        billing_address_state_list_c,
        vendedor_c,
        canal_c,
        hano_competidor_id_c,
        fp_events_id_c,
        competidores_c,
        efectividad_medio_c,
        motivo_perdida_c,
        marca_interes_c,
      },
      relationInfo: {
        // account_id_c,
        contact_id_c,
        // lead_id1_c,
      },
    };
  };
  const getOptionsLanguage = async () => {
    return await Promise.all([
      axios_LB_05.get('./lang-es-divisiones-org-ventas-lists'),
      // axios_LB_05.get<CountriesResponse[]>('./pais-list'),
      axios_LB_05.get('/lang-es-estado-motivo-lead-lists'),
      axios_LB_05.get('/lang-es-dimorigenes-lists'),
      axios_LB_05.get('lang-es-prioridad-lists'),
      axios_LB_05.get<GrupoClienteResponse[]>('/lang-es-dimgrupocliente-lists'),
      axios_GLOBAL.get<CurrencyResponse>('/get-currencies'),
      axios_LB_05.get<type.OpportunitieTypePhasePercentageColor[]>(
        '/lang-es-opportunity-type-sales-stage-doms'
      ),
      axios_LB_05.get('/lang-es-hansa-acuentade-lists'),
    ]);
  };

  //PARA OBTENER LA DIVISION
  const getDivisionStore = async () => {
    try {
      const { data } = await axios_LB_05.get(
        '/lang-es-divisiones-org-ventas-lists'
      );
      return data;
    } catch (error) {
      throw error;
    }
  };
  //PARA OBTENER EL AREA DEL MERCADO
  const getAreaMercadoStore = async (iddivision: string) => {
    try {
      const { data } = await axios_LB_05.get(
        '/lang-es-divisiones-org-ventas-lists'
      );

      const res = data.find(
        (el: { [key: string]: string }) => el.cod_div === iddivision
      )?.amercado;

      return res;
    } catch (error) {
      throw error;
    }
  };
  //OBTIENE EL TIPO DE OPORTUNIDAD
  const getTipoOportunidad = async (iddivision: string) => {
    try {
      const { data } = await axios_LB_05.get(
        '/lang-es-opportunity-type-sales-stage-doms'
      );
      const fataFilter = data.filter(
        (x: type.OpportunitieTypePhasePercentageColor) => x.div == iddivision
      );
      return fataFilter;
    } catch (error) {
      throw error;
    }
  };
  //PARA OBTENER EL AREA DEL MERCADO
  const getFaseOportunidad = async (idtipo: string) => {
    try {
      const { data } = await axios_LB_05.get(
        '/lang-es-opportunity-type-sales-stage-doms'
      );

      const res = data.find(
        (el: type.OpportunitieTypePhasePercentageColor) => el.value === idtipo
      )?.phase;

      return res;
    } catch (error) {
      throw error;
    }
  };
  //PARA OBTENER LA GRUPO CLIENTE
  const getGrupoCliente = async (iddivision: string) => {
    try {
      const { data } = await axios_LB_05.get('/lang-es-dimgrupocliente-lists');
      const res = data.find(
        (el: { [key: string]: string }) => el.div === iddivision
      )?.grupo;
      return res;
    } catch (error) {
      throw error;
    }
  };

  //OBTIENE PARTICIPACION COMO (acuenta_de_c)
  const getParticipacionComo = async () => {
    try {
      const { data } = await axios_LB_05.get('/lang-es-hansa-acuentade-lists');
      return data;
    } catch (error) {
      throw error;
    }
  };

  //PARA OBTENER LA DIVISION
  // const getDivision = () => {
  //   const listDivisiones = ref([]);
  //   try {
  //     const getListDivisiones = async () => {
  //       const { data } = await axios_LB_05.get(
  //         '/lang-es-divisiones-org-ventas-lists'
  //       );
  //       listDivisiones.value = data;
  //     };
  //     return { listDivisiones, getListDivisiones };
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  const deleteLead = async (id: string) => {
    try {
      const { data } = await axios_LB_03.delete(
        `/lead-delete/${id}/${userCRM.id}`
      );
      return data;
    } catch (error) {
      throw error;
    }
  };
  //PARA OBTENER EL ORIGEN
  const getOrigen = async () => {
    try {
      const { data } = await axios_LB_05.get('/lang-es-dimorigenes-lists');
      return data;
    } catch (error) {
      throw error;
    }
  };
  //PARA OBTENER EL ESTADO
  const getEstado = async () => {
    try {
      const { data } = await axios_LB_05.get(
        '/lang-es-estado-motivo-lead-lists'
      );
      return data;
    } catch (error) {
      throw error;
    }
  };
  //PARA LA ELIMINACION MASIVA
  const deleteMassiveData = async (data: object) => {
    try {
      await axios_GLOBAL.patch('/bulk-module-massive-delete', data);
    } catch (error) {
      console.log(error);
    }
  };
  //PARA LA ACTUALIZACION MASIVA
  const updateMassiveData = async (body: object[]) => {
    try {
      await axios_GLOBAL.patch('/bulk-module-massive-update', body);
    } catch (error) {
      console.log(error);
    }
  };
  const setUserAssigned = async (
    module_id: string,
    assigned_user_id: string
  ) => {
    const data_send = {
      type: 'Opportunities',
      id: module_id,
      attributes: {
        assigned_user_id: assigned_user_id,
        modified_user_id: userCRM.id,
      },
    };

    try {
      const { data } = await axios_GLOBAL.patch('/module-update', data_send);
      Notification(
        'positive',
        'check',
        '<strong>Correcto!</strong> <br/> Se cambió el vendedor principal.'
      );
      return data.data;
    } catch (error) {
      Notification(
        'error',
        'error',
        '<strong>Ops!</strong> <br/> Ocurrió un error.'
      );
      throw error;
    }
  };

  return {
    createOpportunity,
    deleteLead,
    getOpportunity,
    getLeadFormatted,
    getOptionsLanguage,
    getDivisionStore,
    getAreaMercadoStore,
    updateLead,
    getTipoOportunidad,
    getFaseOportunidad,
    getGrupoCliente,
    getOrigen,
    getEstado,
    getParticipacionComo,
    deleteMassiveData,
    updateMassiveData,
    setUserAssigned,
  };
};
