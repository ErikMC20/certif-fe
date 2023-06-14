import { axios_LB_01 } from 'src/conections/axiosCRM';
import { OptionBase } from '../utils/types';
const contactTableService = () => {
  const deleteMultipleContacts = async (
    userID: string,
    accountsIDs: OptionBase[]
  ) => {
    try {
      const dataSend = {
        module: 'Contacts',
        id_user: userID,
        list_id_modules: [...accountsIDs],
      };
      const { data } = await axios_LB_01.patch(
        '/bulk-module-removal',
        dataSend
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  const updateMultipleContacts = async (
    userID: string,
    contactsIDs: OptionBase[],
    dataChanging: OptionBase
  ) => {
    try {
      const { assigned_user_id, mass_account_id } = dataChanging;

      const dataSend = {
        module: 'Contacts',
        id_user: userID,
        attributes: {
          assigned_user_id: assigned_user_id,
          mass_account_id: mass_account_id,
        },
        list_id_modules: [...contactsIDs],
      };
      const { data } = await axios_LB_01.post('/bulk-module-update', dataSend);
      return data;
    } catch (error) {
      throw error;
    }
  };

  return {
    deleteMultipleContacts,
    updateMultipleContacts,
  };
};

export default contactTableService;
