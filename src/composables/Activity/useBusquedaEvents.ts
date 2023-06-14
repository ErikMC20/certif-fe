import { onMounted, ref, watch } from 'vue';
import {
  usePais,
  useUserDivision,
  useProspectSource,
  useProspectStatus,
} from 'src/composables/useLanguage';
import { userStore } from 'src/modules/Users/store/UserStore';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
// import { searchAccounts } from 'src/modules/Accounts/services/AccountRelatedService';
import { ActivityServices } from 'src/services/ActivityServices';
import Notification from 'src/modules/Prospects/utils/notify';
import { useQuotesStore } from 'src/modules/Quotes/store/QuotesStore';

export const useBusquedaEvents = () => {
  const { listUsers, getListUsers, filterUsers } = useUserDivision();
  const { listPais, listRegion, getListPais, getListRegion } = usePais();
  const { getFiltroOpo } = ActivityServices();
  const { getListFPEventsStore } = useQuotesStore();
  const { userCRM } = userStore();
  const { listProspectStatus, getListProspectStatus } = useProspectStatus();
  const { listProspectSource, getListProspectSource } = useProspectSource();
  onMounted(async () => {
    await getListUsers(userCRM.iddivision);
    await getListPais();
    await getListProspectSource();
    await getListProspectStatus();
  });

  const showFilter = ref(false);
  const show_more_field = ref(false);
  const show_add = ref(false);

  // const listContacts = ref([] as Datum[]);
  const listPros = ref([]);
  const isFiltering = ref(false);
  const loading = ref(false);
  const selected = ref<{ [key: string]: string }>({});
  const datomando = ref();

  const opcionesfase = [
    { label: 'En Tratamiento', value: 'EnTratamiento' },
    { label: 'Ganado', value: 'Ganado,' },
    { label: 'Perdido', value: 'Perdido' },
  ];
  const formInputs = ref([
    {
      input: 'q-input',
      label: 'Nombre de Evento',
      clearable: true,
      field: 'name',
      visible: true,
    },
  ]);

  // para vaciar filtro
  const dataFilter = ref<any>({
    user_login: '',
    number: '',
    opportunity_name: '',
    account_id: '',
    opportunity_phase_lang: '',
    // amount_usdollar: '',
    opporunity_status_lang: '',
    assigned_user_id: [],
  });

  const submitFilter = async (params: any) => {
    datomando.value = {
      pagina: 1,
      numregistros: 10,
      sortBy: 'name',
      order: 'DESC',
      filter: '',
      name: params.name,
      campaign: '',
      creation_date: {
        from: '',
        to: '',
        operator: '',
      },
      iddivision: '',
      idamercado: '',
    };
    try {
      loading.value = true;
      // listContacts.value = await searchProspects(params.lastname);
      listPros.value = await getListFPEventsStore(datomando.value);
      isFiltering.value = true;
    } catch (error) {
      Notification(
        'negative',
        'error',
        '<strong>Ops!</strong> <br/> Ocurrio un error al realizar la petición'
      );
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const clearFilter = () => {
    isFiltering.value = false;
    listPros.value = [];
    dataFilter.value = {
      user_login: '',
      number: '',
      opportunity_name: '',
      account_id: '',
      opportunity_phase_lang: '',
      // amount_usdollar: '',
      opporunity_status_lang: '',
      assigned_user_id: [],
    };
  };

  const onClose = () => {
    clearFilter();
    showFilter.value = false;
  };

  const cancelInsertion = () => {
    selected.value = {};
    show_add.value = false;
  };

  watch(
    () => dataFilter.value.country,
    (country: string | string[] | undefined) => {
      dataFilter.value.state = '';
      if (typeof country === 'string') getListRegion(country);
    }
  );

  return {
    onClose,
    clearFilter,
    submitFilter,
    // insertItem,
    cancelInsertion,
    selected,
    loading,
    formInputs,
    isFiltering,
    showFilter,
    show_more_field,
    show_add,
    dataFilter,
    HANSACRM3_URL,
    listPros,
  };
};
