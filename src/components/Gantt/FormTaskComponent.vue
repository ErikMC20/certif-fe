<script lang="ts">
import { ref, computed, onMounted } from 'vue';
import { uid, QInput, QSelect } from 'quasar';
import moment from 'moment';
import { TaskModel, DateModel } from './types';
import { onFormatDate, useGanttTaskData } from './useGantt';
import { useProjectMetricUnits as Units } from 'src/composables/useCRMLanguage';
import { userStore } from 'src/modules/Users/store/UserStore';
import DateRangeWithDays from '../DateRangeWithDays/DateRangeWithDays.vue';
import DialogComponent from '../MainDialog/DialogComponent.vue';
import { AlertComponent } from '..';
import ActivitiesComponent from '../Activities/ActivitiesComponent.vue';
import CommentsComponent from '../Comments/CommentsComponent.vue';
import ListAssignationsComponent from 'src/modules/ProjectTask/components/Cards/ListAssignmentsComponent.vue';
</script>
<script setup lang="ts">
const { userCRM } = userStore();
const { listProjectMetricUnits, getlistProjectMetricUnits } = Units();

//refs
const baseCardRef = ref();
const inputTitleRef = ref<InstanceType<typeof QInput> | null>();
const inputQuantityRef = ref<InstanceType<typeof QInput> | null>();
const inputIncidenceRef = ref<InstanceType<typeof QInput> | null>();
const inputUnitRef = ref<InstanceType<typeof QSelect> | null>();
const dateRangeWithDaysRef = ref<InstanceType<
  typeof DateRangeWithDays
> | null>();

//variables

const open = ref(false);
//const showColor = ref(false);
const tab = ref('Activities');
const showDelete = ref(false);
const localParent = ref({} as TaskModel);
const localDate = ref({} as DateModel);
const maxIncidende = ref(0);
const localTask = ref<TaskModel>({
  id: '',
  text: '',
  description: '',
  duration: 1,
  start_date: new Date(),
  end_date: new Date(),
  date_start: moment().format('YYYY-MM-DD'),
  date_finish: moment().format('YYYY-MM-DD'),
  type: 'task',
  incidence: 0,
  parent: '0',
  unit: '',
  quantity: 0,
  quantity_remaining: 0,
  color: '#3db9d3',
  status: 'En espera',
  priority: 'Alta',
  progress: 0,
} as TaskModel);

const isValidateInput = computed(() => {
  if (localTask.value.type == 'task') {
    const validations = [
      inputUnitRef.value?.validate(),
      inputQuantityRef.value?.validate(),
      inputTitleRef.value?.validate(),
      inputIncidenceRef.value?.validate(),
    ];
    return validations.every((el) => !!el);
  }
  const validations = [inputTitleRef.value?.validate()];

  return validations.every((el) => !!el);
});

const isEditing = computed(() => baseCardRef.value?.isEditing === 'edit');

const openCreateDialog = (type: string) => {
  localTask.value.type = type;
  open.value = !open.value;
};

const openHerencialDialog = (parent: TaskModel, total: number) => {
  localParent.value = parent;
  localDate.value = {
    start_date: onFormatDate(parent.start_date),
    end_date: moment(parent.start_date).add(1, 'days').format('YYYY-MM-DD'),
    days: 1,
  };
  //asignamos el padre y la fecha a la tarea nueva
  localTask.value.parent = parent.id;
  maxIncidende.value = Number(parent.incidence) - total;
  localTask.value.date_start = moment(parent.end_date).format('YYYY-MM-DD');

  open.value = !open.value;
};

const openModifiedDialog = (task: TaskModel, parent?: TaskModel) => {
  localTask.value = task;
  if (parent?.incidence) {
    maxIncidende.value = parent?.incidence;
  }

  if (task.real_progress) {
    localTask.value.progress = task.real_progress;
  }
  localParent.value = parent || ({} as TaskModel);
  localDate.value = {
    start_date: onFormatDate(task.start_date),
    end_date: onFormatDate(task.end_date),
    days: task.duration ?? 1,
  };
  open.value = !open.value;
};

const closeDialog = () => {
  dateRangeWithDaysRef.value?.resetDates();
  localTask.value = {
    id: '',
    text: '',
    description: '',
    duration: 1,
    start_date: new Date(),
    end_date: new Date(),
    date_start: moment().format('YYYY-MM-DD'),
    date_finish: moment().format('YYYY-MM-DD'),
    type: 'task',
    unit: '',
    quantity: 0,
    incidence: 0,
    color: '#3db9d3',
    parent: '0',
    progress: 0,
    status: 'En espera',
    priority: 'Alta',
    user_id: userCRM.id,
  };
  localParent.value = {} as TaskModel;
  localDate.value = {} as DateModel;
  open.value = false;
};

const onSaveTask = () => {
  if (!isValidateInput.value) {
    return;
  }

  if (localTask.value.type === 'task') {
    const { days, start_date, end_date } = <DateModel>(
      dateRangeWithDaysRef.value?.getDates()
    );
    const sendData = {
      ...localTask.value,
      id: uid(),
      start_date: new Date(start_date + ' UTC-4'),
      end_date: new Date(end_date + ' UTC-4'),
      duration: days,
      date_start: start_date,
      date_finish: end_date,
    };
    emit('saveTask', useGanttTaskData(sendData));
  } else {
    localTask.value.id = uid();
    console.log(localTask.value);
    emit('saveTask', useGanttTaskData(localTask.value));
  }
  closeDialog();
};

const onUpdateTask = () => {
  if (!isValidateInput.value) {
    return;
  }

  if (localTask.value.type === 'task') {
    const { days, start_date, end_date } = <DateModel>(
      dateRangeWithDaysRef.value?.getDates()
    );
    const sendData = {
      ...localTask.value,
      start_date: new Date(start_date + ' UTC-4'),
      end_date: new Date(end_date + ' UTC-4'),
      duration: days,
      date_start: start_date,
      date_finish: end_date,
    };
    //console.log('update form (task)->', sendData);
    emit('updateTask', useGanttTaskData(sendData));
  } else {
    //console.log('update form (milestone, project)->', localTask.value);
    emit('updateTask', useGanttTaskData(localTask.value));
  }
  closeDialog();
};

const onDeleteTask = () => {
  emit('deleteTask', localTask.value);
  closeDialog();
};

const openConfirm = () => {
  showDelete.value = !showDelete.value;
};

const restoreValues = () => {
  console.log('dsada');
};

const onSlide = (newValue: number) => {
  if (newValue === 100) {
    localTask.value.status = 'Completado';
    localTask.value.quantity_remaining = 0;
    return;
  }

  if (localTask.value.quantity) {
    const porc =
      localTask.value.quantity - localTask.value.quantity * (newValue * 0.01);
    localTask.value.quantity_remaining = Number(porc.toFixed(2));
  }

  localTask.value.status = 'En progreso';
};

const onChangeStatus = (value: string) => {
  if (value === 'Completado') {
    localTask.value.progress = 100;
    localTask.value.quantity_remaining = 0;
    return;
  }
  if (value === 'En espera') {
    localTask.value.progress = 0;
    localTask.value.quantity_remaining = localTask.value.quantity;
  }

  if (value === 'En progreso') {
    localTask.value.progress = 0;
    localTask.value.quantity_remaining = localTask.value.quantity;
  }
  //localTask.value.progress = staticProgress;
};

const onSetQuantityRemaining = (value: number) => {
  if (localTask.value.quantity) {
    localTask.value.progress = 100 - (value / localTask.value.quantity) * 100;
  }
};

onMounted(async () => {
  await getlistProjectMetricUnits();
});

const emit = defineEmits<{
  (e: 'saveTask', localTask: TaskModel): void;
  (e: 'updateTask', localTask: TaskModel): void;
  (e: 'deleteTask', localTask: TaskModel): void;
}>();

defineExpose({
  openCreateDialog,
  openHerencialDialog,
  openModifiedDialog,
});
</script>
<template>
  <DialogComponent
    @hide="closeDialog"
    v-model="open"
    :footer-disabled="!isEditing"
    :persistent="true"
    :size-dialog="localTask.real_id ? 'dialog-lg' : 'dialog-sm'"
    @before-hide="closeDialog"
  >
    <template #header>
      <q-toolbar
        :class="
          localTask.type === 'task'
            ? 'bg-white text-blue'
            : localTask.type === 'milestone'
            ? 'bg-white text-purple'
            : 'bg-white text-green'
        "
        class="shadow-2"
      >
        <template v-if="localTask.type === 'task'">
          <q-icon name="task" size="sm" />
          <q-toolbar-title>
            {{ localTask.real_id ? localTask.text : 'NUEVA TAREA' }}
          </q-toolbar-title>
        </template>
        <template v-if="localTask.type === 'milestone'">
          <span class="milestone-icon"></span>
          <q-toolbar-title>
            {{ localTask.real_id ? localTask.text : 'NUEVO ENTREGABLE' }}
          </q-toolbar-title>
        </template>
        <template v-if="localTask.type === 'project'">
          <q-icon name="label_important" size="sm" />
          <q-toolbar-title>
            {{ localTask.real_id ? localTask.text : 'NUEVO HITO' }}
          </q-toolbar-title>
        </template>

        <q-btn
          flat
          round
          dense
          icon="close"
          v-close-popup
          @click="closeDialog"
        />
      </q-toolbar>
    </template>
    <template #body>
      <div class="row">
        <div :class="localTask.real_id ? 'col-md-6' : 'col-12'">
          <view-card-component
            :controls="!!localTask.real_id"
            icon-name="task"
            title="Información"
            :initial-status="localTask.real_id ? 'read' : 'edit'"
            ref="baseCardRef"
            @cancel-change="restoreValues"
            class="q-ma-sm"
          >
            <template #edit>
              <q-card-section class="row q-col-gutter-sm">
                <div class="col-md-12" v-if="localParent.id">
                  <q-card
                    flat
                    bordered
                    class="text-dark"
                    :class="
                      localParent.type == 'task'
                        ? 'bg-blue-1 '
                        : localParent.type == 'milestone'
                        ? 'bg-purple-1'
                        : 'bg-green-1'
                    "
                  >
                    <q-card-section v-if="localParent && maxIncidende == 0">
                      <q-badge
                        color="negative"
                        text-color="white"
                        :label="`La incidencia ya cumple el  ${localParent.incidence}% asignado al padre`"
                        class="q-pa-sm full-width"
                      />
                    </q-card-section>
                    <q-card-section class="q-py-sm col-6">
                      <q-item-label caption> Tarea padre </q-item-label>
                      <q-item-label>
                        {{ localParent.text }}
                      </q-item-label>
                      <q-item-label caption> Incidendia </q-item-label>
                      <q-item-label>
                        {{ localParent.incidence }} %</q-item-label
                      >
                    </q-card-section>
                  </q-card>
                </div>
                <q-select
                  v-model.prenvent="localTask.type"
                  :options="[
                    {
                      label: 'Hito',
                      value: 'project',
                    },
                    {
                      label: 'Entregable',
                      value: 'milestone',
                    },
                    {
                      label: 'Tarea',
                      value: 'task',
                    },
                  ]"
                  label="Tipo"
                  outlined
                  dense
                  option-value="value"
                  option-label="label"
                  map-options
                  emit-value
                  options-dense
                  class="col-12 q-mb-sm"
                />
                <!-- <div class="col-md-12 q-mb-sm">
              <q-btn
                icon="palette"
                :style="`background-color:${localTask.color}`"
                :text-color="localTask.color != '#ffffff' ? 'white' : 'black'"
                label="Seleccionar color"
              >
                <q-popup-proxy
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="showColor"
                >
                  <q-color
                    v-model="localTask.color"
                    default-view="palette"
                    no-header
                    no-footer
                    class="my-picker"
                    v-close-popup
                  />
                </q-popup-proxy>
              </q-btn>
            </div> -->
                <q-select
                  v-model="localTask.status"
                  :options="['En espera', 'En progreso', 'Completado']"
                  label="Estado"
                  outlined
                  class="col-6 q-mb-sm"
                  dense
                  @update:model-value="onChangeStatus"
                >
                  <template v-slot:prepend>
                    <q-icon
                      name="schedule"
                      color="grey-5"
                      v-if="localTask.status === 'En espera'"
                    />
                    <q-icon
                      name="timeline"
                      color="light-blue-4"
                      v-if="localTask.status === 'En progreso'"
                    />
                    <q-icon
                      name="check"
                      color="green"
                      v-if="localTask.status === 'Completado'"
                    />
                  </template>
                </q-select>

                <q-select
                  v-model="localTask.priority"
                  :options="['Alta', 'Media', 'Baja']"
                  label="Prioridad"
                  outlined
                  class="col-6 q-mb-sm"
                  dense
                >
                  <template v-slot:prepend>
                    <q-icon
                      name="flag"
                      color="red"
                      v-if="localTask.priority === 'Alta'"
                    />
                    <q-icon
                      name="flag"
                      color="orange"
                      v-if="localTask.priority === 'Media'"
                    />
                    <q-icon
                      name="flag"
                      color="green"
                      v-if="localTask.priority === 'Baja'"
                    />
                  </template>
                </q-select>

                <q-input
                  v-model="localTask.text"
                  type="text"
                  label="Nombre"
                  outlined
                  dense
                  class="col-12"
                  autofocus
                  ref="inputTitleRef"
                  @keyup.enter="onSaveTask"
                  :rules="[(val:string) => !!val || 'Campo requerido']"
                >
                </q-input>

                <q-input
                  v-model="localTask.description"
                  type="textarea"
                  :rows="3"
                  label="Descripción"
                  outlined
                  dense
                  class="col-12 q-mb-md"
                  v-if="localTask.type == 'task'"
                />

                <DateRangeWithDays
                  ref="dateRangeWithDaysRef"
                  :date="localDate"
                  v-if="localTask.type === 'task'"
                  class="q-mb-md"
                />

                <q-input
                  v-model.number="localTask.quantity"
                  type="number"
                  label="Cantidad"
                  dense
                  outlined
                  class="col-md-6 col-xs-12"
                  ref="inputQuantityRef"
                  :rules="[(val:number) => val > 0 || 'Ingrese un numero mayor a 0']"
                  @keyup.enter="onSaveTask"
                  @update:model-value="(val:number)=> localTask.quantity_remaining = val "
                  v-if="localTask.type == 'task'"
                />

                <q-input
                  v-model.number="localTask.quantity_remaining"
                  type="number"
                  label="Cantidad faltante"
                  dense
                  outlined
                  class="col-md-6 col-xs-12"
                  ref="inputQuantityResRef"
                  @update:model-value="onSetQuantityRemaining"
                  @keyup.enter="onSaveTask"
                  :readonly="localTask.status == 'En espera'"
                  v-if="localTask.type == 'task'"
                />

                <q-select
                  ref="inputUnitRef"
                  v-model="localTask.unit"
                  :options="listProjectMetricUnits"
                  label="Unidad"
                  outlined
                  dense
                  class="col-md-6 col-xs-12"
                  options-dense
                  option-label="label"
                  option-value="value"
                  map-options
                  emit-value
                  transition-show="scale"
                  transition-hide="scale"
                  :rules="[(val:string) => !!val || 'Campo requerido']"
                  v-if="localTask.type == 'task'"
                />

                <q-input
                  v-if="localTask.type != 'milestone'"
                  v-model.number="localTask.incidence"
                  type="number"
                  label="Incidencia"
                  ref="inputIncidenceRef"
                  outlined
                  dense
                  :min="0"
                  :class="
                    localTask.type == 'project'
                      ? 'col-md-12'
                      : 'col-md-6 col-xs-12'
                  "
                  :rules="localTask.parent!== '0' ? [
                  (val:number) => val <= maxIncidende || 'Incidencia excedida'
                ] : []"
                >
                  <template v-slot:prepend>% </template>
                </q-input>

                <q-input
                  v-else
                  v-model="localTask.date_start"
                  type="date"
                  :label="
                    localTask.type !== 'milestone'
                      ? 'Fecha inicio'
                      : 'Fecha de entrega'
                  "
                  dense
                  outlined
                  class="col-12 q-mb-md"
                />

                <div class="col-12" v-if="localTask.status != 'En espera'">
                  <small
                    >Progreso: {{ localTask.progress.toFixed(2) }} %
                  </small>
                  <q-slider
                    v-model="localTask.progress"
                    :min="0"
                    :max="100"
                    label
                    track-size="10px"
                    :label-value="'Avance: ' + localTask.progress + '%'"
                    @update:model-value="onSlide"
                    switch-label-side
                    class="col-12"
                  />
                </div>
              </q-card-section>
            </template>
            <template #read>
              <q-card-section class="row q-col-gutter-sm">
                <div class="col-md-12" v-if="localParent.id">
                  <q-card
                    flat
                    bordered
                    class="text-dark"
                    :class="
                      localParent.type == 'task'
                        ? 'bg-blue-1 '
                        : localParent.type == 'milestone'
                        ? 'bg-purple-1'
                        : 'bg-green-1'
                    "
                  >
                    <q-card-section v-if="localParent && maxIncidende == 0">
                      <q-badge
                        color="negative"
                        text-color="white"
                        :label="`La incidencia ya cumple el  ${localParent.incidence}% asignado al padre`"
                        class="q-pa-sm full-width"
                      />
                    </q-card-section>
                    <q-card-section class="q-py-sm col-6">
                      <q-item-label caption> Tarea padre </q-item-label>
                      <q-item-label>
                        {{ localParent.text }}
                      </q-item-label>
                      <q-item-label caption> Incidendia </q-item-label>
                      <q-item-label>
                        {{ localParent.incidence }} %</q-item-label
                      >
                    </q-card-section>
                  </q-card>
                </div>
                <q-select
                  v-model.prenvent="localTask.type"
                  :options="[
                    {
                      label: 'Hito',
                      value: 'project',
                    },
                    {
                      label: 'Entregable',
                      value: 'milestone',
                    },
                    {
                      label: 'Tarea',
                      value: 'task',
                    },
                  ]"
                  label="Tipo"
                  outlined
                  dense
                  option-value="value"
                  option-label="label"
                  map-options
                  emit-value
                  options-dense
                  readonly
                  hide-dropdown-icon
                  class="col-12 q-mb-sm"
                />
                <q-select
                  v-model="localTask.status"
                  :options="['En espera', 'En progreso', 'Completado']"
                  label="Estado"
                  outlined
                  class="col-6"
                  dense
                  readonly
                  hide-dropdown-icon
                >
                  <template v-slot:prepend>
                    <q-icon
                      name="schedule"
                      color="grey-5"
                      v-if="localTask.status === 'En espera'"
                    />
                    <q-icon
                      name="timeline"
                      color="light-blue-4"
                      v-if="localTask.status === 'En progreso'"
                    />
                    <q-icon
                      name="check"
                      color="green"
                      v-if="localTask.status === 'Completado'"
                    />
                  </template>
                </q-select>

                <q-select
                  v-model="localTask.priority"
                  :options="['Alta', 'Media', 'Baja']"
                  label="Prioridad"
                  outlined
                  readonly
                  hide-dropdown-icon
                  class="col-6 q-mb-sm"
                  dense
                >
                  <template v-slot:prepend>
                    <q-icon
                      name="flag"
                      color="red"
                      v-if="localTask.priority === 'Alta'"
                    />
                    <q-icon
                      name="flag"
                      color="orange"
                      v-if="localTask.priority === 'Media'"
                    />
                    <q-icon
                      name="flag"
                      color="green"
                      v-if="localTask.priority === 'Baja'"
                    />
                  </template>
                </q-select>

                <q-input
                  v-model="localTask.text"
                  type="text"
                  label="Nombre"
                  outlined
                  dense
                  class="col-12 q-mb-sm"
                  autofocus
                  ref="inputTitleRef"
                  readonly
                >
                </q-input>

                <q-input
                  v-model="localTask.description"
                  type="textarea"
                  :rows="3"
                  label="Descripción"
                  outlined
                  dense
                  class="col-12 q-mb-sm"
                  readonly
                  v-if="localTask.type == 'task'"
                />

                <DateRangeWithDays
                  ref="dateRangeWithDaysRef"
                  :date="localDate"
                  v-if="localTask.type === 'task'"
                  class="q-mb-sm"
                />

                <q-input
                  v-model.number="localTask.quantity"
                  type="number"
                  label="Cantidad"
                  dense
                  outlined
                  class="col-md-6 col-xs-12 q-mb-sm"
                  ref="inputQuantityRef"
                  readonly
                  v-if="localTask.type == 'task'"
                />

                <q-input
                  v-model.number="localTask.quantity_remaining"
                  type="number"
                  label="Cantidad faltante"
                  dense
                  outlined
                  class="col-md-6 col-xs-12 q-mb-sm"
                  ref="inputQuantityResRef"
                  readonly
                  v-if="localTask.type == 'task'"
                />

                <q-select
                  ref="inputUnitRef"
                  v-model="localTask.unit"
                  :options="listProjectMetricUnits"
                  label="Unidad"
                  outlined
                  dense
                  class="col-md-6 col-xs-12 q-mb-sm"
                  options-dense
                  option-label="label"
                  option-value="value"
                  map-options
                  emit-value
                  transition-show="scale"
                  transition-hide="scale"
                  readonly
                  hide-dropdown-icon
                  v-if="localTask.type == 'task'"
                />

                <q-input
                  v-model.number="localTask.incidence"
                  type="number"
                  label="Incidencia"
                  ref="inputIncidenceRef"
                  dense
                  outlined
                  readonly
                  :class="
                    localTask.type == 'project'
                      ? 'col-md-12 q-mb-sm'
                      : 'col-md-6 col-xs-12 q-mb-sm'
                  "
                  v-if="localTask.type != 'milestone'"
                >
                  <template v-slot:prepend>% </template>
                </q-input>

                <q-input
                  v-else
                  v-model="localTask.date_start"
                  type="date"
                  :label="
                    localTask.type !== 'milestone'
                      ? 'Fecha inicio'
                      : 'Fecha de entrega'
                  "
                  dense
                  outlined
                  readonly
                  class="col-12 q-mb-sm"
                />

                <div class="col-12" v-if="localTask.status != 'En espera'">
                  <small
                    >Progreso: {{ localTask.progress.toFixed(2) }} %
                  </small>
                  <q-linear-progress
                    :value="localTask.progress * 0.01"
                    rounded
                    color="primary"
                    track-color="grey-5"
                    class="q-mt-sm"
                    size="15px"
                  />
                </div>
              </q-card-section>
            </template>
          </view-card-component>
        </div>
        <div class="col-md-6" v-if="localTask.real_id">
          <!-- <q-card class="q-my-sm q-ml-none q-mr-md">
            <q-card-section class="q-pa-none">
              <q-toolbar>
                <q-btn flat round dense icon="group" color="primary" />
                <q-toolbar-title> Recursos </q-toolbar-title>
                <q-btn color="primary" icon="add" size="sm" />
              </q-toolbar>
            </q-card-section>
            <q-separator class="text-dark" />
            <q-card-section class="">
              <q-avatar
                v-for="n in 5"
                :key="n"
                size="50px"
                :style="`left: ${n * 2}px`"
              >
                <img :src="`https://cdn.quasar.dev/img/avatar${n + 1}.jpg`" />
              </q-avatar>
            </q-card-section>
          </q-card> -->

          <q-card class="q-my-sm q-ml-none q-mr-md">
            <q-card-section class="q-pa-none">
              <q-tabs
                class="q-ma-none"
                v-model="tab"
                indicator-color="primary"
                :inline-label="!$q.screen.xs"
                :active-color="$q.dark.isActive ? 'orange' : 'primary'"
                align="justify"
                :no-caps="$q.screen.xs ? true : false"
              >
                <q-tab name="Comments" icon="comment" label="Comentarios" />
                <q-tab name="Assignments" icon="task" label="Asignaciones" />
                <q-tab name="Activities" icon="person" label="Actividades" />
              </q-tabs>
              <q-separator />
              <q-tab-panels
                v-model="tab"
                animated
                style="min-height: fit-content"
              >
                <q-tab-panel name="Activities">
                  <ActivitiesComponent
                    :id="localTask.real_id ?? ''"
                    :idUser="userCRM.id"
                    :module="'ProjectTask'"
                  />
                </q-tab-panel>
                <q-tab-panel name="Assignments">
                  <ListAssignationsComponent :module-id="localTask.real_id" />
                </q-tab-panel>
                <q-tab-panel name="Comments">
                  <CommentsComponent
                    :module-id="localTask.real_id"
                    module="ProjectTask"
                  />
                </q-tab-panel>
              </q-tab-panels>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </template>
    <template #footer v-if="isEditing">
      <div class="flex justify-between full-width">
        <div class="q-gutter-sm">
          <q-btn
            color="primary"
            icon="save"
            label="Modificar"
            @click="onUpdateTask"
            v-if="localTask.id"
          />
          <q-btn
            color="primary"
            icon="save"
            label="Guardar"
            @click="onSaveTask"
            v-else
          />
          <q-btn
            text-color="dark"
            color="white"
            icon="close"
            label="Cancelar"
            @click="closeDialog"
            @keyup.esc="closeDialog"
          />
        </div>
        <q-btn
          v-if="localTask.id"
          icon="delete"
          label="Eliminar"
          color="negative"
          @click="openConfirm"
        />
      </div>
    </template>
  </DialogComponent>
  <AlertComponent
    v-model="showDelete"
    message="Se eliminará esta tarea de la lista."
    title="¿Eliminar Tarea?"
    icon="close"
    icon-size="60px"
    icon-color="negative"
    btn-text="Si, eliminar"
    btn-color="negative"
    @confirm="onDeleteTask"
  />
</template>

<style lang="scss" scoped>
.milestone-icon {
  background: #9c27b0;
  border-color: #9111c2;

  border-radius: 3px;
  height: 16px;
  width: 16px;
  border: 1px solid white;
}
.overlapping {
  border: 2px solid white;
  position: absolute;
}
</style>
