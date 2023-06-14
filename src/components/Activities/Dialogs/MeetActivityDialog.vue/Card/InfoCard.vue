<script lang="ts" setup>
import { ref, inject, watch, onMounted, Ref } from 'vue';
import { InfoDataMeetingModel } from 'src/components/types/index';
import moment from 'moment';
import humanize from 'humanize-duration';
import { userStore } from 'src/modules/Users/store/UserStore';
import { QInput } from 'quasar';
import {
  moduleKey,
  idModuleKey,
  reactiveModuleIdKey,
  reactiveModuleNameKey,
} from '../../../ProvideKeys';
import { useAsyncState } from '@vueuse/core';
import { getRecordInfo } from 'src/services/MeetingsServices';
import { useActivity } from 'src/composables/core';
import { useQuasar } from 'quasar';

const props = withDefaults(
  defineProps<{
    data?: InfoDataMeetingModel;
    //infoModule: { module: string; idModule: string; nameModule: string };
    module: string;
    idModule: string;
    nameModule: string;
    readonlyFields?: boolean;
  }>(),
  {
    readonlyFields: false,
  }
);

// const emits = defineEmits<{
//   (events: 'submit'): void;
// }>();

//* Provide Inject feature
const currentModule = ref(
  inject<string>(moduleKey) || inject<Ref<string>>(reactiveModuleNameKey)?.value
);

const currentIdModule = ref(
  inject<string>(idModuleKey) || inject<Ref<string>>(reactiveModuleIdKey)?.value
);
//* Provide Inject feature

//* Store/Composables
const user = userStore();
const { hours } = useActivity();
const $q = useQuasar();

//* Variables
const durationSeconds = ref(
  props.data
    ? moment
        .duration(props.data.duration_hours, 'hours')
        .add(props.data.duration_minutes, 'minutes')
        .asSeconds()
        .toString()
    : '1800'
);
const dateStart = ref(
  props.data
    ? moment(props.data?.date_start, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY')
    : moment().format('DD/MM/YYYY')
);
const timeStart = ref(
  props.data
    ? moment(props.data?.date_start, 'DD/MM/YYYY HH:mm').format('HH:mm')
    : moment().add(5, 'minutes').format('HH:mm')
);
console.log(props.data?.date_start);
const dateEnd = ref(
  props.data
    ? moment(props.data?.date_start, 'DD/MM/YYYY HH:mm')
        .add(durationSeconds.value, 'seconds')
        .format('DD/MM/YYYY')
    : moment(dateStart.value, 'DD/MM/YYYY')
        .add(durationSeconds.value, 'seconds')
        .format('DD/MM/YYYY')
);
const timeEnd = ref(
  props.data && props.data.date_start && durationSeconds.value
    ? moment(props.data?.date_start, 'DD/MM/YYYY HH:mm')
        .add(durationSeconds.value, 'seconds')
        .format('HH:mm')
    : moment().add(durationSeconds.value, 'seconds').format('HH:mm')
);

// variable for maps and location
// const latitude = ref(0);
// const longitude = ref(0);
// const directionAutoValue = ref('');
// const locationMeet = computed({
//   get() {
//     return directionAutoValue.value;
//     //return '';
//   },
//   set(val: { label: string; y: number; x: number } | string) {
//     if (typeof val === 'object') {
//       directionAutoValue.value = val.label;
//       latitude.value = val.y;
//       longitude.value = val.x;
//       return val.label;
//     }
//   },
// });

const infoData = ref<InfoDataMeetingModel>(
  !props.data ? setDefaultData() : (props.data as InfoDataMeetingModel)
);

//* reference variables
const subjectInputRef = ref<InstanceType<typeof QInput> | null>(null);
const dateStartInputRef = ref<InstanceType<typeof QInput> | null>(null);
const dateEndInputRef = ref<InstanceType<typeof QInput> | null>(null);
const timeStartInputRef = ref<InstanceType<typeof QInput> | null>(null);
const timeEndInputRef = ref<InstanceType<typeof QInput> | null>(null);

//* dummy data
const parentOptions = [
  { label: 'Cuenta', value: 'Accounts' },
  { label: 'Contacto', value: 'Contacts' },
  { label: 'Tarea', value: 'Tasks' },
  { label: 'Oportunidad', value: 'Opportunities' },
  { label: 'Incidencia', value: 'Bugs' },
  { label: 'Caso', value: 'Cases' },
  { label: 'Prospecto', value: 'Leads' },
  { label: 'Proyecto', value: 'Project' },
  { label: 'Tarea de proyecto', value: 'ProjectTask' },
  { label: 'Publico Objetivo', value: 'Prospects' },
  { label: 'Producto', value: 'AOS_Products' },
  { label: 'Visitas*', value: 'HANA_Visitas' },
  { label: 'Acciones', value: 'HANT_Acciones' },
  { label: 'Solucion', value: 'HANT_Solucion' },
  { label: 'Citas', value: 'HANC_Citas' },
  { label: 'Adendas', value: 'HAND_Adendas' },
  { label: 'Cartera en Mora', value: 'HANM_CarteraMora' },
  { label: 'Lead', value: 'HANO_Lead' },
  { label: 'Proveedores', value: 'HANP_Proveedores' },
  { label: 'Servicio Tecnico', value: 'HANS_CallCenterST' },
  { label: 'Ordenes de Trabajo', value: 'HANIN_OrdenesTrabajo' },
  { label: 'Visita', value: 'HANIN_Visita' },
  { label: 'OT', value: 'HANST_OT' },
  { label: 'Quejas', value: 'HANT_Quejas' },
  { label: 'Orden de trato al cliente', value: 'HANT_OTC' },
  { label: 'Recepciones', value: 'HANR_Recepciones' },
  { label: 'Cartera total', value: 'HANCT_CarpetaTotal' },
];
const statusOptions = [
  { label: 'Planificada', value: 'Planned' },
  { label: 'Realizada', value: 'Held' },
  { label: 'No realizada', value: 'Not Held' },
];
const durationOptions = ref([
  {
    label: 'Ninguna',
    value: '',
  },
  {
    label: '15 minutos',
    value: '900',
  },
  {
    label: '30 minutos',
    value: '1800',
  },
  {
    label: '45 minutos',
    value: '2700',
  },
  {
    label: '1 hora',
    value: '3600',
  },
  {
    label: '1.5 horas',
    value: '5400',
  },
  {
    label: '2 horas',
    value: '7200',
  },
  {
    label: '3 horas',
    value: '10800',
  },
  {
    label: '6 horas',
    value: '21600',
  },
  {
    label: '1 dia',
    value: '86400',
  },
  {
    label: '2 dias',
    value: '172800',
  },
  {
    label: '3 dias',
    value: '259200',
  },
  {
    label: '1 semana',
    value: '604800',
  },
]);
//* end dummy data

//* methods
function setDefaultData(): InfoDataMeetingModel {
  //TODO Asignar description (o no) y assigned_user_id
  return {
    status: 'Planned',
    parent_type: currentModule.value || props.module || '',
    date_start: `${dateStart.value} ${timeStart.value}`,
    created_by: user.userCRM.id,
    modified_user_id: user.userCRM.id,
    parent_id: currentIdModule.value || props.idModule || '',
  } as InfoDataMeetingModel;
}

const formatHoursMinutes = () => {
  const formattedTime = moment
    .utc(+durationSeconds.value * 1000)
    .format('HH:mm');
  infoData.value.duration_minutes = formattedTime.split(':')[1];
  if (+durationSeconds.value < 86400) {
    infoData.value.duration_hours = formattedTime.split(':')[0];
    return;
  }
  infoData.value.duration_hours = Math.round(
    moment.duration(durationSeconds.value, 'second').asHours()
  ).toString();
};

const formatStartTime = (): void => {
  infoData.value.date_start = `${dateStart.value} ${timeStart.value}`;
  formatHoursMinutes();
};

const updateDuration = (value: string): void => {
  const data = moment(
    `${dateStart.value} ${timeStart.value}`,
    'DD/MM/YYYY HH:mm'
  )
    .add(value, 'seconds')
    .format('DD/MM/YYYY HH:mm');
  dateEnd.value = data.split(' ')[0];
  timeEnd.value = data.split(' ')[1];
};

const updateDurationCustom = (): void => {
  const durationInSeconds = moment(
    `${dateEnd.value} ${timeEnd.value}`,
    'DD/MM/YYYY HH:mm'
  )
    .diff(
      moment(`${dateStart.value} ${timeStart.value}`, 'DD/MM/YYYY HH:mm'),
      'seconds'
    )
    .toString();
  const newDuration = {
    label: humanize(+durationInSeconds * 1000, { language: 'es' }),
    value: durationInSeconds,
  };
  durationOptions.value.push(newDuration);
  durationSeconds.value = durationInSeconds;
};

watch([dateStart, timeStart], () => {
  formatStartTime();
});

watch(durationSeconds, () => {
  formatHoursMinutes();
});

const { state: recordOption, isLoading } = useAsyncState(async () => {
  if (!!currentIdModule.value && !!currentModule.value) {
    const response = await getRecordInfo(
      infoData.value.parent_type,
      currentIdModule.value
    );
    return [{ id: response.id, fullName: response.full_name || response.name }];
  }
  return [];
}, []);

// const isDateValid = (val: string) => {
//   const areDatesValid = moment(
//     `${dateEnd.value} ${timeEnd.value}`,
//     'DD/MM/YYYY: HH:mm'
//   ).isSameOrAfter(
//     moment(`${dateStart.value} ${timeStart.value}`, 'DD/MM/YYYY HH:mm')
//   );
//   return areDatesValid;
// };

const validateInputs = async (): Promise<boolean | undefined> => {
  if (+durationSeconds.value < 0) {
    $q.notify({
      type: 'warning',
      message: 'Fechas Inválidas',
      caption: 'La fechas no son validas',
    });
    return;
  }
  return (
    await Promise.all([
      subjectInputRef.value?.validate(),
      dateStartInputRef.value?.validate(),
      dateEndInputRef.value?.validate(),
      timeStartInputRef.value?.validate(),
      timeEndInputRef.value?.validate(),
    ])
  ).every((input) => !!input);
};

const exposeData = () => {
  return infoData.value;
};

onMounted(() => {
  if (!props.data) formatStartTime();
  else {
    formatHoursMinutes();
    updateDurationCustom();
  }
});

defineExpose({
  validateInputs,
  exposeData,
});
</script>
<template>
  <q-card flat class="q-ml-none" style="width: -webkit-fill-available">
    <q-card-section class="row q-gutter-y-md q-mt-none formMeeting">
      <q-input
        :readonly="readonlyFields"
        class="q-pb-sm q-mt-none"
        ref="subjectInputRef"
        outlined
        dense
        v-model="infoData.name"
        type="text"
        label="Asunto"
        @keyup.enter="$emit('submit')"
        :rules="[(val) => !!val || 'El campo no debe de estar vacio']"
      >
        <template #before>
          <q-icon name="subject" />
        </template>
      </q-input>
      <q-input
        :readonly="readonlyFields"
        outlined
        dense
        v-model="infoData.location"
        type="text"
        @keyup.enter="$emit('submit')"
        label="Ubicación"
      >
        <template #before>
          <q-icon name="location_on" />
        </template>
      </q-input>
      <q-separator inset />
      <q-select
        :readonly="readonlyFields"
        outlined
        dense
        v-model="durationSeconds"
        option-value="value"
        option-label="label"
        emit-value
        map-options
        :options="durationOptions"
        type="text"
        label="Duracion"
        @update:model-value="updateDuration"
      >
        <template #before>
          <q-icon name="timer" />
        </template>
      </q-select>
      <div class="row q-col-gutter-sm">
        <q-input
          :readonly="readonlyFields"
          ref="dateStartInputRef"
          dense
          class="col-12 col-md-6 q-pb-xs"
          outlined
          v-model="dateStart"
          label="Fecha inicio"
          @update:model-value="updateDurationCustom"
          :rules="[(val) => !!val || 'El campo no debe de estar vacio']"
        >
          <template #before>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="dateStart" mask="DD/MM/YYYY">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-select
          :readonly="readonlyFields"
          class="col-12 col-md-6 q-pb-xs"
          outlined
          ref="timeStartInputRef"
          hide-dropdown-icon
          dense
          v-model="timeStart"
          :options="hours"
          label="Hora inicio"
          @update:model-value="updateDurationCustom"
          :rules="[(val) => !!val || 'El campo no debe de estar vacio']"
        >
          <template v-if="$q.screen.lt.md" #before>
            <q-icon name="watch" />
          </template>
          <template v-if="!$q.screen.lt.md" v-slot:append>
            <q-icon name="schedule" />
          </template>
        </q-select>
      </div>

      <div class="row q-col-gutter-sm q-mt-sm">
        <q-input
          :readonly="readonlyFields"
          ref="dateEndInputRef"
          dense
          class="col-12 col-md-6 q-pb-xs"
          outlined
          v-model="dateEnd"
          label="Fecha Fin"
          @update:model-value="updateDurationCustom"
          :rules="[(val) => !!val || 'El campo no debe de estar vacio']"
        >
          <template #before>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="dateEnd"
                  @update:model-value="updateDurationCustom"
                  mask="DD/MM/YYYY"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-select
          :readonly="readonlyFields"
          class="col-12 col-md-6 q-pb-xs"
          ref="timeEndInputRef"
          outlined
          hide-dropdown-icon
          dense
          v-model="timeEnd"
          :options="hours"
          label="Hora Fin"
          @update:model-value="updateDurationCustom"
          :rules="[(val) => !!val || 'El campo no debe de estar vacio']"
        >
          <template v-if="$q.screen.lt.md" #before>
            <q-icon name="watch" />
          </template>
          <template v-if="!$q.screen.lt.md" v-slot:append>
            <q-icon name="schedule" />
          </template>
        </q-select>
      </div>
      <q-separator inset />
      <q-select
        :readonly="readonlyFields"
        outlined
        dense
        option-value="value"
        option-label="label"
        emit-value
        map-options
        v-model="infoData.status"
        :options="statusOptions"
        label="Estado"
        ><template #before>
          <q-icon name="model_training" />
        </template>
      </q-select>
      <!-- <div class="row q-col-gutter-sm">
        <q-select
          dense
          class="col-12 col-md-4"
          v-model="infoData.parent_type"
          :options="parentOptions"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          :readonly="!!currentModule"
          label="Relacionado con"
          outlined
        >
          <template #before> <q-icon name="person_pin" /> </template>
        </q-select>
        <q-select
          dense
          class="col-12 col-md-8"
          v-model="infoData.parent_id"
          :options="recordOption"
          :loading="isLoading"
          option-value="id"
          option-label="fullName"
          label="Registro Asignado"
          map-options
          hide-dropdown-icon
          :readonly="!!currentModule"
          emit-value
          outlined
        >
          <template v-if="$q.screen.lt.md" #before>
            <q-icon name="person" /> </template
        ></q-select>
      </div> -->
      <q-input
        :readonly="readonlyFields"
        outlined
        dense
        v-model="infoData.description"
        type="textarea"
        label="Descripcion"
      >
        <template #before><q-icon name="description" /></template>
      </q-input>
    </q-card-section>
  </q-card>
</template>

<style lang="scss" scoped>
.formMeeting > * {
  width: -webkit-fill-available;
  max-width: 90vw;
}
</style>
