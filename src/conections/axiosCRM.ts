import axios from 'axios';
import {
  CRM4_BN_01,
  CRM4_LB_05,
  CRM4_LB_03,
  CRM4_LB_04,
  CRM4_LB_01,
  CRM4_NS_01,
  CRM4_NS_07,
  CRM4_LB_02,
  CRM4_LB_06,
  CRM4_LB_GLOBAL,
  HANSACRM3_URL,
  PREFERENCES,
} from './api_conectors';

const axios_BN_01 = axios.create({ baseURL: CRM4_BN_01 });
const axios_LB_01 = axios.create({ baseURL: CRM4_LB_01 });
const axios_LB_04 = axios.create({ baseURL: CRM4_LB_04 });
const axios_LB_05 = axios.create({ baseURL: CRM4_LB_05 });
const axios_LB_03 = axios.create({ baseURL: CRM4_LB_03 });
const axios_NS_01 = axios.create({ baseURL: CRM4_NS_01 });
const axios_NS_07 = axios.create({ baseURL: CRM4_NS_07 });
const axios_LB_02 = axios.create({ baseURL: CRM4_LB_02 });

const axios_LB_06 = axios.create({ baseURL: CRM4_LB_06 });
const axios_GLOBAL = axios.create({ baseURL: CRM4_LB_GLOBAL });

const axios_HANSACRM3 = axios.create({ baseURL: HANSACRM3_URL });
const axios_PREFERENCES = axios.create({ baseURL: PREFERENCES });

export {
  axios_BN_01,
  axios_LB_01,
  axios_LB_04,
  axios_LB_05,
  axios_LB_03,
  axios_NS_01,
  axios_NS_07,
  axios_LB_02,
  axios_LB_06,
  axios_GLOBAL,
  axios_HANSACRM3,
  axios_PREFERENCES,
};
