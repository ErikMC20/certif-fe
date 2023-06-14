import { axios_LB_01, axios_GLOBAL } from 'src/conections/axiosCRM';
import { FilterResponseModel } from '../utils/types/index';

export interface genericModel {
  [key: string]: string | string[];
}

const serviceTabContact = () => {
  const filterAdvanced = async (
    account_id: string | undefined,
    params: genericModel
  ) => {
    try {
      console.log(account_id);
      console.log('parametros', params);
      const { data } = await axios_LB_01.get<FilterResponseModel>(
        `/accounts_contact_filter?params=${JSON.stringify({
          id_account: account_id,
          ...params,
        })}`
      );
      return data.data;
    } catch (error) {
      throw error;
    }
  };

  const addContact = async (
    user: string,
    account_id: string | undefined,
    contact_id: string
  ) => {
    try {
      const dataSend = {
        module: 'Accounts',
        id_module: account_id,
        id_user: user,
        relationship: [
          {
            modulo_related: 'Contacts',
            id_modulo_related: contact_id,
          },
        ],
      };

      const { data } = await axios_LB_01.post(
        '/contact_related_accounts',
        dataSend
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  const removeContact = async (idUser: string, contactModuleId: string) => {
    try {
      await axios_GLOBAL.delete(`/module-delete/Contacts/${contactModuleId}/${idUser}`);
    } catch (error) {
      throw error;
    }
  };

  const removeRelationship = async ( accountModuleId: string, contactModuleId: string) => {
    try {
      await axios_GLOBAL.delete(
        `/deleted-relationships-module/Accounts/${accountModuleId}/contacts/${contactModuleId}`
      );
    } catch (error) {
      throw error;
    }
  }

  return { filterAdvanced, addContact, removeContact, removeRelationship };
};

export default serviceTabContact;
