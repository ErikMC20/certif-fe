import { defineStore } from 'pinia';
import { axios_LB_06, axios_PREFERENCES } from 'src/conections/axiosCRM';
import Notification from 'src/modules/Accounts/utils/notify';
import { userStore } from 'src/modules/Users/store/UserStore';
import { OptionBase, PaginationTable } from '../utils/types';
import { useQuotesService } from '../services/QuotesService';

const {
  getDivisionL,
  getAreaMercadoL,
  getGrupoCliente,
  getOrigen,
  getEstado,
  deleteMassiveData,
  updateMassiveData,
  patchSaveStageQuotes,
  getRegionalv2,
} = useQuotesService();
const user = userStore();
export const QuotesTableStore = defineStore('quotes_table', {
  state: () => ({
    mongo_id: null,
    loading: false,
    listdivision: '',
    listmercado: '',
    dataupdatestagequotes: '',
    listregiones: [] as any,
    pagination: {
      page: 1,
      sortBy: 'date_entered',
      descending: true,
      rowsPerPage: 10,
      rowsNumber: 10,
    },
    data_filter: {
      nroCotizacion: '',
      name: '',
      chasis: '',
      anio: '',
      regional: [],
      division: [],
      amercado: [],
      codigoAIO: '',
      etapaCotizacion: '',
      oportunidad: '',
      cuenta: '',
      contacto: '',
      usercreate: [],
      usermodificate: [],
      userassigned: [],
      creation_date: {
        from: '',
        to: '',
        operator: '',
        option: '',
      },
      creation_amount: {
        amount_from: '',
        amount_to: '',
        amount_operator: '',
      },
      idlead: '',
      idprospect: '',
    },
    data_extra: {
      name_account: '',
      name_contact: '',
      name_prospecto: '',
      name_lead: '',
      name_oportunidad: '',
    },
    data_table: {
      rows: [],
      columns: [
        {
          name: 'name',
          align: 'left',
          label: 'Nombre',
          field: 'name',
          sortable: true,
          visible: true,
        },
        {
          name: 'number',
          align: 'center',
          label: 'Nro. Cotizacion',
          field: 'number',
          sortable: true,
          visible: true,
        },
        {
          name: 'name_iddivision_c',
          align: 'left',
          label: 'Division',
          field: 'name_iddivision_c',
          sortable: false,
          visible: true,
        },
        {
          name: 'name_idamercado_c',
          align: 'left',
          label: 'Area de Mercado',
          field: 'name_idamercado_c',
          sortable: false,
          visible: true,
        },
        {
          name: 'stage',
          align: 'center',
          label: 'Etapa',
          field: 'stage',
          sortable: true,
          visible: true,
        },

        {
          name: 'total_amount',
          align: 'right',
          label: 'Monto',
          field: 'total_amount',
          sortable: true,
          visible: true,
        },
        {
          name: 'expiration',
          align: 'center',
          label: 'Expiracion',
          field: 'expiration',
          sortable: true,
          visible: true,
        },

        {
          name: 'name_account',
          align: 'center',
          label: 'Cuenta',
          field: 'name_account',
          sortable: false,
          visible: true,
        },
        {
          name: 'name_contact',
          align: 'center',
          label: 'Contacto',
          field: 'name_contact',
          sortable: false,
          visible: true,
        },
        {
          name: 'name_opportunity',
          align: 'center',
          label: 'Oportunidad',
          field: 'name_opportunity',
          sortable: false,
          visible: true,
        },
        {
          name: 'name_leads',
          align: 'center',
          label: 'Prospecto',
          field: 'name_leads',
          sortable: true,
          visible: true,
        },
        {
          name: 'name_hano_lead',
          align: 'center',
          label: 'Lead',
          field: 'name_hano_lead',
          sortable: false,
          visible: true,
        },
        {
          name: 'name_region_c',
          align: 'center',
          label: 'Region',
          field: 'name_region_c',
          sortable: false,
          visible: true,
        },
        {
          name: 'name_currency',
          align: 'center',
          label: 'Moneda',
          field: 'name_currency',
          sortable: false,
          visible: true,
        },
        {
          name: 'name_assigned_user_id',
          align: 'center',
          label: 'Asignado a',
          field: 'name_assigned_user_id',
          sortable: false,
          visible: true,
        },
        {
          name: 'name_modified_user_id',
          align: 'center',
          label: 'Modificador por',
          field: 'name_modified_user_id',
          sortable: false,
          visible: true,
        },
        {
          name: 'date_entered',
          align: 'center',
          label: 'Fecha Creacion',
          field: 'date_entered',
          sortable: false,
          visible: true,
        },
      ],
    },
    visible_fields: [
      'name_iddivision_c',
      'name_idamercado_c',
      'name_leads',
      'name_hano_lead',
      'name_region_c',
      'name_currency',
      'name_assigned_user_id',
      'name_modified_user_id',
      'date_entered',
    ],
    visible_columns: [
      'name',
      'number',
      'stage',
      'total_amount',
      'expiration',
      'name_account',
      'name_contact',
      'name_opportunity',
    ],
  }),
  actions: {
    async getUserConfig() {
      try {
        const { data } = await axios_PREFERENCES.get(
          `/tables-users-preferences?filter=${JSON.stringify({
            where: { module: 'Quotes', user_id: user.userCRM.id },
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
          this.data_extra = configuration.data_extra;
        } else {
          try {
            const res = await axios_PREFERENCES.post(
              '/tables-users-preferences',
              {
                module: 'Quotes',
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
    async getListQuotes(props: {
      pagination: PaginationTable;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filter: any;
    }) {
      try {
        this.loading = true;
        const { pagination, filter } = props;
        const { page, rowsPerPage, sortBy, descending } = pagination;
        delete filter.creation_date.option;
        const params = {
          page: page,
          rowsPerPage: rowsPerPage,
          sortBy: sortBy,
          order: descending ? 'desc' : 'asc',
          filter: filter,
        };
        const total = await axios_LB_06.get(
          `/aos_quotes_advanced_filter_get_total?params=${encodeURIComponent(
            JSON.stringify(params)
          )}`
        );
        const rows = await axios_LB_06.get(
          `/aos_quotes_advanced_filter?params=${encodeURIComponent(
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
        this.pagination.rowsNumber = total.data[0].total;
        this.loading = false;
      } catch (error) {
        throw error;
      }
    },
    async reloadList() {
      await this.getListQuotes({
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
        nroCotizacion: '',
        name: '',
        chasis: '',
        anio: '',
        regional: [],
        division: [],
        amercado: [],
        codigoAIO: '',
        etapaCotizacion: '',
        oportunidad: '',
        cuenta: '',
        contacto: '',
        usercreate: [],
        usermodificate: [],
        userassigned: [],
        creation_date: {
          from: '',
          to: '',
          operator: '',
          option: '',
        },
        creation_amount: {
          amount_from: '',
          amount_to: '',
          amount_operator: '',
        },
        idlead: '',
        idprospect: '',
      };
      this.data_extra = {
        name_account: '',
        name_contact: '',
        name_prospecto: '',
        name_lead: '',
        name_oportunidad: '',
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
      try {
        this.loading = true;
        const itemsIds = selectItems.map((el) => {
          return { id: el.id };
        });

        const dataSend = {
          module: 'Quotes',
          id_user: user.userCRM.id,
          list_id_modules: itemsIds,
        };
        console.log(dataSend);
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
        this.loading = true;
        const { asignado } = dataChanging;
        const dataSend = {
          module: 'Quotes',
          user_id: user.userCRM.id,
          attributes: [
            {
              column: 'assigned_user_id',
              value: asignado,
            },
          ],
          module_ids: [...selectItems],
        } as any;
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
    async getRegionalv2Store() {
      this.listregiones = await getRegionalv2();
      return this.listregiones;
    },

    async updateStageQuotesList(idQuotes: string, stage: string) {
      try {
        const dataSend = {
          type: 'Quotes',
          id: idQuotes,
          attributes: {
            modified_user_id: user.userCRM.id,
            stage: stage,
          },
        };
        await patchSaveStageQuotes(dataSend);
      } catch (error) {
        console.log(error);
      }
    },
  },
});
