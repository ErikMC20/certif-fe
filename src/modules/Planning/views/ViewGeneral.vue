<script lang="ts">
import { InformationCardComponent, TabCardComponent } from '../components';
import ViewGeneralSkeleton from '../components/Skeletons/ViewGeneralSkeleton.vue';
import { Notification } from 'src/composables';
import { usePlanningStore } from '../store/usePlanningStore';
import { BasicInformation, TaskModel } from '../utils/types';
import GanttComponent from 'src/components/Gantt/GanttComponent.vue';
import { ref, computed } from 'vue';
import { useAsyncState } from '@vueuse/core';
import {
  createTask,
  updateTask,
  deleteTask,
} from '../services/useTasksService';
</script>
<script setup lang="ts">
//props
const props = defineProps<{
  moduleId: string;
  projectId?: string;
}>();

const emits = defineEmits<{
  (event: 'submitComplete', values: string, title?: string): void;
  (event: 'fullScreen', fs: boolean): void;
}>();

//ref declarations
const informationCardRef = ref<InstanceType<
  typeof InformationCardComponent
> | null>(null);
const ganttCardRef = ref<InstanceType<typeof GanttComponent> | null>(null);
const tabsCardRef = ref<InstanceType<typeof TabCardComponent> | null>(null);

//variables
const planningStore = usePlanningStore();
const localIdValue = ref(props.moduleId || '');
const loading = ref(false);
const fullscreen = ref(false);

// computed variables
const isSomeCardEditing = computed(() =>
  [informationCardRef.value?.isEditing].some((value) => !!value)
);

const { isLoading, execute } = useAsyncState(async () => {
  if (!!localIdValue.value) {
    return await planningStore.useGetPlanning(localIdValue.value);
  }
}, {} as BasicInformation);

const { execute: tasks } = useAsyncState(async () => {
  if (!!localIdValue.value) {
    return await planningStore.getTasks(localIdValue.value);
  }
}, []);

//functions
const validateCards = async () => {
  const validCards: (boolean | undefined)[] = [];
  if (informationCardRef.value?.isEditing) {
    const informationCardValidation =
      await informationCardRef.value.validateInputs();
    validCards.push(informationCardValidation);
  }
  if (!localIdValue.value) {
    const commentCardValidation = await tabsCardRef.value?.validateInputs();
    validCards.push(commentCardValidation);
  }

  return validCards.every((card) => !!card);
};

const onSubmit = async () => {
  const areCardsValid = await validateCards();

  if (!areCardsValid) {
    Notification(
      'warning',
      'warning',
      '<strong>Error de validación</strong> <br/> Algunos campos necesitan ser llenados.'
    );
    return;
  }

  if (!!localIdValue.value) {
    const informationData = informationCardRef.value?.exposeCardData();
    const ganttData = ganttCardRef.value?.exposeGanttData();

    if (!!informationData) {
      try {
        await planningStore.useUpdatePlanning(
          localIdValue.value,
          informationData,
          ganttData?.data || []
        );
        emits('submitComplete', localIdValue.value);
        execute();
      } catch (error) {}
    }
  } else {
    const informationData = informationCardRef.value?.exposeCardData();
    const commentData = tabsCardRef.value?.exposeData() ?? '';
    const ganttData = ganttCardRef.value?.exposeGanttData();

    if (!!informationData) {
      try {
        informationData.project_id_c = props.projectId;
        const newWorkarea = await planningStore.useCreatePlanning(
          informationData,
          commentData,
          ganttData?.data || []
        );
        localIdValue.value = newWorkarea.id;

        emits('submitComplete', localIdValue.value, informationData.name);
        execute();
      } catch (error) {
        throw error;
      }
    }
  }
};

const onSaveTask = async (task: TaskModel) => {
  try {
    loading.value = true;
    await createTask(task);
    tasks();
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
    tasks();
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
    tasks();
  } catch (error) {
  } finally {
    loading.value = false;
    Notification('positive', 'check_circle', 'Tarea eliminada correctamente.');
  }
};

const onFullScreen = () => {
  fullscreen.value = !fullscreen.value;
  emits('fullScreen', fullscreen.value);
};

//expose
defineExpose({
  onSubmit,
  isSomeCardEditing,
});
//emits
</script>
<template>
  <ViewGeneralSkeleton v-if="isLoading" />
  <div class="row q-col-gutter-sm" v-else>
    <!-- <div
      style="
        background-color: transparent;
        top: 0;
        left: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
      "
    >
      Versionar
    </div> -->
    <div class="col-md-6 col-sm-12" v-show="!fullscreen">
      <InformationCardComponent
        ref="informationCardRef"
        :id="moduleId ?? ''"
        :data="planningStore.dataSet"
      />
    </div>
    <div class="col-md-6 col-xs-12" v-show="!fullscreen">
      <TabCardComponent ref="tabsCardRef" :module-id="moduleId" />
    </div>
    <div class="col-md-12 col-sm-12">
      <GanttComponent
        ref="ganttCardRef"
        :module-id="moduleId"
        :data="planningStore.tasks"
        :isLoading="loading"
        @save-task="onSaveTask"
        @update-task="onUpdateTask"
        @delete-task="onDeleteTask"
        @fullscreen="onFullScreen"
        :style="
          fullscreen
            ? 'height: calc(100dvh - 100px)'
            : 'height: calc(100dvh - 150px)'
        "
      />
    </div>
  </div>
</template>
<style scoped></style>
