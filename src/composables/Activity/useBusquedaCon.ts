import { onMounted, ref, watch } from 'vue';
import { useUserDivision, usePais } from 'src/composables/useLanguage';
import { userStore } from 'src/modules/Users/store/UserStore';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { searchAccounts } from 'src/modules/Accounts/services/AccountRelatedService';
import Notification from 'src/modules/Prospects/utils/notify';
import { Datum } from 'src/modules/Accounts/utils/types/index';
import serviceTabContact, {
  genericModel,
} from 'src/modules/Accounts/services/AccountTabContactsService';

export const useBusquedaCon = (account_id?: string) => {
  const { listUsers, getListUsers, filterUsers } = useUserDivision();
  const { listPais, listRegion, getListPais, getListRegion } = usePais();
  const { filterAdvanced, addContact } = serviceTabContact();
  const { userCRM } = userStore();

  onMounted(async () => {
    await getListUsers(userCRM.iddivision);
    await getListPais();
  });

  const showFilter = ref(false);
  const show_more_field = ref(false);
  const show_add = ref(false);
  const select_all = ref(false);
  const listAccount = ref([]);
  const listContacts = ref([] as Datum[]);
  const isFiltering = ref(false);
  const loading = ref(false);
  const selected = ref<{ [key: string]: string }>({});

  const filterAccount = (
    val: string,
    update: (callback: () => void) => void
  ) => {
    if (val === '') {
      update(() => {
        listAccount.value = [];
      });
      return;
    }
    update(async () => {
      listAccount.value = await searchAccounts(val);
    });
  };

  const formInputs = ref([
    // {
    //   with_avatar: false,
    //   input: 'q-select',
    //   label: 'Cuenta',
    //   field: 'account',
    //   option_value: 'id',
    //   option_label: 'nombre',
    //   selected_class: 'text-deep-primary text-bold',
    //   clearable: true,
    //   visible: true,
    //   use_chips: false,
    //   multiple: false,
    //   options: listAccount,
    //   use_input: true,
    //   debounce: 200,
    //   emit_value: true,
    //   map_options: true,
    //   filter_function: filterAccount,
    // },
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
      value: '',
    },
    {
      input: 'q-input',
      label: 'CI',
      clearable: true,
      field: 'ci',
      visible: true,
    },
    {
      input: 'q-input',
      label: 'Telefono / Celular',
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
      input: 'q-toggle',
      label: 'Padre/Madre',
      clearable: true,
      field: 'parent',

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataFilter = ref<any>({
    account: '',
    name: '',
    lastname: '',
    ci: '',
    cellphone: '',
    email: '',
    assigned_to: [],
    created_by: [],
    parent: '',
    country: '',
    state: '',
    city: '',
    street: '',
  });

  const existChanges = (params: genericModel) => {
    return Object.values(params).filter(
      (el: string | string[]) => el !== '' && el.length > 0
    ).length;
  };

  const submitFilter = async (params: genericModel, account_id: string) => {
    // console.log(params);
    // console.log(existChanges(params));
    if (existChanges(params) === 0) {
      Notification(
        'warning',
        'warning',
        'Debe ingresar al menos una entrada para realizar la búsqueda.'
      );
      return;
    }
    try {
      loading.value = true;
      listContacts.value = await filterAdvanced(account_id, params);
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
    listContacts.value = [];
    dataFilter.value = {
      account: '',
      name: '',
      lastname: '',
      ci: '',
      cellphone: '',
      email: '',
      assigned_to: [],
      created_by: [],
      parent: '',
      country: '',
      state: '',
      city: '',
      street: '',
    };
  };

  const onClose = () => {
    clearFilter();
    showFilter.value = false;
  };

  const insertItem = async () => {
    try {
      const res = await addContact(userCRM.id, account_id, selected.value.id);
      console.log(res);
      Notification(
        'positive',
        'check',
        `<strong> Acción existosa¡ </strong> <br/> Se agregó ${selected.value.nombre} a la lista de contactos.`
      );
      cancelInsertion();
    } catch (error) {
      Notification(
        'negative',
        'warning',
        '<strong> Ops! algo salió mal </strong> <br/>Ocurrió un error al realizar la acción.'
      );
      throw error;
    }
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
    insertItem,
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
    listContacts,
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
