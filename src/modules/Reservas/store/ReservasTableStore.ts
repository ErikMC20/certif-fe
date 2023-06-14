import { defineStore } from 'pinia';
import { axios_LB_02, axios_PREFERENCES } from 'src/conections/axiosCRM';
import Notification from 'src/modules/Accounts/utils/notify';
import { userStore } from 'src/modules/Users/store/UserStore';
import { OptionBase, PaginationTable } from '../utils/types';
import { useReservasService } from 'src/modules/Reservas/services/ReservasService';

const {
  getDivisionL,
  getAreaMercadoL,
  getGrupoCliente,
  getOrigen,
  getEstado,
  deleteMassiveData,
  //updateMassiveData,
  getTipo,
 // getOptionsLanguage,
} = useReservasService();
const user = userStore();
export const ReservasTableStore = defineStore('reserva_table', {
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
      descripcion: '',
      estado: '',
      numero: '',
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
          name: 'numero',
          align: 'left',
          label: 'Numero',
          field: 'numero',
          sortable: true,
          visible: true,
         },
         {
          name: 'nombre',
          align: 'left',
          label: 'Reserva',
          field: 'nombre',
          sortable: true,
          visible: true,
        },
        {
          name: 'estado',
          align: 'left',
          label: 'Estado de la reserva',
          field: 'estado',
          sortable: true,
          visible: true,
        },
        // {
        //   name: 'asignado_a',
        //   align: 'left',
        //   label: 'Asignado',
        //   field: 'asignado_a',
        //   sortable: true,
        //   visible: true,
        // },
        {
          name: 'fecha_creacion',
          align: 'left',
          label: 'Fecha Creación',
          field: 'fecha_creacion',
          sortable: true,
          visible: true,
        },
        {
          name: 'd_transcurridos',
          align: 'center',
          label: 'Días transcurridos',
          field: 'd_transcurridos',
          sortable: true,
          visible: true,
        },
        {
          name: 'f_vencimiento',
          align: 'left',
          label: 'Fecha Vencimiento',
          field: 'f_vencimiento',
          sortable: true,
          visible: true,
        },
        {
          name: 'descripcion',
          align: 'left',
          label: 'Descripción',
          field: 'descripcion',
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
          name: 'contacto',
          align: 'left',
          label: 'Contacto',
          field: 'contacto',
          sortable: true,
          visible: true,
        },
        {
          name: 'cotizacion',
          align: 'left',
          label: 'Cotizacion',
          field: 'cotizacion',
          sortable: true,
          visible: true,
        },
        {
          name: 'entrega',
          align: 'left',
          label: 'Entrega',
          field: 'entrega',
          sortable: true,
          visible: true,
        },

      ],
    },
    visible_fields: [
      'numero',
      'estado',
      'contacto',
      'cuenta',
      'prospecto',
      'descripcion',
      // 'grupo_cliente',
      'f_vencimiento',
    ],
    visible_columns: [
      'nombre',
      'numero',
      'descripcion',
      'cuenta',
      'f_vencimiento',
      // 'division',
      // 'a_mercado',
      'estado',
      // 'asignado_a',
      // 'fecha_creacion',
    ],
    totalConfirmed:0,
    totalB:0,
    totalR:0
  }),
  actions: {
    async getUserConfig() {
      try {
        const { data } = await axios_PREFERENCES.get(
          `/tables-users-preferences?filter=${JSON.stringify({
            where: { module: 'Reservas', user_id: user.userCRM.id },
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
                module: 'Reservas',
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
    async getListReservas(props: {
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
          `/HANQ_Reservas_Get_Total?filter=${encodeURIComponent(
            JSON.stringify(params)
          )}`
        );
        const rows = await axios_LB_02.get(
          `/HANQ_Reservas_advanced_filter?params=${encodeURIComponent(
            JSON.stringify(params)
          )}`
        );
        this.data_table.rows = rows.data;
        this.pagination.rowsNumber = total.data[0].total;
        this.totalB = total.data[1].total;
        this.totalConfirmed = total.data[2].total;
        this.totalR = total.data[3].total;
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
          module: 'HANQ_Reservas',
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
      await this.getListReservas({
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
        descripcion:'',
        estado: '',
        // fechacierre: '',
        numero: '',
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
    async getTipoPhaseOpportunities() {
      this.listmercado = await getTipo();
      return this.listmercado;
    },
  },
});
