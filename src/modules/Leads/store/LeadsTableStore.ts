import { defineStore } from 'pinia';
import { axios_LB_03, axios_PREFERENCES } from 'src/conections/axiosCRM';
import Notification from 'src/modules/Accounts/utils/notify';
import { userStore } from 'src/modules/Users/store/UserStore';
import { OptionBase, PaginationTable } from '../utils/types';
import { useLeadsService } from 'src/modules/Leads/services/LeadsService';

const {
  getDivisionL,
  getAreaMercadoL,
  getGrupoCliente,
  getOrigen,
  getEstado,
  deleteMassiveData,
  updateMassiveData,
} = useLeadsService();
const user = userStore();
export const LeadsTableStore = defineStore('lead_table', {
  state: () => ({
    mongo_id: null,
    loading: false,
    listdivision: '',
    listmercado: '',
    pagination: {
      page: 1,
      sortBy: 'fecha_creacion',
      descending: true,
      rowsPerPage: 10,
      rowsNumber: 10,
    },
    data_filter: {
      // easyFilter: '',
      name: '',
      grupocliente: [],
      origen: [],
      estado: '',
      fechacierre: { from: '', to: '', operator: '', option: '' },
      producto: '',
      monto: '',
      cuenta_id: '',
      contacto_id: '',
      prospecto_id: '',
      division: [],
      areamercado: [],
      region: '',
      created_by: [],
      assigned_to: [],
      creation_date: { from: '', to: '', operator: '', option: '' },
    },
    data_extra: {
      name_account: '',
      name_contact: '',
      name_prospect: '',
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
          name: 'division',
          align: 'left',
          label: 'División',
          field: 'division',
          sortable: true,
          visible: true,
        },
        {
          name: 'a_mercado',
          align: 'left',
          label: 'Área de Mercado',
          field: 'a_mercado',
          sortable: true,
          visible: true,
        },
        {
          name: 'region',
          align: 'left',
          label: 'Región',
          field: 'region',
          sortable: true,
          visible: true,
        },
        {
          name: 'origen',
          align: 'left',
          label: 'Origen',
          field: 'origen',
          sortable: true,
          visible: true,
        },
        // {
        //   name: 'grupo_cliente',
        //   align: 'left',
        //   label: 'Grupo Cliente',
        //   field: 'grupo_cliente',
        //   sortable: true,
        //   visible: true,
        // },
        {
          name: 'cuenta',
          align: 'left',
          label: 'Cuenta',
          field: 'cuenta',
          sortable: true,
          visible: true,
        },
        {
          name: 'contacto',
          align: 'left',
          label: 'Contacto',
          field: 'contacto',
          sortable: true,
          visible: true,
        },
        {
          name: 'prospecto',
          align: 'left',
          label: 'Prospecto',
          field: 'prospecto',
          sortable: true,
          visible: true,
        },
        {
          name: 'estado',
          align: 'left',
          label: 'Estado',
          field: 'estado',
          sortable: true,
          visible: true,
        },
        {
          name: 'campaign_name',
          align: 'left',
          label: 'Campaña',
          field: 'campaign_name',
          sortable: true,
          visible: true,
        },
        {
          name: 'fecha_cierre',
          align: 'left',
          label: 'Fecha cierre',
          field: 'fecha_cierre',
          sortable: true,
          visible: true,
        },
        {
          name: 'producto',
          align: 'left',
          label: 'Producto',
          field: 'prodcuto',
          sortable: true,
          visible: true,
        },
        {
          name: 'creado_por',
          align: 'left',
          label: 'Creado por',
          field: 'creado_por',
          sortable: true,
          visible: true,
        },
        {
          name: 'modificado_por',
          align: 'left',
          label: 'Modificado por',
          field: 'modificado_por',
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
      'origen',
      'contacto',
      'cuenta',
      'prospecto',
      // 'grupo_cliente',
      'fecha_modificacion',
      'region',
    ],
    visible_columns: [
      'nombre',
      'division',
      'a_mercado',
      'estado',
      'campaign_name',
      'fecha_cierre',
      'asignado_a',
      'fecha_creacion',
      'creado_por',
      'modificado_por',
      'region',
    ],
  }),
  actions: {
    async getUserConfig() {
      try {
        const { data } = await axios_PREFERENCES.get(
          `/tables-users-preferences?filter=${JSON.stringify({
            where: { module: 'Leads', user_id: user.userCRM.id },
            limit: 1,
          })}`
        );
        const configuration = data;
        // console.log('INICIANDO LOS DATOS PARA CREAR EN EL PREFE', data);
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
          try {
            const res = await axios_PREFERENCES.post(
              '/tables-users-preferences',
              {
                module: 'Leads',
                user_id: user.userCRM.id,
                pagination: this.pagination,
                visible_columns: this.visible_columns,
                data_filter: this.data_filter,
                visible_fields: this.visible_fields,
                data_extra: this.data_extra,
              }
            );
            // console.log('OBTENIENDO LOS DATOS DEL PREFERENCES', res);

            this.mongo_id = res.data._id;
          } catch (error) {
            throw error;
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    // PARA CARGAR LA LISTA TANTO LA PAGINACION Y LOS DATOS CON EL FILTRO AVANZADO
    async getListLeads(props: {
      pagination: PaginationTable;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filter: any;
    }) {
      try {
        this.loading = true;
        const { pagination, filter } = props;
        const { page, rowsPerPage, sortBy, descending } = pagination;
        // console.log(filter)
        const params = {
          page: page,
          rowsPerPage: rowsPerPage,
          sortBy: sortBy,
          order: descending ? 'desc' : 'asc',
          filter: filter,
        };
        const total = await axios_LB_03.get(
          `/HANO_Leads_total?filter=${encodeURIComponent(
            JSON.stringify(params)
          )}`
        );
        const rows = await axios_LB_03.get(
          `/HANO_Leads_advanced_filter?params=${encodeURIComponent(
            JSON.stringify(params)
          )}`
        );
        // console.log(
        //   'CARGANDO EL FILTRO DE L LEAD',
        //   props.filter,
        //   JSON.stringify(params),
        //   rows,
        //   total
        // );

        this.data_table.rows = rows.data;
        this.pagination.rowsNumber = total.data;
        this.loading = false;
      } catch (error) {
        throw error;
      }
    },

    async reloadList() {
      await this.getListLeads({
        pagination: this.pagination,
        filter: this.data_filter,
      });
      // console.log(
      //   'RECARGANDO LOS DATOS DE LA LISTA LEAD',
      //   this.pagination,
      //   this.data_filter
      // );
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
        // console.log('PARA LAS COLUMNAS', this.visible_columns);
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
        // console.log('PARA LAS VISIBLE', this.visible_fields);
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
          // console.log('OBTENIENDO LA PAGINACION', data);
          this.pagination.sortBy = pagination.sortBy;
          this.pagination.rowsPerPage = pagination.rowsPerPage;
          this.pagination.descending = pagination.descending;
        } catch (error) {
          console.log(error);
        }
      }
    },
    //ACTUALIZAR LOS DATOS DEL FILTRO EN REDIS
    async setFilterData() {
      try {
        await axios_PREFERENCES.patch(
          `/tables-users-preferences/${this.mongo_id}`,
          {
            data_filter: this.data_filter,
            data_extra: this.data_extra,
          }
        );
        // console.log(
        //   'ACTUALIZANDO EL FILTRO',
        //   this.data_filter,
        //   this.data_extra
        // );
      } catch (error) {
        console.log(error);
      }
    },

    async clearFilterData() {
      this.data_filter = {
        // easyFilter: '',
        name: '',
        grupocliente: [],
        origen: [],
        estado: '',
        fechacierre: { from: '', to: '', operator: '', option: '' },
        producto: '',
        monto: '',
        cuenta_id: '',
        contacto_id: '',
        prospecto_id: '',
        division: [],
        areamercado: [],
        region: '',
        created_by: [],
        assigned_to: [],
        creation_date: { from: '', to: '', operator: '', option: '' },
      };
      this.data_extra = {
        name_account: '',
        name_contact: '',
        name_prospect: '',
      };
      try {
        await axios_PREFERENCES.patch(
          `/tables-users-preferences/${this.mongo_id}`,
          {
            data_filter: this.data_filter,
            data_extra: this.data_extra,
          }
        );
        // console.log(
        //   'BORRANDO CON EL CLEARFILTERDATA DEL PATCH PREFERENCES',
        //   this.data_filter,
        //   this.data_extra
        // );
      } catch (error) {
        console.log(error);
      }
    },
    // PARA LA ELIMINACION MASSIVA
    async deleteMultiple(selectItems: OptionBase[]) {
      console.log('seleccionados ->', selectItems);

      try {
        this.loading = true;
        const itemsIds = selectItems.map((el) => {
          return { id: el.id };
        });
        // console.log('ids ->', itemsIds);

        const dataSend = {
          module: 'HANO_Lead',
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async updateMultiple(dataChanging: any, selectItems: OptionBase[]) {
      try {
        // console.log(dataChanging, selectItems);
        this.loading = true;
        const { asignado, division, areamercado, estado, origen } =
          dataChanging;
        const dataSend = <any>{
          module: 'HANO_Lead',
          user_id: user.userCRM.id,
          attributes: [
            {
              column: 'assigned_user_id',
              value: asignado,
            },
            {
              column: 'iddivision_c',
              value: division,
            },
            {
              column: 'idamercado_c',
              value: areamercado,
            },
            {
              column: 'estado_c',
              value: estado,
            },
            {
              column: 'origen_c',
              value: origen,
            },
          ],
          module_ids: [...selectItems],
        };
        await updateMassiveData(dataSend);
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
          '<strong> Ops! algo salió mal </strong> <br/>Ocurrió un error al eliminar los datos22'
        );
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getDivisionLead() {
      this.listdivision = await getDivisionL();
      return this.listdivision;
    },
    async getAreaMercaLead(id: string) {
      this.listmercado = await getAreaMercadoL(id);
      return this.listmercado;
    },
    async getGrupoClienteLead() {
      this.listmercado = await getGrupoCliente();
      return this.listmercado;
    },
    async getOrigenLead() {
      this.listmercado = await getOrigen();
      return this.listmercado;
    },
    async getEstadoLead() {
      this.listmercado = await getEstado();
      return this.listmercado;
    },
  },
});
