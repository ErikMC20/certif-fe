/* eslint-disable @typescript-eslint/no-explicit-any */
import { axios_rep_01 } from '../../../conections/axiosPRY';
import { base, BasicInformation } from '../utils/types';

export const getTableData = async (params: any) => {
  try {
    const { data } = await axios_rep_01.get(
      `/workarea?params=${JSON.stringify(params)}`
    );
    return {
      rows: data.rows,
      total: data.total,
    };
  } catch (error) {
    throw error;
  }
};

export const createWorkArea = async (
  information: BasicInformation,
  supervisor: string,
  comment: string
) => {
  try {
    const dataSend = {
      ...information,
      name: information.name?.toUpperCase(),
      supervisors: supervisor,
      comments: [comment],
    };
    const { data } = await axios_rep_01.post('/workareas', dataSend);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getOneWorkArea = async (id: string) => {
  try {
    const response = await axios_rep_01.get(`/workareas/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateWorkArea = async (
  id: string,
  information: BasicInformation
) => {
  try {
    const response = await axios_rep_01.patch(`/workareas/${id}`, information);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteWordArea = async (id: string) => {
  try {
    const response = await axios_rep_01.delete(`/workareas/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSupervisor = async (id: string) => {
  try {
    const { data } = await axios_rep_01.get(`/supervisors/workareas/${id}`);
    return data[0];
  } catch (error) {
    throw error;
  }
};

export const updateSupervisor = async (id: string, dataSend: base) => {
  try {
    const { data } = await axios_rep_01.patch(`/supervisors/${id}`, dataSend);
    return data;
  } catch (error) {
    throw error;
  }
};
