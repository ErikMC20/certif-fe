import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { axios_LB_01, axios_GLOBAL } from 'src/conections/axiosCRM';
import {
  AssignedUserModelResponse,
  AssignedUserModel,
} from '../components/types/index';
import { userStore } from 'src/modules/Users/store/UserStore';
//import { UserSuiteModel } from '../components/types/index';
import axios from 'axios';

export interface genericModel {
  [key: string]: string;
}

const { userCRM } = userStore();

export const getAssignedUser = async (
  module: string,
  moduleId: string
): Promise<AssignedUserModel> => {
  try {
    const { data } = await axios_GLOBAL.get<AssignedUserModelResponse>(
      `/AssignedUser-get/${module}/${moduleId}`
    );
    if (data.data.attributes.length === 0) throw new Error('Not users found');
    return data.data.attributes[0];
  } catch (error) {
    throw error;
  }
};

export const getUserLogged = async () => {
  try {
    const { data } = await axios_GLOBAL.get<AssignedUserModel>(
      `/AssignedUsers-Info/${userCRM.id}`
    );

    console.log(userCRM, data);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getFormattedUser = async (userId: string) => {
  try {
    const { data } = await axios_GLOBAL.get<AssignedUserModel>(
      `/AssignedUsers-Info/${userId}`
    );
    console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getUserImage = async (userAvatarUrl: string) => {
  try {
    console.log(`searching... ${HANSACRM3_URL}${userAvatarUrl}`);
    const response = await axios.get(`${HANSACRM3_URL}${userAvatarUrl}`, {
      responseType: 'arraybuffer',
    });
    const formattedImage = Buffer.from(response.data, 'binary').toString(
      'base64'
    );
    console.log(formattedImage);
  } catch (error) {
    throw error;
  }
};

export const getListUsers = async (division?: string, a_mercado?: string) => {
  try {
    const { data } = await axios_LB_01.get<{ data: AssignedUserModel[] }>(
      `/users/division/amercado?params=${JSON.stringify({
        division: division || userCRM.iddivision,
        a_mercado: a_mercado || userCRM.idamercado,
      })}`
    );

    return data.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRelation = async (
  module: string,
  idModule: string,
  idUser: string,
  relationIds: { id: string }[]
) => {
  const payload = {
    module,
    idmodule: idModule,
    id_user: idUser,
    relatedmodule: 'HANA_Relaciones',
    data_hanarelation: relationIds,
  };
  try {
    await axios_LB_01.patch('/hana-relations-account-delete', payload);
  } catch (error) {
    throw error;
  }
};

export const updateRelation = async (
  module: string,
  idmodule: string,
  data: object
) => {
  try {
    await axios_LB_01.post(
      `/update-relationships-accounts/${module}/${idmodule}`,
      data
    );
  } catch (error) {
    throw error;
  }
};
