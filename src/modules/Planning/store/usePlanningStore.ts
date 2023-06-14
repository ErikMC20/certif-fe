import { computed, ref } from 'vue';
import { Loading, QSpinnerPuff, uid } from 'quasar';
import { defineStore } from 'pinia';
import moment from 'moment';
import {
  getOnePlanning,
  updatePlanning,
  createPlanning,
  versionPlanning,
} from '../services/usePlanningService';

import { getPlanningTasks } from '../services/useTasksService';
import { userStore } from 'src/modules/Users/store/UserStore';
import { BasicInformation, TaskModel, GenericModel } from '../utils/types';
import { useProjectStore } from 'src/modules/Projects/store/useProjectStore';

const { userCRM } = userStore();
//const { info1 } = useProjectStore();

export const usePlanningStore = defineStore('planning', () => {
  //state
  const loading = ref(false);
  const payload = ref<GenericModel>({});
  const tasks = ref({
    data: [
      // {
      //   id: uid(),
      //   text: info1.name,
      //   type: 'project',
      //   start_date: new Date(info1.estimated_start_date + ' UTC-4'),
      //   end_date: new Date(info1.estimated_end_date + ' UTC-4'),
      //   duration: info1.duration,
      //   priority: 'Hight',
      //   incidence: 100,
      // },
    ],
    links: [],
  });

  //getters

  const dataSet = computed(() => {
    return {
      id: payload.value.id,
      name: payload.value.name,
      status: payload.value.status,
      estimated_start_date: payload.value.estimated_start_date,
      estimated_end_date: payload.value.estimated_end_date,
      version: payload.value.version,
      project_id: payload.value.hany_planificacion_projectproject_ida,
      project_name: payload.value.hany_planificacion_project_name,
      created_by: payload.value.created_by_name,
      user_id: userCRM.id,
    };
  });

  //actions
  const clearDataPlanning = async () => {
    payload.value = {
      id: '',
      name: '',
      status: 'Draft',
      estimated_start_date: moment().format('YYYY-MM-DD'),
      estimated_end_date: moment().format('YYYY-MM-DD'),
      user_id: userCRM.id,
      project_id_c: '',
    };
    tasks.value = {
      data: [
        // {
        //   text: info1.name.toUpperCase(),
        //   type: 'project',
        //   start_date: moment(info1.estimated_start_date).format('YYYY-MM-DD'),
        //   end_date: moment(info1.estimated_end_date).format('YYYY-MM-DD'),
        //   duration: 50,
        //   incidence: 100,
        // },
      ],
      links: [],
    };
    loading.value = false;
  };

  const useGetPlanning = async (id: string) => {
    loading.value = true;
    try {
      const { data } = await getOnePlanning(id);
      payload.value = data;
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };

  const useCreatePlanning = async (
    information: BasicInformation,
    comment: string,
    tasks: TaskModel[]
  ) => {
    try {
      Loading.show({
        message: 'Guardando Información',
      });

      const response = await createPlanning(information, comment, tasks);
      payload.value = response.data;
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error('No se puede guardar el prospecto');
    } finally {
      Loading.hide();
    }
  };

  const useUpdatePlanning = async (
    moduleId: string,
    information: BasicInformation,
    tasks: TaskModel[]
  ) => {
    try {
      Loading.show({
        message: 'Actualizando Información',
      });
      const response = await updatePlanning(moduleId, information, tasks);
      payload.value = response.data;
      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      Loading.hide();
    }
  };

  const getTasks = async (planningId: string) => {
    loading.value = true;
    try {
      const data = await getPlanningTasks(planningId);
      const rows = data.map((task: GenericModel) => {
        return {
          ...task,
          start_date: moment(task.start_date).format('YYYY-MM-DD'),
          end_date: moment(task.end_date).format('YYYY-MM-DD'),
          date_start: moment(task.date_start).format('YYYY-MM-DD'),
          date_finish: moment(task.date_finish).format('YYYY-MM-DD'),
        };
      });
      tasks.value.data = rows;
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };

  return {
    //state
    payload,
    tasks,
    //getter
    dataSet,
    //actions
    clearDataPlanning,
    useGetPlanning,
    useCreatePlanning,
    useUpdatePlanning,
    getTasks,
  };
});
