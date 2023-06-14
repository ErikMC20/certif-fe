import { axios_rep_01 } from '../../../conections/axiosPRY';
import { base } from '../utils/types';
export const getResponsibles = async (id: string) => {
  try {
    const { data } = await axios_rep_01.get(`/responsibles/project/${id}`);
    return data;
  } catch (error) {
    return error;
  }
};

export const saveResponsibles = async (responsible: base) => {
  try {
    const { data } = await axios_rep_01.post('/responsibles', responsible);
    return data;
  } catch (error) {
    return error;
  }
};

export const updateResponsibles = async (id: string, responsible: base) => {
  try {
    const { data } = await axios_rep_01.put(`/responsibles/${id}`, responsible);
    return data;
  } catch (error) {
    return error;
  }
};

export const deleteResponsibles = async (id: string) => {
  try {
    const { data } = await axios_rep_01.delete(`/responsibles/${id}`);
    return data;
  } catch (error) {
    return error;
  }
};
