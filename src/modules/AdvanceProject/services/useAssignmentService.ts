/* eslint-disable @typescript-eslint/no-explicit-any */
import { axios_rep_01 } from '../../../conections/axiosPRY';
import { axios_LB_01 } from 'src/conections/axiosCRM';
import { BasicInformation } from '../utils/types';

// import {
//   BasicInformation,
//   Params,
//   base,
//   FinancialInformation,
// } from '../utils/types';
/* eslint-disable @typescript-eslint/no-explicit-any */

export const getWorkareasList = async (id: string) => {
  try {
    const { data } = await axios_rep_01.get(`/workareas/project/${id}`);
    console.log(id, data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const getTableData = async (params: any) => {
  try {
    const { data } = await axios_rep_01.get(
      `/asignacion?params=${JSON.stringify(params)}`
    );
    return {
      rows: data.rows,
      total: data.total,
    };
  } catch (error) {
    console.log(error);
  }
};

export const createAssignment = async (
  information: BasicInformation,
  responsible: string[],
  comment: string
) => {
  try {
    const dataSend = {
      ...information,
      supervisors: responsible,
      comments: [comment],
    };
    const { data } = await axios_rep_01.post('/assignment', dataSend);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getOneAssignment = async (id: string) => {
  try {
    const response = await axios_rep_01.get(`/assignment/${id}`);
    console.log(response);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateAssignment = async (
  id: string,
  information: BasicInformation
) => {
  try {
    const response = await axios_rep_01.patch(`/assignment/${id}`, information);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAsignacion = async (id: string) => {
  try {
    const response = await axios_rep_01.get(`/asignacion/${id}`);
    console.log(response);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateAsignacion = async (
  id: string,
  information: BasicInformation
) => {
  try {
    const response = await axios_rep_01.patch(`/asignacion/${id}`, information);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAccountFilter = async (dataFilter: any) => {
  try {
    const { data } = await axios_rep_01.post('/filter/accounts', dataFilter);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getContactsAccount = async (account_id: string) => {
  try {
    const { data } = await axios_LB_01.get(
      `/account_get_contacts/${account_id}`
    );
    return data.data;
  } catch (error) {
    console.log(error);
  }
};
