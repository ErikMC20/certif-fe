import {
  axios_LB_06,
  axios_LB_05,
  axios_GLOBAL,
  axios_HANSACRM3,
} from 'src/conections/axiosCRM';
import { userStore } from 'src/modules/Users/store/UserStore';
import Notification from 'src/modules/Accounts/utils/notify';

import {
  dataFormatCRM3,
  dataFormatCRM3Basic,
} from 'src/conections/conexionCRM3';

import {
  DivisionesModel,
  GrupoCliente,
  PaisListModel,
} from '../../../components/types/index';

import axios from 'axios';

const { userCRM } = userStore();

export const useDocumentsModelService = () => {
  const getOptionsLanguageDocuments = async () => {
    const valueList = await Promise.all([
      axios_LB_05.get<DivisionesModel[]>(
        '/lang-es-divisiones-org-ventas-lists'
      ),
      axios_LB_05.get<GrupoCliente[]>('lang-es-dimgrupocliente-lists'),
      axios_LB_05.get<PaisListModel[]>('pais-list'),
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

  const saveModelDocument = async (
    dataDocument: any,
    nameDocumentTemp: any
  ) => {
    try {
      const dataResponse = await axios_GLOBAL.post(
        '/save_documents',
        dataDocument
      );
      if (dataResponse.data.status === 400) {
        const dataSendFile = dataFormatCRM3Basic('deletedFileUpload', {
          data: {
            tempFileName: nameDocumentTemp,
          },
        });
        const data = await axios_HANSACRM3.post(
          '/service/v4_1/rest.php',
          dataSendFile
        );
        Notification(
          'negative',
          'warning',
          '<strong> Ops! algo salió mal </strong> <br/>Ocurrió un error en los datos.'
        );
      }

      return dataResponse.data;
    } catch (error) {
      const dataSendFile = dataFormatCRM3Basic('deletedFileUpload', {
        data: {
          tempFileName: nameDocumentTemp,
        },
      });
      const data = await axios_HANSACRM3.post(
        '/service/v4_1/rest.php',
        dataSendFile
      );
      Notification(
        'negative',
        'warning',
        '<strong> Ops! algo salió mal </strong> <br/>Ocurrió un error en los datos.'
      );
      console.error(error);
    }
  };

  const saveRelationModuleWithDocumnet = async (
    dataResponse: any,
    modRelation: any,
    idRelation: any
  ) => {
    try {
      const datares = {
        type: 'Documents',
        id: 'de15a73a-a754-c170-ed61-642b369e63d1',
      };
      const module_name = modRelation;
      const module_id = idRelation;

      datares.id = dataResponse.idDocument;

      const dataResponse2 = await axios_GLOBAL.post(
        `/post-relationships-module-create/${module_name}/${module_id}`,
        datares
      );

      return dataResponse2.data;
    } catch (error) {
      console.error(error);
    }
  };

  const updateDocumentTemp = async (
    dataResponse: any,
    dataNameDocumentTemp: any
  ) => {
    //const dateSendCRM3 = { data: dataResponse };
    const dataSEndUpdateDocument = dataResponse;
    dataSEndUpdateDocument.tempFileName = dataNameDocumentTemp;

    const dataSendFile = dataFormatCRM3Basic('changeFileUpload', {
      data: dataSEndUpdateDocument,
    });
    const data = await axios_HANSACRM3.post(
      '/service/v4_1/rest.php',
      dataSendFile
    );
    return data.data;
  };

  const saveFileTemp = async (file: any) => {
    try {
      const dataSendFile = dataFormatCRM3('saveTempFile', {}, file);
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
    getOptionsLanguageDocuments,
    getDivisionL,
    getAreaMercadoL,
    saveDocuments,
    saveFileTemp,
    saveModelDocument,
    saveRelationModuleWithDocumnet,
    updateDocumentTemp,
  };
};
