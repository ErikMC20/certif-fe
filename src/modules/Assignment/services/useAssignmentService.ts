/* eslint-disable @typescript-eslint/no-explicit-any */
import { axios_rep_01 } from '../../../conections/axiosPRY';
import { BasicInformation } from '../utils/types';

export const getOneLoadedTask = async (id: string) => {
  try {
    const res = await axios_rep_01.get(`/loaded-tasks/${id}`);

    return res;
  } catch (error) {
    throw error;
  }
};
export const createLoadedTask = async (dataSend: any) => {
  try {
    const { data } = await axios_rep_01.post('/loaded-tasks', dataSend);
    return data;
  } catch (error) {}
};

export const getLastPlanning = async (id: string) => {
  try {
    const { data } = await axios_rep_01.get(`/projects/lastplanning/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getProjectByUser = async (id: string) => {
  try {
    const { data } = await axios_rep_01.get(`/projects/user/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getProjectTask = async (id: string) => {
  try {
    const { data } = await axios_rep_01.get(`/asignacions/tasks/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAssignmentByUser = async (id: string, project_id: string) => {
  try {
    const { data } = await axios_rep_01.get(
      `/projects/user/assignment/${id}/${project_id}`
    );
    // console.log('data', data);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getWorkareasByUser = async (id: string, project_id: string) => {
  try {
    const { data } = await axios_rep_01.get(
      `/projects/user/workareas/${id}/${project_id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

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

export const getTasksProject = async (id: string) => {
  try {
    const { data } = await axios_rep_01.get(`/projects/tasks/${id}`);

    return data;
  } catch (error) {
    throw error;
  }
};

export const getGoalsWorkArea = async (id: string) => {
  try {
    const { data } = await axios_rep_01.get(`/asignacions/goal/${id}`);
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

export const getTableData = async (id: string, params: any) => {
  try {
    const { data } = await axios_rep_01.get(
      `/asignacions/project/${id}?params=${JSON.stringify(params)}`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getOneAssignment = async (id: string) => {
  try {
    const response = await axios_rep_01.get(`/asignacions/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getAllTasks = async (id: string) => {
  try {
    const response = await axios_rep_01.get(`/asignacions/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const createAssignment = async (information: any, tasks: any[]) => {
  try {
    const dataSend = {
      ...information,
      tareas: tasks,
    };
    const { data } = await axios_rep_01.post('/asignacions', dataSend);
    return data;
  } catch (error) {
    console.log(error);
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

export const saveDataChargedUp = async (dataSend: any) => {
  try {
    const { data } = await axios_rep_01.post(
      '/loaded-tasks/approved',
      dataSend
    );
    return data;
  } catch (error) {
    throw error;
  }
};
