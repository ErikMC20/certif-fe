import {
  GrupoClienteResponse,
  CurrencyResponse,
} from 'src/components/types/index';
import {
  axios_LB_06,
  axios_LB_05,
  axios_GLOBAL,
  axios_HANSACRM3,
} from 'src/conections/axiosCRM';
import { userStore } from 'src/modules/Users/store/UserStore';
import { LeadDataResponse } from '../utils/types';
import { CountriesResponse } from 'src/modules/Leads/utils/types';
import Notification from 'src/modules/Accounts/utils/notify';

import { dataListProd } from '../utils/types';
import { dataFormatCRM3 } from 'src/conections/conexionCRM3';
import * as path from 'path';

const { userCRM } = userStore();

export const useQuotationModelService = () => {
  // const getOptionsLanguage = async () => {
  //   return await Promise.all([
  //     axios_LB_05.get('./lang-es-divisiones-org-ventas-lists'),
  //     axios_LB_05.get<CountriesResponse[]>('./pais-list'),
  //     axios_LB_05.get('/lang-es-estado-motivo-lead-lists'),
  //     axios_LB_05.get('/lang-es-dimorigenes-lists'),
  //     axios_LB_05.get('lang-es-prioridad-lists'),
  //     axios_LB_05.get<GrupoClienteResponse[]>('/lang-es-dimgrupocliente-lists'),
  //     axios_GLOBAL.get<CurrencyResponse>('/get-currencies'),
  //   ]);
  // };

  const getOptionsLanguage = async () => {
    const valueList = await Promise.all([
      axios_LB_05.get('/lang-es-document-category-doms'),
      axios_LB_05.get('/lang-es-document-status-doms'),
      axios_LB_05.get('/lang-es-document-template-type-doms'),
      axios_LB_05.get('/lang-es-hansa-estado-documento-lists'),
    ]);
    return valueList;
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

  //PARA LA LISTA DE ALMACEN
  const listModelProducts = async (params: dataListProd) => {
    try {
      const { idmodelo, typesearch } = params;
      const { data } = await axios_LB_06.get(
        `/hanq_modelo_List_productos?params=${JSON.stringify({
          idmodelo: idmodelo,
          typesearch: typesearch,
        })}`
      );

      return data;
    } catch (error) {
      throw error;
    }
  };
  //PARA LA LISTA DE COLORES
  const listColors = async (idmod: string) => {
    try {
      // console.log(idmod);
      const { data } = await axios_LB_06.post(
        `/hanq_modelo_get_name_colors_to_modelocotizacion_and_stock?params=${JSON.stringify(
          {
            idmodelo: idmod,
          }
        )}`
      );
      // console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  };
  //PARA ACTUALIZAR LA LISTA DE COLORES
  const listColorsAuto = async (idmod: string) => {
    try {
      const { idmodelo } = idmod;
      const { data } = await axios_LB_06.post(
        `/hanq_modelo_insert_name_colors_to_modelocotizacion_and_products_actomatic?params=${JSON.stringify(
          {
            idmodelo: idmodelo,
          }
        )}`
      );
      return data;
    } catch (error) {
      throw error;
    }
  };
  //PARA LISTAR LA LISTA DE PRODUCTOS POR FILTROS DE CEHCK
  const getListaProds = async (params: any) => {
    try {
      const data = await axios_LB_06.get(
        `/hanq_modelo_List_stock_for_model?params=${JSON.stringify(params)}`
      );
      return data.data;
    } catch (error) {
      console.log(error);
    }
  };
  //PARA LISTAR LA LISTA DE LOS TEMPLATES DE CABECERA Y DATOS TECNICOS
  const getTemplates = async (params: any) => {
    try {
      const data = await axios_LB_06.get('/aos-pdf-templates', params);
      // console.log(data.data);
      return data.data;
    } catch (error) {
      console.log(error);
    }
  };
  //PARA LISTAR DE CADA PESTAÑA
  const getListsPesta = async (params: any) => {
    try {
      // const { data } = await axios_LB_06.get(
      //   '/hanq_modelo_get_list_sub_panels',
      //   params
      // );
      const { data } = await axios_LB_06.get(
        `/hanq_modelo_get_list_sub_panels?params=${JSON.stringify(params)}`
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  //PARA CREAR UNA COTIZACION
  const crearModuloQuotation = async (data: any) => {
    try {
      await axios_GLOBAL.post('/module-new', data);
      Notification(
        'positive',
        'check',
        '<strong>Correcto!</strong> <br/> Se agrego correctamente.'
      );
    } catch (error) {
      console.log(error);
      Notification(
        'error',
        'error',
        '<strong>Ops!</strong> <br/> Ocurrió un error.'
      );
    }
  };
  //PARA OBTENER LOS DATOS MANDANDO ID DE MODULE Y EL MODULO
  const getModuloQuotation = async (modulo: string, id_mod: string) => {
    try {
      const { data } = await axios_GLOBAL.get(
        `/module-get/${modulo}/${id_mod}`
      );
      return { id: data.data.id, ...data.data.attributes };
    } catch (error) {
      throw error;
    }
  };
  //PARA LISTAR LAS CATEGORIAS DE LOS DATOS TECNICOS
  const getCategoryModel = async (params: any) => {
    try {
      const data = await axios_LB_06.get('/hanq-categorias', params);
      // console.log(data.data);
      return data.data;
    } catch (error) {
      console.log(error);
    }
  };
  const saveDocuments = async (
    dataDocument: any,
    file: any,
    modRelation: any,
    idRelation: any
  ) => {
    const datares = {
      type: 'Documents',
      id: 'de15a73a-a754-c170-ed61-642b369e63d1',
    };
    const module_name = modRelation;
    const module_id = idRelation;
    try {
      const dataResponse = await axios_LB_06.post(
        '/aos_quotes_save_documents',
        dataDocument
      );

      datares.id = dataResponse.data.idDocument;
      const dataResponse2 = await axios_GLOBAL.post(
        `/post-relationships-module-create/${module_name}/${module_id}`,
        datares
      );

      //const dateSendCRM3 = { data: dataResponse };
      const dataSendFile = dataFormatCRM3('guardar_doc', dataResponse, file);
      const data = await axios_HANSACRM3.post(
        '/service/v4_1/rest.php',
        dataSendFile
      );
      return data.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    getOptionsLanguage,
    getDivisionL,
    getAreaMercadoL,
    // updateLead,
    // getGrupoCliente,
    // getOrigen,
    // getEstado,
    listModelProducts,
    listColors,
    getListaProds,
    getTemplates,
    getListsPesta,
    crearModuloQuotation,
    getModuloQuotation,
    getCategoryModel,
    saveDocuments,
  };
};
