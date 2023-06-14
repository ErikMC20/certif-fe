import {
  axios_LB_03,
  axios_LB_05,
  axios_LB_06,
  axios_GLOBAL,
} from 'src/conections/axiosCRM';
import { userStore } from 'src/modules/Users/store/UserStore';
import * as utils from '../utils/types';
import { ref } from 'vue';
import Notification from 'src/modules/Accounts/utils/notify';
import { api } from 'boot/axios';
import { ListProducts } from '../../Quotation_model/utils/types';

import {
  LeadCreationResponse,
  ReadLeadResponse,
  InfoLead,
  CountriesResponse,
  CardInfoLead,
  RelationInfoLead,
} from '../utils/types';

const { userCRM } = userStore();

export const useQuotesService = () => {
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
    const module = 'AOS_Quotes';
    try {
      // const response = await api.get(
      //   `${axios_GLOBAL}/module-get/${module}/${id}`
      // );

      const response = await axios_GLOBAL.get<ReadLeadResponse>(
        `module-get/${module}/${id}`
      );

      // const response = await axios_GLOBAL.get(
      //   '/lang-es-divisiones-org-ventas-lists'
      // );

      return response.data;

      //return { id: response.data.data.id, ...response.data.data.attributes };
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
      axios_LB_05.get<GrupoClienteResponse[]>('/lang-es-dimgrupocliente-lists'),
      axios_GLOBAL.get<CurrencyResponse>('/get-currencies'),
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
  const deleteMassiveData = async (data: utils.bulkDeleteQuotes) => {
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
      type: 'Quotes',
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
  //PARA OBTENER LA GRUPO CLIENTE mandando su division
  const getGrupoClientev2 = async (divisi: string) => {
    try {
      const { data } = await axios_LB_05.get('/lang-es-dimgrupocliente-lists');
      const res = data.find(
        (el: { [key: string]: string }) => el.div === divisi
      );
      return res;
    } catch (error) {
      throw error;
    }
  };
  //PARA CREAR UNA COTIZACION
  const crearQuotes = async (data: any) => {
    try {
      await axios_GLOBAL.post('/module-new', data);
    } catch (error) {
      console.log(error);
    }
  };
  //PARA ACTUALIZAR UNA COTIZACION
  const updateQuotes = async (data: any) => {
    try {
      await axios_GLOBAL.patch('/module-update', data);
    } catch (error) {
      console.log(error);
    }
  };

  //PARA TRAER LA LISTA DE ARTICULOS DE UNA COTIZACION
  const getListProductsOfQuotesService = async (
    idQuotes: utils.IdQuotes | any
  ) => {
    try {
      const { data } = await axios_LB_06.get(
        `/aos_quotes_get_articles?params=${JSON.stringify(idQuotes)}`
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  //PARA ACTUALIZAR EL ESTADO DE LA COTIZACION DESDE LA TABLA
  const patchSaveStageQuotes = async (dataSend: any) => {
    try {
      await axios_GLOBAL.patch('/module-update', dataSend);
      Notification(
        'positive',
        'check',
        '<strong>Correcto!</strong> <br/> Se actualizo la etapa correctamente.'
      );
    } catch (error) {
      console.log(error);
    }
  };

  //PARA ACTUALIZAR EL ESTADO DE LA COTIZACION DESDE LA TABLA
  const deleteQuotesService = async (dataSend: any) => {
    try {
      const { module, module_id, login_user } = dataSend;
      // await axios_GLOBAL.delete('/module-delete', dataSend);
      await axios_GLOBAL.delete(
        `/module-delete/${module}/${module_id}/${login_user}`
      );
      Notification(
        'positive',
        'check',
        '<strong>Correcto!</strong> <br/> Se elimino correctamente.'
      );
    } catch (error) {
      console.log(error);
    }
  };

  //PARA OBTENER LOS DATOS MANDANDO ID DE MODULE Y EL MODULO
  const getModuleTypeID = async (modulo: string, id_mod: string) => {
    try {
      const { data } = await axios_GLOBAL.get(
        `/module-get/${modulo}/${id_mod}`
      );

      return {
        type: data.data.type,
        id: data.data.id,
        attributes: { ...data.data.attributes },
      };
    } catch (error) {
      throw error;
    }
  };

  const getGrupoClienteServices = async (dataSend: any) => {
    try {
      const { data } = await axios_LB_05.get('/lang-es-dimgrupocliente-lists');

      const res = data.find(
        (el: { [key: string]: string }) => el.div === dataSend
      );
      return res;
    } catch (error) {
      throw error;
    }
  };

  const getRegionalServices = async (dataSend: any) => {
    try {
      const { data } = await axios_LB_05.get('/pais-list');
      return data;
      // const res = data.find(
      //   (el: { [key: string]: string }) => el.cod_pais === dataSend
      // );
      // return res;
    } catch (error) {
      throw error;
    }
  };

  const getListFPEventsService = async (params: any) => {
    try {
      const { data } = await axios_LB_06.get(
        `/fp-eventos-filter-advanced?params=${JSON.stringify(params)}`
      );

      return data;
    } catch (error) {
      throw error;
    }
  };
  // FILTRO DE BUSQUEDA QUE SE DA AL SELECT DE COTIZACIONES DE PRODUCTOS
  const getListProductSelect = async (params: any) => {
    // console.log(params);
    try {
      const { data } = await axios_LB_06.get(
        `/aos_quotes_filter_products?params=${JSON.stringify(params)}`
      );
      // console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  };
  // PARA LISTA PRODUCTOS Y VER LOS PRODUCTOS SUS CHSIS (VEERPROCUTF)
  const getListProductVer = async (params: any) => {
    try {
      const { data } = await axios_LB_06.get(
        `/aos_quotes_filter_products_stock?params=${JSON.stringify(params)}`
      );
      return data;
    } catch (error) {
      throw error;
    }
  };
  // PARA LA MONDEA DE LOS PRODUCTOS
  const getMoneda = async (filter: any) => {
    try {
      const { data } = await axios_LB_06.get(
        `/currencies?filter=${JSON.stringify(filter)}`
      );
      return data;
    } catch (error) {
      throw error;
    }
  };
  // PARA EL FILTRO DEL SELECT VERSION 2
  const getFilterProductosVer2 = async (filter: any) => {
    try {
      const { data } = await axios_LB_06.get(
        `/aos_quotes_filter_products_v2?params=${JSON.stringify(filter)}`
      );
      return data;
    } catch (error) {
      throw error;
    }
  };
  // PARA TRAER LAS IMAGENES
  const getImagesVerProduct = async (val: any) => {
    try {
      const { data } = await axios_LB_06.get(
        `/aos_quotes_get_images_to_modelo?params=${JSON.stringify(val)}`
      );
      return data[0];
    } catch (error) {
      throw error;
    }
  };
  //PARA CREAR UNA COTIZACION VERSIO0N 2
  const crearQuotesVer2 = async (data1: any) => {
    try {
      const datasend = { datarequest: data1 };
      const newQu = await axios_LB_06.post(
        '/aos_quotes_save_quotes_information',
        datasend
      );
      // await axios_LB_06.post(
      //   `/aos_quotes_save_quotes_information?params=${JSON.stringify(datasend)}`
      // );
      return newQu.data.quotes.data.id;
    } catch (error) {
      console.log(error);
    }
  };
  //PARA VER LA LISTA DE ARTICULOS DE LA COTIZACION
  const getListArticuloVer2 = async (datasend: any) => {
    try {
      const { data } = await axios_LB_06.get(
        `/aos_quotes_get_articles_v2?params=${JSON.stringify(datasend)}`
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  // PARA LISTA DE LOS SUBPANELES POR NOMBRE DE SUB PANEL
  const getListInformationSubPanels = async (params: any) => {
    try {
      const { data } = await axios_LB_06.get(
        `/aos_quotes_get_data_subpanels?params=${JSON.stringify(params)}`
      );
      return data;
    } catch (error) {
      throw error;
    }
  };
  //PARA ACTUALIZAR UNA COTIZACION VERSIO0N 2
  const updateQuotesVer2 = async (data1: any) => {
    try {
      const datasend = { datarequest: data1 };
      const newQu = await axios_LB_06.patch(
        '/aos_quotes_save_update_quotes_information',
        datasend
      );
      // await axios_LB_06.post(
      //   `/aos_quotes_save_quotes_information?params=${JSON.stringify(datasend)}`
      // );
      return newQu.data.quotes.data.id;
    } catch (error) {
      console.log(error);
    }
  };

  //PARA traer los correos de cuentas y contactos
  const getemailsTosendLayout = async (
    idaccoint: string,
    idcontact: string
  ) => {
    try {
      const datasend = { idaccount: idaccoint, idcontact: idcontact };
      const responseGetEmails = await axios_LB_06.get(
        `/aos_quotes_get_email_constact_accounts_to_send_email?params=${JSON.stringify(
          datasend
        )}`
      );
      return responseGetEmails.data;
    } catch (error) {
      console.log(error);
    }
  };
  //PARA ELIMINAR DEL GRUPO DE LOS PRODUCTOS
  const deleteGroupProducts = async (datadelete: any) => {
    try {
      const response = await axios_LB_06.patch(
        `/aos_quotes_delete_group_products?params=${JSON.stringify(datadelete)}`
      );
    } catch (error) {
      console.log(error);
    }
  };
  //PARA traer los correos de cuentas y contactos
  const deleteProduct = async (datadelete: any) => {
    try {
      const response = await axios_LB_06.patch(
        `/aos_quotes_delete_product_quotes?params=${JSON.stringify(datadelete)}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  //PARA traer la cotizacion en base64
  const getDocumentBase64 = async (dataSendBase64: any) => {
    try {
      const response = await axios_LB_06.get(
        `/convertToBase64?params=${JSON.stringify(dataSendBase64)}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  //PARA OBTENER TODA LA INFORMACION DE UNA COTIZACION
  const getQuotesCompleta = async (idquotes: string) => {
    try {
      const response = await axios_LB_06.get(
        `/aos_quotes_get_information/${idquotes}`
      );
      // return response.data;
      return {
        attributes: response.data.quotes.attributes,
        listProducts: response.data.listProducts,
      };
    } catch (error) {
      console.log(error);
    }
  };
  //PARA OBTENER TODA LA INFORMACION DE UN MODULO DESFRAGMENTADO
  const getModuleNew = async (mod: string, ide: string) => {
    try {
      const response = await axios_GLOBAL.get(`module-get/${mod}/${ide}`);
      return { id: response.data.data.id, ...response.data.data.attributes };
    } catch (error) {
      throw error;
    }
  };
  //PARA RELACION UNA COTIZACION CON UN MODULO
  const relaModuleQuotes = async (
    modEn: string,
    idEn: string,
    modSa: string,
    idSa: string
  ) => {
    try {
      const datasend = {
        type: modSa,
        id: idSa,
      };
      await axios_GLOBAL.post(
        `/post-relationships-module-create/${modEn}/${idEn}`,
        datasend
      );
    } catch (error) {
      throw error;
    }
  };
  //PARA SOLO OBTENER LA REGIONAL
  const getRegionalv2 = async () => {
    const listRegi = ref([]);
    try {
      const { data } = await axios_LB_05.get('/pais-list');
      listRegi.value = data.map((region: any) => region.regiones).flat();
      return listRegi.value;
    } catch (error) {
      console.log(error);
    }
  };
  //PARA AGREGAR IMAGENES
  const saveImg = async () => {
    const listRegi = ref([]);
    try {
      const { data } = await axios_LB_05.get('/pais-list');
      listRegi.value = data.map((region: any) => region.regiones).flat();
      return listRegi.value;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    deleteLead,
    getDivisionL,
    getAreaMercadoL,
    getGrupoCliente,
    getOrigen,
    getEstado,
    deleteMassiveData,
    updateMassiveData,
    setUserAssigned,
    getGrupoClientev2,
    crearQuotes,
    updateQuotes,
    getListProductsOfQuotesService,
    patchSaveStageQuotes,
    getModuleTypeID,
    deleteQuotesService,
    getGrupoClienteServices,
    getRegionalServices,
    getListFPEventsService,
    getListProductSelect,
    getListProductVer,
    getListInformationSubPanels,
    getMoneda,
    getFilterProductosVer2,
    getImagesVerProduct,
    crearQuotesVer2,
    getListArticuloVer2,
    updateQuotesVer2,
    getemailsTosendLayout,
    deleteGroupProducts,
    deleteProduct,
    getDocumentBase64,
    getQuotesCompleta,
    getModuleNew,
    relaModuleQuotes,
    getRegionalv2,
  };
};
