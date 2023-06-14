import { defineStore } from 'pinia';
import { Pagination } from '../utils/types';
import { getTableData } from '../services/useAssignmentService';
import { ref } from 'vue';
import moment from 'moment';

export const useAssignmentTableStore = defineStore('assign-table', () => {
  const loading = ref(false);
  const pagination = ref({
    page: 1,
    sortBy: 'fecha_creacion',
    descending: true,
    rowsPerPage: 15,
    rowsNumber: 10,
  });
  const data_filter = ref({
    code: '',
    status: ['En revision'],
    approved_status: ['Pendiente'],
    start_date: {
      from: moment().format('YYYY/MM/DD'),
      to: moment().subtract(7, 'days').format('YYYY/MM/DD'),
    },
    end_date: '',
    area: [],
    creation_date: { from: '', to: '', operator: '', option: '' },
  });
  const data_table = ref({
    rows: [],
    columns: [
      {
        name: 'codigo',
        align: 'left',
        label: 'CODIGO',
        field: 'codigo',
        visible: true,
      },
      {
        name: 'nombre',
        align: 'left',
        label: 'AREA DE TRABAJO',
        field: 'nombre',
        sortable: true,
        visible: true,
      },
      {
        name: 'supervisor',
        align: 'left',
        label: 'SUPERVISOR',
        field: 'supervisor',
        visible: true,
      },

      {
        name: 'estado',
        align: 'left',
        label: 'ESTADO',
        field: 'estado',
        sortable: true,
        visible: true,
      },
      {
        name: 'fecha_inicio',
        align: 'left',
        label: 'FECHA INICIO',
        field: 'fecha_inicio',
        sortable: true,
        visible: true,
      },
      {
        name: 'fecha_fin',
        align: 'left',
        label: 'FECHA FIN',
        field: 'fecha_fin',
        sortable: true,
        visible: true,
      },
      {
        name: 'estado_carga',
        align: 'left',
        label: 'APROBACION',
        field: 'estado_carga',
        sortable: false,
        visible: true,
      },
    ],
  });
  const visible_fields = ref([
    'code',
    'status',
    'approved_status',
    'start_date',
    'end_date',
    'area',
    'created_by',
    'modified_by',
    'creation_date',
  ]);
  const visible_columns = ref([
    'codigo',
    'nombre',
    'estado',
    'supervisor',
    'progreso',
    'fecha_inicio',
    'fecha_fin',
    'estado_carga',
  ]);

  //actions

  const clearFilterData = async () => {
    data_filter.value = {
      code: '',
      status: [],
      approved_status: [],
      start_date: { from: '2020/07/08', to: '2020/07/17' },
      end_date: '',
      area: [],
      creation_date: { from: '', to: '', operator: '', option: '' },
    };
  };

  const getListAssignations = async (
    id: string,
    props: {
      pagination: Pagination;
      filter: any;
    }
  ) => {
    loading.value = true;
    const { pagination, filter } = props;
    const { page, rowsPerPage, sortBy, descending } = pagination;
    const params = {
      page: page,
      rowsPerPage: rowsPerPage,
      sortBy: sortBy,
      order: descending ? 'desc' : 'asc',
      filter: filter,
    };
    const { rows, total } = await getTableData(id, params);

    data_table.value.rows = rows;
    pagination.rowsNumber = total;
    loading.value = false;
  };

  const reloadList = async (id: string) => {
    await getListAssignations(id, {
      pagination: pagination.value,
      filter: data_filter.value,
    });
  };

  const setVisibleColumn = (columns: string[]) => {
    visible_columns.value = columns;
  };

  const setPagination = (pag: any) => {
    pagination.value.sortBy = pag.sortBy;
    pagination.value.rowsPerPage = pag.rowsPerPage;
    pagination.value.descending = pag.descending;
  };

  const setVisibleField = async (columns: string[]) => {
    visible_fields.value = columns;
  };

  return {
    loading,
    pagination,
    data_filter,
    visible_columns,
    visible_fields,
    data_table,

    getListAssignations,
    clearFilterData,
    reloadList,
    setVisibleColumn,
    setVisibleField,
    setPagination,
  };
});
