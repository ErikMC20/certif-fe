import { onMounted, ref, watch } from 'vue';
import {
  usePais,
  useUserDivision,
  useDateRange,
} from 'src/composables/useLanguage';
import { LeadsTableStore } from 'src/modules/Leads/store/LeadsTableStore';
import { userStore } from 'src/modules/Users/store/UserStore';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
// import { searchAccounts } from 'src/modules/Accounts/services/AccountRelatedService';
import { ActivityServices } from 'src/services/ActivityServices';
import Notification from 'src/modules/Prospects/utils/notify';
// import DateRangeComponent from 'src/components/DateRange/DateRangeComponent.vue';

export const useBusquedaAtri = () => {
  const tableStore = LeadsTableStore();
  const listDivision = ref();
  const listMercado = ref();
  const listGrupoCliente = ref();
  const listOrigen = ref();
  const user = userStore();
  const listEstado = ref();
  const { getFiltroAtri } = ActivityServices();
  const { listUsers, getListUsers, filterUsers } = useUserDivision();
  const { listPais, listRegion, getListPais, getListRegion } = usePais();
  const { listDateRange, getListDateRange } = useDateRange();

  // const dynamicInput = ref<InstanceType<typeof DateRangeComponent> | null>(
  //   null
  // );
  // const dataFilter = ref<any>(tableStore.data_filter);
  // const dataExtra = ref<any>(tableStore.data_extra);

  onMounted(async () => {
    listDivision.value = await tableStore.getDivisionLead();
    const listaGR = await tableStore.getGrupoClienteLead();
    listGrupoCliente.value = listaGR.grupo;
    listOrigen.value = await tableStore.getOrigenLead();
    listEstado.value = await tableStore.getEstadoLead();
    // listPais.value = await tableStore.getPaisLead();
    await getListUsers(user.userCRM.iddivision);
    await getListPais();
    await getListDateRange();
    await tableStore.getGrupoClienteLead();
    await tableStore.getOrigenLead();
    await tableStore.getEstadoLead();
  });

  const showFilter = ref(false);
  const show_more_field = ref(false);
  const show_add = ref(false);

  // const listContacts = ref([] as Datum[]);
  const listPros = ref([]);
  const isFiltering = ref(false);
  const loading = ref(false);
  const selected = ref<{ [key: string]: string }>({});
  const datomando = ref({});

  const formInputs = ref([
    {
      input: 'q-input',
      label: 'Nombre',
      clearable: true,
      field: 'name',
      visible: true,
    },
    {
      input: 'q-input',
      label: 'Valor',
      clearable: true,
      field: 'valor_c',
      visible: true,
    },
    {
      input: 'q-select',
      label: 'Division',
      clearable: true,
      field: 'iddivision_c',
      option_label: 'label',
      option_value: 'cod_div',
      options_dense: true,
      visible: true,
      emit_value: true,
      map_options: true,
      options: listDivision,
    },
    {
      input: 'q-select',
      label: 'Area de Mercado',
      clearable: true,
      field: 'idamercado_c',
      option_label: 'label',
      option_value: 'cod_amercado',
      options_dense: true,
      visible: true,
      emit_value: true,
      map_options: true,
      options: listMercado,
    },
  ]);

  // para vaciar filtro
  const dataFilter = ref<any>({
    // easyFilter: '',
    name: '',
    valor: '',
    iddivicion: [],
    idamercado: [],
  });

  const submitFilter = async (params: any) => {
    datomando.value = {
      page: 1,
      rowsPerPage: 20,
      sortBy: 'name',
      order: 'desc',
      filter: params,
    };

    console.log(datomando.value);
    try {
      loading.value = true;
      // listContacts.value = await searchProspects(params.lastname);
      listPros.value = await getFiltroAtri(datomando.value);
      console.log(listPros.value);
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
      // easyFilter: '',
      name: '',
      valor: '',
      iddivicion: [],
      idamercado: [],
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
