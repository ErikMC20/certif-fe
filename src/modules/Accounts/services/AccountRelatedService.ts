import { axios_LB_01 } from 'src/conections/axiosCRM';

const dataModel = {
  module: 'Accounts',
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

export const getListRelatedAccounts = async (accountId: string) => {
  try {
    const { data } = await axios_LB_01.get(`/accounts_related/${accountId}`);
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const addItem = async (accountID: string, parentID: string) => {
  try {
    dataModel.idmodule = parentID;
    dataModel.data_accounts[0].idmodulo = accountID;
    console.log(dataModel);
    const { data } = await axios_LB_01.post(
      '/accounts-relation_account-create',
      dataModel
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
