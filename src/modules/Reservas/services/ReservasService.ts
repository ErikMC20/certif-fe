
import {
  axios_LB_03,
  axios_LB_05,
  axios_LB_02,
  axios_GLOBAL,
} from 'src/conections/axiosCRM';
import { userStore } from 'src/modules/Users/store/UserStore';
import { LeadDataResponse } from '../utils/types';
import Notification from 'src/modules/Accounts/utils/notify';

import {
  LeadCreationResponse,
  ReadLeadResponse,
  InfoLead,
  CardInfo,
  RelationInfoLead,
} from '../utils/types';

const { userCRM } = userStore();

export const useReservasService = () => {
  const createReserva = async (
    leadInfo: CardInfo,
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

  const convertReserva = async (
    leadInfo: CardInfo,
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
    const { data } = await axios_LB_02.post<LeadCreationResponse>(
      '/reserve-new',
      body
    );
    return { id: data.data.id, ...data.data.attributes };
  };

  const updateReserva = async (
    leadId: string,
    leadInfo: CardInfo,
    relationInfo: RelationInfoLead
  ) => {
    leadInfo.modified_user_id = userCRM.id;
    const attributes = { ...leadInfo, ...relationInfo };
    const { data } = await axios_LB_02.patch<LeadDataResponse>(
      `/Reserve-update/${leadId}`,
      {
        attributes,
      }
    );
    return { id: data.id, ...data.attributes };
  };
  const getReservas = async (
    id: string
  ) => {
    try {
      const response = await axios_LB_02.get<ReadLeadResponse>(
        `reservas-get/${id}`
      );
      //response.data.data.attributes.fecha_venc_c = moment(response.data.data.attributes.fecha_venc_c, 'YYYY-MM-DD').format('DD-MM-YYYY');
      //response.data.data.attributes.reser_stage_c = moment(response.data.data.attributes.reser_stage_c, 'YYYY-MM-DD').format('DD-MM-YYYY');

      return { id: response.data.data.id, ...response.data.data.attributes };
    } catch (error) {
      throw error;
    }
  };
  
  const getReservasFormatted = async (id: string): Promise<InfoLead> => {
    const {
      name,
      iddivision_c,
      idamercado_c,
      idgrupocliente_c,
      reser_stage_c,
      description,
      currency_id,
      currency_name,
      currency_symbol,
      region_c,
      fecha_venc_c,
      hanq_reservas_accountsaccounts_ida,
      hanq_reservas_contactscontacts_ida,
      hanq_reservas_opportunitiesopportunities_ida,
      hanq_reservas_aos_quotesaos_quotes_idb,

      
    } = await getReservas(id);
    return {
      cardInfo: {
        name,
        iddivision_c,
        idamercado_c,
        idgrupocliente_c,
        reser_stage_c,
        description,
        currency_id,
        currency_name,
        currency_symbol,
        region_c,
        fecha_venc_c,
      },
      relationInfo: {
        hanq_reservas_accountsaccounts_ida,
        hanq_reservas_contactscontacts_ida,
        hanq_reservas_opportunitiesopportunities_ida,
        hanq_reservas_aos_quotesaos_quotes_idb,
      },
    };
  };
  const getOptionsLanguage = async () => {
    return await Promise.all([
      axios_LB_05.get('lang-es-opportunity-type-sales-stage-doms'),
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

  const getGrupoCliente = async (iddivision: string) => {
    try {
      const { data } = await axios_LB_05.get('/lang-es-dimgrupocliente-lists');
      const res = data.find(
        (el: { [key: string]: string }) => el.div === iddivision
      );
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

  const deleteReserva = async (id: string) => {
    try {
      const { data } = await axios_LB_02.delete(
        `/reservas-delete/${id}/${userCRM.id}`
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
  const deleteMassiveData = async (data: any) => {
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
      type: 'HANQ_Reservas',
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
  const getTipo = async () => {
    try {
      const { data } = await axios_LB_05.get(
        '/lang-es-opportunity-type-sales-stage-doms'
      );
      return data;
    } catch (error) {
      throw error;
    }
  };
  return {
    convertReserva,
    createReserva,
    deleteReserva,
    getReservas,
    getReservasFormatted,
    getOptionsLanguage,
    getDivisionL,
    getAreaMercadoL,
    updateReserva,
    getGrupoCliente,
    getOrigen,
    getEstado,
    deleteMassiveData,
    updateMassiveData,
    setUserAssigned,
    getTipo,
  };
};
