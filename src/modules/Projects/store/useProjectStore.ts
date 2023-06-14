import {
  getOneProject,
  updateProject,
  createProject,
} from '../services/useProjectService';
import moment from 'moment';
import {
  BasicInformation,
  ClientInformation,
  FinancialInformation,
} from '../utils/types';
import { ReponsibleUserModel } from '../../../components/types/index';
import { userStore } from 'src/modules/Users/store/UserStore';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Loading } from 'quasar';

const { userCRM } = userStore();

export const useProjectStore = defineStore('project', () => {
  const loading = ref(false);
  const payload = ref({
    id: '',
    numeropst_c: '',
    codigoaio_c: '',
    name: '',
    description: '',
    ubicacion_c: '',
    estimated_start_date: moment().format('YYYY-MM-DD'),
    estimated_end_date: moment().format('YYYY-MM-DD'),
    real_start_date_c: '',
    real_end_date_c: '',
    account_id_c: '',
    account_c: '',
    contact_id_c: '',
    contact_c: '',
    pais_c: 'BO',
    status: 'Draft',
    priority: 'High',
    msproject_projecthref_c: '',
    porc_avance_proyecto_c: '',
    monto_contrato_c: 0,
    monto_utilidad_c: 0,
    monto_costo_c: 0,
    diferencia: 0,
    responsible: [],
    user_id: userCRM.id,
    iddivision_c: '',
    idamercado_c: '',
    idregional_c: '',
    sync_projectserver_c: 0,
  });

  const info1 = computed(() => {
    return {
      numeropst_c: payload.value.numeropst_c || '',
      codigoaio_c: payload.value.codigoaio_c || '',
      name: payload.value.name,
      description: payload.value.description,
      ubicacion_c: payload.value.ubicacion_c,
      estimated_start_date: payload.value.estimated_start_date,
      estimated_end_date: payload.value.estimated_end_date,
      duration: moment(payload.value.estimated_end_date).diff(
        moment(payload.value.estimated_start_date),
        'days'
      ),
      real_end_date_c: moment(payload.value.real_end_date_c).format(
        'YYYY-MM-DD'
      ),
      real_start_date_c: moment(payload.value.real_start_date_c)
        .add(7, 'days')
        .format('YYYY-MM-DD'),
      pais_c: payload.value.pais_c,
      user_id: userCRM.id,
      status: payload.value.status,
      priority: payload.value.priority,
      porc_avance_proyecto_c: payload.value.porc_avance_proyecto_c,
      msproject_projecthref_c: payload.value.msproject_projecthref_c,
      sync_projectserver_c: payload.value.sync_projectserver_c,
      iddivision_c: payload.value.iddivision_c,
      idamercado_c: payload.value.idamercado_c,
      idregional_c: payload.value.idregional_c,
    };
  });

  const info2 = computed(() => {
    return {
      monto_contrato_c: Math.round(payload.value.monto_contrato_c) ?? 0,
      monto_utilidad_c: Math.round(payload.value.monto_utilidad_c) ?? 0,
      monto_costo_c: Math.round(payload.value.monto_costo_c) ?? 0,
      diferencia: payload.value.diferencia,
    };
  });

  const info3 = computed(() => {
    return {
      account_id_c: payload.value.account_id_c,
      account_c: payload.value.account_c,
      contact_id_c: payload.value.contact_id_c,
      contact_c: payload.value.contact_c,
    };
  });

  const onClearDataProject = async () => {
    payload.value = {
      id: '',
      numeropst_c: '',
      codigoaio_c: '',
      name: '',
      description: '',
      ubicacion_c: '',
      estimated_start_date: moment().format('YYYY-MM-DD'),
      estimated_end_date: moment().add(7, 'days').format('YYYY-MM-DD'),
      real_start_date_c: '',
      real_end_date_c: '',
      account_id_c: '',
      account_c: '',
      contact_id_c: '',
      contact_c: '',
      pais_c: 'BO',
      status: 'Draft',
      priority: 'High',
      porc_avance_proyecto_c: '',
      msproject_projecthref_c: '',
      monto_contrato_c: 0,
      monto_utilidad_c: 0,
      monto_costo_c: 0,
      diferencia: 0,
      responsible: [],
      user_id: userCRM.id,
      iddivision_c: userCRM.iddivision,
      idamercado_c: userCRM.idamercado,
      idregional_c: userCRM.idregional,
      sync_projectserver_c: 0,
    };
    loading.value = false;
  };

  const onCreateProject = async (
    information: BasicInformation,
    financial: FinancialInformation,
    clientinfo: ClientInformation,
    responsible: ReponsibleUserModel[],
    comment: string
    // oportunities: ClientData
  ) => {
    console.log('create');
    try {
      const response = await createProject(
        information,
        financial,
        clientinfo,
        responsible,
        comment
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error('No se puede guardar el prospecto');
    } finally {
      Loading.hide();
    }
  };

  const onGetProject = async (id: string) => {
    loading.value = true;
    try {
      const data = await getOneProject(id);
      payload.value = data;
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };

  const onUpdateProject = async (
    moduleId: string,
    information: BasicInformation,
    clientinfo: ClientInformation,
    financial: FinancialInformation
  ) => {
    try {
      const { data } = await updateProject(
        moduleId,
        information,
        clientinfo,
        financial
      );
      payload.value = data;
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      Loading.hide('udpate');
    }
  };

  return {
    //states
    loading,
    payload,
    //getter
    info1,
    info2,
    info3,
    //actions
    onClearDataProject,
    onCreateProject,
    onGetProject,
    onUpdateProject,
  };
});
