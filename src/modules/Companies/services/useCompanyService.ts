/* eslint-disable @typescript-eslint/no-explicit-any */
import { axios_LB_01, axios_NS_07, axios_PREFERENCES } from 'src/conections/axiosCRM';
import { axios_rep_01 } from '../../../conections/axiosPRY';
import {
  BasicInformation,
  Company,
  Params,
  base
} from '../utils/types';

import { userStore } from 'src/modules/Users/store/UserStore';

const { userCRM } = userStore();

export const getTableData = async (params: Params) => {
  try {
    const { data } = await axios_NS_07.get('/empresas');
    console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getTablePreferences = async () => {
  try {
    const { data } = await axios_PREFERENCES.get(
      `/tables-users-preferences?filter=${JSON.stringify({
        where: { module: 'Projects', user_id: userCRM.id },
        limit: 1,
      })}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const saveTablePreferences = async (data: any) => {
  try {
    const res = await axios_PREFERENCES.post('/tables-users-preferences', {
      module: 'Projects',
      user_id: userCRM.id,
      pagination: data.pagination,
      visible_columns: data.visible_columns,
      data_filter: data.data_filter,
      visible_fields: data.visible_fields,
    });
    return res.data._id;
  } catch (error) {
    throw error;
  }
};

export const updateTablePreferences = async (id: string, data: any) => {
  try {
    await axios_PREFERENCES.patch(`/tables-users-preferences/${id}`, data);
  } catch (error) {
    throw error;
  }
};

export const createCompany = async (
  dataCompany: Company,
  // oportunities: ClientData
) => {
  try {
    // const dataSend = {
    //   ...information,
    //   ...financial,
    //   ...clientinfo,
    //   responsible: responsible,
    //   comments: comment,
    // };
    // console.log(dataSend);
    const { data } = await axios_NS_07.post('/empresas', dataCompany);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getIndicators = async (id: string) => {
  try {
    const response = await axios_rep_01.get(`/projects/indicators/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOneCompany = async (id: string) => {
  try {
    const response = await axios_NS_07.get(`empresas/${id}`);
    console.log('service ',response)
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateCompany = async (
  id: string,
  information: BasicInformation,
) => {
  try {
    const dataSend = {
      ...information,
    };
    const response = await axios_NS_07.patch(`/empresas/${id}`, dataSend);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMilestonesInProgress = async (id: string) => {
  try {
    const data = await axios_rep_01.get(
      `/projects/milestones/inprogress/${id}`
    );
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const getTasksInProgress = async (id: string) => {
  try {
    const data = await axios_rep_01.get(`/projects/tasks/inprogress/${id}`);
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const getAccountFilter = async (dataFilter: base) => {
  try {
    const { data } = await axios_rep_01.post('/filter/accounts', dataFilter);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getContactsAccount = async (account_id: string) => {
  try {
    const { data } = await axios_LB_01.get(
      `/account_get_contacts/${account_id}`
    );
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const getWorkArasList = async (project_id: string) => {
  try {
    const { data } = await axios_rep_01.get(`/workareas/project/${project_id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateStatusProject = async (project_id: string, data: any) => {
  try {
    const resp = await axios_rep_01.patch(
      `/project/status/${project_id}`,
      data
    );
    return resp;
  } catch (error) {
    throw error;
  }
};

export const getGoalsList = async (project_id: string) => {
  try {
    const { data } = await axios_rep_01.get(`/goals/planning/${project_id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getPlanningsList = async (project_id: string) => {
  try {
    const { data } = await axios_rep_01.get(`/plannings/project/${project_id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteMassiveData = async (data: any) => {
  // console.log('delete massive');
  // console.log(data);
  // return;
  try {
    data.items.forEach(async (element:any)=>{
      await axios_NS_07.delete(`empresas/${element.id}`);
    })
    return;
  } catch (error) {
    throw error;
  }
};

export const updateMassiveData = async (data: any) => {
  try {
    await axios_rep_01.post('/projects/update_mutiple', data);
  } catch (error) {
    throw error;
  }
};

export const get_avance_project = async (data_filter: any) => {
  try {
    // const { data } = await axios_rep_01.get(
    //   `/Project_Get_Avance/${id_proyect}`
    // );
    const params = {
      filter: data_filter,
    };
    const { data } = await axios_rep_01.get(
      `/Project_Get_Avance?params=${encodeURIComponent(JSON.stringify(params))}`
    );
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const get_avance_grafico = async (data_filter: any) => {
  try {
    const params = {
      filter: data_filter,
    };
    const { data } = await axios_rep_01.get(
      `/Project_Get_Grafico?params=${encodeURIComponent(
        JSON.stringify(params)
      )}`
    );
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const getActivitiesProyects = async (
  id: string,
  dateStart: string,
  dateEnd: string
) => {
  try {
    const response = await axios_rep_01.get(
      `Get_list_Activities/${id}/${dateStart}/${dateEnd}`
    );
    // console.log('your response', response.data.data[0]);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};
