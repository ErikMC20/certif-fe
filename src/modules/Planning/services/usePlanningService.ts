import { axios_rep_01 } from '../../../conections/axiosPRY';
import { BasicInformation, TaskModel } from '../utils/types';

export const getTableData = async () => {
  try {
    // const { data } = await axios_rep_01.get(
    //   `/workarea?params=${JSON.stringify(params)}`
    // );
    return {
      rows: [],
      total: 0,
    };
  } catch (error) {
    console.log(error);
  }
};

export const createPlanning = async (
  information: BasicInformation,
  comment: string,
  tasks: TaskModel[]
) => {
  try {
    const dataSend = {
      ...information,
      comment: comment,
      tasks: tasks,
    };
    const { data } = await axios_rep_01.post('/plannings', dataSend);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const versionPlanning = async (
  information: BasicInformation,
  comment: string,
  tasks: TaskModel[]
) => {
  try {
    const dataSend = {
      ...information,
      comment: comment,
      tasks: tasks,
    };
    const { data } = await axios_rep_01.post('/plannings/version', dataSend);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getOnePlanning = async (id: string) => {
  try {
    const response = await axios_rep_01.get(`/plannings/${id}`);

    return response.data;
  } catch (error) {
    return error;
  }
};

export const getPlanningTasks = async (id: string) => {
  try {
    const { data } = await axios_rep_01.get(`/tasks/planning/${id}`);
    return data;
  } catch (error) {
    return error;
  }
};

export const updatePlanning = async (
  id: string,
  information: BasicInformation,
  tasks: TaskModel[]
) => {
  try {
    const dataSend = {
      ...information,
      tasks: tasks,
    };
    const response = await axios_rep_01.patch(`/plannings/${id}`, dataSend);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const approvedPlanning = async (id: string, projectId: string) => {
  try {
    const response = await axios_rep_01.patch(`/plannings/approved/${id}`, {
      projectId: projectId,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const cancelPlanning = async (id: string) => {
  try {
    const response = await axios_rep_01.patch(`/plannings/cancel/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deletePlanning = async (id: string) => {
  try {
    const response = await axios_rep_01.delete(`/plannings/${id}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};
