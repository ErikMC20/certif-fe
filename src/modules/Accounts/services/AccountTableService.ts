import { axios_LB_01} from 'src/conections/axiosCRM';
import { assignedUserService } from './AccountAssignedUserService';
import accountService from './AccountService';
import { AccountsFiltered, OptionBase } from '../utils/types';
import { Notify } from 'quasar';

const accountTableService = () => {
  const getAccounts = async (
    filter: object,
    page = 1,
    cantidad = 10,
    sortBy = 'fecha_creacion',
    order = 'desc'
  ): Promise<AccountsFiltered> => {
    try {
      const params = {
        page: page,
        rowsPerPage: cantidad,
        filter: filter,
        sortBy: sortBy,
        order: order,
      };

      const { data } = await axios_LB_01.get<AccountsFiltered>(
        `/accounts_advanced_filter?params=${JSON.stringify(params)}`
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  const deleteMultipleAccounts = async (
    userID: string,
    accountsIDs: OptionBase[]
  ) => {
    try {
      const dataSend = {
        module: 'Accounts',
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

  const updateMultipleAccounts = async (
    userID: string,
    accountsIDs: OptionBase[],
    dataChanging: OptionBase
  ) => {
    try {
      const { industry, account_type, tipocuenta_c, assigned_user_id } =
        dataChanging;
      const dataSend = {
        module: 'Accounts',
        id_user: userID,
        attributes: {
          industry: industry,
          account_type: account_type,
          tipocuenta_c: tipocuenta_c,
          assigned_user_id: assigned_user_id,
          status_juridico_c: '',
          condicion_pago_c: '',
        },
        list_id_modules: [...accountsIDs],
      };

      const { data } = await axios_LB_01.post('/bulk-module-update', dataSend);

      //** assigning users to hana_relaciones */

      const userData = await assignedUserService().getUserData(
        assigned_user_id
      );
      const assignedUser = {
        assigned_user_id: userData.id,
        principal: 'yes',
        iddivision_c: userData.iddivision_c,
        idamercado_c: userData.idamercado_c,
        idgrupocliente_c: userData.idgrupocliente_c,
        idsector_c: '',
        idregional_c: userData.idregional_c,
        idcanalvta_c: '',
      };
      accountsIDs.forEach(async (account) => {
        // validation
        const usersAssignedToAccount =
          await assignedUserService().getListUsersAssignedToAccount(
            '03',
            account.id
          );

        if (
          usersAssignedToAccount.some(
            (user) =>
              user.id === assignedUser.assigned_user_id &&
              user.iddivision_c === assignedUser.iddivision_c &&
              user.idamercado_c === assignedUser.idamercado_c
          )
        ) {
          const accountRepeated = await accountService.readAccount(account.id);
          const repeatedNameAccount =
            accountRepeated.info_account.detail_account.name;
          Notify.create({
            type: 'warning',
            message: 'Usuario ya asignado',
            caption: `Ya se asigno el usuario ${userData.full_name} a la cuenta: ${repeatedNameAccount}`,
          });
          console.log(
            'This user is already assigned',
            accountRepeated.info_account.detail_account
          );
          return;
        }
        await assignedUserService().addUserToAccountRelation(
          account.id,
          userID,
          assignedUser
        );
      });

      //** end assigning users to hana_relaciones */
      return data;
    } catch (error) {
      throw error;
    }
  };

  return {
    getAccounts,
    deleteMultipleAccounts,
    updateMultipleAccounts,
  };
};

export default accountTableService;
