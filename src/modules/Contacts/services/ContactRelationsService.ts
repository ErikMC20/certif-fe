import { axios_LB_01 } from 'src/conections/axiosCRM';

const dataModel = {
  module: 'Contacts',
  idmodule: '',
  id_user: '1',
  data_accounts: [
    {
      relatedmodule: 'Accounts',
      idmodulo: '',
    },
  ],
};

export interface genericModel {
  [key: string]: string;
}

export const searchAccounts = async (filter: string) => {
  if (filter.length < 3) {
    return;
  }
  const { data } = await axios_LB_01.get(
    `/accounts/search?params=${JSON.stringify({ filter: filter })}`
  );
  return data.data;
};

export const getListRelated = async (id: string) => {
  try {
    const { data } = await axios_LB_01.get(`/contact_get_relations/${id}`);
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const addItem = async (
  user: string,
  account_id: string | undefined,
  contact_id: string
) => {
  try {
    const dataSend = {
      module: 'Contacts',
      id_module: contact_id,
      id_user: user,
      relationship: [
        {
          modulo_related: 'Accounts',
          id_modulo_related: account_id,
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

export const deleteItem = async (accountID: string, parentID: string) => {
  try {
    dataModel.idmodule = parentID;
    dataModel.data_accounts[0].idmodulo = accountID;
    const { data } = await axios_LB_01.post(
      '/accounts-relation_account-delete',
      dataModel
    );
    return data;
  } catch (error) {
    throw error;
  }
};
