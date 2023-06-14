<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import moment from 'moment';
import { useActivityStore } from 'src/stores/ActivityStore';
import { useActivity } from 'src/composables/core';
import { Attributes } from '../../../modules/Prospects/utils/types';

const storeCall = useActivityStore();
const { hours } = useActivity();

const props = defineProps<{
  durationselect?: boolean;
  data?: any;
  bloquear?: boolean;
  idCard?: string;
}>();

const data = ref({
  fechainicio: '',
  horainicio: '',
  duracion: '',
  duracion2: {
    label: '15 minutos',
    valormin: '00:15',
  },
  fechafin: '',
  horafin: '',
});
const dataSend = ref({
  datestart: '',
  duracionhora: '',
  duracionminuto: '',
  dateend: '',
});
const dataleer = ref({
  fechainicio: '',
  horainicio: '',
  duracion: '',
  duracion2: {
    label: '15 minutos',
    valormin: '00:15',
  },
  fechafin: '',
  horafin: '',
});
const aux1 = ref();
const aux2 = ref();
// type llenado = {
//   dateestartCall: 'YYYY-MM-DD HH:mm:ss';
// };
const llenado = ref();
// const localDate = ref<any>({
//   data1: props.data.asunto,
// });

onMounted(async () => {
  if (!props.idCard) {
    datosPredi();
    duracionHoras();
    separandoDuracion();
  } else {
    datosPredi2();
    duracionHoras2();
    separandoDuracion2();
  }
});

watch(
  () => data.value.duracion2,
  async () => {
    if (data.value.duracion2.valormin == 'ingresar') {
      data.value.duracion = moment().format('01:00');
    }
    duracionHoras();
    separandoDuracion();
  }
);
watch(
  () =>
    dataleer.value.horainicio +
    dataleer.value.duracion +
    dataleer.value.fechainicio,
  async () => {
    duracionHoras2();
    separandoDuracion2();
  }
);
watch(
  () => data.value.horainicio + data.value.duracion + data.value.fechainicio,
  async () => {
    duracionHoras();
    separandoDuracion();
  }
);

// datos de entrada al cargar
const datosPredi = () => {
  data.value.fechainicio = moment().format('YYYY-MM-DD');
  data.value.fechafin = moment().format('YYYY-MM-DD');
  // data.value.horainicio = moment().format('HH:mm');
  data.value.horafin = moment().format('HH:mm');
  redondear();
  // data.value.duracion = moment().add(3, 'minutes').format('HH:mm');
};

// para calcular la duracion una segunda opcion----------------------------
// const calculandoDuracionSum = () => {
//   var b, hora1, hora2, t1, t2;
//   console.log(data.value.duracion);
//   if (data.value.duracion2.valormin == 'ingresar') {
//     b = data.value.duracion;
//   } else {
//     data.value.duracion = data.value.duracion2.valormin;
//     b = data.value.duracion2.valormin;
//   }
//   const a = data.value.horainicio;
//   hora1 = a.split(':');
//   hora2 = b.split(':');
//   t1 = new Date();
//   t2 = new Date();
//   t1.setHours(parseInt(hora1[0]), parseInt(hora1[1]));
//   t2.setHours(parseInt(hora2[0]), parseInt(hora2[1]));
//   //sumando el tiempo
//   t1.setHours(t1.getHours() + t2.getHours(), t1.getMinutes() + t2.getMinutes());
//   dataSend.value.duracionhora = t1.getHours().toString();
//   dataSend.value.duracionminuto = t1.getMinutes().toString();
//   data.value.horafin =
//     (t1.getHours() < 10 ? '0' : '') +
//     t1.getHours() +
//     ':' +
//     (t1.getMinutes() < 10 ? '0' : '') +
//     t1.getMinutes();
// };

// para el select duracion una segunda opcion------------------------------
// const selectDuracion = () => {
//   const bbn = data.value.duracion2;
//   var tuya = bbn.valormin;
//   var hora1, hora2, t1, t2;
//   hora1 = tuya.split(':');
//   t1 = new Date();
//   t1.setHours(parseInt(hora1[0]), parseInt(hora1[1]));
//   data.value.duracion =
//     (t1.getHours() < 10 ? '0' : '') +
//     t1.getHours() +
//     ':' +
//     (t1.getMinutes() < 10 ? '0' : '') +
//     t1.getMinutes();
// };

//para separar la duracion en horas y minutos
const separandoDuracion = () => {
  // dataSend.value.datestart = moment(
  //   data.value.fechainicio + ' ' + data.value.horainicio
  // )
  //   .add(4, 'h')
  //   .format('YYYY-MM-DD HH:mm:ss');
  const b = data.value.duracion;
  var hora2, t2;

  hora2 = b.split(':');
  t2 = new Date();
  t2.setHours(parseInt(hora2[0]), parseInt(hora2[1]));
  dataSend.value.duracionhora = t2.getHours().toString();
  dataSend.value.duracionminuto = t2.getMinutes().toString();
  emit('changeDate', dataSend.value);
};

//para calcular la duracion
const duracionHoras = () => {
  aux1.value = moment(
    data.value.fechainicio + ' ' + data.value.horainicio
  ).format('YYYY-MM-DD HH:mm');
  dataSend.value.datestart = moment(
    data.value.fechainicio + ' ' + data.value.horainicio
  )
    .add(4, 'h')
    .format('YYYY-MM-DD HH:mm');

  var b = moment().format('HH:mm');
  if (data.value.duracion2.valormin == 'ingresar') {
    b = data.value.duracion;
  } else {
    data.value.duracion = data.value.duracion2.valormin;
    b = data.value.duracion;
  }
  dataSend.value.dateend = moment(dataSend.value.datestart)
    .add(b)
    .format('YYYY-MM-DD HH:mm');
  aux2.value = moment(aux1.value).add(b).format('YYYY-MM-DD HH:mm');

  data.value.fechafin = moment(aux2.value).format('YYYY-MM-DD');
  data.value.horafin = moment(aux2.value).format('HH:mm');
  emit('changeDate', dataSend.value);
};
// -----------------------------------------------------------------------para leer
// datos de entrada al cargar
const datosPredi2 = async () => {
  llenado.value = await storeCall.getCallsPro(props.idCard);

  dataleer.value.fechainicio = moment(
    llenado.value.attributes.date_start
  ).format('YYYY-MM-DD');
  dataleer.value.horainicio = moment(
    llenado.value.attributes.date_start
  ).format('HH:mm');
  dataleer.value.duracion2 = {
    label: 'Establecer',
    valormin: 'ingresar',
  };
  dataleer.value.duracion =
    (llenado.value.attributes.duration_hours < 10 ? '0' : '') +
    llenado.value.attributes.duration_hours +
    ':' +
    (llenado.value.attributes.duration_minutes < 10 ? '0' : '') +
    llenado.value.attributes.duration_minutes;
  dataleer.value.fechafin = moment(llenado.value.attributes.data_end).format(
    'YYYY-MM-DD'
  );
  dataleer.value.horafin = moment(llenado.value.attributes.date_end).format(
    'HH:mm'
  );
};
//para separar la duracion en horas y minutos
const separandoDuracion2 = () => {
  // dataSend.value.datestart = moment(
  //   dataleer.value.fechainicio + ' ' + dataleer.value.horainicio
  // ).format('YYYY-MM-DD HH:mm:ss');
  const b = dataleer.value.duracion;
  var hora2, t2;

  hora2 = b.split(':');
  t2 = new Date();
  t2.setHours(parseInt(hora2[0]), parseInt(hora2[1]));
  dataSend.value.duracionhora = t2.getHours().toString();
  dataSend.value.duracionminuto = t2.getMinutes().toString();
  emit('changeDateR', dataSend.value);
};

//para calcular la duracion
const duracionHoras2 = () => {
  aux1.value = moment(
    dataleer.value.fechainicio + ' ' + dataleer.value.horainicio
  ).format('YYYY-MM-DD HH:mm');
  dataSend.value.datestart = moment(
    dataleer.value.fechainicio + ' ' + dataleer.value.horainicio
  )
    .add(4, 'h')
    .format('YYYY-MM-DD HH:mm');

  var b = moment().format('HH:mm');
  if (dataleer.value.duracion2.valormin == 'ingresar') {
    b = dataleer.value.duracion;
  } else {
    dataleer.value.duracion = dataleer.value.duracion2.valormin;
    b = dataleer.value.duracion;
  }
  dataSend.value.dateend = moment(dataSend.value.datestart)
    .add(b)
    .format('YYYY-MM-DD HH:mm');
  aux2.value = moment(aux1.value).add(b).format('YYYY-MM-DD HH:mm');
  dataleer.value.fechafin = moment(aux2.value).format('YYYY-MM-DD');
  dataleer.value.horafin = moment(aux2.value).format('HH:mm');
  emit('changeDateR', dataSend.value);
};
//para REDONDEAR MINUTOS--------------------------------------------------
const redondear = () => {
  // data.value.horainicio = moment().format('HH:mm');
  const redo = moment().format('HH:mm');
  var horaR, tR, min, hor, min2, otro;

  horaR = redo.split(':');
  tR = new Date();
  tR.setHours(parseInt(horaR[0]), parseInt(horaR[1]));
  hor = tR.getHours().toString();
  min = tR.getMinutes().toString();
  if ((min >= 0) & (min <= 7)) {
    data.value.horainicio = hor + ':' + 0;
  } else if ((min >= 8) & (min <= 15)) {
    data.value.horainicio = hor + ':' + 15;
  } else if ((min >= 16) & (min <= 22)) {
    data.value.horainicio = hor + ':' + 15;
  } else if ((min >= 23) & (min <= 29)) {
    data.value.horainicio = hor + ':' + 30;
  } else if ((min >= 30) & (min <= 37)) {
    data.value.horainicio = hor + ':' + 30;
  } else if ((min >= 38) & (min <= 45)) {
    data.value.horainicio = hor + ':' + 45;
  } else if ((min >= 46) & (min <= 52)) {
    data.value.horainicio = hor + ':' + 45;
  } else if ((min >= 53) & (min <= 59)) {
    data.value.horainicio = hor + ':' + 0;
  }
  console.log(otro);
};
// -----------------------------------------------------------------------para leer cerrando
//para la opcion de duracion del select
const optionsdura = [
  {
    label: '15 minutos',
    valormin: '00:15',
  },
  {
    label: '30 minutos',
    valormin: '00:30',
  },
  {
    label: '45 minutos',
    valormin: '00:45',
  },
  {
    label: '1 hora',
    valormin: '01:00',
  },
  {
    label: 'Establecer',
    valormin: 'ingresar',
  },
];

const emit = defineEmits<{
  (event: 'changeDate', dataSend: any): void;
  (event: 'changeDateR', dataSend: any): void;
}>();

const exposeData = () => {
  return dataSend.value;
};
defineExpose({
  exposeData,
});
</script>

<template>
  <div class="row q-col-gutter-md col-12" v-if="!props.idCard">
    <div
      :class="data.duracion2.valormin != 'ingresar' ? 'col-md-12' : 'col-md-6'"
      v-if="props.durationselect"
    >
      <q-select
        v-model="data.duracion2"
        :options="optionsdura"
        label="Duracion"
        outlined
        dense
        options-dense
        option-value="value"
        option-label="label"
        transition-show="flip-up"
        transition-hide="flip-down"
        color="primary"
      >
        <template #before>
          <q-icon name="manage_history" />
        </template>
      </q-select>
    </div>
    <div class="col-md-6 col-xs-6" v-if="data.duracion2.label == 'Establecer'">
      <!-- <q-label>Duración</q-label> -->
      <!-- <q-select
                    v-model="data.duracion"
                    :options="optionsdura"
                    label="Duración"
                    outlined
                    dense
                    options-dense
                    option-value="id"
                    option-label="value"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    color="primary"
                  > -->
      <q-input
        v-model="data.duracion"
        label="Duracion hrs."
        mask="##:##"
        outlined
        dense
        color="primary"
      >
      </q-input>
    </div>
    <div class="col-md-6 col-xs-6">
      <q-input
        v-model="data.fechainicio"
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
    <div class="col-md-6 col-xs-6">
      <!-- <q-input
        v-model="data.horainicio"
        type="time"
        label="Hora de Inicio"
        outlined
        dense
        color="primary"
      >
      </q-input> -->
      <q-select
        class="col-12 col-md-6 q-pb-xs"
        outlined
        hide-dropdown-icon
        dense
        v-model="data.horainicio"
        :options="hours"
        label="Hora de inicio"
      >
        <template v-if="$q.screen.lt.md" #before>
          <q-icon name="watch" />
        </template>
        <template v-if="!$q.screen.lt.md" v-slot:append>
          <q-icon name="schedule" />
        </template>
      </q-select>
    </div>

    <div class="col-md-6 col-xs-6">
      <q-input
        v-model="data.fechafin"
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
    <div class="col-md-6 col-xs-6">
      <!-- <q-input
        v-model="data.horafin"
        label="Hora de Fin"
        value="duramas"
        type="time"
        outlined
        dense
        color="primary"
      /> -->
      <q-select
        class="col-12 col-md-6 q-pb-xs"
        outlined
        hide-dropdown-icon
        dense
        v-model="data.horafin"
        :options="hours"
        label="Hora de Fin"
      >
        <template v-if="$q.screen.lt.md" #before>
          <q-icon name="watch" />
        </template>
        <template v-if="!$q.screen.lt.md" v-slot:append>
          <q-icon name="schedule" />
        </template>
      </q-select>
    </div>
    <!-- <pre>{{ dataSend }}</pre>
    <pre>{{ data }}</pre> -->
  </div>
  <!-- --------------------------------------------------------------------para leer los datos -->
  <div class="row q-col-gutter-sm col-12" v-else>
    <div
      :class="
        dataleer.duracion2.valormin != 'ingresar' ? 'col-md-12' : 'col-md-6'
      "
      v-if="props.durationselect"
    >
      <q-select
        v-model="dataleer.duracion2"
        :options="optionsdura"
        label="Duracion"
        outlined
        dense
        options-dense
        option-value="value"
        option-label="label"
        transition-show="flip-up"
        transition-hide="flip-down"
        color="primary"
        readonly
      >
        <template #before>
          <q-icon name="manage_history" />
        </template>
      </q-select>
    </div>
    <div
      class="col-md-6 col-xs-6"
      v-if="dataleer.duracion2.label == 'Establecer'"
    >
      <!-- <q-label>Duración</q-label> -->
      <!-- <q-select
                    v-model="dataleer.duracion"
                    :options="optionsdura"
                    label="Duración"
                    outlined
                    dense
                    options-dense
                    option-value="id"
                    option-label="value"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    color="primary"
                  > -->
      <q-input
        v-model="dataleer.duracion"
        label="Duracion hrs."
        mask="##:##"
        outlined
        dense
        color="primary"
        :readonly="props.bloquear"
      >
      </q-input>
    </div>
    <div class="col-md-6 col-xs-6">
      <q-input
        v-model="dataleer.fechainicio"
        label="Fecha de Inicio"
        type="date"
        outlined
        dense
        color="primary"
        :readonly="props.bloquear"
      >
        <template #before>
          <q-icon name="event" />
        </template>
      </q-input>
    </div>
    <div class="col-md-6 col-xs-6">
      <!-- <q-input
        v-model="dataleer.horainicio"
        type="time"
        label="Hora de Inicio"
        outlined
        dense
        color="primary"
        :readonly="props.bloquear"
      >
      </q-input> -->
      <q-select
        class="col-12 col-md-6 q-pb-xs"
        outlined
        hide-dropdown-icon
        dense
        v-model="dataleer.horainicio"
        :options="hours"
        label="Hora de Inicio"
        :readonly="props.bloquear"
      >
        <template v-if="$q.screen.lt.md" #before>
          <q-icon name="watch" />
        </template>
        <template v-if="!$q.screen.lt.md" v-slot:append>
          <q-icon name="schedule" />
        </template>
      </q-select>
    </div>

    <div class="col-md-6 col-xs-6">
      <q-input
        v-model="dataleer.fechafin"
        label="Fecha de Fin"
        type="date"
        outlined
        dense
        color="primary"
        :readonly="props.bloquear"
      >
        <template #before>
          <q-icon name="event" />
        </template>
      </q-input>
    </div>
    <div class="col-md-6 col-xs-6">
      <!-- <q-input
        v-model="dataleer.horafin"
        label="Hora de Fin"
        value="duramas"
        type="time"
        outlined
        dense
        color="primary"
        :readonly="props.bloquear"
      /> -->
      <q-select
        class="col-12 col-md-6 q-pb-xs"
        outlined
        hide-dropdown-icon
        dense
        v-model="dataleer.horafin"
        :options="hours"
        label="Hora de Fin"
        :readonly="props.bloquear"
      >
        <template v-if="$q.screen.lt.md" #before>
          <q-icon name="watch" />
        </template>
        <template v-if="!$q.screen.lt.md" v-slot:append>
          <q-icon name="schedule" />
        </template>
      </q-select>
    </div>
    <!-- <pre>{{ dataSend }}</pre>
    <pre>{{ dataleer }}</pre> -->
  </div>
</template>

<style lang="scss" scoped>
//  mostrar el calendario al hacer click

.q-input[type='date']::-webkit-calendar-picker-indicator {
  display: block;
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
}
</style>
