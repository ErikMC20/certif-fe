import { defineStore } from 'pinia';
import { axios_LB_03,axios_LB_02, axios_PREFERENCES } from 'src/conections/axiosCRM';
import Notification from 'src/modules/Accounts/utils/notify';
import { userStore } from 'src/modules/Users/store/UserStore';
import { OptionBase, PaginationTable } from '../utils/types';
import { useDeliveriesService } from 'src/modules/Deliveries/services/DeliveriesService';

const {
  getDivisionL,
  getAreaMercadoL,
  getGrupoCliente,
  getOrigen,
  getEstado,
  deleteMassiveData,
  updateMassiveData,
} = useDeliveriesService();
const user = userStore();
export const DeliveriesTableStore = defineStore('deliveries_table', {
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
      placa: '',
      estado: '',
      descripcion: '',
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
          label: 'Entrega',
          field: 'nombre',
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
          name: 'score_percentage',
          align: 'left',
          label: 'Puntuacion %',
          field: 'score_percentage',
          sortable: false,
          visible: true,
        },
        {
          name: 'estado',
          align: 'left',
          label: 'Estado de la entrega',
          field: 'estado',
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
          name: 'lugar',
          align: 'left',
          label: 'Lugar de entrega',
          field: 'lugar',
          sortable: true,
          visible: true,
        },
          {
          name: 'f_entrega',
          align: 'left',
          label: 'Fecha de entrega',
          field: 'f_entrega',
          sortable: true,
          visible: true,
        },
        
        {
          name: 'descripcion',
          align: 'left',
          label: 'Descripcion',
          field: 'descripcion',
          sortable: true,
          visible: true,
         },
         {
          name: 'placa',
          align: 'left',
          label: 'Placa/Numero de serie',
          field: 'placa',
          sortable: true,
          visible: true,
         },
        {
          name: 'reserva',
          align: 'left',
          label: 'Reserva',
          field: 'reserva',
          sortable: true,
          visible: true,
        },
      ],
    },
    visible_fields: [
      'descripcion',
      'estado',
      'contacto',
      'cuenta',
      'prospecto',
      // 'grupo_cliente',
      'fecha_modificacion',
    ],
    visible_columns: [
      'nombre',
      'descripcion',
      'estado',
      // 'division',
      // 'a_mercado',
      // 'estado',
      // 'asignado_a',
      // 'fecha_creacion',
    ],
    totalE:0,
    totalP:0,
    totalC:0,
  }),
  actions: {
    async getUserConfig() {
      try {
        const { data } = await axios_PREFERENCES.get(
          `/tables-users-preferences?filter=${JSON.stringify({
            where: { module: 'Deliveries', user_id: user.userCRM.id },
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
                module: 'Deliveries',
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
    async getListDeliveries(props: {
      pagination: PaginationTable;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filter: any;
    }) {
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
        const total = await axios_LB_02.get(
          `/HANE_Entregas_Get_Total?filter=${encodeURIComponent(
            JSON.stringify(params)
          )}`
        );
        const rows = await axios_LB_02.get(
          `/HANE_Entregas_advanced_filter?params=${encodeURIComponent(
            JSON.stringify(params)
          )}`
        );
      
        this.data_table.rows = rows.data;
        this.pagination.rowsNumber = total.data[0].total;
        this.totalE = total.data[1].total;
        this.totalP = total.data[2].total;
        this.totalC = total.data[3].total;
        this.loading = false;
      } catch (error) {
        throw error;
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
          module: 'HANE_Entregas',
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

    async reloadList() {
      await this.getListDeliveries({
        pagination: this.pagination,
        filter: this.data_filter,
      });
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
      } catch (error) {
        console.log(error);
      }
    },

    async clearFilterData() {
      this.data_filter = {
        // easyFilter: '',
        name: '',
        grupocliente: [],
        placa: '',
        estado: '',
        // fechacierre: '',
        descripcion: '',
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
      } catch (error) {
        console.log(error);
      }
    },
    // PARA LA ELIMINACION MASSIVA
    
    async getDivisionLead() {
      this.listdivision = await getDivisionL();
      return this.listdivision;
    },
    async getAreaMercaLead(id: string) {
      this.listmercado = await getAreaMercadoL(id);
      return this.listmercado;
    },
    async getGrupoClienteLead(id: string) {
      this.listmercado = await getGrupoCliente(id);
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
