import { defineStore } from 'pinia';
import { axios_LB_01, axios_PREFERENCES } from 'src/conections/axiosCRM';
import { userStore } from 'src/modules/Users/store/UserStore';

const user = userStore();

export const ContactTableStore = defineStore('contact_table', {
  state: () => ({
    mongo_id: null,
    pagination: {
      page: 1,
      sortBy: 'fecha_creacion',
      descending: true,
      rowsPerPage: 10,
      rowsNumber: 10,
    },
    data_filter: {
      name: '',
      lastname: '',
      ci: '',
      cellphone: '',
      parent: '',
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
          name: 'ci',
          align: 'left',
          label: 'Ci',
          field: 'ci',
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
          name: 'cuenta',
          align: 'left',
          label: 'Cuenta',
          field: 'cuenta',
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
          name: 'fecha_nacimiento',
          align: 'left',
          label: 'Fecha de nacimiento',
          field: 'fecha_nacimiento',
          sortable: true,
          visible: true,
        },
        {
          name: 'genero',
          align: 'left',
          label: 'Genero',
          field: 'genero',
          sortable: false,
        },
        {
          name: 'padre',
          align: 'left',
          label: 'Padre/Madre',
          field: 'padre',
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
      'name',
      'lastname',
      'ci',
      'parent',
      'cellphone',
      'email',
      'country',
      'created_by',
      'assigned_to',
    ],
    visible_columns: [
      'nombre',
      'ci',
      'telefono',
      'cuenta',
      'correo',
      'asignado_a',
      'fecha_creacion',
    ],
  }),
  actions: {
    async getUserConfig() {
      try {
        const { data } = await axios_PREFERENCES.get(
          `/tables-users-preferences?filter=${JSON.stringify({
            where: { module: 'Contacts', user_id: user.userCRM.id },
            limit: 1,
          })}`
        );
        const configuration = data;
        if (configuration) {
          this.mongo_id = configuration._id;
          this.pagination.rowsPerPage = configuration.pagination.rowsPerPage;
          this.pagination.sortBy = configuration.pagination.sortBy;
          this.pagination.descending = configuration.pagination.descending;

          this.visible_columns = configuration.visible_columns;
          this.data_filter = configuration.data_filter;
          this.visible_fields = configuration.visible_fields;
        } else {
          try {
            const res = await axios_PREFERENCES.post(
              '/tables-users-preferences',
              {
                module: 'Contacts',
                user_id: user.userCRM.id,
                pagination: this.pagination,
                visible_columns: this.visible_columns,
                data_filter: this.data_filter,
                visible_fields: this.visible_fields,
              }
            );
            console.log(res);

            this.mongo_id = res.data._id;
          } catch (error) {
            throw error;
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getListContacts(
      page: number,
      cantidad: number,
      sortBy: string,
      order: string,
      filter: object
    ) {
      try {
        const params = {
          page: page,
          rowsPerPage: cantidad,
          filter: filter,
          sortBy: sortBy,
          order: order,
        };
        const total = await axios_LB_01.get(
          `/contacts-total/?filter=${encodeURIComponent(
            JSON.stringify(params)
          )}`
        );
        const rows = await axios_LB_01.get(
          `/contacts_advanced_filter?params=${encodeURIComponent(
            JSON.stringify(params)
          )}`
        );

        this.data_table.rows = rows.data.data;
        this.pagination.rowsNumber = total.data;
      } catch (error) {
        throw error;
      }
    },

    async reloadList() {
      const { sortBy, descending, rowsPerPage } = this.pagination;

      await this.getListContacts(
        1,
        rowsPerPage,
        sortBy,
        descending ? 'desc' : 'asc',
        this.data_filter
      );
    },

    async setVisibleColumn(columns: string[]) {
      try {
        await axios_PREFERENCES.patch(
          `/tables-users-preferences/${this.mongo_id}`,
          {
            visible_columns: columns,
          }
        );
        this.visible_columns = columns;
      } catch (error) {
        console.log(error);
      }
    },

    async setVisibleField(columns: string[]) {
      try {
        await axios_PREFERENCES.patch(
          `/tables-users-preferences/${this.mongo_id}`,
          {
            visible_fields: columns,
          }
        );
        this.visible_fields = columns;
      } catch (error) {
        console.log(error);
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async setPagination(pagination: any) {
      if (
        this.mongo_id &&
        (pagination.rowsPerPage !== this.pagination.rowsPerPage ||
          pagination.sortBy !== this.pagination.sortBy ||
          pagination.descending !== this.pagination.descending)
      ) {
        try {
          const { data } = await axios_PREFERENCES.patch(
            `/tables-users-preferences/${this.mongo_id}`,
            {
              pagination: {
                sortBy: pagination.sortBy,
                descending: pagination.descending,
                rowsPerPage: pagination.rowsPerPage,
              },
            }
          );
          console.log(data);
          this.pagination.sortBy = pagination.sortBy;
          this.pagination.rowsPerPage = pagination.rowsPerPage;
          this.pagination.descending = pagination.descending;
        } catch (error) {
          console.log(error);
        }
      }
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

    async clearFilterData() {
      this.data_filter = {
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
