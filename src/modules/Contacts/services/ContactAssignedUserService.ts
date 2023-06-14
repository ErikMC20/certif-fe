import { axios_LB_01 } from 'src/conections/axiosCRM';
import Notification from 'src/modules/Accounts/utils/notify';

export const assignedUserService = () => {
  // const getListUsersAssigneds = async (
  //   iddivision: string,
  //   idaccount: string
  // ) => {
  //   try {
  //     const { data } = await axios_LB_01.get(
  //       `/accounts_assigned_users?params=${JSON.stringify({
  //         iddivision: iddivision,
  //         idaccount: idaccount,
  //       })}`
  //     );

  //     return data.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  const getPrimaryUsersAssigned = async (idaccount: string) => {
    try {
      const { data } = await axios_LB_01.get(
        `/contacts_assigned_user/${idaccount}`
      );
      console.log(data.data);

      return data.data[0];
    } catch (error) {
      throw error;
    }
  };

  const addUserAssigned = async (
    contact_id: string,
    assigned_user_id: string,
    modified_user_id: string
  ) => {
    const data_send = {
      info_contact: {
        detail_contact: {
          id: contact_id,
          assigned_user_id: assigned_user_id,
          modified_user_id: modified_user_id,
        },
      },
      phone_email_contact: {},
      comments: {},
    };

    try {
      const { data } = await axios_LB_01.patch(
        `/contact-update/${contact_id}`,
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

  return {
    getPrimaryUsersAssigned,
    addUserAssigned,
  };
};
