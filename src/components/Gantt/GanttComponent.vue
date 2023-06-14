<script setup lang="ts">
import FormTaskComponent from './FormTaskComponent.vue';
import { DataModel, TaskModel } from './types';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Notify } from 'quasar';
import {
  useInitialGant,
  useZoomGantt,
  useToggleGantt,
  useCrudGanttFunctions,
  onFormatDate,
  Gantt,
} from './useGantt';
const props = defineProps<{
  moduleId: string;
  data: DataModel;
  isLoading: boolean;
  style?: string;
}>();

//composables
const { zoomIn, zoomOut } = useZoomGantt();
const { getTaskGantt, updateTaskGantt, deleteTaskGantt } =
  useCrudGanttFunctions();
const { chartToggle, gridToggle, toggleChart, toggleGrid } = useToggleGantt();

//vars
const ganttRef = ref();
const localData = ref<DataModel>(props.data);
const formTaskRef = ref<InstanceType<typeof FormTaskComponent> | null>(null);

//functions
Gantt.value.attachEvent(
  'onTaskCreated',
  (task) => {
    const uParent = getTaskGantt(task.parent) as TaskModel;
    if (uParent) {
      const total = countTaskIncicendeLimit(uParent.id);
      formTaskRef.value?.openHerencialDialog(uParent, total);
      return;
    }
    if (totalIncidence.value === 100) {
      Notify.create({
        type: 'warning',
        message: 'La incidencia del proyecto ya cumple el 100%',
        actions: [{ icon: 'close', color: 'dark', size: 'sm', round: true }],
      });
      return;
    }
    formTaskRef.value?.openCreateDialog('task');
  },
  null
);

Gantt.value.attachEvent(
  'onTaskDblClick',
  (id) => {
    const uTask = getTaskGantt(id);
    const uParent = getTaskGantt(uTask.parent);
    formTaskRef.value?.openModifiedDialog(uTask, uParent);
  },
  null
);

Gantt.value.attachEvent(
  'onRowDragEnd',
  () => {
    Gantt.value.refreshData();
  },
  null
);

Gantt.value.attachEvent(
  'onAfterTaskDrag',
  async (e) => {
    Gantt.value.setSizes();
    const task = Gantt.value.getTask(e);
    task.date_start = onFormatDate(task.start_date);
    task.date_finish = onFormatDate(task.end_date);
    Gantt.value.render();
  },
  null
);

const countTaskIncicendeLimit = (parentId: string): number => {
  const totalIncidence = localData.value.data
    .filter((el) => el.parent === parentId)
    .reduce((acum, el) => acum + Number(el.incidence), 0);
  return totalIncidence;
};

const openModal = (type: string): void => {
  if (totalIncidence.value === 100) {
    Notify.create({
      type: 'warning',
      message: 'La incidencia del proyecto ya cumple el 100%',
      actions: [{ icon: 'close', color: 'dark', size: 'sm', round: true }],
    });
    return;
  }
  formTaskRef.value?.openCreateDialog(type);
};

const onSaveTask = async (task: TaskModel) => {
  if (props.moduleId) {
    try {
      task.planification_id = props.moduleId;
      task.date_start = onFormatDate(task.date_start);
      task.date_finish = onFormatDate(task.date_finish);
      await emit('saveTask', task);
    } catch (error) {
    } finally {
      localData.value.data.push(task);
    }
  } else {
    localData.value.data.push(task);
  }
  //Gantt.value.render();
  useInitialGant(ganttRef.value, localData.value);
};

const onUpdatedTask = (task: TaskModel) => {
  if (props.moduleId) {
    try {
      task.date_start = onFormatDate(task.date_start);
      task.date_finish = onFormatDate(task.date_finish);
      emit('updateTask', task);
    } catch (error) {
    } finally {
      updateTaskGantt(task.id, task);
    }
  } else {
    updateTaskGantt(task.id, task);
  }

  useInitialGant(ganttRef.value, localData.value);
};

const onDeleteTask = (task: TaskModel) => {
  if (props.moduleId) {
    try {
      emit('deleteTask', task);
    } catch (error) {
    } finally {
      const taskFind = localData.value.data.findIndex(
        (el) => el.id === task.id
      );
      localData.value.data.splice(taskFind, 1);
      deleteTaskGantt(task.id);
    }
  } else {
    const taskFind = localData.value.data.findIndex((el) => el.id === task.id);
    localData.value.data.splice(taskFind, 1);
    deleteTaskGantt(task.id);
  }

  useInitialGant(ganttRef.value, localData.value);
};

const cleanGanttData = () => {
  localData.value = <DataModel>{
    data: [],
    links: [],
  };
  Gantt.value.clearAll();
};

const exposeGanttData = () => {
  console.log(localData.value.data);
  const newData = localData.value.data.map((task: TaskModel) => {
    return {
      ...task,
      date_start: onFormatDate(task.date_start),
      date_finish: onFormatDate(task.date_finish),
      index: task.$index,
      wsb: task.$wbs,
    };
  });
  return {
    data: newData,
    links: [],
  };
};

//computed properties
const totalIncidence = computed(() => {
  const incidences = localData.value.data.filter((task) => task.parent === '0');
  return incidences.reduce((acum, val) => acum + val.incidence, 0);
});

//lifecicle
onMounted(async () => {
  await useInitialGant(ganttRef.value, localData.value);
});

onUnmounted(() => {
  cleanGanttData();
});

defineExpose({
  exposeGanttData,
});

const emit = defineEmits<{
  (event: 'saveTask', task: TaskModel): void;
  (event: 'updateTask', task: TaskModel): void;
  (event: 'deleteTask', task: TaskModel): void;
  (event: 'fullscreen'): void;
}>();
</script>
<template>
  <q-card :style="style" class="no-border-radius">
    <q-card-section class="q-pa-sm row items-center">
      <div class="col-xs-12 col-md-8">
        <q-btn-dropdown
          align="right"
          label="Agregar"
          color="primary"
          dense
          split
          menu-self="top right"
          @click="openModal('task')"
          class="q-pl-sm bg-primary"
        >
          <q-list dense>
            <q-item clickable v-close-popup @click="openModal('project')">
              <q-item-section>
                <q-item-label>AGREGAR HITO</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="openModal('milestone')">
              <q-item-section>
                <q-item-label>AGREGAR ENTREGABLE</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <span class="text-grey-7 q-ml-md">
          Incidencia Total : {{ totalIncidence }} %
          <q-icon
            name="check_circle"
            color="green"
            size="xs"
            v-if="totalIncidence === 100"
          />
        </span>
      </div>

      <div class="flex justify-between col-xs-12 col-md-4">
        <q-btn
          icon="last_page"
          dense
          @click="toggleChart"
          flat
          :color="chartToggle ? 'blue' : ''"
          :disable="gridToggle"
        >
          <q-tooltip class="bg-grey-4 text-black"> Expandir Lista </q-tooltip>
        </q-btn>
        <q-btn
          icon="first_page"
          dense
          @click="toggleGrid"
          flat
          :color="gridToggle ? 'blue' : ''"
          :disable="chartToggle"
        >
          <q-tooltip class="bg-grey-4 text-black"> Expandir Gantt </q-tooltip>
        </q-btn>
        <q-btn icon="zoom_in" dense @click="zoomIn" rounded flat>
          <q-tooltip class="bg-grey-4 text-black"> Acercar </q-tooltip>
        </q-btn>
        <q-btn icon="zoom_out" dense @click="zoomOut" rounded flat>
          <q-tooltip class="bg-grey-4 text-black"> Alejar </q-tooltip>
        </q-btn>
        <q-btn icon="fullscreen" dense round flat @click="$emit('fullscreen')">
          <q-tooltip class="bg-grey-4 text-black"> Fullscreen </q-tooltip>
        </q-btn>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section class="full-height q-pa-none">
      <div class="gantt-container">
        <div class="gantt" ref="ganttRef"></div>
      </div>
      <q-inner-loading :showing="isLoading" label="Guardando...">
        <q-spinner-ios size="50px" />
      </q-inner-loading>
    </q-card-section>
  </q-card>

  <FormTaskComponent
    ref="formTaskRef"
    @save-task="onSaveTask"
    @update-task="onUpdatedTask"
    @delete-task="onDeleteTask"
  />
</template>

<style lang="scss">
@import 'gantt-hansa-js/src/codebase/gantt.css';

.gantt-container {
  height: 100%;
  padding: 0px;
  margin: 0px;
  overflow: hidden;
}
.gantt {
  height: 100%;
  width: 100%;
}

.gantt-today {
  background-color: #ff474768;
}
.gantt_drag_marker {
  z-index: 1000000 !important;
}

.gantt_task_progress_drag {
  display: none !important;
}
.milestone::before {
  color: $purple;
  content: '\f0c8';
  display: inline-block;
  font: var(--fa-font-solid);
  transform: rotate(45deg);
  font-size: 0.9rem;
  margin-right: 0.5em;
}

.milestone-icon {
  background: #9c27b0;
  border-color: #9111c2;
  transform: rotate(45deg);
  border-radius: 3px;
}

.weekend {
  background: #dfdfdf;
  color: #858282 !important;
  font-weight: bold;
}

.gantt_tooltip {
  z-index: 10000;
}

.gantt_row.gantt_row_project {
  font-weight: bold !important;
}
</style>
