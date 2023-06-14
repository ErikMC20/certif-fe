import { ref } from 'vue';
import {
  axios_LB_03,
  axios_LB_04,
  axios_LB_05,
  axios_GLOBAL,
} from 'src/conections/axiosCRM';
import { PhoneModel, ModuleActivity } from '../components/types/index';
import Notification from 'src/modules/Prospects/utils/notify';
import { axios_LB_01, axios_LB_06 } from 'src/conections/axiosCRM';
export interface genericModel {
  [key: string]: string;
}

export const ActivityServices = () => {
  // de manera dinamica
  // const getPhonesProspect = async (
  //   id_module: string,
  //   module: ModuleActivity
  // ) => {
  //   try {
  //     const { data } = await axios_GLOBAL.get<{ phones: PhoneModel[] }>(
  //       `/related-phones-get/${module}/${id_module}`
  //     );
  //     return data.phones;
  //   } catch (error) {
  //     throw error;
  //   }
  // };
  //PARA TELEFONOS DE PROSPECT
  const getPhonesProspect = async (moduletype: string, id_module: string) => {
    try {
      const { data } = await axios_GLOBAL.get(
        `/related-phones-get/${moduletype}/${id_module}`
      );
      const una = data.phones;
      const dos = data.phonesForModule;
      return dos.concat(una);
    } catch (error) {
      throw error;
    }
  };
  //PARA ESTADO DE LLAMADAS
  const getCallStatus = async () => {
    try {
      const { data } = await axios_LB_05.get('/lang-es-status-calls-lists');
      return data;
    } catch (error) {
      throw error;
    }
  };
  //PARA TIPO DE LLAMADASA
  const getCallType = async () => {
    try {
      const { data } = await axios_LB_05.get('/lang-es-direction-calls-lists');
      return data;
    } catch (error) {
      throw error;
    }
  };
  //PARA GUARDAR llamada
  const saveCall = async (data: any) => {
    try {
      await axios_LB_04.post('/calls-new', data);
      Notification(
        'positive',
        'check',
        '<strong> Acción exitosa! </strong> <br/> Se guardo la llamada con exito.'
      );
    } catch (error) {
      console.log(error);
      Notification(
        'negative',
        'warning',
        '<strong> Ops! algo salió mal </strong> <br/>Ocurrió un error al guardar la llamada.'
      );
    }
  };
  //PARA OBTENER EL PROSPECT
  const getProspect = async (id_pros: string) => {
    try {
      const { data } = await axios_LB_03.get(`/leads/${id_pros}`);
      return data;
    } catch (error) {
      throw error;
    }
  };
  //PARA LA BUSQUEDA DE PROSPECTOS
  const searchProspects = async (filter2: string) => {
    const { data } = await axios_LB_03.get(
      `/prospects/search?params=${JSON.stringify({ filter: filter2 })}`
    );
    return data.data;
  };
  //PARA actualizar llamada
  const updateCall = async (data: any, id_pros: string) => {
    try {
      await axios_LB_04.patch(`/calls-update/${id_pros}`, data);
      Notification(
        'positive',
        'check',
        '<strong> Acción exitosa! </strong> <br/> Se actualizo la llamada con exito.'
      );
    } catch (error) {
      console.log(error);
      Notification(
        'negative',
        'warning',
        '<strong> Ops! algo salió mal </strong> <br/>Ocurrió un error al guardar la llamada.'
      );
    }
  };
  //PARA OBTENER LA LLAMADA
  const getCalls = async (id_call: string) => {
    try {
      const { data } = await axios_LB_04.get(`/calls-get/${id_call}`);
      return data.data;
    } catch (error) {
      throw error;
    }
  };
  //PARA OBTENER LA NOTA
  const getNote = async (id_note: string) => {
    try {
      const { data } = await axios_LB_04.get(`/notes-get/${id_note}`);
      return data.data;
    } catch (error) {
      throw error;
    }
  };
  //PARA CREAR UNA NUEVA NOTA
  const saveNote = async (data: any) => {
    try {
      await axios_LB_04.post('/notes-new', data);
      Notification(
        'positive',
        'check',
        '<strong> Acción exitosa! </strong> <br/> Se guardo la nota con exito.'
      );
    } catch (error) {
      console.log(error);
      Notification(
        'negative',
        'warning',
        '<strong> Ops! algo salió mal </strong> <br/>Ocurrió un error al guardar la nota.'
      );
    }
  };
  //PARA ACTUALIZAR LA NOTA
  const updateNote = async (data: any, id_note: string) => {
    try {
      await axios_LB_04.patch(`/notes-update/${id_note}`, data);
      Notification(
        'positive',
        'check',
        '<strong> Acción exitosa! </strong> <br/> Se actualizo la nota con exito.'
      );
    } catch (error) {
      console.log(error);
      Notification(
        'negative',
        'warning',
        '<strong> Ops! algo salió mal </strong> <br/>Ocurrió un error al guardar la nota.'
      );
    }
  };
  //PARA ELIMINAR UNA LLAMADA
  const deleteCall = async (id_call: string, id_user: string) => {
    try {
      await axios_LB_04.delete(`/calls-delete/${id_call}/${id_user}`);
      Notification(
        'positive',
        'check',
        '<strong> Acción exitosa! </strong> <br/> Se elimino la llamada con exito.'
      );
    } catch (error) {
      console.log(error);
      Notification(
        'negative',
        'warning',
        '<strong> Ops! algo salió mal </strong> <br/>Ocurrió un error al eliminar la llamada.'
      );
    }
  };
  //PARA OBTENER LOS TELEFONOES SECUNDARIOS
  const getPhonesSecun = async () => {
    try {
      const { data } = await axios_LB_05.get('/tipo-telefono-list');
      return data;
    } catch (error) {
      throw error;
    }
  };
  //PARA OBTENER LOS TELEFONOES SECUNDARIOS CON EL ID
  const getPhonesSecunId = async (id_phone: string) => {
    try {
      const { data } = await axios_LB_05.get(`/tipo-telefono-list/${id_phone}`);
      return data;
    } catch (error) {
      throw error;
    }
  };
  //PARA CREAR LOS COMENTARIOS
  const saveComent = async (data: any) => {
    try {
      await axios_GLOBAL.post('/comments-new', data);
    } catch (error) {
      console.log(error);
    }
  };
  //PARA OBTENER LOS TELEFONOS DEL CONTACTO
  const getPhonesRelaContact = async (tabla_name: string, id_pros: string) => {
    try {
      const { data } = await axios_GLOBAL(
        `/related-phones-contacts-get/${tabla_name}/${id_pros}`
      );
      return data.data_contacts;
    } catch (error) {
      throw error;
    }
  };
  //PARA ELIMINAR UNA NOTA
  const deleteNote = async (id_note: string, id_user: string) => {
    try {
      await axios_LB_04.delete(`/notes-delete/${id_note}/${id_user}`);
      Notification(
        'positive',
        'check',
        '<strong> Acción exitosa! </strong> <br/> Se elimino la nota con exito.'
      );
    } catch (error) {
      console.log(error);
      Notification(
        'negative',
        'warning',
        '<strong> Ops! algo salió mal </strong> <br/>Ocurrió un error al eliminar la nota.'
      );
    }
  };
  //PARA OBTENER LOS MODULOS
  const getModules = async () => {
    try {
      const { data } = await axios_LB_05.get('/lang-es-modules-lists');
      return data;
    } catch (error) {
      throw error;
    }
  };
  //PARA OBTENER LOS DATOS MANDANDO ID DE MODULE Y EL MODULO
  const getModuleTypeID = async (modulo: string, id_mod: string) => {
    try {
      const { data } = await axios_GLOBAL.get(
        `/module-get/${modulo}/${id_mod}`
      );
      return data.data;
    } catch (error) {
      throw error;
    }
  };
  // PARA OBTENER FILTRO DE PROSPECTOS
  const getFiltroPro = async (params: any) => {
    try {
      const data = await axios_LB_03.get(
        `/prospects_advanced_filter?params=${JSON.stringify(params)}`
      );
      return data.data;
    } catch (error) {
      console.log(error);
    }
  };
  // PARA OBTENER FILTRO DE CUENTAS
  const getFiltroAco = async (params: any) => {
    try {
      const data = await axios_LB_01.get(
        `/accounts_advanced_filter?params=${JSON.stringify(params)}`
      );
      return data.data.data;
    } catch (error) {
      console.log(error);
    }
  };
  // PARA OBTENER FILTRO DE CONTACTOS
  const getFiltroCon = async (params: any) => {
    try {
      const data = await axios_LB_01.get(
        `/contacts_advanced_filter?params=${JSON.stringify(params)}`
      );
      return data.data.data;
    } catch (error) {
      console.log(error);
    }
  };
  // PARA OBTENER FILTRO DE LEADS
  const getFiltroLed = async (params: any) => {
    try {
      const data = await axios_LB_03.get(
        `/HANO_Leads_advanced_filter?params=${JSON.stringify(params)}`
      );
      return data.data;
    } catch (error) {
      console.log(error);
    }
  };
  // PARA OBTENER FILTRO DE OPORTUNIDADES
  const getFiltroOpo = async (params: any) => {
    try {
      const data = await axios_LB_04.get(
        `/Opportunities_advanced_filter?params=${JSON.stringify(params)}`
      );
      // console.log(data.data);
      return data.data.data;
    } catch (error) {
      console.log(error);
    }
  };
  // PARA OBTENER FILTRO DE ATRIBUTOS
  const getFiltroAtri = async (params: any) => {
    try {
      const data = await axios_LB_06.post(
        `/hani_atributos_filter_advanced?params=${JSON.stringify(params)}`
      );
      // console.log(data.data);
      return data.data;
    } catch (error) {
      console.log(error);
    }
  };
  // PARA OBTENER FILTRO DE CONJUNTO ATRIBUTOS
  const getFiltroConAtri = async (params: any) => {
    try {
      const data = await axios_LB_06.post(
        `/hani_conjunto_atributos_filter_advanced?params=${JSON.stringify(
          params
        )}`
      );
      // console.log(data.data);
      return data.data;
    } catch (error) {
      console.log(error);
    }
  };
  // PARA OBTENER FILTRO DE HANP PROVEEDORES
  const getFiltroHanpProveedor = async (params: any) => {
    try {
      const data = await axios_LB_06.get(
        `/hnap-proveedores-filter-advanced?params=${JSON.stringify(params)}`
      );
      return data.data;
    } catch (error) {
      console.log(error);
    }
  };
  return {
    saveCall,
    getPhonesProspect,
    getCallStatus,
    getCallType,
    getProspect,
    searchProspects,
    updateCall,
    getCalls,
    getNote,
    saveNote,
    updateNote,
    deleteCall,
    getPhonesSecun,
    getPhonesSecunId,
    saveComent,
    getPhonesRelaContact,
    deleteNote,
    getModules,
    getModuleTypeID,
    getFiltroPro,
    getFiltroAco,
    getFiltroCon,
    getFiltroLed,
    getFiltroOpo,
    getFiltroAtri,
    getFiltroConAtri,
    getFiltroHanpProveedor,
  };
};
