import { defineStore } from 'pinia';
import { Filter, Pagination } from '../utils/types';
import { getTableData } from '../services/useWorkAreasService';

export const useWorkAreasTableStore = defineStore('project-table', {
  state: () => ({
    loading: false,
    pagination: {
      page: 1,
      sortBy: 'fecha_creacion',
      descending: true,
      rowsPerPage: 15,
      rowsNumber: 10,
    },
    data_filter: {
      account: '',
      name: '',
      pst_code: '',
      aio_code: '',
      status: '',
      start_date: '',
      end_date: '',
      country: '',
      state: '',
      city: '',
      created_by: [],
      modified_by: [],
      assigned_to: [],
      creation_date: { from: '', to: '', operator: '', option: '' },
    },
    data_table: {
      rows: [],
      columns: [
        {
          name: 'codigo1',
          align: 'left',
          label: 'CODIGO 1',
          field: 'codigo1',
          sortable: true,
          visible: true,
        },
        {
          name: 'codigo2',
          align: 'left',
          label: 'CODIGO 2',
          field: 'codigo2',
          sortable: true,
          visible: true,
        },
        {
          name: 'nombre',
          align: 'left',
          label: 'NOMBRE',
          field: 'nombre',
          sortable: true,
          visible: true,
        },

        {
          name: 'estado',
          align: 'left',
          label: 'ESTADO',
          field: 'estado',
          sortable: false,
          visible: true,
        },
        {
          name: 'progreso',
          align: 'left',
          label: 'PROGRESO',
          field: 'progreso',
          sortable: true,
          visible: true,
        },
        {
          name: 'cuadrilla',
          align: 'left',
          label: 'CUADRILLAS',
          field: 'cuadrillas',
          sortable: true,
          visible: true,
        },
        {
          name: 'fecha_inicio',
          align: 'left',
          label: 'FECHA DE INICIO',
          field: 'fecha_inicio',
          sortable: true,
          visible: true,
        },
        {
          name: 'fecha_cierre',
          align: 'left',
          label: 'FECHA DE CIERRE',
          field: 'fecha_cierre',
          sortable: true,
          visible: true,
        },
        {
          name: 'account_name',
          align: 'left',
          label: 'CLIENTE',
          field: 'account_name',
          sortable: true,
          visible: true,
        },
        {
          name: 'pais',
          align: 'left',
          label: 'PAIS',
          field: 'pais',
          sortable: false,
          visible: true,
        },
        {
          name: 'creado_por',
          align: 'left',
          label: 'CREADO POR',
          field: 'creado_por',
          sortable: true,
          visible: true,
        },
        {
          name: 'asignado_a',
          align: 'left',
          label: 'ASIGNADO A',
          field: 'asignado_a',
          sortable: true,
          visible: true,
        },
        {
          name: 'fecha_creacion',
          align: 'left',
          label: 'FECHA CREACION',
          field: 'fecha_creacion',
          sortable: true,
          visible: true,
        },
        {
          name: 'fecha_modificacion',
          align: 'left',
          label: 'FECHA MODIFICACION',
          field: 'fecha_modificacion',
          sortable: true,
          visible: true,
        },
      ],
    },
    visible_fields: [
      'account',
      'name',
      'status',
      'country',
      'created_by',
      'assigned_to',
    ],
    visible_columns: [
      'codigo2',
      'nombre',
      'estado',
      'progreso',
      'account_name',
      'asignado_a',
      'fecha_inicio',
      'fecha_cierre',
      'fecha_creacion',
    ],
  }),
  actions: {
    async getListProjects(props: { pagination: Pagination; filter: Filter }) {
      this.loading = true;
      const { pagination, filter } = props;
      const { page, rowsPerPage, sortBy, descending } = pagination;
      const params = {
        page: page,
        rowsPerPage: rowsPerPage,
        sortBy: sortBy,
        order: descending ? 'desc' : 'asc',
        filter: filter,
      };
      const data = await getTableData(params);

      this.data_table.rows = data?.rows;
      this.pagination.rowsNumber = data?.total;
      this.loading = false;
    },

    async reloadList() {
      await this.getListProjects({
        pagination: this.pagination,
        filter: this.data_filter,
      });
    },

    async setVisibleColumn(columns: string[]) {
      // await updateTablePreferences(this.mongo_id ?? '', {
      //   visible_columns: columns,
      // });
      this.visible_columns = columns;
    },

    async setVisibleField(columns: string[]) {
      // await updateTablePreferences(this.mongo_id ?? '', {
      //   visible_fields: columns,
      // });
      this.visible_fields = columns;
    },

    async clearFilterData() {
      this.data_filter = {
        account: '',
        name: '',
        pst_code: '',
        aio_code: '',
        status: '',
        start_date: '',
        end_date: '',
        country: '',
        state: '',
        city: '',
        created_by: [],
        modified_by: [],
        assigned_to: [],
        creation_date: { from: '', to: '', operator: '', option: '' },
      };
      // await updateTablePreferences(this.mongo_id ?? '', {
      //   data_filter: this.data_filter,
      // });
    },
  },
});
