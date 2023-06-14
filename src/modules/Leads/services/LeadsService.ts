import {
  axios_LB_03,
  axios_LB_05,
  axios_GLOBAL,
} from 'src/conections/axiosCRM';
import { userStore } from 'src/modules/Users/store/UserStore';
import { LeadDataResponse, productForDivAndAM } from '../utils/types';
import Notification from 'src/modules/Accounts/utils/notify';

import {
  LeadCreationResponse,
  ReadLeadResponse,
  InfoLead,
  CountriesResponse,
  CardInfoLead,
  RelationInfoLead,
} from '../utils/types';

const { userCRM } = userStore();

export const useLeadsService = () => {
  const createLead = async (
    leadInfo: CardInfoLead,
    relationInfo: RelationInfoLead,
    firstComment: string,
    assignedUser: string
  ) => {
    leadInfo.assigned_user_id = assignedUser;
    leadInfo.created_by = userCRM.id;
    const attributes = { ...leadInfo, ...relationInfo };
    // adding first description from the first comment
    attributes.description = firstComment;
    const attributes_comment = {
      created_by: userCRM.id,
      visualizacion_c: 'interno',
      description: firstComment,
      relevance: 'medium',
    };
    const body = { attributes, attributes_comment };
    const { data } = await axios_LB_03.post<LeadCreationResponse>(
      '/lead-new',
      body
    );
    return { id: data.data.id, ...data.data.attributes };
  };
  const updateLead = async (
    leadId: string,
    leadInfo: CardInfoLead,
    relationInfo: RelationInfoLead
  ) => {
    leadInfo.modified_user_id = userCRM.id;
    const attributes = { ...leadInfo, ...relationInfo };
    const { data } = await axios_LB_03.patch<LeadDataResponse>(
      `/lead-update/${leadId}`,
      {
        attributes,
      }
    );
    return { id: data.id, ...data.attributes };
  };
  const getLead = async (id: string) => {
    try {
      const response = await axios_LB_03.get<ReadLeadResponse>(
        `lead-get/${id}`
      );

      return { id: response.data.data.id, ...response.data.data.attributes };
    } catch (error) {
      throw error;
    }
  };
  const getLeadFormatted = async (id: string): Promise<InfoLead> => {
    const {
      name,
      idamercado_c,
      idgrupocliente_c,
      origen_c,
      campaign_id_c,
      estado_c,
      motivo_c,
      producto_c,
      date_closed,
      description,
      currency_id,
      currency_name,
      currency_symbol,
      region_c,
      prioridad_c,
      amount,
      account_id_c,
      contact_id_c,
      lead_id1_c,
      campania_c,
      iddivision_c,
      opportunity_id_c,
      country_c,
      probability,
    } = await getLead(id);
    return {
      cardInfo: {
        name,
        idamercado_c,
        idgrupocliente_c,
        origen_c,
        campaign_id_c,
        estado_c,
        motivo_c,
        producto_c,
        date_closed,
        description,
        currency_id,
        currency_name,
        currency_symbol,
        region_c,
        prioridad_c,
        amount,
        campania_c,
        iddivision_c,
        opportunity_id_c,
        country_c,
        probability,
      },
      relationInfo: {
        account_id_c,
        contact_id_c,
        lead_id1_c,
      },
    };
  };
  const getOptionsLanguage = async () => {
    return await Promise.all([
      axios_LB_05.get('./lang-es-divisiones-org-ventas-lists'),
      axios_LB_05.get<CountriesResponse[]>('./pais-list'),
      axios_LB_05.get('/lang-es-estado-motivo-lead-lists'),
      axios_LB_05.get('/lang-es-dimorigenes-lists'),
      axios_LB_05.get('lang-es-prioridad-lists'),
      axios_LB_05.get('/lang-es-dimgrupocliente-lists'),
      axios_GLOBAL.get('/get-currencies'),
      axios_LB_05.get<productForDivAndAM>(
        'lang-es-products-div-amercado-lists'
      ),
    ]);
  };

  //PARA OBTENER LA DIVISION
  const getDivisionL = async () => {
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
  const getAreaMercadoL = async (iddivision: string) => {
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
  //PARA OBTENER LA GRUPO CLIENTE
  const getGrupoCliente = async () => {
    try {
      const { data } = await axios_LB_05.get('/lang-es-dimgrupocliente-lists');
      const res = data.find(
        (el: { [key: string]: string }) => el.div === userCRM.iddivision
      );
      return res;
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
  const deleteMassiveData = async (data: object[]) => {
    try {
      await axios_GLOBAL.patch('/bulk-module-removal', data);
    } catch (error) {
      console.log(error);
    }
  };
  const setUserAssigned = async (
    module_id: string,
    assigned_user_id: string
  ) => {
    const data_send = {
      type: 'HANO_Lead',
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
  //PARA LA ACTUALIZACION MASIVA
  const updateMassiveData = async (data: object[]) => {
    try {
      await axios_GLOBAL.patch('/bulk-module-massive-update', data);
    } catch (error) {
      console.log(error);
    }
  };
  return {
    createLead,
    deleteLead,
    getLead,
    getLeadFormatted,
    getOptionsLanguage,
    getDivisionL,
    getAreaMercadoL,
    updateLead,
    getGrupoCliente,
    getOrigen,
    getEstado,
    deleteMassiveData,
    updateMassiveData,
    setUserAssigned,
  };
};
