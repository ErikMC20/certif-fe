/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import Notification from '../utils/notify';
import { userStore } from 'src/modules/Users/store/UserStore';
import { OptionBase, PaginationTable } from '../utils/types';
import { ProspectService } from '../services/ProspectsService';

const user = userStore();
const { updateDatosPros } = ProspectService();

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
      lead_source: '',
      status: '',
      phone: '',
      email: '',
      country: '',
      state: '',
      city: '',
      street: '',
      created_by: [],
      modified_by: [],
      assigned_to: [],
      creation_date: { from: '', to: '' },
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
