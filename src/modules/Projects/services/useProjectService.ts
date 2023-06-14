/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReponsibleUserModel } from 'src/components/types';
import { axios_rep_01 } from '../../../conections/axiosPRY';
import { axios_LB_01, axios_PREFERENCES } from 'src/conections/axiosCRM';
import {
  BasicInformation,
  Params,
  base,
  FinancialInformation,
  ClientInformation,
} from '../utils/types';
import { userStore } from 'src/modules/Users/store/UserStore';

const { userCRM } = userStore();

export const getTableData = async (params: Params) => {
  try {
    const { data } = await axios_rep_01.get(
      `/projects?params=${JSON.stringify(params)}`
    );
    return {
      ...data,
    };
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

export const createProject = async (
  information: BasicInformation,
  financial: FinancialInformation,
  clientinfo: ClientInformation,
  responsible: ReponsibleUserModel[],
  comment: string
  // oportunities: ClientData
) => {
  try {
    const dataSend = {
      ...information,
      ...financial,
      ...clientinfo,
      responsible: responsible,
      comments: comment,
    };
    console.log(dataSend);
    const { data } = await axios_rep_01.post('/projects', dataSend);
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

export const getOneProject = async (id: string) => {
  try {
    const response = await axios_rep_01.get(`projects/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateProject = async (
  id: string,
  information: BasicInformation,
  clientinfo: ClientInformation,
  financial: FinancialInformation
) => {
  try {
    const dataSend = {
      ...information,
      ...clientinfo,
      ...financial,
    };
    const response = await axios_rep_01.patch(`/projects/${id}`, dataSend);
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
  try {
    await axios_rep_01.post('/projects/delete_mutiple', data);
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
