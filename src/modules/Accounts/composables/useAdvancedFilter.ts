/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, onMounted, watch } from 'vue';
import {
  useTipoCliente,
  useTipoCuenta,
  useRubro,
  useUserDivision,
  useTipoDocumento,
  usePais,
  useRegimenTributario,
  useDateRange,
} from 'src/composables/useLanguage';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { userStore } from 'src/modules/Users/store/UserStore';
import { AccountTableStore } from '../store/AccountTableStore';

export const useAdvancedFilter = () => {
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
  const { listDateRange, getListDateRange } = useDateRange();

  const literalDate = ref('');

  onMounted(async () => {
    await getListTipoCliente();
    await getListTipoCuenta();
    await getListRubro();
    await getListUsers(userStore().userCRM.iddivision);
    await getListTipoDocumento();
    await getListPais();
    await getListRegimenTributario();
    await getListDateRange();
  });
  /**
   * ? Dialog para mostrar mas campos de busqueda
   */
  const show_more_input = ref(false);
  const todos = ref(false);

  const form = ref([
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
      visible: false,
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
      visible: false,
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
      visible: false,
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
      input: 'q-input',
      label: 'Ciudad',
      clearable: true,
      field: 'city',
      visible: false,
    },
    {
      input: 'q-input',
      label: 'Dirección',
      clearable: true,
      field: 'street',
      visible: false,
    },
    {
      input: 'q-select',
      label: 'Fecha creación',
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
    {
      option_label: 'label',
      option_value: 'cod_rt',
      options_dense: true,
      visible: false,
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
      visible: false,
    },
  ]);

  const form_modules = ref([
    {
      input: 'q-select',
      field: 'tipocuenta_c',
      label: 'Contacto',
      clearable: false,
      option_label: 'label',
      option_value: 'cod_c',
      visible: false,
      emit_value: true,
      map_options: true,
      options: listTipoCuenta,
    },
    {
      input: 'q-select',
      field: 'tipocuenta_c',
      label: 'Cotizaciones',
      clearable: false,
      option_label: 'label',
      option_value: 'cod_c',
      visible: false,
      emit_value: true,
      map_options: true,
      options: listTipoCuenta,
    },
    {
      input: 'q-select',
      field: 'tipocuenta_c',
      label: 'Campaña',
      clearable: false,
      option_label: 'label',
      option_value: 'cod_c',
      visible: false,
      emit_value: true,
      map_options: true,
      options: listTipoCuenta,
    },
    {
      input: 'q-select',
      field: 'tipocuenta_c',
      label: 'Propectos',
      clearable: false,
      option_label: 'label',
      option_value: 'cod_c',
      visible: false,
      emit_value: true,
      map_options: true,
      options: listTipoCuenta,
    },
    {
      input: 'q-select',
      field: 'tipocuenta_c',
      label: 'Oportunidades',
      clearable: false,
      option_label: 'label',
      option_value: 'cod_c',
      visible: false,
      emit_value: true,
      map_options: true,
      options: listTipoCuenta,
    },
  ]);

  const dataFilter = ref<any>(data_filter);

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
      const last = form.value.find((el) => el.field == 'lastname');
      const com = form.value.find((el) => el.field == 'comercial_name');
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

  const clearFilter = () => {
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
      creation_date: { from: '', to: '', operator: '', option: '' },
    };
  };

  return {
    show_more_input,
    todos,
    literalDate,
    HANSACRM3_URL,
    form,
    dataFilter,
    form_modules,
    clearFilter,
  };
};

export interface genericModel {
  [keyof: string]: string | string[];
}
