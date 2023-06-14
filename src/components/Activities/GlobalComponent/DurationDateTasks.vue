<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import moment from 'moment';
import { stringify } from 'querystring';

const props = defineProps<{
  name?: string;
  idActivity?: string;
  idModule: string;
  modoread?:boolean;
  data?: any;
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

onMounted(async () => {

  // if (!props.idActivity) {
    datosPredi();
    duracionHoras();
    separandoDuracion();
  // } else {
  //   console.log('aqui');
  //   data.value.fechainicio = moment(
  //     props.data.dateStart
  //   ).format('YYYY-MM-DD');
  //   data.value.horainicio = moment(
  //     props.data.dateStart
  //   ).format('HH:mm');
  // }

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
// watch(
//   () => data.value.duracion ,
//   async () => {
//     duracionHoras();
//     separandoDuracion();
//   }
// );
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
  data.value.horainicio = moment().format('HH:mm');
  data.value.horafin = moment().format('HH:mm');
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
  dataSend.value.datestart = moment(
    data.value.fechainicio + ' ' + data.value.horainicio
  ).format('YYYY-MM-DD HH:mm:ss');
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
  dataSend.value.datestart = moment(
    data.value.fechainicio + ' ' + data.value.horainicio
  ).format('YYYY-MM-DD HH:mm');

  var b = moment().format('HH:mm');
  if (data.value.duracion2.valormin == 'ingresar') {
    b = data.value.duracion;
  } else {
    data.value.duracion = data.value.duracion2.valormin;
    b = data.value.duracion;
  }
  dataSend.value.dateend = moment(dataSend.value.datestart)
    .add(b)
    .format('YYYY-MM-DD HH:mm:ss');
  data.value.fechafin = moment(dataSend.value.dateend).format('YYYY-MM-DD');
  data.value.horafin = moment(dataSend.value.dateend).format('HH:mm');
  emit('changeDate', dataSend.value);
};

//para la opcion de duracion del select
const optionsdura = [
  {
    label: '3 minutos',
    valormin: '00:03',
  },
  {
    label: '5 minutos',
    valormin: '00:05',
  },
  {
    label: '10 minutos',
    valormin: '00:10',
  },
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
}>();

const exposeData = () => {
  return dataSend.value;
};
defineExpose({
  exposeData,
});
</script>

<template>
  <div class="row q-col-gutter-sm col-12">
    <div
      :class="data.duracion2.valormin != 'ingresar' ? 'col-md-12' : 'col-md-6'"
    >
      <q-select
        :readonly="modoread"
        v-model="data.duracion2"
        :options="optionsdura"
        label="Duracion"
        :outlined="!modoread"
        dense
        options-dense
        option-value="value"
        option-label="label"
        transition-show="flip-up"
        transition-hide="flip-down"
        color="primary"
      >
        <template #before v-if="modoread==false">
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
        type="time"
        :outlined="!modoread"
        dense
        color="primary"
      >
      </q-input>
    </div>
    <div class="col-md-6 col-xs-6">
      <q-input
      :readonly="modoread"
        v-model="data.fechainicio"
        label="Fecha de Inicio"
        type="date"
        :outlined="!modoread"
        dense
        color="primary"
      >
        <template #before v-if="modoread==false">
          <q-icon name="event" />
        </template>
      </q-input>
    </div>
    <div class="col-md-6 col-xs-6">
      <q-input
        v-model="data.horainicio"
        :readonly="modoread"
        type="time"
        label="Hora de Inicio"
        :outlined="!modoread"
        dense
        color="primary"
      >
      </q-input>
    </div>

    <div class="col-md-6 col-xs-6">
      <q-input
        v-model="data.fechafin"
        :readonly="modoread"
        label="Fecha de Fin"
        type="date"
        :outlined="!modoread"
        dense
        color="primary"
      >
        <template #before v-if="modoread==false">
          <q-icon name="event" />
        </template>
      </q-input>
    </div>
    <div class="col-md-6 col-xs-6">
      <q-input
        v-model="data.horafin"
        :readonly="modoread"
        label="Hora de Fin"
        value="duramas"
        type="time"
        :outlined="!modoread"
        dense
        color="primary"
      />
    </div>
    <!-- <pre>{{ dataSend }}</pre>
    <pre>{{ data }}</pre> -->
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
