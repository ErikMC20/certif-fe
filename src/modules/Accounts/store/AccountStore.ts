import { AccountDataModel,AccountModel,AccountDataDraft} from '../utils/types/index';
import { AccountReadModel, Resp }                        from '../utils/types';
import { api }                                           from 'boot/axios';
import { assignedUserService }                           from '../services/AccountAssignedUserService';
import { defineStore }                                   from 'pinia';
import { Loading, QSpinnerPuff }                         from 'quasar';
import { phonesUpdateModel,emailsUpdateModel}            from '../../../components/types/index';
import { RepeatedNITCIResponse }                         from '../utils/types/index';
import { useContact }                                    from 'src/composables/core';
import accountService                                    from '../services/AccountService';
//import { userStore }                                     from '../../Users/store/UserStore';

//*LLAMADA AL STORE PROCEDURE DE USUARIOS */
//const { userCRM: { id:usuario_id }} = userStore();
type UpdateAccountOptions = {
  idUser?: string;
  phones?: phonesUpdateModel;
  emails?: emailsUpdateModel;
};
// const { addUserAssignedList } = assignedUserService();
export const AccountStore = defineStore('Accounts', {
  state: () => ({
    accountCRM: [],
    accountDraft: {} as AccountDataDraft,
    CRM4_LB_01: process.env.CRM4_LB_01,
    CRM4_NS_02: process.env.CRM4_NS_02,
    CRM4_LB_03: process.env.CRM4_LB_03,
    originDraft: '',
    requestBase: {
      pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: 'fecha_creacion',
        descending: 'desc' ? true : false,
      },
      filter: {},
    },
    //roles_accounts: {} as rolesAccounts,
    selectedAccount: null as Resp | null
  }),
  getters: {
    getSelectedAccountId(state) {
      return state.selectedAccount?.info_account.detail_account.id
        ? state.selectedAccount?.info_account.detail_account.id
        : '';
    },
    getDescriptionCRM3(state) {
      return state.selectedAccount?.info_account.detail_account.description
        ? state.selectedAccount.info_account.detail_account.description
        : '';
    },
    getSelectedAccountInfo(state) {
      return {
        id: state.selectedAccount?.info_account.detail_account.id || '',
        accountType:
          (state.selectedAccount?.info_account.detail_account
            .tipocuenta_c as AccountModel) || ('Privada' as AccountModel),
        created:
          state.selectedAccount?.info_account.detail_account.created_by_name ||
          '',
        modify:
          state.selectedAccount?.info_account.detail_account.modified_by_name ||
          '',
        directionCRM3:
          state.selectedAccount?.info_account.direction_account
            .billing_address_street || '',
        headerData: {
          name: state.selectedAccount?.info_account.detail_account.name || '',
          accountType:
            state.selectedAccount?.info_account.detail_account.tipocuenta_c ||
            '',
          code:
            state.selectedAccount?.info_account.detail_account.idcuentasap_c ||
            'No Asignado',
        },
      };
    },
    getAccountForm(state): AccountDataModel | null {
      if (typeof state.selectedAccount === 'object') {
        const accountData = state.selectedAccount;
        if (accountData)
          return {
            infoData: {
              id: accountData?.info_account.detail_account.id,
              account_type:
                accountData?.info_account.detail_account.account_type,
              billing_address_city:
                accountData?.info_account.detail_account.billing_address_city,
              billing_address_country:
                accountData?.info_account.detail_account
                  .billing_address_country,
              billing_address_state_list_c:
                accountData?.info_account.detail_account
                  .billing_address_state_list_c,
              industry: accountData?.info_account.detail_account.industry,
              name: accountData?.info_account.detail_account.name,
              names_c: accountData?.info_account.detail_account.names_c,
              lastname_c: accountData?.info_account.detail_account.lastname_c,
              nombre_comercial_c:
                accountData?.info_account.detail_account.nombre_comercial_c,
              tipo_documento_c:
                accountData?.info_account.detail_account.tipo_documento_c,
              nit_ci_c: accountData?.info_account.detail_account.nit_ci_c,
              regimen_tributario_c:
                accountData?.info_account.detail_account.regimen_tributario_c,
              subindustry_c:
                accountData?.info_account.detail_account.subindustry_c,
              tipocuenta_c:
                accountData?.info_account.detail_account.tipocuenta_c,
              cod_aio: accountData?.info_account.detail_account.cod_aio,
              created_by: accountData?.info_account.detail_account.created_by,
              modified_user_id:
                accountData?.info_account.detail_account.modified_user_id,
              idcuentasap_c:
                accountData?.info_account.detail_account.idcuentasap_c,
              assigned_user_id:
                accountData?.info_account.detail_account.assigned_user_id,
              celular_c: accountData?.info_account.detail_account.celular_c,
            },
            mainPhone: {
              code: accountData?.phone_email_account.celular_cd_c,
              phone: accountData?.phone_email_account.celular_c,
              whatsapp: accountData?.phone_email_account.celular_wp_c,
            },
            officePhone: {
              code: accountData?.phone_email_account.phone_office_cd_c,
              phone: accountData?.phone_email_account.phone_office,
              whatsapp: accountData?.phone_email_account.phone_office_wp_c,
            },
            emails:
              accountData?.phone_email_account.emails.map((email) => ({
                ...email,
              })) || [],
            phones: accountData?.phone_email_account.phones || [],
            directionData: {
              address_street_generated_c:
                accountData?.info_account.direction_account
                  .address_street_generated_c,
              latitude:
                accountData?.info_account.direction_account.jjwg_maps_lat_c,
              longitude:
                accountData?.info_account.direction_account.jjwg_maps_lng_c,
            },
          };
      }
      return null;
    },
  },
  actions: {
    clearDraft() {
      this.accountDraft = {} as AccountDataDraft;
    },
    clearSelectedAccount() {
      this.selectedAccount = null;
    },
    async createAccount(data: object) {
      try {
        Loading.show({
          spinner: QSpinnerPuff,
          message: 'Creando la cuenta',
        });
        const responseCreation = await accountService.createAccount(data);
        const response = await accountService.readAccount(
          responseCreation.resp.info_account.detail_account.id
        );
        this.selectedAccount = response;
        return responseCreation;
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        Loading.hide();
      }
    },
    async readAccount(id: string) {
      try {
        const response = await accountService.readAccount(id);

        // console.log(response);
        this.selectedAccount = response;
      } catch (error) {
        console.log(error);
      }
    },
    async updateAccount(
      id: string,
      data: object,
      options: UpdateAccountOptions = {}
    ) {
      const {
        idUser = '',
        phones = {} as phonesUpdateModel,
        emails = {} as emailsUpdateModel,
      } = options;
      try {
        Loading.show({
          group: 'udpate',
          spinner: QSpinnerPuff,
          message: 'Actualizando la Cuenta',
        });
        await accountService.updateAccount(id, data);
        if (!!idUser) {
          Loading.show({
            group: 'udpate',
            spinner: QSpinnerPuff,
            message: 'Actualizando Telefonos y Correos',
          });
          const { updateBodyContact, deletedBodyContact, createdBodyContact } =
            useContact(idUser, phones, emails);
          await accountService.createAccountPhonesEmails(
            id,
            createdBodyContact
          );
          await accountService.udpateAccountPhonesEmails(id, updateBodyContact);
          await accountService.deleteAccountPhonesEmails(
            id,
            deletedBodyContact
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        Loading.hide('udpate');
      }
    },
    cleanSelectedAccount() {
      this.selectedAccount = null;
    },
    async addUserAssinged(
      accountId: string,
      assignedUserId: string,
      userId: string
    ) {
      const { addUserAssigned } = assignedUserService();
      await addUserAssigned(accountId, assignedUserId, userId);
    },
    // async addUserAssinged2(accountId: string, data: any) {
    //   console.log(data, accountId, 'entrando al store');
    //   const { addUserAssigned2 } = assignedUserService();
    //   await addUserAssigned2(accountId, data);
    // },
    // async addUserAssinged(dataSend: any) {
    //   console.log(dataSend);
    //   await addUserAssignedList(dataSend, userCRM.id);
    // },
    async getAccountComments(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_01}/accounts-getComments/${id}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getAccountHistoryChanges(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_01}/accounts-getHistoryChanges/${id}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getAccountsContact(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_01}/account_get_contacts/${id}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getAccountsDocuments(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_01}/account_get_documents/${id}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getAccountsOportunities(id: string, div: string) {
      //const div='03';
      try {
        const response = await api.get(
          `${this.CRM4_LB_01}/account_get_opportunities/${id}/${div}`
        );
        //console.log('your response', response.data.data);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getAccountsQuotes(id: string, div: string) {
      //const div='03';
      try {
        const response = await api.get(
          `${this.CRM4_LB_01}/account_get_quotes/${id}/${div}`
        );
        //console.log('your response', response.data.data);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getAccountsDeliveries(id: string, div: string) {
      //const div='03';
      try {
        const response = await api.get(
          `${this.CRM4_LB_01}/account_get_deliveries/${id}/${div}`
        );
        //console.log('your response', response.data.data);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getAccountsReservations(id: string, div: string) {
      //const div='03';
      try {
        const response = await api.get(
          `${this.CRM4_LB_01}/account_get_reservations/${id}/${div}`
        );
        //console.log('your response', response.data.data);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async readRepeatedEmailsPhones(val: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_01}/account-verify-emails_phones/${val}`
        );
        console.log('object :>> ', response);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async readRepeatedNITCI(val: string, module = 'account') {
      try {
        const response = await api.get<RepeatedNITCIResponse>(
          `${this.CRM4_LB_01}/account-verify-ci_nit/${module}/${val}`
        );
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getAccountsCampaing(id: string, div: string) {
      //const div='03';
      try {
        const response = await api.get(
          `${this.CRM4_LB_01}/account_get_campaigns/${id}/${div}`
        );
        //console.log('your response', response.data.data);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getAccountsQuejas(id: string, modulo: string, div: string) {
      //const div='03';
      try {
        const response = await api.get(
          `${this.CRM4_LB_01}/get_quejas/${id}/${modulo}/${div}`
        );
        //console.log('your response', response.data.data);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getAccountsGet(id: string) {
      //const div='03';
      try {
        const response = await api.get<AccountReadModel>(
          `${this.CRM4_LB_01}/account-get-all/${id}`
        );
        return response.data.resp;
      } catch (error) {
        console.log(error);
      }
    },

    setDraftData(draft: AccountDataDraft) {
      this.accountDraft = draft;
    },

    async getRelationAll(nameModule: string,idModule: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_03}/Lead_Get_All/${nameModule}/${idModule}`
        );
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    //*Action para obtener rol del usuario en Cuentas.
    // async getRolAccount(){
    //   try {
    //     const { data } = await api.get(`${this.CRM4_NS_02}/api/accounts/${usuario_id}`);
    //     this.roles_accounts = data;
    //   } catch (error) {
    //     console.log('Error al obtener el rol:', error);
    //   }
    // }
  },
});
