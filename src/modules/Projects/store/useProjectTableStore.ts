import { defineStore } from 'pinia';
import {
  Filter,
  Pagination,
  PaginationTable,
  UpdateMassiveModel,
} from '../utils/types';
import {
  updateMassiveData,
  deleteMassiveData,
  getTableData,
  getTablePreferences,
  saveTablePreferences,
  updateTablePreferences,
} from '../services/useProjectService';
import { axios_PREFERENCES } from 'src/conections/axiosCRM';
import { Notification } from 'src/composables';
import { userStore } from 'src/modules/Users/store/UserStore';

const { userCRM } = userStore();

export const useProjectTableStore = defineStore('project-table', {
  state: () => ({
    loading: false,
    mongo_id: '',
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
          label: 'CODIGO PST',
          field: 'codigo1',
          sortable: true,
          visible: true,
        },
        {
          name: 'codigo2',
          align: 'left',
          label: 'CODIGO AIO',
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
          sortable: true,
          visible: true,
        },
        {
          name: 'pendiente',
          align: 'left',
          label: 'POR REVISAR',
          field: 'pendiente',
          sortable: false,
          visible: true,
        },
        {
          name: 'progreso',
          align: 'left',
          label: 'SALUD DEL PROYECTO',
          field: 'progreso',
          sortable: true,
          visible: true,
        },

        {
          name: 'responsibles',
          align: 'left',
          label: 'RESPONSABLES',
          field: 'responsibles',
          sortable: false,
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
          name: 'dias',
          align: 'left',
          label: 'DURACIÓN',
          field: 'dias',
          sortable: false,
          visible: true,
        },
        {
          name: 'account_name',
          align: 'left',
          label: 'CLIENTE',
          field: 'account_name',
          sortable: false,
          visible: true,
        },
        {
          name: 'pais',
          align: 'left',
          label: 'PAIS',
          field: 'pais',
          sortable: true,
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
      'codigo2',
      'nombre',
      'estado',
      'pendiente',
      'progreso',
      'account_name',
      'asignado_a',
      'fecha_inicio',
      'fecha_cierre',
      'fecha_creacion',
      'dias',
    ],
  }),
  actions: {
    async getUserConfig() {
      const configuration = await getTablePreferences();
      if (configuration) {
        this.mongo_id = configuration._id;
        this.pagination.rowsPerPage = configuration.pagination.rowsPerPage;
        this.pagination.sortBy = configuration.pagination.sortBy;
        this.pagination.descending = configuration.pagination.descending;

        this.visible_columns = configuration.visible_columns;
        this.data_filter = configuration.data_filter;
        this.visible_fields = configuration.visible_fields;
      } else {
        this.mongo_id = await saveTablePreferences({
          pagination: this.pagination,
          visible_columns: this.visible_columns,
          data_filter: this.data_filter,
          visible_fields: this.visible_fields,
        });
      }
    },

    async getListProjects(props: { pagination: Pagination; filter: Filter }) {
      try {
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

        this.data_table.rows = data;
        this.pagination.rowsNumber = data.length;
        console.log(data.length);
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async reloadList() {
      await this.getListProjects({
        pagination: this.pagination,
        filter: this.data_filter,
      });
    },

    async setPagination(pagination: PaginationTable) {
      if (
        this.mongo_id &&
        (pagination.rowsPerPage !== this.pagination.rowsPerPage ||
          pagination.sortBy !== this.pagination.sortBy ||
          pagination.descending !== this.pagination.descending)
      ) {
        await updateTablePreferences(this.mongo_id ?? '', {
          pagination: {
            sortBy: pagination.sortBy,
            descending: pagination.descending,
            rowsPerPage: pagination.rowsPerPage,
          },
        });
        this.pagination.sortBy = pagination.sortBy;
        this.pagination.rowsPerPage = pagination.rowsPerPage;
        this.pagination.descending = pagination.descending;
      }
    },

    async setVisibleColumn(columns: string[]) {
      await updateTablePreferences(this.mongo_id ?? '', {
        visible_columns: columns,
      });
      this.visible_columns = columns;
    },

    async setVisibleField(columns: string[]) {
      await updateTablePreferences(this.mongo_id ?? '', {
        visible_fields: columns,
      });
      this.visible_fields = columns;
    },

    async setFilterData() {
      try {
        await axios_PREFERENCES.patch(
          `/tables-users-preferences/${this.mongo_id}`,
          {
            data_filter: this.data_filter,
          }
        );
      } catch (error) {
        console.log(error);
      }
    },

    async deleteMultiple(selectItems: { id: string }[]) {
      this.loading = true;

      try {
        const dataSend = {
          user_id: userCRM.id,
          items: selectItems,
        };
        await deleteMassiveData(dataSend);
        await this.reloadList();
        Notification(
          'positive',
          'check_circle',
          `<strong> Acción exitosa¡ </strong> <br/> ${
            selectItems.length > 1
              ? `Se eliminaron ${selectItems.length} registros de la tabla.`
              : 'Se eliminó un registro de la tabla.'
          }`
        );
      } catch (error) {
        Notification(
          'negative',
          'warning',
          '<strong> Ops! algo salió mal </strong> <br/>Ocurrió un error al eliminar los datos.'
        );
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateMultiple(
      data: UpdateMassiveModel,
      selectItems: { id: string }[]
    ) {
      this.loading = true;

      try {
        const dataSend = {
          items: selectItems,
          data_update: {
            ...data,
            user_id: userCRM.id,
          },
        };
        await updateMassiveData(dataSend);
        await this.reloadList();
        Notification(
          'positive',
          'check_circle',
          `<strong> Acción exitosa¡ </strong> <br/> ${
            selectItems.length > 1
              ? `Se actualizaron ${selectItems.length} registros de la tabla.`
              : 'Se actualizó un registro de la tabla.'
          }`
        );
      } catch (error) {
        Notification(
          'negative',
          'warning',
          '<strong> Ops! algo salió mal </strong> <br/>Ocurrió un error al eliminar los datos.'
        );
        throw error;
      } finally {
        this.loading = false;
      }
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
      try {
        await axios_PREFERENCES.patch(
          `/tables-users-preferences/${this.mongo_id}`,
          {
            data_filter: this.data_filter,
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
  },
});
