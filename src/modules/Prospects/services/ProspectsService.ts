/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  axios_GLOBAL,
  axios_LB_01,
  axios_LB_03,
  axios_LB_05,
  axios_PREFERENCES,
} from 'src/conections/axiosCRM';
import Notification from 'src/modules/Accounts/utils/notify';
import { userStore } from 'src/modules/Users/store/UserStore';
import { Option, ProspectResponseModel } from '../utils/types';
import { ContactRequestModel } from '../../../components/types/index';

const { userCRM } = userStore();

export const ProspectService = () => {
  /** AssignedUser Service */
  const getUserAssigned = async (id_module: string) => {
    try {
      const { data } = await axios_GLOBAL.get(
        `/AssignedUser-get/${'leads'}/${id_module}`
      );
      return data.data.attributes[0];
    } catch (error) {
      throw error;
    }
  };
  const getListUsersAssigned = async (id_module: string) => {
    try {
      const { data } = await axios_GLOBAL.get(
        `/AssignedUsers-get/${'prospects'}/${userCRM.iddivision}/${id_module}`
      );
      return data.data.attributes[0];
    } catch (error) {
      throw error;
    }
  };
  const setUserAssigned = async (
    module_id: string,
    assigned_user_id: string
  ) => {
    const data_send = {
      type: 'Leads',
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

  /** Campaigns Filter Service */
  const getCampaignsFilter = async (dataFilter: Option) => {
    try {
      const { data } = await axios_LB_03.get(
        `/Prospect_Filter_Campaigns?filter=${JSON.stringify({
          filter: dataFilter,
        })}`
      );

      return data.data;
    } catch (error) {
      throw error;
    }
  };
  const readProspect = async (id: string) => {
    const response = await axios_LB_03.get<ProspectResponseModel>(
      `prospect-get/${id}`
    );
    return response.data;
  };
  const updateProspect = async (id: string, data: object) => {
    await axios_LB_03.patch(`/prospect-update/${id}`, data);
  };
  const updateProspect2 = async (
    id: string,
    data: { attributes: { [key: string]: string | number } }
  ) => {
    data.attributes.modified_user_id = userCRM.id;
    try {
      await axios_LB_03.patch(`/prospect-update/${id}`, data);
    } catch (error) {
      throw error;
    }
  };
  const createProspectPhonesEmails = async (
    idProspect: string,
    body: ContactRequestModel
  ) => {
    await axios_LB_03.post(
      `/create-emails-phones-prospect/${idProspect}`,
      body
    );
  };
  const updateProspectPhonesEmails = async (
    idProspect: string,
    body: ContactRequestModel
  ) => {
    await axios_LB_03.patch(
      `/update-emails-phones-prospect/${idProspect}`,
      body
    );
  };
  const deleteProspectPhonesEmails = async (
    idProspect: string,
    body: ContactRequestModel
  ) => {
    await axios_LB_03.patch(
      `/delete-emails-phones-prospect/${idProspect}`,
      body
    );
  };
  const deleteProspect = async (id: string) => {
    try {
      await axios_LB_03.delete(`/prospect-delete/${id}/${userCRM.id}`);
    } catch (error) {
      throw error;
    }
  };
  const getOptionsLanguage = async () => {
    return await Promise.all([
      axios_LB_05.get('/salutation-dom-lists'),
      axios_LB_05.get('/pais-list'),
      axios_LB_05.get('/lang-es-lead-status-dom-lists'),
      axios_LB_05.get('/lead-source-dom-lists'),
    ]);
  };

  /** Table Services */
  const getTableData = async (params: any) => {
    try {
      const total = await axios_LB_03.get(
        `/prospects_total?filter=${encodeURIComponent(JSON.stringify(params))}`
      );
      const rows = await axios_LB_03.get(
        `/prospects_advanced_filter?params=${encodeURIComponent(
          JSON.stringify(params)
        )}`
      );
      const data = { total: total.data, rows: rows.data };
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getTablePreferences = async () => {
    try {
      const { data } = await axios_PREFERENCES.get(
        `/tables-users-preferences?filter=${JSON.stringify({
          where: { module: 'Prospects', user_id: userCRM.id },
          limit: 1,
        })}`
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const saveTablePreferences = async (data: any) => {
    try {
      const res = await axios_PREFERENCES.post('/tables-users-preferences', {
        module: 'Prospects',
        user_id: userCRM.id,
        pagination: data.pagination,
        visible_columns: data.visible_columns,
        data_filter: data.data_filter,
        visible_fields: data.visible_fields,
        data_extra: data.data_extra,
      });
      return res.data._id;
    } catch (error) {
      console.log(error);
    }
  };

  const updateTablePreferences = async (id: string, data: any) => {
    try {
      await axios_PREFERENCES.patch(`/tables-users-preferences/${id}`, data);
    } catch (error) {
      console.log(error);
    }
  };
  const updateDatosPros = async (data: any) => {
    try {
      await axios_LB_03.post('/bulk-module-prospect-update ', data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateMassiveData = async (data: any) => {
    try {
      await axios_LB_01.post('/bulk-module-update', data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMassiveData = async (data: any) => {
    try {
      await axios_LB_01.patch('/bulk-module-removal', data);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    // prospect services
    deleteProspect,
    // assgined user services
    getUserAssigned,
    setUserAssigned,
    getListUsersAssigned,
    // campaigns filter services
    getCampaignsFilter,
    // table services
    getTableData,
    getTablePreferences,
    saveTablePreferences,
    updateTablePreferences,
    deleteMassiveData,
    updateMassiveData,
    updateDatosPros,
    getOptionsLanguage,
    updateProspect,
    updateProspect2,
    readProspect,
    createProspectPhonesEmails,
    updateProspectPhonesEmails,
    deleteProspectPhonesEmails,
  };
};
