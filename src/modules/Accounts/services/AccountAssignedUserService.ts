import { axios_LB_01, axios_GLOBAL } from 'src/conections/axiosCRM';
// import { userStore } from 'src/modules/Users/store/UserStore';
import Notification from '../utils/notify';
import {
  UserSuiteModel,
  AssignedUsersModel,
} from '../../../components/types/index';

export const assignedUserService = () => {
  const getListUsersAssigneds = async (
    iddivision: string,
    idaccount: string
  ) => {
    try {
      const { data } = await axios_LB_01.get(
        `/accounts_assigned_users?params=${JSON.stringify({
          iddivision: iddivision,
          idaccount: idaccount,
        })}`
      );

      return data.data;
    } catch (error) {
      throw error;
    }
  };

  const getListUsersAssignedToAccount = async (
    idDivision: string,
    idAccount: string
  ) => {
    try {
      const response = await axios_GLOBAL.get<AssignedUsersModel>(
        `/AssignedUsers-get/accounts/${idDivision}/${idAccount}`
      );
      return response.data.data.attributes;
    } catch (error) {
      throw error;
    }
  };

  const getUserData = async (idUser: string) => {
    try {
      const response = await axios_GLOBAL.get<UserSuiteModel>(
        `/module-get/Users/${idUser}`
      );
      return {
        id: response.data.data.id,
        ...response.data.data.attributes,
      };
    } catch (error) {
      throw error;
    }
  };

  const getPrimaryUsersAssigned = async (idaccount: string) => {
    try {
      const { data } = await axios_LB_01.get(
        `/accounts_assigned_single_user/${idaccount}`
      );
      return data.data[0] ?? null;
    } catch (error) {
      throw error;
    }
  };

  const addUserAssigned = async (
    account_id: string,
    assigned_user_id: string,
    modified_user_id: string
  ) => {
    // const data = {
    //   type: 'HANA_Relaciones',
    //   attributes: {
    //     created_by: modified_user,
    //     modified_user_id: modified_user,
    //     description: 'CREACION',
    //     assigned_user_id: assigned_user,
    //     principal: 'yes',
    //     iddivision_c: '03',
    //     idamercado_c: '03_01',
    //   },
    // };
    // try {
    //   const verPost = `/post-relationships-module-create-generic/${'Accounts'}/${account_id}`;

    //   await axios_GLOBAL.post(verPost, data);
    //   Notification(
    //     'positive',
    //     'check',
    //     '<strong>Correcto!</strong> <br/> Se cambió el vendedor principal.'
    //   );
    //   return data;
    // } catch (error) {
    //   Notification(
    //     'error',
    //     'error',
    //     '<strong>Ops!</strong> <br/> Ocurrió un error.'
    //   );
    //   throw error;
    // }
    //EL ANTERIOR AGREGAR USUARIO ASIGNADO
    const data_send = {
      info_account: {
        detail_account: {
          assigned_user_id: assigned_user_id,
          modified_user_id: modified_user_id,
        },
      },
      phone_email_account: {},
      comments: {},
    };

    try {
      const { data } = await axios_LB_01.patch(
        `/account-update/${account_id}`,
        data_send
      );
      Notification(
        'positive',
        'check',
        '<strong>Correcto!</strong> <br/> Se cambió el vendedor principal.'
      );
      return data.data;
    } catch (error) {
      Notification(
        'error',
        'error',
        '<strong>Ops!</strong> <br/> Ocurrió un error.'
      );
      throw error;
    }
  };

  const addUserToAccountRelation = async (
    idModule: string,
    userId: string,
    bodyData: object
  ) => {
    try {
      const relationURL = `/post-relationships-module-create-generic/${'Accounts'}/${idModule}`;
      const sendBody = {
        type: 'HANA_Relaciones',
        attributes: {
          created_by: userId,
          description: 'PRUEBA 55',
          ...bodyData,
        },
      };
      console.log(relationURL, sendBody);
      await axios_GLOBAL.post(relationURL, sendBody);
    } catch (error) {
      throw error;
    }
  };
  // const addUserAssigned2 = async (
  //   account_id: string,
  //   assigned_user: string,
  //   modified_user: string
  // ) => {
  //   const data_send = {
  //     assigned_user_id: assigned_user,
  //     principal: 'yes',
  //     iddivision_c: '03',
  //     idamercado_c: '03_01',
  //     created_by: modified_user,
  //     modified_user_id: modified_user,
  //   };

  //   try {
  //     const { data } = await axios_GLOBAL.post(
  //       `/post-relationships-module-create-generic/${'Accounts'}/${assigned_user}`,
  //       data_send
  //     );
  //     Notification(
  //       'positive',
  //       'check',
  //       '<strong>Correcto!</strong> <br/> Se cambió el vendedor principal.'
  //     );
  //     return data.data;
  //   } catch (error) {
  //     Notification(
  //       'error',
  //       'error',
  //       '<strong>Ops!</strong> <br/> Ocurrió un error.'
  //     );
  //     throw error;
  //   }
  // };
  // const addUserAssignedList = async (data_send: any, id_module: string) => {
  //   try {
  //     const { data } = await axios_GLOBAL.post(
  //       `/post-relationships-module-create-generic/${'accounts'}/${id_module}`,
  //       data_send
  //     );
  //     Notification(
  //       'positive',
  //       'check',
  //       '<strong>Correcto!</strong> <br/> Se cambió el vendedor principal.'
  //     );
  //     return data.data;
  //   } catch (error) {
  //     Notification(
  //       'error',
  //       'error',
  //       '<strong>Ops!</strong> <br/> Ocurrió un error.'
  //     );
  //     throw error;
  //   }
  // };

  const deleteUserAssigned = async () => {
    try {
      const { data } = await axios_LB_01.get('/users_assigned/delete');
      return data.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    getPrimaryUsersAssigned,
    getListUsersAssigneds,
    getListUsersAssignedToAccount,
    addUserAssigned,
    deleteUserAssigned,
    addUserToAccountRelation,
    getUserData,
    // addUserAssigned2,
    // addUserAssignedList,
  };
};
