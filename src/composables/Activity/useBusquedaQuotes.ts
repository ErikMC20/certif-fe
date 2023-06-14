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

export const useBusquedaQuotes = () => {
  const tableStore = LeadsTableStore();
  const listDivision = ref();
  const listMercado = ref();
  const listGrupoCliente = ref();
  const listOrigen = ref();
  const user = userStore();
  const listEstado = ref();
  const { getFiltroQuotes } = ActivityServices();
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
    listMercado.value = await tableStore.getAreaMercaLead(
      dataFilter.value.division
    );
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
      label: 'Numero Cotizacion',
      clearable: true,
      field: 'nroCotizacion',
      visible: true,
      type: 'number',
    },
    {
      input: 'q-input',
      label: 'Nombre',
      clearable: true,
      field: 'name',
      visible: true,
    },
    {
      input: 'q-input',
      label: 'Chasis',
      clearable: true,
      field: 'chasis',
      visible: true,
    },
    {
      input: 'q-input',
      label: 'Año',
      clearable: true,
      field: 'año',
      visible: true,
    },
    {
      input: 'q-select',
      label: 'Pais',
      clearable: true,
      field: 'country',
      option_label: 'label',
      option_value: 'cod_pais',
      options_dense: true,
      visible: true,
      emit_value: true,
      map_options: true,
      options: listPais,
    },
    {
      input: 'q-select',
      label: 'Departamento',
      clearable: true,
      option_label: 'label',
      option_value: 'cod_region',
      field: 'regional',
      options_dense: true,
      visible: true,
      emit_value: true,
      map_options: true,
      options: listRegion,
    },
    {
      input: 'q-input',
      label: 'Codigo AIO',
      clearable: true,
      field: 'codigoAIO',
      visible: true,
    },
    {
      input: 'q-select',
      label: 'Division',
      clearable: true,
      field: 'division',
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
      field: 'amercado',
      option_label: 'label',
      option_value: 'cod_amercado',
      options_dense: true,
      visible: true,
      emit_value: true,
      map_options: true,
      options: listMercado,
    },
    {
      with_avatar: true,
      input: 'q-select',
      label: 'Asignado a',
      field: 'userassigned',
      option_value: 'id',
      option_label: 'user_name',
      selected_class: 'text-deep-primary text-bold',
      clearable: false,
      visible: true,
      use_chips: true,
      multiple: true,
      options: listUsers,
      use_input: true,
      debounce: 0,
      emit_value: true,
      map_options: true,
      filter_function: filterUsers,
    },
    {
      with_avatar: true,
      input: 'q-select',
      label: 'Creado por',
      field: 'usercreate',
      option_value: 'id',
      option_label: 'user_name',
      selected_class: 'text-deep-primary text-bold',
      clearable: false,
      visible: true,
      use_chips: true,
      multiple: true,
      options: listUsers,
      use_input: true,
      debounce: 0,
      emit_value: true,
      map_options: true,
      filter_function: filterUsers,
    },
    // {
    //   input: 'q-select',
    //   label: 'Fecha creacion',
    //   clearable: true,
    //   field: 'creation_date',
    //   visible: true,
    //   withInput: true,
    //   options_dense: true,
    //   emit_value: true,
    //   map_options: true,
    //   option_label: 'label',
    //   option_value: 'value',
    //   options: listDateRange,
    // },
  ]);

  // para vaciar filtro
  const dataFilter = ref<any>({
    nroCotizacion: '',
    name: '',
    chasis: '',
    año: '',
    regional: '',
    division: [],
    amercado: [],
    codigoAIO: '',
    etapaCotizacion: '',
    oportunidad: '',
    cuenta: '',
    contacto: '',
    usercreate: [],
    usermodificate: [],
    userassigned: [],
    creation_date: {
      from: '',
      to: '',
      operator: '',
      option: '',
    },
    creation_amount: {
      amount_from: '',
      amount_to: '',
      amount_operator: '',
    },
    idlead: '',
    idprospect: '',
  });

  const submitFilter = async (params: any) => {
    datomando.value = {
      page: 1,
      sortBy: 'date_entered',
      order: 'desc',
      rowsPerPage: 10,
      rowsNumber: 20,
      filter: params,
    };

    try {
      loading.value = true;
      // listContacts.value = await searchProspects(params.lastname);
      listPros.value = await getFiltroQuotes(datomando.value);
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
      nroCotizacion: '',
      name: '',
      chasis: '',
      año: '',
      regional: '',
      division: [],
      amercado: [],
      codigoAIO: '',
      etapaCotizacion: '',
      oportunidad: '',
      cuenta: '',
      contacto: '',
      usercreate: [],
      usermodificate: [],
      userassigned: [],
      creation_date: {
        from: '',
        to: '',
        operator: '',
        option: '',
      },
      creation_amount: {
        amount_from: '',
        amount_to: '',
        amount_operator: '',
      },
      idlead: '',
      idprospect: '',
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
