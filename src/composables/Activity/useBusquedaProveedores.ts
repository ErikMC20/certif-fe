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

export const useBusquedaProveedores = () => {
  const { listUsers, getListUsers, filterUsers } = useUserDivision();
  const { listPais, listRegion, getListPais, getListRegion } = usePais();
  const { getFiltroHanpProveedor } = ActivityServices();
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
      label: 'Busqueda Rapida',
      clearable: true,
      field: 'easefilter',
      visible: true,
      dependence: 'Privada',
    },
    {
      input: 'q-input',
      label: 'codigo proveedor',
      clearable: true,
      field: 'idproveedor_c',
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
      label: 'Dirección',
      clearable: true,
      field: 'billing_address_street',
      visible: true,
      dependence: 'Privada',
    },
    {
      input: 'q-input',
      label: 'Grupo Proveedor',
      clearable: true,
      field: 'idgrupo_c',
      visible: true,
      dependence: 'Privada',
    },
  ]);

  // para vaciar filtro
  const dataFilter = ref<any>({
    easefilter: '',
    idproveedor_c: '',
    name: '',
    billing_address_street: '',
    idgrupo_c: '',
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
      listPros.value = await getFiltroHanpProveedor(datomando.value);
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
      easefilter: '',
      idproveedor_c: '',
      name: '',
      billing_address_street: '',
      idgrupo_c: '',
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
