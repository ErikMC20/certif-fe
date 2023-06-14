import { CRM4_LB_01, CRM4_LB_05 } from 'src/conections/api_conectors';
import { api } from 'src/boot/axios';
import { RowTableModel } from '../components/types/index';

export async function readOptions() {
  const [
    documentsList,
    accountType,
    taxRegime,
    industry,
    countries,
    codesCountry,
    directions,
  ] = await Promise.all([
    api.get(`${CRM4_LB_05}/tipo-documento-list`),
    api.get(`${CRM4_LB_05}/type-dom-list`),
    api.get(`${CRM4_LB_05}/regimen-tributario-list`),
    api.get(`${CRM4_LB_05}/dimrubro-dimsubrubro`),
    api.get(`${CRM4_LB_05}/pais-list`),
    api.get(`${CRM4_LB_05}/lang-es-cod-paises-lists`),
    api.get(`${CRM4_LB_05}/direcciones-list`),
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
}

export async function readRepeatedEmailsPhones(val: string) {
  try {
    const response = await api.get(
      `${CRM4_LB_01}/account-verify-emails_phones/${val}`
    );
    console.log('object :>> ', response);
    return response.data.data as RowTableModel[];
  } catch (error) {
    console.log(error);
  }
}

export async function readRepeatedNITCI(val: string, module = 'account') {
  try {
    const response = await api.get(
      `${CRM4_LB_01}/account-verify-ci_nit/${module}/${val}`
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
}
