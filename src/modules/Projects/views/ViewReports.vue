<script setup lang="ts">
import { ref } from 'vue';
import {
  getIndicators,
  get_avance_grafico,
  getWorkArasList,
} from '../services/useProjectService';
import { useAsyncState } from '@vueuse/core';
import moment from 'moment';
import VueApexCharts from 'vue3-apexcharts';
import { IndicatorsModel } from '../utils/types';
const props = defineProps<{
  moduleId: string;
}>();

const indicador = ref<IndicatorsModel>({
  costo: {
    porcentaje: 0.0,
    contrato: 0,
    costo_real: 0,
    costo_total: 0,
  },
  tiempo: {
    porcentaje: 0.0,
    dias: 0,
    transcurrido: 0,
    total: 0,
  },
  alcance: {
    avance: 0.0,
    completada: 0,
    total: 0,
  },
} as IndicatorsModel);
const tipo = ref('Global');
const area = ref('Todas');
const expresado = ref('dias');
const fini = ref('');
const ffin = ref('');
const verAvance = ref('');
const optionsRango = ['Semana', 'Mes', 'Personalizado'];
const datos = ref([] as { [key: string]: string }[]);
const series = ref([] as { [key: string]: string }[]);
const respuesta = ref();
const respuesta2 = ref();
const respuesta3 = ref();
const chartOptions = ref({});
const mesesProyecto = ref([] as { [key: string]: string }[]);
const areasTrabajo = ref([] as { [key: string]: string }[]);
const agrupadoysumado = ref([] as { [key: string]: string }[]);
const agrupadoysumado2 = ref([] as { [key: string]: string }[]);
const agrupadoysumado3 = ref([] as { [key: string]: string }[]);
const data_filter = ref({
  id_project: props.moduleId,
  fecha_ini: '',
  fecha_fin: '',
  area: '',
});

const { execute } = useAsyncState(async () => {
  try {
    indicador.value = await getIndicators(props.moduleId || '');
    datos.value = await get_avance_grafico(data_filter.value);
    if (expresado.value == 'dias') {
      const sumaValores = datos.value.reduce((resultado, objeto) => {
        const { dias, planificacion } = objeto;
        resultado[dias] = (resultado[dias] || 0) + planificacion;
        return resultado;
      }, {});
      agrupadoysumado.value = Object.entries(sumaValores).map(
        ([dias, planificacion]) => ({ dias, planificacion })
      );

      const sumaValores2 = datos.value.reduce((resultado, objeto) => {
        const { dias, asignacion } = objeto;
        resultado[dias] = (resultado[dias] || 0) + asignacion;
        return resultado;
      }, {});
      agrupadoysumado2.value = Object.entries(sumaValores2).map(
        ([dias, asignacion]) => ({ dias, asignacion })
      );

      const sumaValores3 = datos.value.reduce((resultado, objeto) => {
        const { dias, real_c } = objeto;
        resultado[dias] = (resultado[dias] || 0) + real_c;
        return resultado;
      }, {});
      agrupadoysumado3.value = Object.entries(sumaValores3).map(
        ([dias, real_c]) => ({ dias, real_c })
      );
    } else if (expresado.value == 'meses') {
      const sumaValores = datos.value.reduce((resultado, objeto) => {
        const { meses, planificacion } = objeto;
        resultado[meses] = (resultado[meses] || 0) + planificacion;
        return resultado;
      }, {});
      agrupadoysumado.value = Object.entries(sumaValores).map(
        ([meses, planificacion]) => ({ meses, planificacion })
      );

      const sumaValores2 = datos.value.reduce((resultado, objeto) => {
        const { meses, asignacion } = objeto;
        resultado[meses] = (resultado[meses] || 0) + asignacion;
        return resultado;
      }, {});
      agrupadoysumado2.value = Object.entries(sumaValores2).map(
        ([meses, asignacion]) => ({ meses, asignacion })
      );

      const sumaValores3 = datos.value.reduce((resultado, objeto) => {
        const { meses, real_c } = objeto;
        resultado[meses] = (resultado[meses] || 0) + real_c;
        return resultado;
      }, {});
      agrupadoysumado3.value = Object.entries(sumaValores3).map(
        ([meses, real_c]) => ({ meses, real_c })
      );
    } else if (expresado.value == 'gestiones') {
      const sumaValores = datos.value.reduce((resultado, objeto) => {
        const { gestiones, planificacion } = objeto;
        resultado[gestiones] = (resultado[gestiones] || 0) + planificacion;
        return resultado;
      }, {});
      agrupadoysumado.value = Object.entries(sumaValores).map(
        ([gestiones, planificacion]) => ({ gestiones, planificacion })
      );

      const sumaValores2 = datos.value.reduce((resultado, objeto) => {
        const { gestiones, asignacion } = objeto;
        resultado[gestiones] = (resultado[gestiones] || 0) + asignacion;
        return resultado;
      }, {});
      agrupadoysumado2.value = Object.entries(sumaValores2).map(
        ([gestiones, asignacion]) => ({ gestiones, asignacion })
      );

      const sumaValores3 = datos.value.reduce((resultado, objeto) => {
        const { gestiones, real_c } = objeto;
        resultado[gestiones] = (resultado[gestiones] || 0) + real_c;
        return resultado;
      }, {});
      agrupadoysumado3.value = Object.entries(sumaValores3).map(
        ([gestiones, real_c]) => ({ gestiones, real_c })
      );
    }

    const array = agrupadoysumado.value.map((r) => r.planificacion).flat();
    const array2 = agrupadoysumado2.value.map((r) => r.asignacion).flat();
    const array3 = agrupadoysumado3.value.map((r) => r.real_c).flat();
    respuesta.value = sumaAcumulada(array);
    respuesta2.value = sumaAcumulada(array2);
    respuesta3.value = sumaAcumulada(array3);
    series.value = [
      {
        name: 'Planificado',
        type: 'line',
        data: respuesta.value,
      },
      {
        name: 'Asignado',
        type: 'line',
        data: respuesta2.value,
      },
      {
        name: 'Real',
        type: 'line',
        data: respuesta3.value,
      },
    ];
    chartOptions.value = {
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 3,
        curve: 'smooth',
      },
      title: {
        text: 'CURVA - S, 2022 - 2023',
        align: 'left',
        offsetX: 110,
      },
      xaxis: {
        categories:
          expresado.value == 'dias'
            ? agrupadoysumado.value.map((r) => r.dias).flat()
            : expresado.value == 'meses'
            ? agrupadoysumado.value.map((r) => r.meses).flat()
            : expresado.value == 'gestiones'
            ? agrupadoysumado.value.map((r) => r.gestiones).flat()
            : '',
        title: {
          text:
            expresado.value == 'dias'
              ? 'Días'
              : expresado.value == 'meses'
              ? 'Meses'
              : expresado.value == 'gestiones'
              ? 'Gestiones'
              : '',
        },
      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#008FFB',
          },
          labels: {
            style: {
              colors: '#008FFB',
            },
          },
          title: {
            text: 'Incidencias',
            style: {
              color: '#008FFB',
            },
          },
          tooltip: {
            enabled: true,
          },
        },
      ],
      tooltip: {
        fixed: {
          enabled: true,
          position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60,
        },
      },
      legend: {
        horizontalAlign: 'left',
        offsetX: 40,
      },
    };

    const resp2 = await getWorkArasList(props.moduleId);
    areasTrabajo.value = resp2;
  } catch (error) {
  } finally {
  }
}, {} as any);

const changeOption1 = (val: string) => {
  if (tipo.value == 'Global') {
    fini.value = '';
    ffin.value = '';
    verAvance.value = '';
    area.value = '';
  } else {
    verAvance.value = 'Mes';
    fini.value = moment().startOf('month').format('YYYY-MM-DD');
    ffin.value = moment().endOf('month').format('YYYY-MM-DD');
  }
};

const changeOption2 = (val: string) => {
  fini.value = '';
  ffin.value = '';
  updateOption(val);
};

const updateOption = (value: string) => {
  switch (value) {
    case 'Semana':
      fini.value = moment().subtract(7, 'days').format('YYYY-MM-DD');
      ffin.value = moment().format('YYYY-MM-DD');
      //operatorValue.value = 'between';
      break;
    case 'Mes':
      fini.value = moment().startOf('month').format('YYYY-MM-DD');
      ffin.value = moment().endOf('month').format('YYYY-MM-DD');
      //operatorValue.value = 'between';
      break;

    default:
      fini.value = moment().startOf('month').format('YYYY-MM-DD');
      ffin.value = moment().startOf('month').format('YYYY-MM-DD');
      break;
  }
};

// const mesesDinamicos = ()=>{
//   var startDate = moment('2012-04-01');
//   var endDate = moment('2014-11-01');

//   var dates = [];
//   endDate.subtract(1, 'month'); //Substract one month to exclude endDate itself

//   var month = moment(startDate); //clone the startDate
//   while( month < endDate ) {
//       month.add(1, 'month');
//       dates.push(month.format('MM-YYYY'));
//   }
//   mesesProyecto.value=dates;
//   console.log(dates);
// }

const filtraAvance = () => {
  data_filter.value.id_project = props.moduleId;
  data_filter.value.fecha_ini = fini.value;
  data_filter.value.fecha_fin = ffin.value;
  data_filter.value.area = area.value;
  console.log(data_filter);
  execute();
};

const sumaAcumulada = (array: any) => {
  let acumulado = 0;
  const resultado = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i] == 0) {
      acumulado += array[i];

      resultado.push(0);
    } else {
      acumulado += array[i];
      resultado.push(acumulado);
    }
  }
  return resultado;
};
</script>
<template>
  <q-card class="my-card q-mt-none" style="min-height: 80vh">
    <q-card-section class="row q-pb-none">
      <q-card flat bordered style="width: 100%">
        <q-card-section class="row q-col-gutter-sm item">
          <q-select
            v-model="tipo"
            :options="['Global', 'Especifico']"
            label="Mostrar avance"
            class="col-2"
            outlined
            dense
            @update:model-value="changeOption1"
          />
          <q-select
            v-model="expresado"
            :options="['dias', 'meses', 'gestiones']"
            label="Expresado"
            class="col-2"
            outlined
            dense
            @update:model-value="execute()"
          />
          <!-- <q-select v-model="verAvance" :options="optionsRango" label="Ver avance por" class="col-2" outlined dense v-if="tipo == 'Especifico'" @update:model-value="changeOption2" />
      <q-input v-model="fini" type="date" label="Fecha inicio" class="col-2" outlined
        :readonly="verAvance=='Semana' ? true:verAvance=='Mes' ? true:false" dense v-if="tipo=='Especifico'" />
      <q-input v-model="ffin" type="date" label="Fecha fin" class="col-2" outlined :readonly="verAvance=='Semana' ? true:verAvance=='Mes' ? true:false" dense v-if=" tipo=='Especifico'" /> -->
          <q-select
            v-model="area"
            :options="areasTrabajo"
            label="Area de trabajo"
            class="col-2"
            outlined
            dense
            option-value="id"
            option-label="name"
            emit-value
            map-options
            v-if="tipo == 'Especifico'"
          />
          <div>
            <q-btn
              color="primary"
              class="q-ml-lg"
              icon="search"
              label="Filtrar"
              @click="filtraAvance"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-card-section>
    <q-card-section class="row q-pb-none">
      <div class="col-6 text-center">
        <span class="text-grey-8">Tareas Completadas</span>
        <div class="text-bold text-center">
          <span style="font-size: 2em">
            {{ indicador.alcance.completada }}
            <small class="text-grey-5">
              /
              {{ indicador.alcance.total }}
            </small>
          </span>
        </div>
        <div class="text-center text-grey-6" style="font-size: 0.8rem">
          {{ indicador.alcance.avance }} % de progreso
        </div>
      </div>
      <div class="col-6 text-center">
        <span class="text-grey-8">Tiempo Restante</span>
        <div class="text-bold text-center">
          <span style="font-size: 2em">
            {{ indicador.tiempo.total - indicador.tiempo.transcurrido || 0 }}
          </span>
        </div>
        <div class="text-center text-grey-6" style="font-size: 0.8rem">
          {{ indicador.tiempo.porcentaje }} % de tiempo transcurrido
        </div>
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <VueApexCharts
        type="line"
        height="400"
        width="100%"
        :options="chartOptions"
        :series="series"
      ></VueApexCharts>
    </q-card-section>
  </q-card>
</template>
<style scoped></style>
