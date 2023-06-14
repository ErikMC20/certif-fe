<script lang="ts">
import { ref, toRefs, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import AssignedSingleUserTask from 'src/components/AssignedUsers/AssignedSingleUserTask.vue';
import moment from 'moment';
import { QInput, QForm } from 'quasar';
import { userStore } from 'src/modules/Users/store/UserStore';
import { api } from '../../../boot/axios';
// import DurationDateTasks from '../GlobalComponent/DurationDateTasks.vue';
import { Loading, QSpinnerPuff } from 'quasar';
</script>
<script lang="ts" setup>
//**********************************************Invocacion de funciones nativas
const $q = useQuasar();

//**********************************************Invocacion de props emits ref
const props = withDefaults(
  defineProps<{
    idModule?: string;
    module?: string;
  }>(),
  {
    idModule: '',
  }
);
const emits = defineEmits<{ (event: 'formSaved'): void }>();
const assignedSingleUserRef = ref<InstanceType<
  typeof AssignedSingleUserTask
> | null>(null);
//**********************************************Invocacion de metodos externos
const { userCRM } = userStore();
const { idModule } = toRefs(props);

//**********************************************Variables individuales agrupadas
type AttributesOptions = {
  active: boolean;
  name: string;
  date_entered: string;
  date_modified: string;
  created_by: string;
  modified_user_id: string;
  description: string;
  assigned_user_id: string;
  status: string;
  date_due: string;
  date_start: string;
  parent_type: string;
  parent_id: string;
  priority: string;
  accion_seguir_c: string;
  tipotarea_c: string;
  montocomprometido_c: string;
  currency_id: string;
  motivo_mora_c: string;
  monto_cobrado_c: string;
  fecha_inicio_real_c: string;
  fecha_fin_real_c: string;
};
type AttributesOptions1 = {
  bean_module: string;
  bean_id: string;
  created_by: string;
  visualizacion_c: string;
  relevance: string;
  description: string;
};
type Task = {
  subject: string;
  url: string;
  location: string;
  attributes: AttributesOptions;
  attributes_comment: AttributesOptions1;
};
const localTask = ref({
  attributes: {
    name: '',
    date_entered: '2020-01-05 00:00:00.000',
    date_modified: '2020-01-05 00:00:00.000',
    created_by: userCRM.id,
    modified_user_id: userCRM.id,
    description: '',
    assigned_user_id: userCRM.id,
    status: 'Not Started',
    date_start: '2020-01-05 00:00:00.000',
    date_due: '2020-01-05 00:00:00.000',
    parent_type: props.module,
    parent_id: '',
    priority: 'Low',
    accion_seguir_c: '',
    tipotarea_c: '',
    montocomprometido_c: '',
    currency_id: '',
    motivo_mora_c: '',
    monto_cobrado_c: '',
    fecha_inicio_real_c: '',
    fecha_fin_real_c: '',
  },
  attributes_comment: {
    bean_module: 'Tasks',
    bean_id: '',
    created_by: userCRM.id,
    visualizacion_c: 'interno',
    relevance: 'medium',
    description: '',
  },
} as Task);
const fechas = ref({
  attributes: {
    date_start: moment().format('YYYY-MM-DD'),
    date_end: moment().format('YYYY-MM-DD'),
    time_start: moment().format('HH:00'),
    time_end: moment().format('HH:15'),
  },
});

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

//**********************************************Declaracion Variables individuales internas
const open = ref(false);
const tab = ref('comentarios');
const commentCreate = ref('');
const check = ref('Low');
const validateInput = ref([(val: string) => !!val || 'El campo es requerido']);
const myForm = ref<InstanceType<typeof QForm> | null>(null);
const myForm1 = ref<InstanceType<typeof QForm> | null>(null);
const myForm2 = ref<InstanceType<typeof QForm> | null>(null);
const horas = ref<any>([]);

//**********************************************Declaracion de metodos internos

onMounted(async () => {
  calculaTiempo();
});

const restoreValues = () => {
  localTask.value = {
    attributes: {
      name: '',
      date_entered: '2020-01-05 00:00:00.000',
      date_modified: '2020-01-05 00:00:00.000',
      created_by: userCRM.id,
      modified_user_id: userCRM.id,
      description: '',
      assigned_user_id: userCRM.id,
      status: 'Not Started',
      date_start: '2020-01-05 00:00:00.000',
      date_due: '2020-01-05 00:00:00.000',
      parent_type: props.module,
      parent_id: '',
      priority: 'Low',
      accion_seguir_c: '',
      tipotarea_c: '',
      montocomprometido_c: '',
      currency_id: '',
      motivo_mora_c: '',
      monto_cobrado_c: '',
      fecha_inicio_real_c: '',
      fecha_fin_real_c: '',
    },
    attributes_comment: {
      bean_module: 'Tasks',
      bean_id: '',
      created_by: userCRM.id,
      visualizacion_c: 'interno',
      relevance: 'medium',
      description: '',
    },
  } as Task;
  check.value = 'Low';
  fechas.value = {
    attributes: {
      date_start: moment().format('YYYY-MM-DD'),
      date_end: moment().format('YYYY-MM-DD'),
      time_start: moment().format('HH:00'),
      time_end: moment().format('HH:15'),
    },
  };
};
const onChangeUserAssigned = async (id: string) => {
  localTask.value.attributes.assigned_user_id = id;
  console.log('cambia usuario');
};

const updateAssignedUserId = (id: string) => {
  localTask.value.attributes.assigned_user_id = id;
  console.log('pordefecto' + id);
};

const saveTask = async () => {
  Loading.show({
    spinner: QSpinnerPuff,
    message: 'Creando la Tarea',
  });
  localTask.value.attributes.parent_id = idModule.value;
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
    fechas.value.attributes.date_start,
    'YYYY-MM-DD'
  ).format('YYYY-MM-DD');
  let convert4DateEnd =
    new_date_end + ' ' + fechas.value.attributes.time_end + ':00';
  localTask.value.attributes.date_due = moment(convert4DateEnd)
    .add(4, 'h')
    .format('YYYY-MM-DD HH:mm:ss');
  localTask.value.attributes.priority = check.value;
  localTask.value.attributes_comment.description = commentCreate.value;
  console.log(localTask.value);
  const response = await api.post(
    `${process.env.CRM4_LB_04}/tasks-new`,
    localTask.value
  );
  commentCreate.value = '';
  Loading.hide();
  emits('formSaved');
  open.value = false;
  console.log('todo okey');
};

const cancelTask = () => {
  console.log('Cancel...');
};

const validateForm = () => {
  myForm1.value?.validate();
  myForm2.value?.validate();
  myForm.value?.validate().then((success) => {
    if (success) {
      saveTask();
    } else {
      console.log('falta campos');
      $q.notify({
        color: 'red-6',
        textColor: 'white',
        icon: 'warning',
        message: 'LLene los campos obligatorios.',
      });
    }
  });
};

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
    @before-hide="restoreValues"
  >
    <template #header>
      <div class="bg-primary-3 text-black">
        <q-toolbar class="bg-primary q-pa-md">
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-avatar text-color="white">
                  <q-icon name="task" size="md"></q-icon>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-white text-h5"
                  >Nueva Tarea</q-item-label
                >
                <q-item-label class="text-grey-4 text-caption" lines="1"
                  >Programe una nueva tarea de manera sencilla
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-space />
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
            <q-card style="width: 100%">
              <q-form ref="myForm" v-model="localTask">
                <q-card-section>
                  <div class="row justify-between">
                    <span class="text subtitle">Información</span>
                    <span>
                      <q-checkbox
                        left-label
                        v-model="check"
                        size="xs"
                        label="Prioridad Alta"
                        color="primary"
                        true-value="High"
                        false-value="Low"
                      />
                      <q-icon
                        name="local_fire_department"
                        :color="check == 'High' ? 'red' : 'grey-5'"
                      ></q-icon>
                    </span>
                  </div>
                  <q-separator color="grey"></q-separator>
                  <br />
                  <div class="col q-gutter-y-md">
                    <q-input
                      ref="myForm1"
                      outlined
                      :rules="validateInput"
                      borderless
                      dense
                      v-model="localTask.attributes.name"
                      type="text"
                      label="Asunto*"
                    >
                      <template #before>
                        <q-icon name="bookmark" />
                      </template>
                    </q-input>
                    <q-input
                      style="width: 100%"
                      v-model="localTask.attributes.description"
                      type="textarea"
                      label="Descripcion"
                      outlined
                    >
                    </q-input>
                    <q-select
                      v-model="localTask.attributes.status"
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
                          v-model="fechas.attributes.date_start"
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
                  </div>
                </q-card-section>
              </q-form>
            </q-card>
          </div>
        </div>

        <div class="col-12 col-sm-6 q-gutter-y-sm">
          <div class="row">
            <q-card style="width: 100%">
              <AssignedSingleUserTask
                ref="assignedSingleUserRef"
                :module="'leads'"
                :module-id="''"
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
                  style="min-height: 10dvh"
                  class="q-py-sm"
                >
                  <q-input
                    autogrow
                    outlined
                    bottom-slots
                    v-model="commentCreate"
                    placeholder="Escriba su comentario inicial"
                    dense
                    color="primary"
                    ref="commentRef"
                  >
                  </q-input>
                </q-tab-panel>
              </q-tab-panels>
            </q-card>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <q-btn color="primary" class="q-mr-md" @click="validateForm"
        >Guardar</q-btn
      >
      <q-btn color="negative" v-close-popup @click="cancelTask">Cancelar</q-btn>
    </template>
  </dialog-component>
</template>
<style lang="scss" scoped></style>
