import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getTask } from '../services/useTasksService';
import { GenericModel } from '../utils/types';

export const useProjectTask = defineStore('projecttasks', () => {
  //state
  const loading = ref(false);
  const payload = ref<GenericModel>({});

  const getTasks = async (id: string) => {
    loading.value = true;
    try {
      const data = await getTask(id);
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
    //getter
    //actions
    getTasks,
  };
});
