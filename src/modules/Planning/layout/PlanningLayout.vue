<script setup lang="ts">
import GanttComponent from 'src/components/Gantt/GanttComponent.vue';
import { useAsyncState } from '@vueuse/core';
import { TaskModel } from '../utils/types';
import {
  createTask,
  deleteTask,
  updateTask,
} from '../services/useTasksService';
import { Notification } from 'src/composables';
import { usePlanningStore } from '../store/usePlanningStore';
import { ref } from 'vue';

const ganttCardRef = ref<InstanceType<typeof GanttComponent> | null>(null);

const moduleId = ref('');
const loading = ref(false);
const tasks = ref({
  data: [],
  links: [],
});

const { getTasks } = usePlanningStore();

const { execute } = useAsyncState(
  async () => {
    return await getTasks(moduleId.value);
  },
  [],
  { immediate: false }
);

const onSaveTask = async (task: TaskModel) => {
  try {
    loading.value = true;
    await createTask(task);
    execute();
  } catch (error) {
  } finally {
    loading.value = false;
    Notification('positive', 'check_circle', 'Tarea guardada correctamente.');
  }
};

const onUpdateTask = async (task: TaskModel) => {
  try {
    loading.value = true;
    await updateTask(task.real_id ?? '', task);
    execute();
  } catch (error) {
  } finally {
    loading.value = false;
    Notification('positive', 'check_circle', 'Tarea modificada correctamente.');
  }
};

const onDeleteTask = async (task: TaskModel) => {
  try {
    loading.value = true;
    await deleteTask(task.real_id ?? '');
    execute();
  } catch (error) {
  } finally {
    loading.value = false;
    Notification('positive', 'check_circle', 'Tarea eliminada correctamente.');
  }
};
</script>
<template>
  <GanttComponent
    ref="ganttCardRef"
    :module-id="moduleId"
    :data="tasks"
    :isLoading="loading"
    @save-task="onSaveTask"
    @update-task="onUpdateTask"
    @delete-task="onDeleteTask"
    :style="'height:calc(100dvh - 50px)'"
  />
</template>

<style scoped></style>
