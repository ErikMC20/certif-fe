import { defineStore } from 'pinia';
import { Loading } from 'quasar';
import {
  getOneAssignment,
  updateAssignment,
  createAssignment,
} from '../services/useAssignmentService';
import { userStore } from 'src/modules/Users/store/UserStore';
import { ref, computed } from 'vue';
import moment from 'moment';
import { getOneLoadedTask } from '../services/useAssignmentService';

const { userCRM } = userStore();
export const useAssignmentStore = defineStore('assignment', () => {
  //state
  const loading = ref(false);
  const payload = ref({
    id: '',
    codigo_c: '',
    name: '',
    description: '',
    cantidad_asig_c: '',
    status_c: '',
    operation_status_c: '',
    user_id: userCRM.id,
    instalacion_id: '',
    estimated_start_date_c: '',
    estimated_end_date_c: '',
  });

  //getters
  const newPayload = computed(() => {
    return {
      id: payload.value.id,
      code: payload.value.codigo_c,
      name: payload.value.name,
      description: payload.value.description,
      status: payload.value.status_c,
      start_date: payload.value.estimated_start_date_c,
      end_date: payload.value.estimated_end_date_c,
      operation_status: payload.value.operation_status_c,
      user_id: payload.value.user_id,
      tasks: [],
    };
  });

  //actions
  const clearDataAssignment = () => {
    payload.value = {
      id: '',
      codigo_c: '',
      name: '',
      description: '',
      cantidad_asig_c: '',
      status_c: '',
      operation_status_c: '',
      user_id: userCRM.id,
      instalacion_id: '',
      estimated_start_date_c: '',
      estimated_end_date_c: '',
    };
    loading.value = false;
  };

  const getWorkAreas = async (id: string) => {
    loading.value = true;
    try {
      const { data } = await getOneAssignment(id);
      payload.value = data;
      return data;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const useCreateAssignment = async (information: any, tasks: any[]) => {
    try {
      Loading.show({
        message: 'Guardando asignación',
      });
      const { data } = await createAssignment(information, tasks);
      return data;
    } catch (error) {
      throw error;
    } finally {
      Loading.hide();
    }
  };

  const useGetAssignment = async (id: string) => {
    try {
      const { data } = await getOneAssignment(id);
      console.log(data);
      data.estimated_start_date_c = moment(data.estimated_start_date_c).format(
        'YYYY-MM-DD'
      );
      data.estimated_end_date_c = moment(data.estimated_end_date_c).format(
        'YYYY-MM-DD'
      );
      payload.value = data;
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const useUpdateAssignment = async (
    id: string,
    information: any
    //tasks: any[]
  ) => {
    try {
      Loading.show({
        message: 'Actualizando asignación',
      });
      const { data } = await updateAssignment(id, information);
      return data;
    } catch (error) {
      throw error;
    } finally {
      Loading.hide();
    }
  };

  const useGetLoadedTask = async (id: string) => {
    try {
      const { data } = await getOneLoadedTask(id);
      return data;
    } catch (error) {
      throw Error('Error -> ', error ?? '');
    }
  };

  return {
    //state
    payload,
    //getter
    newPayload,
    //actions
    clearDataAssignment,
    getWorkAreas,
    useGetAssignment,
    useCreateAssignment,
    useUpdateAssignment,
    useGetLoadedTask,
  };
});
