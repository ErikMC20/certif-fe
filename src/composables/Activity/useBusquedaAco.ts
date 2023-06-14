import { onMounted, ref, watch } from 'vue';
import {
  useTipoCliente,
  useTipoCuenta,
  useRubro,
  useUserDivision,
  useTipoDocumento,
  usePais,
  useRegimenTributario,
} from 'src/composables/useLanguage';
import { userStore } from 'src/modules/Users/store/UserStore';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { AccountTableStore } from '../../modules/Accounts/store/AccountTableStore';
import { ActivityServices } from 'src/services/ActivityServices';
import Notification from 'src/modules/Prospects/utils/notify';

export const useBusquedaAco = () => {
  const { listTipoCliente, getListTipoCliente, filterTipoCliente } =
    useTipoCliente();
  const { listTipoCuenta, getListTipoCuenta } = useTipoCuenta();
  const { listRubro, listSubrubro, getListRubro, getListSubrubro } = useRubro();
  const { listUsers, getListUsers, filterUsers } = useUserDivision();
  const { listTipoDocumento, getListTipoDocumento } = useTipoDocumento();
  const { listPais, listRegion, getListPais, getListRegion } = usePais();
  const { listRegimenTributario, getListRegimenTributario } =
    useRegimenTributario();
  const { data_filter } = AccountTableStore();
  const { getFiltroAco } = ActivityServices();
  onMounted(async () => {
    await getListTipoCliente();
    await getListTipoCuenta();
    await getListRubro();
    await getListUsers(userStore().userCRM.iddivision);
    await getListTipoDocumento();
    await getListPais();
    await getListRegimenTributario();
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
      input: 'q-select',
      field: 'account_type',
      label: 'Tipo cuenta',
      clearable: true,
      option_label: 'label',
      option_value: 'cod_c',
      visible: true,
      emit_value: true,
      map_options: true,
      options: listTipoCuenta,
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
      field_depencende: 'account_type',
    },
    {
      input: 'q-input',
      label: 'Nombre Comercial',
      clearable: true,
      field: 'comercial_name',
      visible: true,
      dependence: 'Empresa',
      field_depencende: 'account_type',
    },
    {
      input: 'q-input',
      label: 'Código AIO',
      type: 'number',
      clearable: true,
      field: 'aio_code',
      visible: true,
    },
    {
      input: 'q-input',
      label: 'NIT / CI',
      clearable: true,
      field: 'nit_ci',
      visible: true,
    },
    {
      input: 'q-select',
      label: 'Tipo cliente',
      field: 'client_type',
      option_label: 'label',
      option_value: 'cod_tipo',
      options_dense: true,
      clearable: true,
      visible: true,
      options: listTipoCliente,
      use_input: true,
      debounce: 0,
      emit_value: true,
      map_options: true,
      filter_function: filterTipoCliente,
    },
    {
      input: 'q-input',
      label: 'Teléfono / Celular',
      type: 'tel',
      clearable: true,
      field: 'cellphone',
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
      input: 'q-select',
      label: 'Rubro',
      field: 'industry',
      option_label: 'label',
      option_value: 'cod_rubro',
      options_dense: true,
      clearable: true,
      visible: true,
      emit_value: true,
      map_options: true,
      options: listRubro,
    },
    {
      input: 'q-select',
      label: 'Sub rubro',
      field: 'sub_industry',
      option_label: 'label',
      option_value: 'cod_subrubro',
      options_dense: true,
      clearable: true,
      visible: true,
      emit_value: true,
      map_options: true,
      options: listSubrubro,
    },
    {
      input: 'q-select',
      label: 'Tipo Documento',
      clearable: true,
      field: 'document_type',
      option_label: 'label',
      option_value: 'cod_doc',
      options_dense: true,
      visible: true,
      emit_value: true,
      map_options: true,
      options: listTipoDocumento,
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
      label: 'Dirección',
      clearable: true,
      field: 'street',
      visible: true,
    },
    {
      option_label: 'label',
      option_value: 'cod_rt',
      options_dense: true,
      visible: true,
      emit_value: true,
      map_options: true,
      input: 'q-select',
      label: 'Regimen tributario',
      clearable: true,
      field: 'tax_regime',
      options: listRegimenTributario,
    },
    {
      input: 'q-input',
      label: 'Sitio web',
      clearable: true,
      field: 'website',
      visible: true,
    },
  ]);

  // para vaciar filtro
  const dataFilter = ref<any>({
    easyFilter: '',
    name: '',
    lastname: '',
    comercial_name: '',
    client_type: '',
    account_type: '',
    aio_code: '',
    nit_ci: '',
    cellphone: '',
    email: '',
    industry: '',
    sub_industry: '',
    country: '',
    state: '',
    city: '',
    street: '',
    document_type: '',
    tax_regime: '',
    website: '',
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
      listPros.value = await getFiltroAco(datomando.value);
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
      easyFilter: '',
      name: '',
      lastname: '',
      comercial_name: '',
      client_type: '',
      account_type: '',
      aio_code: '',
      nit_ci: '',
      cellphone: '',
      email: '',
      industry: '',
      sub_industry: '',
      country: '',
      state: '',
      city: '',
      street: '',
      document_type: '',
      tax_regime: '',
      website: '',
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
    () => dataFilter.value?.industry,
    (industry: string | string[] | undefined) => {
      dataFilter.value.sub_industry = '';
      if (typeof industry === 'string') getListSubrubro(industry);
    }
  );
  watch(
    () => dataFilter.value?.country,
    (country: string | string[]) => {
      dataFilter.value.state = '';
      if (typeof country === 'string') getListRegion(country);
    }
  );

  watch(
    () => dataFilter.value?.account_type,
    (account_type: string) => {
      const last = formInputs.value.find((el) => el.field == 'lastname');
      const com = formInputs.value.find((el) => el.field == 'comercial_name');
      if (last != undefined && com != undefined) {
        if (account_type === 'Privada') {
          last.visible = true;
          com.visible = false;
        } else {
          last.visible = false;
          com.visible = true;
        }
      }
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

export const useUtils = () => {
  const propsCreateAlert = {
    icon: 'perm_contact_calendar',
    iconColor: 'positive',
    iconSize: '50px',
    title: '¿ Relacionar contacto ?',
    message: 'La cuenta ',
    btnColor: 'positive',
    btnText: 'Si, agregar contacto',
  };

  const propsDeleteAlert = {
    icon: 'warning',
    iconColor: 'warning',
    iconSize: '50px',
    title: '¿ Eliminar cuenta relacionada ?',
    message: 'Esta cuenta se eliminará de la lista de cuentas relacionadas.',
    btnColor: 'negative',
    btnText: 'Si, eliminar',
  };

  const propsDeleteRelationAlert = {
    icon: 'warning',
    iconColor: 'warning',
    iconSize: '50px',
    title: '¿ Eliminar relación ?',
    message: 'El eliminara la relacion del registro.',
    btnColor: 'negative',
    btnText: 'Si, eliminar',
  };

  return {
    propsCreateAlert,
    propsDeleteAlert,
    propsDeleteRelationAlert,
  };
};
