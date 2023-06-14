/* eslint-disable @typescript-eslint/no-explicit-any */
import { axios_rep_01 } from '../../../conections/axiosPRY';
import { GenericModel } from '../utils/types';

export const getWorkareasList = async (id: string) => {
  try {
    const { data } = await axios_rep_01.get(`/workareas/project/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getTaskList = async (id: string) => {
  try {
    const { data } = await axios_rep_01.get(`/tasks/planning/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getGoalsList = async (plnningTd: string) => {
  try {
    const { data } = await axios_rep_01.get(`/goals/planning/${plnningTd}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const createGoal = async (dataSend: any) => {
  try {
    const data = axios_rep_01.post('/goals', dataSend);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateGoal = async (id: string, dataSend: GenericModel) => {
  try {
    const data = axios_rep_01.patch(`/goals/${id}`, dataSend);
    return data;
  } catch (error) {
    throw error;
  }
};
