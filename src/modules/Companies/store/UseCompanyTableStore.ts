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
} from '../services/useCompanyService';
import { axios_PREFERENCES } from 'src/conections/axiosCRM';
import { Notification } from 'src/composables';
import { userStore } from 'src/modules/Users/store/UserStore';

const { userCRM } = userStore();

export const useCompanyTableStore = defineStore('company_table', {
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
        // {
        //   name: 'id_empresa',
        //   align: 'left',
        //   label: 'id Empresa',
        //   field: 'id_empresa',
        //   sortable: true,
        //   visible: true,
        // },
        {
          name: 'name',
          align: 'left',
          label: 'Nombre Legal de la Empresa',
          field: 'name',
          sortable: true,
          visible: true,
        },
        {
          name: 'razon_social_c',
          align: 'left',
          label: 'Razón social',
          field: 'razon_social_c',
          sortable: true,
          visible: true,
        },
        {
          name: 'direccion_c',
          align: 'left',
          label: 'Dirección',
          field: 'direccion_c', //back
          sortable: true,
          visible: true,
        },
        {
          name: 'resolucion_ministerial_c',
          align: 'left',
          label: 'Nro. de Resolución Ministerial',
          field: 'resolucion_ministerial_c',
          sortable: true,
          visible: true,
        },
        {
          name: 'phone_office',
          align: 'left',
          label: 'Teléfono',
          field: 'phone_office',
          sortable: true,
          visible: true,
        },
        {
          name: 'ownership',
          align: 'left',
          label: 'Representante Legal',
          field: 'ownership',
          sortable: true,
          visible: true,
        }
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
        'name',
        'razon_social_c',
        'direccion_c',
        'resolucion_ministerial_c',
        'phone_office',
        'ownership'
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

    async getListCompanies(props: { pagination: Pagination; filter: Filter }) {
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
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async reloadList() {
      await this.getListCompanies({
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
