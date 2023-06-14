<script lang="ts">
import { ref, provide, onMounted, computed } from 'vue';
import { api } from '../../boot/axios';
import { useProspectStore } from '../../modules/Prospects/store/ProspectStore';
import EmailsActivitieDialog from '../../components/Activities/Dialogs/EmailsActivitieDialog.vue';
import MeetsActivitieDialog from 'src/components/Activities/Dialogs/MeetActivitieDialog.vue';
import CallsActivitieDialog from './Dialogs/CallsActivitieDialog.vue';
import TasksActivitieDialog from './Dialogs/TasksActivitieDialog.vue';
import NoteActivitieDialog from './Dialogs/NoteActivitieDialog.vue';
//import { userStore } from 'src/modules/Users/store/UserStore';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import { ModuleActivity } from '../types/index';
import { moduleKey, idModuleKey } from './ProvideKeys';
import { updateMeetingAttributesService } from 'src/services/MeetingsServices';
import { useActivityStore } from 'src/stores/ActivityStore';
import InfoCard from 'src/components/Activities/Dialogs/TaskActivityDialog/Card/InfoCard.vue';
import InfoCardEmails from 'src/components/Activities/Dialogs/EmailActivitieDialog/Card/InfoCardEmails.vue';
import { SearchUser } from '../types/index';
import moment from 'moment';
</script>
<script lang="ts" setup>
//Declaracion de Constantes, props.
//const user = userStore();
const { Get_list_Activities } = useProspectStore();
const props = withDefaults(
  defineProps<{
    id: string;
    idUser: string;
    module: ModuleActivity;
    emails?: SearchUser[];
    nameReg?: string;
    fromDate?: string;
    toDate?: string;
    activeTab?:
      | 'todas'
      | 'tarea'
      | 'llamada'
      | 'correo'
      | 'reunion'
      | 'notas'
      | 'nota';
  }>(),
  {
    activeTab: 'todas',
  }
);
const emailsOrigin = ref(props.emails ? props.emails : ([] as SearchUser[]));
const addatribute = () => {
  for (let index = 0; index < emailsOrigin.value.length; index++) {
    emailsOrigin.value[index].fullname = props.nameReg;
  }
};

//* Provide / Inject features
provide(moduleKey, props.module);
provide(idModuleKey, props.id);
//* End Provide / Inject feature

const ActiveSqeleton = ref(false);
const rangeDate = ref({
  from: !!props.fromDate
    ? moment(props.fromDate, 'DD/MM/YYYY').format('YYYY/MM/DD')
    : moment().startOf('month').format('YYYY/MM/DD'),
  to: !!props.toDate
    ? moment(props.toDate, 'DD/MM/YYYY').format('YYYY/MM/DD')
    : moment().endOf('month').format('YYYY/MM/DD'),
});

const rangeDate2 = ref({
  from2: props.fromDate || moment().startOf('month').format('DD/MM/YYYY'),
  to2: props.toDate || moment().endOf('month').format('DD/MM/YYYY'),
});
const id = ref(props.id);
const idUser = ref(props.idUser);
const getActivities = ref([] as { [key: string]: string }[]);
//const tabAct = ref('todas');
const tabAct = ref(props.activeTab || 'todas');
const hideCard = ref(true);
const hideCardCompleted = ref(true);
const emailDialog = ref();
const meetDialog = ref();
const callDialog = ref();
const taskDialog = ref();
const noteDialog = ref();
const idActivity = ref('');
const storeCall = useActivityStore();
const showConfimed = ref(false);
const activityId = ref('');
const indexAux = ref();
const typeActivity = ref('');
const taskEditDialog = ref();
const emailEditDialog = ref();
const asunto = ref('');
const localUpdateTask = ref({
  attributes: {
    modified_user_id: idUser.value,
    date_start: '',
    date_due: '',
    status: 'Completed',
  },
});
const openEmail = () => {
  emailDialog.value.open = !emailDialog.value.open;
};
const openMeet = () => {
  meetDialog.value.open = true;
};
const openCall = () => {
  callDialog.value.open = !callDialog.value.open;
};
const openTask = () => {
  taskDialog.value.open = !taskDialog.value.open;
};
const openNote = () => {
  noteDialog.value.open = !noteDialog.value.open;
};

const propsCreateAlert = {
  title: 'Alerta de confirmación',
  icon: 'person',
  iconSize: 'md',
  message: '',
  iconColor: 'primary',
  btnColor: 'primary',
  btnText: 'Si, estoy seguro',
};

const seeMore = (index: number) => {
  listAux.value[index].descripcion_truncate = listAux.value[index].descripcion;
};

const seeLess = (index: number) => {
  listAux.value[index].descripcion_truncate = listAux.value[
    index
  ].descripcion_truncate.substring(0, 100);
};

//Metodos y funciones
onMounted(async () => {
  let dateStart = moment(rangeDate.value.from).format('YYYY-MM-DD');
  let dateEnd = moment(rangeDate.value.to).format('YYYY-MM-DD');
  getActivities.value = await Get_list_Activities(id.value, dateStart, dateEnd);
  ActiveSqeleton.value = true;
  addatribute();
});

const cargaData = async () => {
  if (rangeDate.value.from != undefined) {
    let dateStart = moment(rangeDate.value.from).format('YYYY-MM-DD');
    let dateEnd = moment(rangeDate.value.to).format('YYYY-MM-DD');
    //console.log(dateStart);
    ActiveSqeleton.value = false;
    getActivities.value = await Get_list_Activities(
      id.value,
      dateStart,
      dateEnd
    );
    ActiveSqeleton.value = true;
    addatribute();
  } else {
    let dateStart = moment(JSON.stringify(rangeDate.value)).format(
      'YYYY-MM-DD'
    );
    let dateEnd = moment(JSON.stringify(rangeDate.value)).format('YYYY-MM-DD');
    //console.log(dateStart);
    ActiveSqeleton.value = false;
    getActivities.value = await Get_list_Activities(
      id.value,
      dateStart,
      dateEnd
    );
    ActiveSqeleton.value = true;
    addatribute();
  }
};

const getModuleActivities = async () => {
  let dateStart = moment(rangeDate.value.from).format('YYYY-MM-DD');
  let dateEnd = moment(rangeDate.value.to).format('YYYY-MM-DD');
  getActivities.value = await Get_list_Activities(id.value, dateStart, dateEnd);
};

const onCancelRelation = () => {
  console.log('se cancelo');
};

const formSaved = async () => {
  let dateStart = moment(rangeDate.value.from).format('YYYY-MM-DD');
  let dateEnd = moment(rangeDate.value.to).format('YYYY-MM-DD');
  getActivities.value = await Get_list_Activities(id.value, dateStart, dateEnd);
  hideCard.value = true;
  hideCardCompleted.value = true;
};

const update_status = (
  idTask: string,
  index: number,
  typeTask: 'tarea' | 'llamada' | 'reunion' | 'correo'
) => {
  showConfimed.value = true;
  activityId.value = idTask;
  indexAux.value = index;
  typeActivity.value = typeTask;
};

const updateStatusDynamic = async () => {
  console.log('datos de tarea: ', activityId, indexAux);
  switch (typeActivity.value) {
    case 'tarea':
      localUpdateTask.value.attributes.date_start =
        listAux.value[indexAux.value].fecha_inicio;
      localUpdateTask.value.attributes.date_due =
        listAux.value[indexAux.value].fecha_fin;
      const response = await api.patch(
        `${process.env.CRM4_LB_04}/tasks-update/${activityId.value}`,
        localUpdateTask.value
      );
      hideCard.value = false;
      console.log(hideCard.value);
      formSaved();
      console.log(hideCard.value);
      hideCardCompleted.value = false;
    case 'llamada':
      console.log('actualizar llamada', activityId.value);
      await storeCall.updateCallProStatus(activityId.value);
      hideCard.value = false;
      formSaved();
      hideCardCompleted.value = false;
      return;
    case 'reunion':
      console.log('actualizar reunion');
      await updateMeetingAttributesService(activityId.value, {
        date_start: listAux.value[indexAux.value].fecha_inicio,
        date_end: listAux.value[indexAux.value].fecha_fin,
        status: 'Held',
        modified_user_id: idUser.value,
      });
      hideCard.value = false;
      formSaved();
      hideCardCompleted.value = false;
      return;
    case 'correo':
      console.log('actualizar correo');
      return;
  }
};

const openActivity = (id: string, type: string, index: number) => {
  switch (type) {
    case 'reunion':
      meetDialog.value.openDialog(id);
      return;
    case 'llamada':
      callDialog.value.openDialog(id);
      return;
    case 'nota':
      noteDialog.value.openDialog(id);
      return;
    case 'tarea':
      asunto.value = listAux.value[index].asunto;
      idActivity.value = listAux.value[index].id;
      taskEditDialog.value.open = true;
      return;
    case 'correo':
      asunto.value = listAux.value[index].asunto;
      idActivity.value = listAux.value[index].id;
      emailEditDialog.value.open = true;
    default:
      break;
  }
};

const restoreDate = () => {
  rangeDate.value.from = moment(rangeDate2.value.from2, 'DD/MM/YYYY').format(
    'YYYY/MM/DD'
  );
  rangeDate.value.to = moment(rangeDate2.value.to2, 'DD/MM/YYYY').format(
    'YYYY/MM/DD'
  );
};

const DuplicateDatesAux = () => {
  if (rangeDate.value.from != undefined) {
    rangeDate2.value.from2 = moment(rangeDate.value.from).format('DD/MM/YYYY');
    rangeDate2.value.to2 = moment(rangeDate.value.to).format('DD/MM/YYYY');
    cargaData();
  } else {
    rangeDate2.value.from2 = moment(JSON.stringify(rangeDate.value)).format(
      'DD/MM/YYYY'
    );
    rangeDate2.value.to2 = moment(JSON.stringify(rangeDate.value)).format(
      'DD/MM/YYYY'
    );
    cargaData();
  }
};

const filterDates = (type: string) => {
  rangeDate.value = {
    from: moment().startOf('month').format('YYYY/MM/DD'),
    to: moment().endOf('month').format('YYYY/MM/DD'),
  };
  rangeDate2.value.from2 = moment(rangeDate.value.from).format('DD/MM/YYYY');
  rangeDate2.value.to2 = moment(rangeDate.value.to).format('DD/MM/YYYY');
  cargaData();
};

const listAux = computed(() => {
  if (tabAct.value == 'todas') {
    return getActivities.value;
  } else {
    return getActivities.value.filter(
      (objeto) =>
        objeto.tipo_actividad
          .toLowerCase()
          .indexOf(tabAct.value.toLowerCase()) > -1
    );
  }
});
</script>
<template>
  <div v-if="ActiveSqeleton">
    <div>
      <div class="q-ml-md">
        <q-card class="bg-grey-2 q-pa-md">
          <div class="row justify-between">
            <div :class="!$q.screen.xs ? 'q-gutter-sm' : ''">
              <q-btn
                round
                :color="tabAct == 'todas' ? 'blue-5' : 'grey'"
                icon="list"
                size="sm"
                @click="tabAct = 'todas'"
                :flat="tabAct == 'todas' ? false : true"
              >
                <q-badge color="blue " floating transparent>
                  {{ getActivities.length }}
                </q-badge>
                <q-tooltip class="bg-grey-8">Todas</q-tooltip>
              </q-btn>
              <q-btn
                round
                :color="tabAct == 'tarea' ? 'blue-5' : 'grey'"
                icon="task"
                size="sm"
                @click="tabAct = 'tarea'"
                :flat="tabAct == 'tarea' ? false : true"
              >
                <q-badge color="blue " floating transparent>
                  {{
                    getActivities.filter(
                      (v: any) => v.tipo_actividad === 'tarea'
                    ).length
                  }}
                </q-badge>
                <q-tooltip class="bg-grey-8">Ver solo Tareas</q-tooltip>
              </q-btn>
              <q-btn
                round
                :color="tabAct == 'llamada' ? 'blue-5' : 'grey'"
                icon="phone"
                size="sm"
                @click="tabAct = 'llamada'"
                :flat="tabAct == 'llamada' ? false : true"
              >
                <q-badge color="blue " floating transparent>
                  {{
                    getActivities.filter(
                      (v: any) => v.tipo_actividad === 'llamada'
                    ).length
                  }}
                </q-badge>
                <q-tooltip class="bg-grey-8">Ver solo Llamadas</q-tooltip>
              </q-btn>
              <q-btn
                round
                :color="tabAct == 'reunion' ? 'blue-5' : 'grey'"
                icon="alarm"
                size="sm"
                @click="tabAct = 'reunion'"
                :flat="tabAct == 'reunion' ? false : true"
              >
                <q-badge color="blue " floating transparent>
                  {{
                    getActivities.filter(
                      (v: any) => v.tipo_actividad === 'reunion'
                    ).length
                  }}
                </q-badge>
                <q-tooltip class="bg-grey-8">Ver solo Reuniónes</q-tooltip>
              </q-btn>
              <q-btn
                round
                :color="tabAct == 'correo' ? 'blue-5' : 'grey'"
                icon="email"
                size="sm"
                @click="tabAct = 'correo'"
                :flat="tabAct == 'correo' ? false : true"
              >
                <q-badge color="blue " floating transparent>
                  {{
                    getActivities.filter(
                      (v: any) => v.tipo_actividad === 'correo'
                    ).length
                  }}
                </q-badge>
                <q-tooltip class="bg-grey-8">Ver solo Email</q-tooltip>
              </q-btn>
              <q-btn
                round
                :color="tabAct == 'nota' ? 'blue-5' : 'grey'"
                icon="speaker_notes"
                size="sm"
                @click="tabAct = 'nota'"
                :flat="tabAct == 'nota' ? false : true"
              >
                <q-badge color="blue " floating transparent>
                  {{
                    getActivities.filter(
                      (v: any) => v.tipo_actividad === 'nota'
                    ).length
                  }}
                </q-badge>
                <q-tooltip class="bg-grey-8">Ver solo Notas</q-tooltip>
              </q-btn>
            </div>
            <div>
              <q-btn round color="primary" size="sm" flat>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                    persistent
                  >
                    <q-date v-model="rangeDate" range minimal>
                      <div class="row justify-center">
                        <q-btn
                          v-close-popup
                          label="Aplicar"
                          color="primary"
                          flat
                          @click="DuplicateDatesAux"
                        />
                        <q-btn
                          v-close-popup
                          label="este mes"
                          color="primary"
                          flat
                          @click="filterDates('mes')"
                        />
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="red"
                          flat
                          @click="restoreDate"
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>

                <q-tooltip class="bg-grey-8">Rango de fechas</q-tooltip>
              </q-btn>
              <q-btn-dropdown
                :dense="!$q.screen.xs ? false : true"
                :icon="!$q.screen.xs ? 'add' : 'add'"
                color="primary"
                :label="!$q.screen.xs ? 'Programar' : ''"
                size="sm"
              >
                <q-list dense>
                  <q-item clickable v-close-popup>
                    <q-item-section>
                      <q-item-label @click="openTask">Tarea</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section>
                      <q-item-label @click="openCall">Llamada</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section>
                      <q-item-label @click="openMeet">Reunion</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section>
                      <q-item-label @click="openEmail">Correo</q-item-label>
                    </q-item-section>
                  </q-item>
                  <!-- <q-item clickable v-close-popup>
                    <q-item-section>
                      <q-item-label>Whatsapp</q-item-label>
                    </q-item-section>
                  </q-item> -->
                  <q-item clickable v-close-popup>
                    <q-item-section>
                      <q-item-label @click="openNote">Nota</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </div>
        </q-card>
      </div>

      <div class="q-gutter-y-md" v-if="getActivities.length > 0">
        <!-- <q-scroll-area
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      style="height: 65vh;"
    > -->
        <q-scroll-area style="height: 65vh">
          <div class="q-ml-md">
            <q-timeline color="blue-3">
              <div>
                <div class="column items-center">
                  <!-- <q-chip v-if="rangeDate.from != null || rangeDate.from != ''" square color="orange-5" text-color="white" size="sm">{{  (moment(rangeDate.from).format('DD/MM/YYYY')) }} hasta {{(moment(rangeDate.to).format('DD/MM/YYYY'))}}</q-chip>
                  <q-chip v-else square color="orange-5" text-color="white" size="sm">- hasta -</q-chip>  -->

                  <span class="text-primary"
                    >Actividades desde
                    <span class="text-red">{{ rangeDate2.from2 }}</span> hasta
                    <span class="text-red">{{ rangeDate2.to2 }}</span></span
                  >
                </div>
                <div class="col-12">
                  <q-chip square color="blue-5" text-color="white" size="sm">
                    Actividades por hacer
                  </q-chip>
                  <q-chip square color="blue-5" text-color="white" size="sm">
                    {{
                      listAux.filter(
                        (v: any) =>
                          v.estado === 'Planificada' ||
                          v.estado == 'No iniciada' ||
                          v.estado == 'En progreso'
                      ).length
                    }}
                  </q-chip>

                  <q-separator color="blue-4" inset />
                </div>
              </div>
              <template
                v-if="getActivities.filter((v:any) => v.estado === 'Planificada' || v.estado == 'No iniciada' || v.estado == 'En progreso').length<=0"
              >
                <div>
                  <q-timeline-entry icon="priority_high">
                    <template v-slot:title>
                      <q-card>
                        <q-item bordered separator>
                          <q-item-section style="padding: 0px" class="q-mr-lg">
                            <q-item-label class="text-black">
                              Programa una nueva actividad
                              <q-btn
                                round
                                color="grey"
                                icon="task"
                                size="sm"
                                @click="openTask"
                                flat
                              >
                                <q-tooltip class="bg-grey-8">Tarea</q-tooltip>
                              </q-btn>
                              <q-btn
                                round
                                color="grey"
                                icon="phone"
                                size="sm"
                                @click="openCall"
                                flat
                              >
                                <q-tooltip class="bg-grey-8">Llamada</q-tooltip>
                              </q-btn>
                              <q-btn
                                round
                                color="grey"
                                icon="alarm"
                                size="sm"
                                @click="openMeet"
                                flat
                              >
                                <q-tooltip class="bg-grey-8">Reunión</q-tooltip>
                              </q-btn>
                              <q-btn
                                round
                                color="grey"
                                icon="email"
                                size="sm"
                                flat
                                @click="openEmail"
                              >
                                <q-tooltip class="bg-grey-8">Email</q-tooltip>
                              </q-btn>
                              <q-btn
                                round
                                color="grey"
                                icon="speaker_notes"
                                size="sm"
                                flat
                                @click="openNote"
                              >
                                <q-tooltip class="bg-grey-8">Nota</q-tooltip>
                              </q-btn>
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-card>
                    </template>
                  </q-timeline-entry>
                </div>
              </template>
              <template v-else v-for="(reg, index) in listAux" :key="index">
                <q-timeline-entry
                  :icon="
                    reg.tipo_actividad == 'tarea'
                      ? 'task'
                      : reg.tipo_actividad == 'llamada'
                      ? 'phone'
                      : reg.tipo_actividad == 'reunion'
                      ? 'alarm'
                      : reg.tipo_actividad == 'correo'
                      ? 'email'
                      : reg.tipo_actividad == 'nota'
                      ? 'speaker_notes'
                      : ''
                  "
                  color="blue-3"
                  text-color="white"
                  v-if="
                    reg.estado == 'Planificada' ||
                    reg.estado == 'No iniciada' ||
                    reg.estado == 'En progreso'
                  "
                >
                  <template v-slot:title>
                    <transition
                      :appear="hideCard == true ? true : false"
                      :enter-active-class="
                        hideCard == true ? ' animated fadeOutDown ' : ''
                      "
                    >
                      <q-card
                        class="bg-grey-1 app-search__result"
                        v-show="hideCard"
                      >
                        <q-item bordered separator>
                          <!-- <q-item-section avatar>
                        <q-btn  round color="blue" class="shadow-5" text-color="white" size="md" icon="check"
                          @click="updateStatus(reg.id)">
                          <q-tooltip class="bg-black" anchor="top middle" self="bottom middle" :offset="[10, 10]">Marcar
                            la tarea como completada</q-tooltip>
                        </q-btn>
                      </q-item-section> -->
                          <q-item-section
                            style="padding: 0px"
                            class="q-mr-lg"
                            @click="
                              openActivity(reg.id, reg.tipo_actividad, index)
                            "
                          >
                            <q-item-label>
                              <span
                                :class="
                                  reg.control_vencimiento > '0' &&
                                  (reg.estado == 'No iniciada' ||
                                    reg.estado == 'Planificada')
                                    ? 'text-red-4'
                                    : '  '
                                "
                                >{{ reg.fecha_ini_fin }}
                              </span>
                              <q-icon
                                name="chevron_right"
                                color="grey-4"
                                size="xs"
                              />
                              <q-chip color="blue" text-color="white" size="xs">
                                <span class="text-capitalize"
                                  >{{ reg.tipo_actividad }}
                                </span>
                              </q-chip>

                              <q-chip
                                :color="
                                  reg.estado == 'Planificada'
                                    ? 'grey-6'
                                    : reg.estado == 'No iniciada'
                                    ? 'grey-6'
                                    : reg.estado == 'En progreso'
                                    ? 'orange-4'
                                    : reg.estado == 'Aplazada'
                                    ? 'red-4'
                                    : reg.estado == 'No Realizada'
                                    ? 'red-4'
                                    : ''
                                "
                                :icon="
                                  reg.estado == 'Planificada'
                                    ? 'alarm_on'
                                    : reg.estado == 'No iniciada'
                                    ? 'alarm_on'
                                    : reg.estado == 'En progreso'
                                    ? 'timelapse'
                                    : reg.estado == 'Aplazada'
                                    ? 'close'
                                    : reg.estado == 'No Realizada'
                                    ? 'close'
                                    : ''
                                "
                                text-color="white"
                                size="xs"
                              >
                                {{ reg.estado }}
                              </q-chip>
                            </q-item-label>
                            <q-item-label class="text-blue-10">
                              {{ reg.asunto }}
                            </q-item-label>
                            <q-item-label
                              v-if="
                                reg.descripcion.length > 200 &&
                                reg.descripcion_truncate.length < 200
                              "
                            >
                              <span class="text-black">
                                {{ reg.descripcion_truncate }}...
                              </span>
                              <q-btn
                                class="q-ml-xs"
                                size="xs"
                                flat
                                text-color="blue"
                                dense
                                @click="seeMore(index)"
                                v-if="reg.descripcion_truncate.length < 200"
                                >ver Mas...</q-btn
                              >
                            </q-item-label>
                            <q-item-label v-else>
                              <span class="text-black">
                                {{ reg.descripcion_truncate }}
                              </span>
                              <q-btn
                                class="q-ml-xs"
                                size="xs"
                                flat
                                text-color="blue"
                                dense
                                @click="seeLess(index)"
                                v-if="reg.descripcion_truncate.length > 200"
                                >...ver Menos</q-btn
                              >
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side top>
                            <q-item-label caption>
                              <q-btn
                                dense
                                outline
                                icon="more_vert"
                                size="xs"
                                color="primary"
                                flat
                                @click="(event:Event)=>event.stopPropagation()"
                              >
                                <q-menu>
                                  <q-list dense>
                                    <q-item clickable v-close-popup>
                                      <q-item-section
                                        @click="
                                          openActivity(
                                            reg.id,
                                            reg.tipo_actividad,
                                            index
                                          )
                                        "
                                        >Detalle</q-item-section
                                      >
                                    </q-item>
                                    <q-separator />
                                  </q-list>
                                </q-menu>
                              </q-btn>
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-separator inset></q-separator>
                        <div class="row justify-between q-pa-xs">
                          <!-- <pre>{{ reg }}</pre> -->
                          <q-btn
                            color="blue"
                            size="xs"
                            label="marcar como completado"
                            @click="
                              update_status(
                                reg.id,
                                index,
                                reg.tipo_actividad as
                                  | 'tarea'
                                  | 'llamada'
                                  | 'reunion'
                                  | 'correo'
                              )
                            "
                          >
                            <!-- <q-tooltip
                              class="bg-primary"
                              anchor="top middle"
                              self="bottom middle"
                              :offset="[10, 10]"
                              >La tarea pasara como completada</q-tooltip
                            > -->
                          </q-btn>
                          <span class="text-grey-7"
                            ><q-icon
                              name="person"
                              color="primary"
                              size="15px"
                            />
                            {{ reg.asignado }}
                          </span>
                        </div>
                      </q-card>
                    </transition>
                  </template>
                </q-timeline-entry>
              </template>
              <div class="row items-center">
                <div class="col-12">
                  <q-chip square color="green" text-color="white" size="sm">
                    Actividades realizadas
                  </q-chip>
                  <q-chip square color="green" text-color="white" size="sm">
                    {{
                      listAux.filter(
                        (v: any) =>
                          v.estado !== 'Planificada' &&
                          v.estado !== 'No iniciada' &&
                          v.estado !== 'En progreso'
                      ).length
                    }}
                  </q-chip>
                  <q-separator color="green-2" inset />
                </div>
              </div>

              <div>
                <template v-for="(reg, index) in listAux" :key="index">
                  <q-timeline-entry
                    :icon="
                      reg.tipo_actividad == 'tarea'
                        ? 'task'
                        : reg.tipo_actividad == 'llamada'
                        ? 'phone'
                        : reg.tipo_actividad == 'reunion'
                        ? 'alarm'
                        : reg.tipo_actividad == 'correo'
                        ? 'email'
                        : reg.tipo_actividad == 'nota'
                        ? 'speaker_notes'
                        : ''
                    "
                    color="green-3"
                    text-color="white"
                    v-if="
                      reg.estado !== 'Planificada' &&
                      reg.estado !== 'No iniciada' &&
                      reg.estado !== 'En progreso'
                    "
                  >
                    <template v-slot:title>
                      <transition
                        :appear="hideCardCompleted == true ? true : false"
                        :enter-active-class="
                          hideCardCompleted == true ? 'animated fadeInDown' : ''
                        "
                      >
                        <q-card
                          v-show="hideCardCompleted"
                          class="app-search__result2"
                          @click="
                            openActivity(reg.id, reg.tipo_actividad, index)
                          "
                        >
                          <q-item bordered separator>
                            <q-item-section style="padding: 0px">
                              <q-item-label>
                                <span
                                  :class="
                                    reg.control_vencimiento > '0' &&
                                    (reg.estado == 'No iniciada' ||
                                      reg.estado == 'Planificada')
                                      ? 'text-red-4'
                                      : '  '
                                  "
                                  >{{ reg.fecha_ini_fin }}
                                </span>
                                <q-icon
                                  name="chevron_right"
                                  color="grey-4"
                                  size="xs"
                                />
                                <q-chip
                                  color="blue
                        "
                                  text-color="white"
                                  size="xs"
                                >
                                  <span class="text-capitalize"
                                    >{{ reg.tipo_actividad }}
                                  </span>
                                </q-chip>
                                <q-chip
                                  v-if="reg.tipo_actividad != 'nota'"
                                  :color="
                                    reg.estado == 'Enviado'
                                      ? 'green'
                                      : reg.estado == 'Realizada'
                                      ? 'green-5'
                                      : reg.estado == 'Completado'
                                      ? 'green-5'
                                      : reg.estado == 'Planificada'
                                      ? 'grey-6'
                                      : reg.estado == 'No iniciada'
                                      ? 'grey-6'
                                      : reg.estado == 'En progreso'
                                      ? 'orange-4'
                                      : reg.estado == 'Aplazada'
                                      ? 'red-4'
                                      : reg.estado == 'No Realizada'
                                      ? 'red-4'
                                      : ''
                                  "
                                  :icon="
                                    reg.estado == 'Enviado'
                                      ? 'check'
                                      : reg.estado == 'Realizada'
                                      ? 'check'
                                      : reg.estado == 'Completado'
                                      ? 'check'
                                      : reg.estado == 'Planificada'
                                      ? 'alarm_on'
                                      : reg.estado == 'No iniciada'
                                      ? 'alarm_on'
                                      : reg.estado == 'En progreso'
                                      ? 'timelapse'
                                      : reg.estado == 'Aplazada'
                                      ? 'close'
                                      : reg.estado == 'No Realizada'
                                      ? 'close'
                                      : ''
                                  "
                                  text-color="white"
                                  size="xs"
                                >
                                  {{ reg.estado }}
                                </q-chip>
                              </q-item-label>

                              <q-item-label class="text-blue-10"
                                >{{ reg.asunto }}
                              </q-item-label>
                              <q-item-label
                                v-if="
                                  reg.descripcion.length > 200 &&
                                  reg.descripcion_truncate.length < 200
                                "
                              >
                                <span class="text-black">
                                  {{ reg.descripcion_truncate }}...
                                </span>
                                <q-btn
                                  class="q-ml-xs"
                                  size="xs"
                                  color="primary"
                                  flat
                                  text-color="blue"
                                  @click="seeMore(index)"
                                  v-if="reg.descripcion_truncate.length < 200"
                                  >ver Mas...</q-btn
                                >
                              </q-item-label>
                              <q-item-label v-else>
                                <span class="text-black">
                                  {{ reg.descripcion_truncate }}
                                </span>
                                <q-btn
                                  class="q-ml-xs"
                                  size="xs"
                                  color="primary"
                                  flat
                                  text-color="blue"
                                  @click="seeLess(index)"
                                  v-if="reg.descripcion_truncate.length > 200"
                                  >...ver Menos</q-btn
                                >
                              </q-item-label>
                            </q-item-section>
                            <q-item-section side top>
                              <q-item-label caption>
                                <q-btn
                                  dense
                                  outline
                                  icon="more_vert"
                                  size="xs"
                                  color="primary"
                                  flat
                                  @click="(event:Event)=>event.stopPropagation()"
                                  ><q-menu dense>
                                    <q-list dense>
                                      <q-item clickable v-close-popup>
                                        <q-item-section
                                          @click="
                                            openActivity(
                                              reg.id,
                                              reg.tipo_actividad,
                                              index
                                            )
                                          "
                                          >Detalle</q-item-section
                                        >
                                      </q-item>
                                      <q-separator />
                                    </q-list> </q-menu
                                ></q-btn>
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-separator inset></q-separator>
                          <div class="column items-end q-mr-lg">
                            <span class="text-grey-7"
                              ><q-icon
                                name="person"
                                color="primary"
                                size="15px"
                              />
                              {{ reg.asignado }}
                            </span>
                          </div>
                        </q-card>
                      </transition>
                    </template>
                  </q-timeline-entry>
                </template>
              </div>
            </q-timeline>
          </div>
        </q-scroll-area>
      </div>

      <div class="q-gutter-y-md" v-else>
        <div class="column no-wrap flex-center">
          <!-- <q-icon name="person_add_disabled" size="56px" /> -->
          <div class="q-mt-md text-center">
            <p>No se encontraron</p>
            <p>
              actividades entre fechas
              <span
                ><span class="text-red">{{ rangeDate2.from2 }}</span> hasta
                <span class="text-red">{{ rangeDate2.to2 }}</span></span
              >
            </p>
            <div class="q-pa-md q-gutter-sm">
              <q-btn round color="teal" icon="task" @click="openTask">
                <q-tooltip class="bg-grey-8">Programar tarea</q-tooltip>
              </q-btn>
              <q-btn round color="light-blue" icon="phone" @click="openCall">
                <q-tooltip class="bg-grey-8">Programar llamada</q-tooltip>
              </q-btn>
              <q-btn round color="cyan-6" icon="alarm" @click="openMeet">
                <q-tooltip class="bg-grey-8">Programar reunión</q-tooltip>
              </q-btn>
              <q-btn round color="blue-10" icon="email" @click="openEmail">
                <q-tooltip class="bg-grey-8">Programar email</q-tooltip>
              </q-btn>
              <!-- <q-btn round color="green-5" icon="whatsapp">
                <q-tooltip class="bg-grey-8">Programar whatsapp</q-tooltip>
              </q-btn> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <q-card style="height: 60vh; width: 100%">
      <q-skeleton height="50px" square class="bg-grey-5 text-white" />
      <q-card-section>
        <q-skeleton type="QBtn" width="20%" class="text-subtitle1" />
      </q-card-section>
      <q-markup-table>
        <thead>
          <tr>
            <th class="text-left">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="n in 7" :key="n">
            <td class="text-left">
              <q-skeleton animation="blink" type="text" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card>
  </div>

  <AlertComponent
    v-model="showConfimed"
    v-bind="propsCreateAlert"
    @confirm="updateStatusDynamic"
    @denegate="onCancelRelation"
  >
    <template #body>
      <span> Esta seguro de completar la actividad? </span>
    </template>
  </AlertComponent>
  <EmailsActivitieDialog
    ref="emailDialog"
    :idModule="id"
    @form-saved="formSaved"
    :guests="emailsOrigin"
    :module="module"
  />
  <MeetsActivitieDialog ref="meetDialog" @saved="getModuleActivities" />
  <CallsActivitieDialog
    ref="callDialog"
    :idModule="id"
    :ModuleType="props.module"
    @form-saved="formSaved"
  />
  <TasksActivitieDialog
    ref="taskDialog"
    :idModule="id"
    @form-saved="formSaved"
    :module="module"
  />
  <InfoCard
    ref="taskEditDialog"
    :asunto="asunto"
    :idActivity="idActivity"
    @form-saved="formSaved"
  />
  <InfoCardEmails
    ref="emailEditDialog"
    :asunto="asunto"
    :idActivity="idActivity"
    @form-saved="formSaved"
  />
  <NoteActivitieDialog
    ref="noteDialog"
    :idModule="id"
    :ModuleType="props.module"
    @form-saved="formSaved"
  />
</template>
<style lang="sass">
.my-menu-link
  color: white
  background: #F2C037

.q-timeline__title
  font-size: 0.75rem
  color:#96A3B0

.q-timeline__content
  padding-bottom: 0px

.q-timeline__title
  margin-top: 0
  margin-bottom: 5px

.q-timeline__entry--icon .q-timeline__subtitle
  padding-top: 0px

.app-search__result
  margin: 0px 0px 0px 0
  padding: 0px 0px 0px 0px
  border: 1px solid rgba(0,0,0,.12)
  border-left: 2px solid #00B4FF

.app-search__result2
  margin: 0px 0px 0px 0
  padding: 0px 0px 0px 0px
  border: 1px solid rgba(0,0,0,.12)
  border-left: 2px solid #5BBB0B
</style>
