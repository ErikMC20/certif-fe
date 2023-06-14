import { CRM4_LB_01, HANSACRM3_URL } from 'src/conections/api_conectors';
import { Loading, Notify } from 'quasar';
import { api } from 'src/boot/axios';
import { axios_LB_05, axios_LB_01 } from 'src/conections/axiosCRM';
import { AccountReadModel } from '../utils/types';
import { ContactRequestModel } from '../../../components/types/index';

export default {
  async createAccount(body: object) {
    const response = await axios_LB_01.post('/account-new', body);
    return response.data;
  },
  async createContact(body: object) {
    try {
      Loading.show();
      console.log(body);
      const response = await api.post(`${CRM4_LB_01}/account-new/`, body);
      Notify.create({
        type: 'positive',
        message: 'Se ha creado la cuenta correctamente',
      });
      return response.data.resp;
    } catch (error) {
      if (error instanceof Error) {
        Notify.create({
          type: 'negative',
          message: 'Ha ocurrido un error al crear el dato.',
          caption: `${error.message}`,
        });
      }
    } finally {
      Loading.hide();
    }
  },
  async readAccount(id: string, options: { assignedFormat?: boolean } = {}) {
    const { assignedFormat = false } = options;
    const response = await api.get<AccountReadModel>(
      `${CRM4_LB_01}/account-get-all/${id}`
    );
    if (assignedFormat) {
      return {
        id: response.data.resp.info_account.detail_account.id,
        name: response.data.resp.info_account.detail_account.name,
        typeAccount:
          response.data.resp.info_account.detail_account.tipocuenta_c,
      };
    }
    return response.data.resp;
  },
  async readOptionsLanguage() {
    return await Promise.all([
      axios_LB_05.get('/tipo-documento-list'),
      axios_LB_05.get('/type-dom-list'),
      axios_LB_05.get('/regimen-tributario-list'),
      axios_LB_05.get('/dimrubro-dimsubrubro'),
      axios_LB_05.get('/pais-list'),
      axios_LB_05.get('/lang-es-cod-paises-lists'),
      axios_LB_05.get('/direcciones-list'),
    ]);
  },
  async readOptions() {
    const [
      documentsList,
      accountType,
      taxRegime,
      industry,
      countries,
      codesCountry,
      directions,
    ] = await Promise.all([
      axios_LB_05.get('/tipo-documento-list'),
      axios_LB_05.get('/type-dom-list'),
      axios_LB_05.get('/regimen-tributario-list'),
      axios_LB_05.get('/dimrubro-dimsubrubro'),
      axios_LB_05.get('/pais-list'),
      axios_LB_05.get('/lang-es-cod-paises-lists'),
      axios_LB_05.get('/direcciones-list'),
    ]);
    const currentOptions = {
      infoClient: {
        tipo_documento_c: [...documentsList.data],
        account_type: [...accountType.data],
        regimen_tributario_c: [...taxRegime.data],
        industry: [...industry.data],
        billing_address_country: [...countries.data],
      },
      infoDirectionsAccount: [...directions.data],
      infoCodeCountry: codesCountry.data,
    };
    return currentOptions;
  },
  readImageUser(idUsuario: string) {
    return `${HANSACRM3_URL}/upload/users/${idUsuario}`;
  },
  async updateAccount(id: string, body: object) {
    await axios_LB_01.patch(`/account-update/${id}`, body);
  },
  async createAccountPhonesEmails(
    idAccount: string,
    body: ContactRequestModel
  ) {
    await axios_LB_01.post(
      `/create-phones-emails-by-account/${idAccount}`,
      body
    );
  },
  async udpateAccountPhonesEmails(
    idAccount: string,
    body: ContactRequestModel
  ) {
    await axios_LB_01.patch(`/email-phone-update-account/${idAccount}`, body);
  },
  async deleteAccountPhonesEmails(
    idAccount: string,
    body: ContactRequestModel
  ) {
    await axios_LB_01.patch(`/email-phone-delete-account/${idAccount}`, body);
  },
  async updateContact(id: string, body: object) {
    try {
      Loading.show();
      console.log(body);
      await api.patch(`${CRM4_LB_01}/account-update/${id}`, body);
      const response = await api.get(`${CRM4_LB_01}/account-get-all/${id}`);
      Notify.create({
        type: 'positive',
        message: 'Se ha actualizado la cuenta correctamente',
      });
      return response.data.resp;
    } catch (error) {
      if (error instanceof Error) {
        Notify.create({
          type: 'negative',
          message: 'Ha ocurrido un error al crear el dato.',
          caption: `${error.message}`,
        });
      }
    } finally {
      Loading.hide();
    }
  },
};
