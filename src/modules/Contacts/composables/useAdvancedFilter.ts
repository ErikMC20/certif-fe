/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, onMounted, watch } from 'vue';
import {
  useUserDivision,
  usePais,
  useDateRange,
} from 'src/composables/useLanguage';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { userStore } from 'src/modules/Users/store/UserStore';
import { ContactTableStore } from '../store/ContactTableStore';

export const useAdvancedFilter = () => {
  const { listUsers, getListUsers, filterUsers } = useUserDivision();
  const { listPais, listRegion, getListPais, getListRegion } = usePais();
  const { data_filter } = ContactTableStore();
  const { listDateRange, getListDateRange } = useDateRange();
  // const {
  //   unaSemana,
  //   esteMes,
  //   mesPasado,
  //   primerTrimestre,
  //   segundoTrimestre,
  //   tercerTrimestre,
  //   cuartoTrimestre,
  //   gestionPasada,
  //   gestionPresente,
  // } = useDateRange();

  onMounted(async () => {
    await getListUsers(userStore().userCRM.iddivision);
    await getListPais();
    await getListDateRange();
  });
  /**
   * ? Dialog para mostrar mas campos de busqueda
   */
  const show_more_input = ref(false);
  const todos = ref(false);

  const form = ref([
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
      input: 'q-input',
      label: 'CI',
      clearable: true,
      field: 'ci',
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
      visible: false,
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
      visible: false,
      emit_value: true,
      map_options: true,
      options: listRegion,
    },
    {
      input: 'q-select',
      label: 'Estado civil',
      clearable: true,
      field: 'civil_state',
      option_label: 'label',
      option_value: 'cod_estado',
      options_dense: true,
      visible: false,
      emit_value: true,
      map_options: true,
      options: [
        {
          label: '',
          cod_estado: '',
        },
        {
          label: 'Soltero',
          cod_estado: 'Solte',
        },
        {
          label: 'Casado',
          cod_estado: 'Casado',
        },
        {
          label: 'Viudo',
          cod_estado: 'Viudo',
        },
        {
          label: 'Dovorciado',
          cod_estado: 'Divor',
        },
        {
          label: 'Concub',
          cod_estado: 'Concubinato',
        },
        {
          label: 'Separ',
          cod_estado: 'Separado',
        },
        {
          label: 'Fallecido',
          cod_estado: 'Fallecido',
        },
      ],
    },
    {
      input: 'q-input',
      label: 'Ciudad',
      clearable: true,
      field: 'city',
      visible: false,
    },
    {
      input: 'q-input',
      label: 'Direccion',
      clearable: true,
      field: 'street',
      visible: false,
    },
    {
      input: 'q-select',
      label: 'Fecha creacion',
      clearable: true,
      field: 'creation_date',
      visible: false,
      withInput: true,
      options_dense: true,
      emit_value: true,
      map_options: true,
      option_label: 'label',
      option_value: 'value',
      options: listDateRange,
    },
  ]);

  const dataFilter = ref<any>(data_filter);

  watch(
    () => dataFilter.value.country,
    (country: string | string[]) => {
      dataFilter.value.state = '';
      if (typeof country === 'string') getListRegion(country);
    }
  );

  const clearFilter = () => {
    dataFilter.value = {
      name: '',
      lastname: '',
      ci: '',
      parent: '',
      cellphone: '',
      email: '',
      country: '',
      state: '',
      city: '',
      street: '',
      account: '',
      created_by: [],
      modified_by: [],
      assigned_to: [],
      creation_date: { from: '', to: '', operator: '', option: '' },
    };
  };

  return {
    show_more_input,
    HANSACRM3_URL,
    form,
    todos,
    dataFilter,
    clearFilter,
  };
};
