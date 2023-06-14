import { axios_rep_01 } from 'src/conections/axiosPRY';

export const getTask = async (id: string) => {
  try {
    const { data } = await axios_rep_01.get(`/tasks/one/${id}`);
    return data;
  } catch (error) {
    return error;
  }
};

export const getAllAssignmentByTask = async (id: string) => {
  try {
    const { data } = await axios_rep_01.get(`/asignacions/all/tasks/${id}`);
    return data;
  } catch (error) {
    return error;
  }
};
