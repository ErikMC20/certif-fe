import { defineStore } from 'pinia';
import { Filter, Pagination } from '../utils/types';
import { getTableData } from '../services/useAssignmentService';

export const useAssignmentTableStore = defineStore('assignment-table', {
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
          name: 'codigo',
          align: 'left',
          label: 'CODIGO',
          field: 'codigo',
          sortable: true,
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
          sortable: true,
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
          name: 'descarga',
          align: 'left',
          label: 'DESCARGA',
          field: 'descarga',
          sortable: false,
          visible: true,
        },
        {
          name: 'carga',
          align: 'left',
          label: 'CARGA',
          field: 'carga',
          sortable: false,
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
      'codigo',
      'nombre',
      'estado',
      'supervisor',
      'progreso',
      'fecha_inicio',
      'fecha_fin',
      'carga',
      'descarga',
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
      //const data = await getTableData(params);

      const rows = <any>[
        {
          codigo: 'YC01-01',
          nombre: 'YACUIBA 01',
          progreso: 'En progreso',
          fecha_inicio: '2022/03/12',
          fecha_fin: '2022/03/13',
          estado: 'APROBADO',
          supervisor: {
            nombre: 'PAOLA PEREDO',
          },
        },
        {
          codigo: 'YC02-01',
          nombre: 'YACUIBA 02',
          progreso: 'Terminado',
          fecha_inicio: '2022/03/01',
          fecha_fin: '2022/03/02',
          estado: 'APROBADO',
          supervisor: {
            nombre: 'JAIME LEON',
          },
        },
        {
          codigo: 'VLL01-01',
          nombre: 'VILLAMONETOS 01',
          progreso: 'En progreso',
          fecha_inicio: '2022/03/15',
          fecha_fin: '2022/03/15',
          estado: 'EN REVISION',
          supervisor: {
            nombre: 'ERIKA MILLAR',
          },
        },
        {
          codigo: 'YC02-02',
          nombre: 'YACUIBA 01',
          progreso: 'En progreso',
          fecha_inicio: '2022/03/12',
          fecha_fin: '2022/03/13',
          estado: 'APROBADO',
          supervisor: {
            nombre: 'JAILE LEON',
          },
        },
        {
          codigo: 'YC01-03',
          nombre: 'YACUIBA 01',
          progreso: 'En progreso',
          fecha_inicio: '2022/03/12',
          fecha_fin: '2022/03/13',
          estado: 'APROBADO',
          supervisor: {
            nombre: 'PEREDO',
          },
        },
        {
          codigo: 'YC01-02',
          nombre: 'YACUIBA 01',
          progreso: 'En progreso',
          fecha_inicio: '2022/03/12',
          fecha_fin: '2022/03/13',
          estado: 'RECHAZADO',
          supervisor: {
            nombre: 'PAOLA PEREDO',
          },
        },
        {
          codigo: 'YC01-03',
          nombre: 'YACUIBA 01',
          progreso: 'En progreso',
          fecha_inicio: '2022/03/12',
          fecha_fin: '2022/03/13',
          estado: 'EN REVISION',
          supervisor: {
            nombre: 'JAIME LEON',
          },
        },
      ];

      this.data_table.rows = rows;
      this.pagination.rowsNumber = 8;
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

    async setPagination(pagination: any) {
      // if (
      //   this.mongo_id &&
      //   (pagination.rowsPerPage !== this.pagination.rowsPerPage ||
      //     pagination.sortBy !== this.pagination.sortBy ||
      //     pagination.descending !== this.pagination.descending)
      // ) {
      //   await updateTablePreferences(this.mongo_id ?? '', {
      //     pagination: {
      //       sortBy: pagination.sortBy,
      //       descending: pagination.descending,
      //       rowsPerPage: pagination.rowsPerPage,
      //     },
      //   });
      this.pagination.sortBy = pagination.sortBy;
      this.pagination.rowsPerPage = pagination.rowsPerPage;
      this.pagination.descending = pagination.descending;
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
