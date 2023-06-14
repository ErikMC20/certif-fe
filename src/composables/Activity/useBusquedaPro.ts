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

export const useBusquedaPro = () => {
  const { listUsers, getListUsers, filterUsers } = useUserDivision();
  const { listPais, listRegion, getListPais, getListRegion } = usePais();
  const { getFiltroPro } = ActivityServices();
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
  const datomando = ref({});

  const formInputs = ref([
    {
      input: 'q-input',
      label: 'Nombre de la cuenta',
      clearable: true,
      field: 'account_name',
      visible: true,
    },
    {
      input: 'q-input',
      label: 'Nombre(s)',
      clearable: true,
      field: 'name',
      visible: true,
    },
    {
      input: 'q-input',
      label: 'Apellidos',
      clearable: true,
      field: 'lastname',
      visible: true,
      dependence: 'Privada',
    },
    {
      input: 'q-select',
      label: 'Toma de contacto',
      clearable: true,
      field: 'lead_source',
      option_label: 'label',
      option_value: 'value',
      options_dense: true,
      visible: true,
      emit_value: true,
      map_options: true,
      options: listProspectSource,
    },
    {
      input: 'q-select',
      label: 'Estado',
      clearable: true,
      field: 'status',
      option_label: 'label',
      option_value: 'value',
      options_dense: true,
      visible: true,
      emit_value: true,
      map_options: true,
      options: listProspectStatus,
    },
    {
      input: 'q-input',
      label: 'Telefono / Celular',
      type: 'tel',
      clearable: true,
      field: 'phone',
      visible: true,
    },
    {
      input: 'q-input',
      label: 'Email',
      clearable: true,
      field: 'email',
      visible: true,
    },
    {
      with_avatar: true,
      input: 'q-select',
      label: 'Asignado a',
      field: 'assigned_to',
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
      field: 'created_by',
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
      label: 'Modificado por',
      field: 'modified_by',
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
      field: 'state',
      options_dense: true,
      visible: true,
      emit_value: true,
      map_options: true,
      options: listRegion,
      dependence: 'country',
    },
    {
      input: 'q-input',
      label: 'Ciudad',
      clearable: true,
      field: 'city',
      visible: true,
    },
    {
      input: 'q-input',
      label: 'Direccion',
      clearable: true,
      field: 'street',
      visible: true,
    },
  ]);

  // para vaciar filtro
  const dataFilter = ref<any>({
    account_name: '',
    name: '',
    lastname: '',
    lead_source: [],
    status: [],
    phone: '',
    email: '',
    country: '',
    state: '',
    city: '',
    street: '',
    created_by: [],
    modified_by: [],
    assigned_to: [],
  });

  const submitFilter = async (params: any) => {
    datomando.value = {
      page: 1,
      rowsPerPage: 20,
      sortBy: 'fecha_creacion',
      order: 'desc',
      filter: params,
    };

    console.log(datomando.value);
    try {
      loading.value = true;
      // listContacts.value = await searchProspects(params.lastname);
      listPros.value = await getFiltroPro(datomando.value);
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
      account_name: '',
      name: '',
      lastname: '',
      lead_source: [],
      status: [],
      phone: '',
      email: '',
      country: '',
      state: '',
      city: '',
      street: '',
      created_by: [],
      modified_by: [],
      assigned_to: [],
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
