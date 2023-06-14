import { defineStore } from 'pinia';
import { axios_PREFERENCES, axios_LB_04 } from 'src/conections/axiosCRM';
import Notification from 'src/modules/Accounts/utils/notify';
import { userStore } from 'src/modules/Users/store/UserStore';
import { OptionBase, PaginationTable } from '../utils/types';
import { useOpportunitiesService } from 'src/modules/Opportunities/services/OpportunitiesService';

const {
  getDivisionStore,
  getAreaMercadoStore,
  getGrupoCliente,
  getTipoOportunidad,
  getFaseOportunidad,
  getOrigen,
  getEstado,
  getParticipacionComo,
  deleteMassiveData,
  updateMassiveData,
} = useOpportunitiesService();
const user = userStore();
export const OpportunitiesTableStore = defineStore('opportunities_table', {
  state: () => ({
    mongo_id: null,
    loading: false,
    listDivision: '',
    listMercado: '',
    participacion: '',
    pagination: {
      page: 1,
      rowsPerPage: 10,
      sortBy: 'number',
      order: 'desc',
      rowsNumber: 10,
      descending: true,
    },
    data_filter: {
      user_login: '',
      number: '',
      nombre: '',
      account_id: '',
      opportunity_phase_lang: '',
      date_closed: {
        start_date_closed: '',
        end_date_closed: '',
        operator_closed: '',
      },
      amount: {
        amount_start: '',
        amount_end: '',
        amount_operator: '',
      },
      opporunity_status_lang: '',
      grupo_cliente: '',
      // lead_source: [],
      // status: [],
      // created_by: [],
      // modified_by: [],
      assigned_user_to: [],
      // creation_date: {
      //   from: '',
      //   to: '',
      //   operator: '',
      // },
    },
    data_extra: {
      name_account: '',
      // name_contact: '',
      // name_prospect: '',
    },
    data_table: {
      rows: [],
      columns: [
        {
          name: 'number',
          align: 'left',
          label: 'Número',
          field: 'number',
          sortable: true,
          visible: true,
        },
        {
          name: 'nombre',
          align: 'left',
          label: 'Nombre',
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
          name: 'opportunity_phase',
          align: 'left',
          label: 'Fase de la oportunidad',
          field: 'opportunity_phase',
          sortable: false,
          visible: true,
        },
        {
          name: 'date_closed',
          align: 'left',
          label: 'Fecha cierre',
          field: 'date_closed',
          sortable: true, // para quitar el ordenamiento
          visible: true,
        },
        {
          name: 'amount_usdollar',
          align: 'left',
          label: 'Monto',
          field: 'amount_usdollar',
          sortable: true,
          visible: true,
        },
        {
          name: 'opporunity_status',
          align: 'left',
          label: 'Estado de la opotunidad',
          field: 'opporunity_status',
          sortable: true,
          visible: true,
        },
        {
          name: 'assigned_user_name',
          align: 'left',
          label: 'Usuario asignado',
          field: 'assigned_user_name',
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
          name: 'grupo_cliente',
          align: 'left',
          label: 'Grupo cliente',
          field: 'grupo_cliente',
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
          name: 'creation_date',
          align: 'left',
          label: 'Fecha Creación',
          field: 'creation_date',
          sortable: true,
          visible: true,
        },
        // {
        //   name: 'fecha_modificacion',
        //   align: 'left',
        //   label: 'Fecha Modificación',
        //   field: 'fecha_modificacion',
        //   sortable: true,
        //   visible: true,
        // },
      ],
    },
    visible_fields: [
      // 'campaign',
      // 'name',
      // 'lastname',
      // 'country',
      // 'created_by',
      // 'assigned_to',

      'number',
      'nombre',
      'cuenta',
      'opportunity_phase',
      'date_closed',
      'amount_usdollar',
      'opporunity_status',
      'assigned_user_name',
      'division',
      'a_mercado',
      'creado_por',
      'creation_date',
      'grupo_cliente',
    ],
    visible_columns: [
      'number',
      'nombre',
      'cuenta',
      'opportunity_phase',
      'date_closed',
      'amount_usdollar',
      'opporunity_status',
      'assigned_user_name',
      'division',
      'a_mercado',
      'creado_por',
      'creation_date',
      'grupo_cliente',

      // 'nombre',
      // 'estado',
      // 'telefono',
      // 'cuenta',
      // 'correo',
      // 'asignado_a',
      // 'fecha_creacion',
    ],
  }),
  actions: {
    async getUserConfig() {
      try {
        const { data } = await axios_PREFERENCES.get(
          `/tables-users-preferences?filter=${JSON.stringify({
            where: { module: 'Opportunities', user_id: user.userCRM.id },
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
                module: 'Opportunities',
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
    async getList(props: {
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
        const response = await axios_LB_04.get(
          `/Opportunities_advanced_filter?params=${encodeURIComponent(
            JSON.stringify(params)
          )}`
        );
        const {
          data: { data, total },
        } = response;

        // console.log(
        //   'CARGANDO EL FILTRO DE L LEAD',
        //   props.filter,
        //   JSON.stringify(params),
        //   rows,
        //   total
        // );

        this.data_table.rows = data;
        this.pagination.rowsNumber = total;
        this.loading = false;
      } catch (error) {
        throw error;
      }
    },

    async reloadList() {
      await this.getList({
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
        // grupo_cliente: [],
        origen: [],
        estado: '',
        // fechacierre: '',
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
      0;
      this.data_extra = {
        name_account: '',
        // name_contact: '',
        // name_prospect: '',
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
      // console.log('seleccionados ->', selectItems);

      try {
        this.loading = true;
        const itemsIds = selectItems.map((el) => {
          return { id: el.id };
        });
        console.log('ids ->', itemsIds);

        const dataSend = {
          module: 'Opportunities',
          login_user: user.userCRM.id,
          modules_ids: itemsIds,
        };

        await deleteMassiveData(dataSend);
        await this.reloadList();
        Notification(
          'positive',
          'check_circle',
          `<strong> Acción exitosa </strong> <br/> ${
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
        // console.log(dataChanging, selectItems);
        this.loading = true;
        const {
          asignado,
          division,
          areamercado,
          opportunity_type,
          phase,
          estado,
          acuenta_de_c,
        } = dataChanging;
        const dataSend = {
          module: 'Opportunities',
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
              column: 'opportunity_type',
              value: opportunity_type,
            },
            {
              column: 'sales_stage',
              value: phase,
            },
            {
              column: 'estado_oportunidad_c',
              value: estado,
            },
            {
              column: 'acuenta_de_c',
              value: acuenta_de_c,
            },
          ],
          module_ids: [...selectItems],
        };
        await updateMassiveData(dataSend);
        await this.reloadList();
        Notification(
          'positive',
          'check',
          `<strong> Acción exitosa </strong> <br/> Se actualizaron ${selectItems.length} registros de la tabla.`
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
      this.listdivision = await getDivisionStore();
      return this.listdivision;
    },
    async getAreaMercaLead(id: string) {
      this.listmercado = await getAreaMercadoStore(id);
      return this.listmercado;
    },
    async getStoreTipoOportunidad(iddivision: string) {
      this.data = await getTipoOportunidad(iddivision);
      return this.data;
    },
    async getStoregetPhaseOpportunitie(iddivision: string) {
      this.listmercado = await getFaseOportunidad(iddivision);
      return this.listmercado;
    },
    async getGrupoClienteLead(iddivision: string) {
      // iddivision = !iddivision ? '' : iddivision;
      this.data = await getGrupoCliente(iddivision);
      return this.data;
    },
    async getOrigenLead() {
      this.listmercado = await getOrigen();
      return this.listmercado;
    },
    async getEstadoLead() {
      this.listmercado = await getEstado();
      return this.listmercado;
    },
    async getStoreParticipacion() {
      this.data = await getParticipacionComo();
      return this.data;
    },
  },
});
