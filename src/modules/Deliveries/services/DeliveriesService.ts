

import {
  GrupoClienteResponse,
  CurrencyResponse,
} from 'src/components/types/index';
import {
  axios_LB_02,
  axios_LB_03,
  axios_LB_05,
  axios_GLOBAL,
} from 'src/conections/axiosCRM';
import { userStore } from 'src/modules/Users/store/UserStore';
import { LeadDataResponse } from '../utils/types';
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

export const useDeliveriesService = () => {
  const createDelivery = async (
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
  const updateDelivery = async (
    deliveryId: string,
    leadInfo: CardInfoLead,
    relationInfo: RelationInfoLead
  ) => {
    leadInfo.modified_user_id = userCRM.id;
    const attributes = { ...leadInfo, ...relationInfo };
    const { data } = await axios_LB_02.patch<LeadDataResponse>(
      `/delivery-update/${deliveryId}`,
      {
        attributes,
      }
    );
    return { id: data.id, ...data.attributes };
  };
  const getDelivery = async (
    id: string
  ) => {
    try {
      const response = await axios_LB_02.get<ReadLeadResponse>(
        `deliveries-get/${id}`
      );

      return { id: response.data.data.id, ...response.data.data.attributes };
    } catch (error) {
      throw error;
    }
  };
  const getDeliveryFormatted = async (id: string): Promise<InfoLead> => {
    const {
      name,
      iddivision_c,
      idamercado_c,
      grupo_cliente_c,
      referencia_c,
      campaign_id_c,
      estado_c,
      lugar_entrega_c,
      producto_c,
      fecha_entrega_c,
      description,
      currency_id,
      currency_name,
      currency_symbol,
      regional_c,
      prioridad_c,
      amount,
      account_id_c,
      contact_id_c,
      lead_id1_c,
      campania_c,
    } = await getDelivery(id);
    return {
      cardInfo: {
        name,
        iddivision_c,
        idamercado_c,
        grupo_cliente_c,
        referencia_c,
        campaign_id_c,
        estado_c,
        lugar_entrega_c,
        producto_c,
        fecha_entrega_c,
        description,
        currency_id,
        currency_name,
        currency_symbol,
        regional_c,
        prioridad_c,
        amount,
        campania_c,
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
      axios_LB_02.get('/Get_List_Place_Delivey'),
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
  const deleteDelivery = async (id: string) => {
    try {
      const { data } = await axios_LB_02.delete(
        `/deliveries-delete/${id}/${userCRM.id}`
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
      type: 'HANE_Entregas',
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

  const updatePlaca = async (
    deliveryId: string,
    leadInfo: CardInfoLead,
    relationInfo: RelationInfoLead
  ) => {
    leadInfo.modified_user_id = userCRM.id;
    const attributes = { ...leadInfo, ...relationInfo };
    const { data } = await axios_LB_02.patch<LeadDataResponse>(
      `/placa-update/${deliveryId}`,
      {
        attributes,
      }
    );
    return { id: data.id, ...data.attributes };
  };
  //PARA OBTENER EL ESTADO
  const getplace = async () => {
    try {
      const { data } = await axios_LB_02.get(
        '/Get_List_Place_Delivey'
      );
      return data;
    } catch (error) {
      throw error;
    }
  };
  return {
    createDelivery,
    deleteDelivery,
    getDelivery,
    getDeliveryFormatted,
    getOptionsLanguage,
    getDivisionL,
    getAreaMercadoL,
    updateDelivery,
    getGrupoCliente,
    getOrigen,
    getEstado,
    deleteMassiveData,
    updateMassiveData,
    setUserAssigned,
    updatePlaca,
    getplace,
  };
};

