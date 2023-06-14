import { ref } from 'vue';
import { axios_LB_03 } from 'src/conections/axiosCRM';
import { getRecordModuleInfo } from 'src/services/GlobalService';
import { AttributesLeadResponse, ReadLeadResponse } from '../../utils/types';
import { useOpportunitiesStore } from 'src/modules/Opportunities/store/OpportunitiesStore';
import { storeToRefs } from 'pinia';
import { OpportunityGlobal } from 'src/modules/Opportunities/utils/types';
import { userStore } from 'src/modules/Users/store/UserStore';
import moment from 'moment';
import {
  AccountDataDraft,
  AccountModel,
  DetailAccountModel,
} from 'src/modules/Accounts/utils/types';

interface LeadModel extends AttributesLeadResponse {
  id: string;
}

const opportunityStore = useOpportunitiesStore();
const uStore = userStore();
const { draft: opportunityDraft } = storeToRefs(opportunityStore);
const { userCRM } = storeToRefs(uStore);
const isLoading = ref<boolean>(false);
const localId = ref<string>('');
const leadData = ref<LeadModel>({} as LeadModel);

const generateComment = async ({
  account_id_c,
  contact_id_c,
  lead_id1_c,
}: {
  account_id_c: string;
  contact_id_c: string;
  lead_id1_c: string;
}) => {
  console.log('generating comment...', account_id_c);
  if (!!account_id_c) {
    const response = await getRecordModuleInfo<{
      id: string;
      title: string;
      email1: string;
      celular_c: string;
    }>('Accounts', account_id_c, {
      allData: false,
      fields: ['title', 'email1', 'celular_c'],
    });
    return response;
  }
  return null;
};

const convertToOpportunity = async (id: string): Promise<void> => {
  const currentLead = await readLead(id);
  const opportunity = {
    name: currentLead.name,
    iddivision_c: currentLead.iddivision_c,
    assigned_user_id: userCRM.value.id,
    date_closed: moment().add(1, 'M').format('DD-MM-YYYY'),
    currency_id: currentLead.currency_id,
    description: currentLead.description,
    idamercado_c: currentLead.idamercado_c,
    idgrupocliente_c: currentLead.idgrupocliente_c,
    region_c: currentLead.region_c,
    origen_c: currentLead.origen_c,
    campaign_id: currentLead.campaign_id_c,
    amount: currentLead.amount,
    account_id: currentLead.account_id_c,
    contact_id1_c: currentLead.contact_id_c,
  } as OpportunityGlobal;
  opportunityDraft.value = opportunity;
  console.log(currentLead);
  console.log('Hello ddd...');
};

const createAccountFormat = async (
  id: string,
  type: AccountModel
): Promise<AccountDataDraft> => {
  const currentLead = await readLead(id);
  const accountData = {
    infoDataLocal: {
      account_type: 'Customer',
      names_c: currentLead.name,
      billing_address_city: '',
      billing_address_country: '',
      billing_address_state: '',
      billing_address_state_list_c: '',
      shipping_address_state: '',
      shipping_address_state_list_c: '',
      industry: 'N0',
      name: currentLead.name,
      tipo_documento_c: type === 'Empresa' ? '03' : '01',
      nit_ci_c: '',
      regimen_tributario_c: '01',
      subindustry_c: 'N0_N05',
      tipocuenta_c: type,
      created_by: userCRM.value.id,
    },
    mainPhone: {
      code: '+591',
      phone: '',
      whatsapp: '0',
    },
    officePhone: {
      code: '+591',
      phone: '',
      whatsapp: '0',
    },
    direction: {
      address_street_generated_c: '',
      latitude: 0,
      longitude: 0,
    },
    phonesModel: [],
    emailsModel: [],
    directionCRM3: '',
    assignedUserId: userCRM.value.id,
  } as AccountDataDraft;
  return accountData;
};

const readLead = async (id: string): Promise<LeadModel> => {
  try {
    const { data } = await axios_LB_03.get<ReadLeadResponse>(`/lead-get/${id}`);
    return { id: data.data.id, ...data.data.attributes };
  } catch (error) {
    throw error;
  }
};

const getLead = async (id: string): Promise<LeadModel> => {
  try {
    isLoading.value = true;
    const response = await readLead(id);
    //* assign to a local lead variable // localLead.value = response;
    return response;
  } catch (error) {
    throw error;
  } finally {
    isLoading.value = false;
  }
};

export function useLead(id?: string) {
  console.log(id);

  return {
    // * properties
    localId,
    leadData,

    // store properties
    userCRM,

    // * methods
    createAccountFormat,
    convertToOpportunity,
    generateComment,
    getLead,
  };
}
