import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { ref, computed } from 'vue';
import moment from 'moment';
import { storeToRefs } from 'pinia';
import { Loading, QSpinnerPuff, Notify } from 'quasar';
import {
  OpportunitiesResponse,
  FilterForm,
  FilterFormat,
} from '../../../utils/types';
import { opportunityStates } from 'src/modules/Businesses/utils/dummyData';
import { useBusinessesStore } from '../../../store/index';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import { useBusinessesService } from 'src/modules/Businesses/services/BusinessesService';
import {
  getRecordModuleInfo,
  getRelationBetweenModules,
  updateModuleRecord,
  deleteModuleRecord,
} from 'src/services/GlobalService';
import { userStore } from 'src/modules/Users/store/UserStore';
import { useDivision, getDateMoment } from 'src/composables/useLanguage';
import { axios_NS_01 } from 'src/conections/axiosCRM';
import { opportunityTypes } from '../../../utils/dummyData';

const businessesStore = useBusinessesStore();
const { getDetailedOpportunities } = useBusinessesService();
const uStore = userStore();
const languageStore = useFormOptionsStore();
const { userCRM } = storeToRefs(uStore);
const { filter, salesPhase } = storeToRefs(businessesStore);
const { opportunityType } = storeToRefs(languageStore);

const { listDivisiones, getListDivisiones } = useDivision();

const isLoading = ref(false);
const isExpiredActivitiesLoading = ref(false);

const dialogs = ref({
  expiredActivities: false,
  expiredOpportunities: false,
  opportunitiesWithoutActivities: false,
});

const formatAmount = (amount: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  return formatter.format(amount);
};

const formatAmounts = (opportunities: OpportunitiesResponse[]) => {
  const amount = opportunities
    .map((opp) => opp.monto || 0)
    .reduce((acc, cur) => acc + cur, 0);
  return formatAmount(amount);
};

const formatDate = (date?: string) => {
  if (moment(date).isValid()) return moment(date).format('DD/MM/YYYY');
  return 'Sin Fecha';
};

const formatPhase = (name: string) => {
  return (
    businessesStore.salesPhase.find((phase) => phase.value === name)?.label ||
    ''
  );
};

const getOpportunityData = async (id: string, fields?: string[]) => {
  try {
    const response = await getRecordModuleInfo('Opportunities', id, {
      allData: !!fields,
      fields,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

const openDialog = (value: string) => {
  switch (value) {
    case 'expired_activities':
      dialogs.value.expiredActivities = true;
      break;
    case 'expired_opportunities':
      dialogs.value.expiredOpportunities = true;
      break;
    case 'opportunities_without_activities':
      dialogs.value.opportunitiesWithoutActivities = true;
    default:
      break;
  }
};

const phaseValidation = {
  quotes: async (id: string): Promise<number> => {
    const data = await getRelationBetweenModules(
      'Opportunities',
      id,
      'aos_quotes'
    );
    return data.length;
  },
  reserves: async (id: string): Promise<number> => {
    const data = await getRelationBetweenModules(
      'Opportunities',
      id,
      'hanq_reservas_opportunities'
    );
    return data.length;
  },
};

const changeOpportunityPhase = async (id: string, phase: string) => {
  const attributes = {
    sales_stage: phase,
    modified_user_id: userCRM.value.id,
  };

  try {
    const response = await updateModuleRecord('Opportunities', id, attributes);
    Notify.create({
      type: 'positive',
      message: 'Se ha actualizado la oportunidad',
    });
    if (response.status === 400)
      throw new Error(response.response?.statusText || 'Error');
    return response;
  } catch (error) {
    throw error;
  }
};

const changeOpportunityState = async (
  id: string,
  value: string,
  state: 'Ganado' | 'Perdido'
) => {
  const attributes: { [key: string]: string } = {
    estado_oportunidad_c: state,
    modified_user_id: userCRM.value.id,
  };
  if (state === 'Ganado') attributes.motivo_c = value;
  else attributes.motivo_perdida_c = value;

  try {
    Loading.show({
      spinner: QSpinnerPuff,
      message: 'Cambiando el estado de la oportunidad',
    });
    const response = await updateModuleRecord('Opportunities', id, attributes);
    if (response.status === 400)
      throw new Error(response.response?.statusText || 'Error');
    reloadData();
    return response;
  } catch (error) {
    Notify.create({
      color: 'negative',
      message: 'Error al realizar el proceso',
    });
  } finally {
    Loading.hide();
  }
};

const deleteOpportunity = async (id: string) => {
  try {
    Loading.show({
      spinner: QSpinnerPuff,
      message: 'Eliminando oportunidad',
    });
    await deleteModuleRecord('Opportunities', id, userCRM.value.id);
    reloadData();
  } catch (error) {
    Notify.create({
      color: 'negative',
      message: 'Error al eliminar oportunidad',
    });
  } finally {
    Loading.hide();
  }
};

const searchByParams = async (data: FilterFormat) => {
  businessesStore.$state.filter = data;
  console.log(data);
  try {
    isLoading.value = true;
    await businessesStore.getBusinessesDetailed(data);
    Notify.create({
      type: 'positive',
      message: 'Se han obtenido los datos correctamente',
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const searchFromFilter = async () => {
  await searchByParams(filter.value);
};

const reloadData = async (disableLoad = false) => {
  try {
    if(!disableLoad) isLoading.value = true;
    await searchFromFilter();
    Notify.create({
      type: 'positive',
      message: 'Se han obtenido los datos correctamente',
    });
  } catch (error) {
    console.log(error);
  } finally {
    if(!disableLoad) isLoading.value = false;
  }
};

const getRules = (name: string) => {
  const phase = businessesStore.salesPhase.find(
    (phase) => phase.value === name
  );

  console.log(phase)

  if (!phase?.prop) return [];

  return phase?.prop.rules;
};

const getFilter = async () => {
  await languageStore.getBusinessesOptions();
};

const filterInitialBusinesses = async () => {
  const { gestionPresente } = getDateMoment();

  // console.log(userCRM.value);

  filter.value = {
    iddivision_c: userCRM.value.iddivision || '',
    idamercado_c: userCRM.value.idamercado || '',
    // region_c: userCRM.value.idregional || '',
    option_date_closed: 'This year',
    operator_date_closed: 'between',
    opportunity_type: '03_01_Hansa',
    estado_oportunidad_c: 'EnTratamiento',
    from_date_closed: gestionPresente.from,
    to_date_closed: gestionPresente.to,
  };
  // salesPhase.value =
  //   opportunityTypes.find((opp) => opp.value === '03_01_Hansa')?.salesPhases ||
  //   [];

  try {
    isLoading.value = true;
    await getFilter();

    salesPhase.value =
      opportunityType.value.find((opp) => opp.value === '03_01_Hansa')?.phase ||
      [];
    await businessesStore.getBusinessesDetailed(filter.value);
    Notify.create({
      type: 'positive',
      message: 'Se han obtenido los datos correctamente',
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};
// todo check salesphase and bind with mongo
const updateSalesPhase = (val: string) => {
  salesPhase.value =
    opportunityType.value.find((opp) => opp.value === val)?.phase || [];
};

const loadExpiredActivities = async () => {
  try {
    isExpiredActivitiesLoading.value = true;

    await businessesStore.getExpiredActivitiesDetailed(filter.value);
  } catch (error) {
    console.log(error);
  } finally {
    isExpiredActivitiesLoading.value = false;
  }
};

const openOpportunityInCRM3 = (id: string) => {
  window.open(
    `${HANSACRM3_URL}/index.php?module=Opportunities&action=DetailView&record=${id}`
  );
};

export const useBusinesses = () => {
  return {
    // Properties
    dialogs,
    isLoading,
    isExpiredActivitiesLoading,
    phaseValidation,

    // Store properties
    filter,
    salesPhase,

    // Getters
    businessesAmount: computed(() => businessesStore.currentColumns.length),
    currentColumns: computed(() => businessesStore.currentColumns),
    listDivisiones: computed(() => languageStore.businessesOptions.divisiones),
    grupoCliente: computed(() => languageStore.businessesOptions.grupoCliente),
    paisList: computed(() => languageStore.businessesOptions.paisList),
    opportunityType: computed(
      () => languageStore.businessesOptions.opportunityType
    ),
    originList: computed(() => languageStore.businessesOptions.origen),
    opportunityState: computed(
      () => languageStore.businessesOptions.opportunityState
    ),
    validExpiredActivities: computed(
      () => businessesStore.validExpiredActivities
    ),

    // Methods
    changeOpportunityPhase,
    changeOpportunityState,
    deleteOpportunity,
    filterInitialBusinesses,
    formatAmount,
    formatAmounts,
    formatDate,
    formatPhase,
    getDetailedOpportunities,
    getFilter,
    getOpportunityData,
    getRules,
    loadExpiredActivities,
    openDialog,
    reloadData,
    searchByParams,
    searchFromFilter,
    updateSalesPhase,
    openOpportunityInCRM3,
  };
};
