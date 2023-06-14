import { axios_LB_01 } from 'src/conections/axiosCRM';
import { UserSessionModel } from '../utils/types/index';
export const getUserSessionData = async (id: string) => {
  const response = await axios_LB_01.get<UserSessionModel>(
    `/user-session/${id}`
  );

  return response.data;
};
