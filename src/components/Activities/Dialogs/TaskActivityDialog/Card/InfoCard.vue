<script lang="ts">
import { ref, onMounted, watch } from 'vue';
import CommentsList from 'src/components/Comments/CommentsList.vue';
import { InfoTask } from 'src/components/Activities/Dialogs/TaskActivityDialog/utils/types';
import AssignedSingleUserTask from 'src/components/AssignedUsers/AssignedSingleUserTask.vue';
import moment from 'moment';
import { api } from '../../../../../boot/axios';
import { userStore } from 'src/modules/Users/store/UserStore';
import { axios_LB_04 } from 'src/conections/axiosCRM';
import { Loading, QSpinnerPuff } from 'quasar';
</script>

<script lang="ts" setup>
const props = defineProps<{
  asunto?: string;
  idActivity: string;
}>();
const { userCRM } = userStore();
const open = ref(false);
const tab = ref('comentarios');
const localValue = ref(<InfoTask>{});
const inputData = ref({} as InfoTask);
const localTask = ref({
  attributes: {
    name: '',
    modified_user_id: '',
    description: '',
    status: '',
    date_start: '',
    date_due: '',
    assigned_user_id: inputData.value.assigned_user_id,
    tipotarea_c: '',
  },
});

const horas = ref<any>([]);
const fechas = ref({
  attributes: {
    date_start: moment().format('YYYY-MM-DD'),
    date_end: moment().format('YYYY-MM-DD'),
    time_start: moment().format('HH:00'),
    time_end: moment().format('HH:15'),
  },
});
const options = [
  {
    label: '',
    value: '',
  },
  {
    label: 'Atención de Lead',
    value: '03_LEADS_AtencionLeads',
  },
  {
    label: 'Contacto Cliente',
    value: '03_LEADS_ContactoCliente',
  },
  {
    label: 'Visita Venta',
    value: '03_LEADS_VisitaVenta',
  },
  {
    label: 'Test Drive',
    value: '03_LEADS_TestDrive',
  },
];
const optionsEstado = [
  {
    label: 'No iniciada',
    value: 'Not Started',
  },
  {
    label: 'En Progreso',
    value: 'In Progress',
  },
  {
    label: 'Completada',
    value: 'Completed',
  },
  {
    label: 'Pendiente de Información',
    value: 'Pending Input',
  },
  {
    label: 'Aplazada',
    value: 'Deferred',
  },
];
const isEditing = ref(false);
const assignedUserId = ref(localValue.value.assigned_user_id);

onMounted(async () => {
  calculaTiempo();
});

const calculaTiempo = () => {
  for (let index = 6; index <= 23; index++) {
    let minutos = 0;
    for (let index2 = 0; index2 < 4; index2++) {
      if (index2 <= 0) {
        if (index > 9) {
          horas.value.push(index + ':00');
        } else {
          horas.value.push('0' + index + ':00');
        }
      } else {
        minutos = minutos + 15;
        if (index > 9) {
          horas.value.push(index + ':' + minutos);
        } else {
          horas.value.push('0' + index + ':' + minutos);
        }
      }
    }
  }
};

const info = async () => {
  const response = await axios_LB_04.get(`/tasks-get/${props.idActivity}`);
  localValue.value = response.data.data.attributes;
  inputData.value = { ...localValue.value };
  fechas.value.attributes.date_start = moment(
    localValue.value.date_start
  ).format('YYYY-MM-DD');
  fechas.value.attributes.time_start = moment(
    localValue.value.date_start
  ).format('HH:mm');
  fechas.value.attributes.date_end = moment(localValue.value.date_due).format(
    'YYYY-MM-DD'
  );
  fechas.value.attributes.time_end = moment(localValue.value.date_due).format(
    'HH:mm'
  );
};

const onChangeUserAssigned = async (id: string) => {
  localTask.value.attributes.assigned_user_id = id;
  console.log(id);
};

const deleteTasks = async () => {
  Loading.show({
    spinner: QSpinnerPuff,
    message: 'Eliminando la Tarea',
  });
  const response = await axios_LB_04.delete(
    `/tasks-delete/${props.idActivity}/${userCRM.id}`
  );
  Loading.hide();
  emits('formSaved');
  open.value = false;
};

const saveTask = async () => {
  Loading.show({
    spinner: QSpinnerPuff,
    message: 'Modificando la Tarea',
  });
  let new_date_start = moment(
    fechas.value.attributes.date_start,
    'YYYY-MM-DD'
  ).format('YYYY-MM-DD');
  let convert4DateStart =
    new_date_start + ' ' + fechas.value.attributes.time_start + ':00';
  localTask.value.attributes.date_start = moment(convert4DateStart)
    .add(4, 'h')
    .format('YYYY-MM-DD HH:mm:ss');

  let new_date_end = moment(
    fechas.value.attributes.date_end,
    'YYYY-MM-DD'
  ).format('YYYY-MM-DD');
  let convert4DateEnd =
    new_date_end + ' ' + fechas.value.attributes.time_end + ':00';
  localTask.value.attributes.date_due = moment(convert4DateEnd)
    .add(4, 'h')
    .format('YYYY-MM-DD HH:mm:ss');

  localTask.value.attributes.description = inputData.value.description;
  localTask.value.attributes.name = inputData.value.name;
  localTask.value.attributes.modified_user_id = userCRM.id;
  localTask.value.attributes.status = inputData.value.status;
  localTask.value.attributes.tipotarea_c = inputData.value.tipotarea_c;
  const response = await api.patch(
    `${process.env.CRM4_LB_04}/tasks-update/${props.idActivity}`,
    localTask.value
  );
  Loading.hide();
  emits('formSaved');
  open.value = false;
};

const restoreValues = () => {
  console.log('restaura datos');
  inputData.value = { ...localValue.value };
  //isEditing.value=true;
  fechas.value.attributes.date_start = moment(
    localValue.value.date_start
  ).format('YYYY-MM-DD');
  fechas.value.attributes.time_start = moment(
    localValue.value.date_start
  ).format('HH:mm');
  fechas.value.attributes.date_end = moment(localValue.value.date_due).format(
    'YYYY-MM-DD'
  );
  fechas.value.attributes.time_end = moment(localValue.value.date_due).format(
    'HH:mm'
  );
};

const updateAssignedUserId = (id: string) => {
  assignedUserId.value = id;
};

watch(
  () => fechas.value.attributes.time_start,
  () => {
    // console.log(fechas.value.attributes.time_start)
    let uno = fechas.value.attributes.time_start;
    fechas.value.attributes.time_end = moment(uno, 'HH:mm')
      .add(15, 'm')
      .format('HH:mm');
    // console.log(fechas.value.attributes.time_end);
  }
);

const emits = defineEmits<{ (event: 'formSaved'): void }>();

//**********************************************defineExpose
defineExpose({
  open,
});
</script>

<template>
  <dialog-component
    size-dialog="dialog-lg"
    v-model="open"
    :footerDisabled="false"
    :headerDisabled="false"
    :iconDialog="''"
    :persistent="false"
    @show="info"
  >
    <template #header>
      <div class="bg-primary-3 text-black">
        <q-toolbar class="bg-primary q-pa-lg">
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-avatar text-color="white">
                  <q-icon name="task" size="md"></q-icon>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-grey-5 text-caption" lines="1"
                  >Tarea
                  <q-item-label class="text-white text-h5">{{
                    asunto
                  }}</q-item-label>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-space />
          <q-btn size="xs" color="white" outline label="opciones">
            <q-menu auto-close :offset="[110, 0]">
              <q-list dense>
                <q-item clickable dense>
                  <q-item-section avatar dense>
                    <q-avatar icon="delete" text-color="red" size="md" />
                  </q-item-section>
                  <q-item-section @click="deleteTasks">Eliminar</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn
            dense
            flat
            color="white"
            :icon="!$q.screen.xs ? 'close' : 'arrow_back_ios'"
            v-close-popup
          >
            <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-toolbar>
      </div>
    </template>
    <template #body>
      <div class="row q-pa-md q-col-gutter-sm">
        <div class="col-12 col-sm-6 q-gutter-y-sm">
          <div class="row" style="height: 75vh">
            <view-card-component
              style="width: 100%"
              :controls="!!idActivity"
              :initial-status="!!idActivity ? 'read' : 'edit'"
              icon-name="task"
              ref="baseCardRef"
              title="Información de la tarea"
              @cancel-change="restoreValues"
            >
              <template #read>
                <div class="row q-col-gutter-sm q-ma-xs">
                  <q-select
                    class="col-12 col-sm-12 q-mb-sm"
                    v-model="inputData.tipotarea_c"
                    hide-dropdown-icon
                    :options="options"
                    stack-label
                    dense
                    label="Tipo de tarea"
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                    color="secondary"
                    readonly
                  >
                  </q-select>
                  <q-input
                    class="col-12 col-sm-12 q-mb-sm"
                    readonly
                    dense
                    v-model="inputData.name"
                    type="text"
                    label="Asunto"
                  />
                  <q-select
                    class="col-12 col-sm-12 q-mb-sm"
                    v-model="inputData.status"
                    hide-dropdown-icon
                    :options="optionsEstado"
                    stack-label
                    dense
                    label="Estado"
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                    color="secondary"
                    readonly
                  >
                  </q-select>
                  <q-input
                    class="col-12 col-sm-12 q-mb-sm"
                    autogrow
                    v-model="inputData.description"
                    type="textarea"
                    label="Descripcion"
                    readonly
                  >
                  </q-input>
                  <!-- <component :is="DurationDateTasks" ref="durationInput" @changeDate="changeDateC" :modoread="true" :idActivity="idActivity" :data="dates"/> -->
                  <div class="row q-col-gutter-sm col-12">
                    <div class="col-6 col-xs-6">
                      <q-input
                        v-model="fechas.attributes.date_start"
                        label="Fecha de Inicio"
                        type="date"
                        readonly
                        dense
                        color="primary"
                      >
                        <template #before>
                          <q-icon name="event" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-6 col-xs-6">
                      <q-select
                        color="grey-3"
                        readonly
                        dense
                        v-model="fechas.attributes.time_start"
                        :options="horas"
                        label="Hora inicio"
                      >
                        <template v-slot:append>
                          <q-icon name="schedule" />
                        </template>
                      </q-select>
                    </div>

                    <div class="col-6 col-xs-6">
                      <q-input
                        v-model="fechas.attributes.date_end"
                        label="Fecha de Fin"
                        type="date"
                        readonly
                        dense
                        color="primary"
                      >
                        <template #before>
                          <q-icon name="event" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-6 col-xs-6">
                      <q-select
                        color="grey-3"
                        readonly
                        dense
                        v-model="fechas.attributes.time_end"
                        :options="horas"
                        label="Hora Fin"
                      >
                        <template v-slot:append>
                          <q-icon name="schedule" />
                        </template>
                      </q-select>
                    </div>
                  </div>
                </div>
              </template>

              <template #edit>
                <div class="row q-col-gutter-sm q-ma-xs">
                  <!-- <q-select class="col-12 col-sm-12 q-mb-sm" v-model="inputData.tipotarea_c" :options="options"
                    stack-label outlined dense label="Tipo de tarea" option-value="value" option-label="label"
                    emit-value map-options color="secondary">
                    <template #before>
                      <q-icon name="list" />
                    </template>
                  </q-select> -->
                  <q-input
                    ref="myForm1"
                    class="col-12 col-sm-12 q-mb-sm"
                    borderless
                    dense
                    v-model="inputData.name"
                    type="text"
                    label="Asunto*"
                    outlined
                  >
                    <template #before>
                      <q-icon name="title" />
                    </template>
                  </q-input>
                  <q-select
                    class="col-12 col-sm-12 q-mb-sm"
                    v-model="inputData.status"
                    :options="optionsEstado"
                    stack-label
                    outlined
                    dense
                    label="Estado"
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                    color="secondary"
                  >
                    <template #before>
                      <q-icon name="list" />
                    </template>
                  </q-select>
                  <q-input
                    class="col-12 col-sm-12 q-mb-sm"
                    v-model="inputData.description"
                    type="textarea"
                    label="Descripcion"
                    outlined
                    autogrow
                  >
                    <template #before>
                      <q-icon name="list" />
                    </template>
                  </q-input>
                  <div class="row q-col-gutter-sm col-12">
                    <div class="col-6 col-xs-6">
                      <q-input
                        v-model="fechas.attributes.date_start"
                        label="Fecha de Inicio"
                        type="date"
                        outlined
                        dense
                        color="primary"
                      >
                        <template #before>
                          <q-icon name="event" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-6 col-xs-6">
                      <q-select
                        color="grey-3"
                        outlined
                        dense
                        v-model="fechas.attributes.time_start"
                        :options="horas"
                        label="Hora inicio"
                      >
                        <template v-slot:append>
                          <q-icon name="schedule" />
                        </template>
                      </q-select>
                    </div>

                    <div class="col-6 col-xs-6">
                      <q-input
                        v-model="fechas.attributes.date_end"
                        label="Fecha de Fin"
                        type="date"
                        outlined
                        dense
                        color="primary"
                      >
                        <template #before>
                          <q-icon name="event" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-6 col-xs-6">
                      <q-select
                        color="grey-3"
                        outlined
                        dense
                        v-model="fechas.attributes.time_end"
                        :options="horas"
                        label="Hora Fin"
                      >
                        <template v-slot:append>
                          <q-icon name="schedule" />
                        </template>
                      </q-select>
                    </div>
                  </div>
                  <!-- <component :is="DurationDateTasks" ref="durationInput" @changeDate="changeDateC" :modoread="false" :idActivity="idActivity" :data="dates"/> -->
                </div>
              </template>
            </view-card-component>
          </div>
        </div>
        <div class="col-12 col-sm-6 q-gutter-y-sm">
          <div class="row">
            <q-card style="width: 100%">
              <AssignedSingleUserTask
                ref="assignedSingleUserRef"
                :module="'tasks'"
                :module-id="idActivity"
                :withList="true"
                @changeUser="onChangeUserAssigned"
                @new-assigned-id="updateAssignedUserId"
              />
            </q-card>
          </div>
          <div class="row">
            <q-card style="width: 100%">
              <q-tabs
                class="q-ma-none"
                v-model="tab"
                indicator-color="primary"
                :inline-label="!$q.screen.xs"
                :active-color="$q.dark.isActive ? 'orange' : 'primary'"
                align="justify"
                :no-caps="$q.screen.xs ? true : false"
              >
                <q-tab name="comentarios" icon="comment" label="Comentarios" />
              </q-tabs>
              <q-tab-panels
                v-model="tab"
                animated
                style="min-height: fit-content"
              >
                <q-tab-panel
                  name="comentarios"
                  style="min-height: 59vh"
                  class="q-py-sm"
                >
                  <CommentsList
                    :id="idActivity"
                    :descCRM3="'dsf'"
                    :modulo="'Tasks'"
                  ></CommentsList>
                </q-tab-panel>
              </q-tab-panels>
            </q-card>
          </div>
        </div>
      </div>
    </template>
    <template #footer v-if="!isEditing">
      <q-btn color="primary" class="q-mr-md" @click="saveTask">Guardar</q-btn>
      <q-btn color="negative" v-close-popup>Cancelar</q-btn>
    </template>
  </dialog-component>
</template>
<style lang="scss" scoped></style>
