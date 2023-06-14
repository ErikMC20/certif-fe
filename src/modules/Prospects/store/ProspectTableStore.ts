/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import Notification from '../utils/notify';
import { userStore } from 'src/modules/Users/store/UserStore';
import { OptionBase, PaginationTable } from '../utils/types';
import { ProspectService } from '../services/ProspectsService';

const user = userStore();
const {
  getTablePreferences,
  saveTablePreferences,
  updateTablePreferences,
  getTableData,
  deleteMassiveData,
  updateMassiveData,
  updateDatosPros,
} = ProspectService();

export const ProspectTableStore = defineStore('prospect_table', {
  state: () => ({
    mongo_id: null,
    loading: false,
    pagination: {
      page: 1,
      sortBy: 'fecha_creacion',
      descending: true,
      rowsPerPage: 10,
      rowsNumber: 10,
    },
    data_filter: {
      campaign: '',
      account_name: '',
      name: '',
      lastname: '',
      lead_source: [],
      status: [],
      phone: '',
      email: '',
      country: '',
      state: '',
      city: '',
      street: '',
      created_by: [],
      modified_by: [],
      assigned_to: [],
      creation_date: { from: '', to: '', operator: '', option: '' },
    },
    data_extra: {
      name_campaign: '',
    },
    data_table: {
      rows: [],
      columns: [
        {
          name: 'nombre',
          align: 'left',
          label: 'Nombre',
          field: 'nombre',
          sortable: true,
          visible: true,
        },

        {
          name: 'estado',
          align: 'left',
          label: 'Estado',
          field: 'estado',
          sortable: false,
        },
        {
          name: 'cuenta',
          align: 'left',
          label: 'Cuenta',
          field: 'cuenta',
          sortable: true,
          visible: true,
        },
        {
          name: 'telefono',
          align: 'left',
          label: 'Telefono',
          field: 'telefono',
          sortable: true,
          visible: true,
        },
        {
          name: 'celular',
          align: 'left',
          label: 'Celular',
          field: 'celular',
          sortable: true,
          visible: true,
        },
        {
          name: 'correo',
          align: 'left',
          label: 'Correo',
          field: 'correo',
          sortable: true,
          visible: true,
        },
        {
          name: 'campania',
          align: 'left',
          label: 'Campaña',
          field: 'campania',
          sortable: true,
          visible: true,
        },
        {
          name: 'creado_por',
          align: 'left',
          label: 'Creado Por',
          field: 'creado_por',
          sortable: true,
          visible: true,
        },
        {
          name: 'asignado_a',
          align: 'left',
          label: 'Asignado',
          field: 'asignado_a',
          sortable: true,
          visible: true,
        },
        {
          name: 'fecha_creacion',
          align: 'left',
          label: 'Fecha Creación',
          field: 'fecha_creacion',
          sortable: true,
          visible: true,
        },
        {
          name: 'fecha_modificacion',
          align: 'left',
          label: 'Fecha Modificación',
          field: 'fecha_modificacion',
          sortable: true,
          visible: true,
        },
      ],
    },
    visible_fields: [
      'campaign',
      'name',
      'lastname',
      'ci',
      'phone',
      'email',
      'country',
      'created_by',
      'assigned_to',
    ],
    visible_columns: [
      'nombre',
      'estado',
      'telefono',
      'cuenta',
      'correo',
      'asignado_a',
      'fecha_creacion',
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
        this.data_extra = configuration.data_extra;
      } else {
        this.mongo_id = await saveTablePreferences({
          pagination: this.pagination,
          visible_columns: this.visible_columns,
          data_filter: this.data_filter,
          visible_fields: this.visible_fields,
          data_extra: this.data_extra,
        });
      }
    },

    async getListProspects(props: {
      pagination: PaginationTable;
      filter: any;
    }) {
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
      console.log(params);
      this.data_table.rows = data?.rows;
      this.pagination.rowsNumber = data?.total;
      this.loading = false;
    },

    async reloadList() {
      await this.getListProspects({
        pagination: this.pagination,
        filter: this.data_filter,
      });
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

    async setPagination(pagination: any) {
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

    async setFilterData() {
      await updateTablePreferences(this.mongo_id ?? '', {
        data_filter: this.data_filter,
      });
    },

    async clearFilterData() {
      this.data_filter = {
        campaign: '',
        account_name: '',
        name: '',
        lastname: '',
        lead_source: [],
        status: [],
        phone: '',
        email: '',
        country: '',
        state: '',
        city: '',
        street: '',
        created_by: [],
        modified_by: [],
        assigned_to: [],
        creation_date: { from: '', to: '', operator: '', option: '' },
      };
      this.data_extra = {
        name_campaign: '',
      };
      await updateTablePreferences(this.mongo_id ?? '', {
        data_filter: this.data_filter,
        data_extra: this.data_extra,
      });
    },

    async deleteMultiple(selectItems: OptionBase[]) {
      console.log('seleccionados ->', selectItems);

      try {
        this.loading = true;
        const itemsIds = selectItems.map((el) => {
          return { id: el.id };
        });
        console.log('ids ->', itemsIds);

        const dataSend = {
          module: 'Leads',
          id_user: user.userCRM.id,
          list_id_modules: itemsIds,
        };
        await deleteMassiveData(dataSend);
        await this.reloadList();
        Notification(
          'positive',
          'check_circle',
          `<strong> Acción exitosa¡ </strong> <br/> ${
            itemsIds.length > 1
              ? `Se eliminaron ${itemsIds.length} registros de la tabla.`
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

    async updateMultiple(dataChanging: any, selectItems: OptionBase[]) {
      try {
        this.loading = true;
        const {
          assigned_user_id,
          estadocampana,
          pais,
          regiones,
          contacto,
          tipocampana,
        } = dataChanging;
        const dataSend = {
          module: 'Leads',
          id_user: user.userCRM.id,
          attributes: {
            assigned_user_id: assigned_user_id,
            status: estadocampana,
            alt_address_country: pais,
            primary_address_country: pais,
            alt_address_city: regiones,
            lead_source: contacto,
          },
          list_id_modules: [...selectItems],
          campaign: {
            id: tipocampana.id,
            name: tipocampana.value,
          },
        };
        await updateDatosPros(dataSend);
        await this.reloadList();
        Notification(
          'positive',
          'check',
          `<strong> Acción exitosa¡ </strong> <br/> Se actualizaron ${selectItems.length} registros de la tabla.`
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

    async updateCampaignMultiple(dataChanging: any, selectItems: OptionBase[]) {
      try {
        this.loading = true;
        const { assigned_user, campaign } = dataChanging;

        const dataSend = {
          module: 'Leads',
          id_user: user.userCRM.id,
          attributes: {},
          list_id_modules: [...selectItems],
          campaign: {
            id: campaign.id,
            name: campaign.nombre,
            assigned_user_id: assigned_user,
          },
        };
        await updateDatosPros(dataSend);
        await this.reloadList();
        Notification(
          'positive',
          'check',
          `<strong> Acción exitosa¡ </strong> <br/> Se actualizaron ${selectItems.length} registros de la tabla.`
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
  },
});
