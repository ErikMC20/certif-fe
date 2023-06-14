import { CRM_REP_01, HANSACRM3_URL } from './api_conectors';
import axios from 'axios';
export const axios_rep_01 = axios.create({ baseURL: CRM_REP_01 });
export const axiosCRM3 = axios.create({
  baseURL: HANSACRM3_URL + '/service/v4_1/rest.php',
});
