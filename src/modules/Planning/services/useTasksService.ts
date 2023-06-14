import { axios_rep_01 } from 'src/conections/axiosPRY';
import { TaskModel } from '../../../components/Gantt/types';

export const getPlanningTasks = async (planningId: string) => {
  try {
    const { data } = await axios_rep_01.get(`/tasks/planning/${planningId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const createTask = async (task: TaskModel) => {
  try {
    const { data } = await axios_rep_01.post('/tasks', task);
    return data;
  } catch (error) {
    return error;
  }
};

export const updateTask = async (id: string, task: TaskModel) => {
  try {
    const { data } = await axios_rep_01.patch(`/tasks/${id}`, task);
    return data;
  } catch (error) {
    return error;
  }
};

export const deleteTask = async (id: string) => {
  try {
    const { data } = await axios_rep_01.delete(`/tasks/${id}`);
    return data;
  } catch (error) {
    return error;
  }
};
