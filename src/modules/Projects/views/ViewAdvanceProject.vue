<script lang="ts">
import ViewHijos from 'src/modules/Projects/views/ViewHijos.vue';
</script>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  get_avance_project,
  getWorkArasList,
} from '../services/useProjectService';
import moment from 'moment';
const props = defineProps<{
  moduleId: string;
}>();

const tipo = ref('Global');
const area = ref('Todas');
const fini = ref('');
const ffin = ref('');
const verAvance = ref('');
const optionsRango = ['Semana', 'Mes', 'Personalizado'];
const tasks = ref();
const state = ref([] as { [key: string]: string }[]);
const areasTrabajo = ref([] as { [key: string]: string }[]);
const data_filter = ref({
  id_project: props.moduleId,
  fecha_ini: '',
  fecha_fin: '',
  area: '',
});

onMounted(async () => {
  const res1 = await get_avance_project(data_filter.value);
  state.value = res1;
  const res = await get_avance_project(data_filter.value);
  tasks.value = ordenarLista(res);
  const resp2 = await getWorkArasList(props.moduleId);
  areasTrabajo.value = resp2;
  areasTrabajo.value.unshift({ id: '', name: 'Todas' });
});

function ordenarLista(lista: any) {
  const raiz = <any[]>[];
  const mapa = <any>{};
  lista.forEach((item: any) => {
    mapa[item.gantt_id] = item;
    item.childs = [];
  });
  lista.forEach((item: any) => {
    console.log(item);
    if (item.gantt_padre !== '0') {
      mapa[item.gantt_padre]?.childs.push(item);
    } else {
      raiz.push(item);
    }
  });
  return raiz;
}

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

const filtraAvance = async () => {
  data_filter.value.id_project = props.moduleId;
  data_filter.value.fecha_ini = fini.value;
  data_filter.value.fecha_fin = ffin.value;
  data_filter.value.area = area.value;
  const res1 = await get_avance_project(data_filter.value);
  state.value = res1;
  const res = await get_avance_project(data_filter.value);
  tasks.value = ordenarLista(res);
};
</script>
<template>
  <q-card class="my-card q-mt-none" style="min-height: 80vh">
    <q-card-section>
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
            v-model="verAvance"
            :options="optionsRango"
            label="Ver avance por"
            class="col-2"
            outlined
            dense
            v-if="tipo == 'Especifico'"
            @update:model-value="changeOption2"
          />
          <q-input
            v-model="fini"
            type="date"
            label="Fecha inicio"
            class="col-2"
            outlined
            :readonly="
              verAvance == 'Semana' ? true : verAvance == 'Mes' ? true : false
            "
            dense
            v-if="tipo == 'Especifico'"
          />
          <q-input
            v-model="ffin"
            type="date"
            label="Fecha fin"
            class="col-2"
            outlined
            :readonly="
              verAvance == 'Semana' ? true : verAvance == 'Mes' ? true : false
            "
            dense
            v-if="tipo == 'Especifico'"
          />
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
      <div class="col-4 text-center">
        <span class="text-grey-8">Total de Tareas</span>
        <div>
          <span class="text-bold q-ma-sm" style="font-size: 2em">
            {{ state.filter((o: any) => o.tipo === 'task').length ?? 0 }}
          </span>
        </div>
      </div>
      <div class="col-4 text-center">
        <span class="text-grey-8"><q-icon name="fiber_manual_record" color="orange" size="10px" class="q-mr-xs"/>Avance Asignado Global</span>
        
        <!-- <div>
          <span class="text-bold q-ma-sm" style="font-size: 2em"> -->
            <!-- {{
              Math.round(
                state
                  .filter((o: any) => o.tipo === 'task')
                  .map((o: any) => o.porcentaje_asig_incidencia)
                  .reduce((a: any, b: any) => a + b, 0) /
                  state.filter((v: any) => v.tipo === 'task').length
              ) || 0
            }} -->
            <!-- {{              
                state
                  .filter((o: any) => o.tipo === 'task')
                  .map((o: any) => o.incidencia)
                  .reduce((a: any, b: any) => a + b, 0)
               || 0
            }}/{{              
                state
                  .filter((o: any) => o.tipo === 'task')
                  .map((o: any) => o.porcentaje_asig_incidencia)
                  .reduce((a: any, b: any) => a + b, 0)
               || 0
            }}
            %</span
          >
        </div> -->

        <div class="text-bold text-center">
          <span style="font-size: 2em">
            
            {{              
                state
                  .filter((o: any) => o.tipo === 'task')
                  .map((o: any) => o.porcentaje_asig_incidencia)
                  .reduce((a: any, b: any) => a + b, 0)
               || 0
            }}
            <small class="text-grey-5">
              / {{              
                state
                  .filter((o: any) => o.tipo === 'task')
                  .map((o: any) => o.incidencia)
                  .reduce((a: any, b: any) => a + b, 0)
               || 0
            }} %
              
            </small>
          </span>
        </div>
      </div>
      <div class="col-4 text-center">
        <span class="text-grey-8"><q-icon name="fiber_manual_record" color="green" size="10px" class="q-mr-xs"/>Avance Real Global</span>
        <!-- <div>
          <span class="text-bold q-ma-sm" style="font-size: 2em"> -->
            <!-- {{
              Math.round(
                state
                  .filter((o: any) => o.tipo === 'task')
                  .map((o: any) => o.porcentaje_real_incidencia)
                  .reduce((a: any, b: any) => a + b, 0) /
                  state.filter((v: any) => v.tipo === 'task').length
              ) || 0
            }} -->
            <!-- {{
              
                state
                  .filter((o: any) => o.tipo === 'task')
                  .map((o: any) => o.porcentaje_real_incidencia)
                  .reduce((a: any, b: any) => a + b, 0) 
               || 0
            }}
            %
          </span>
        </div> -->

        <div class="text-bold text-center">
          <span style="font-size: 2em">            
            {{              
                 state
                  .filter((o: any) => o.tipo === 'task')
                  .map((o: any) => o.porcentaje_real_incidencia)
                  .reduce((a: any, b: any) => a + b, 0) 
               || 0
            }}
            <small class="text-grey-5">
              / {{              
                state
                  .filter((o: any) => o.tipo === 'task')
                  .map((o: any) => o.incidencia)
                  .reduce((a: any, b: any) => a + b, 0)
               || 0
            }} %              
            </small>
          </span>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="q-pt-lg">
      <div class="col-xs-12 col-md-3">
        <q-list dense class="col-12">
          <q-expansion-item
            header-class="text-blue bg-grey-1"
            popup
            v-for="(item, index) in tasks"
            :key="index"
            :label="item.nombre"
          >
            <template v-slot:header="{ expanded }">
              <q-item-section avatar v-if="expanded == false">
                <!-- <q-circular-progress
                  show-value
                  class="text-green"
                  :value="Math.round((item.childs.filter((o:any) => o.tipo === 'task' ).map((o:any) => o.porcentaje_real_incidencia).reduce((a:any, b:any) => a + b, 0))/(item.childs.filter((v:any) => v.tipo === 'task' ).length))"
                  size="50px"
                  color="green"
                  track-color="grey-3"
                >
                  {{
                    Math.round(
                      item.childs
                        .filter((o: any) => o.tipo === 'task')
                        .map((o: any) => o.porcentaje_real_incidencia)
                        .reduce((a: any, b: any) => a + b, 0) /
                        item.childs.filter((v: any) => v.tipo === 'task').length
                    )
                  }}%
                </q-circular-progress> -->
                <q-circular-progress
                  show-value
                  class="text-green"
                  :value="Math.round((item.childs.filter((o:any) => o.tipo === 'task' ).map((o:any) => o.porcentaje_real_incidencia).reduce((a:any, b:any) => a + b, 0)))"
                  size="50px"
                  color="green"
                  track-color="grey-3"
                >
                  {{                    
                      item.childs
                        .filter((o: any) => o.tipo === 'task')
                        .map((o: any) => o.porcentaje_real_incidencia)
                        .reduce((a: any, b: any) => a + b, 0)                     
                  }}%
                </q-circular-progress>
              </q-item-section>
              <q-item-section>
                <q-item-label
                  class="text-bold flex items-center text-primary"
                  >{{ item.nombre }}</q-item-label
                >
                <q-item-label class="text-subtitle2 text-grey-7">
                  Tareas: {{ item.childs.length }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <!-- <q-circular-progress
                  v-if="expanded == true"
                  show-value
                  class="text-light-orange"
                  :value="Math.round((item.childs.filter((o:any) => o.tipo === 'task' ).map((o:any) => o.porcentaje_asig_incidencia).reduce((a:any, b:any) => a + b, 0))/(item.childs.filter((v:any) => v.tipo === 'task' ).length))"
                  size="50px"
                  color="yellow-4"
                  track-color="grey-3"
                >
                  {{
                    Math.round(
                      item.childs
                        .filter((o: any) => o.tipo === 'task')
                        .map((o: any) => o.porcentaje_asig_incidencia)
                        .reduce((a: any, b: any) => a + b, 0) /
                        item.childs.filter((v: any) => v.tipo === 'task').length
                    )
                  }}%
                </q-circular-progress> -->
                <q-circular-progress
                  v-if="expanded == true"
                  show-value
                  class="text-light-orange"
                  :value="Math.round((item.childs.filter((o:any) => o.tipo === 'task' ).map((o:any) => o.porcentaje_asig_incidencia).reduce((a:any, b:any) => a + b, 0)))"
                  size="50px"
                  color="orange"
                  track-color="grey-3"
                >
                  {{                    
                      item.childs
                        .filter((o: any) => o.tipo === 'task')
                        .map((o: any) => o.porcentaje_asig_incidencia)
                        .reduce((a: any, b: any) => a + b, 0)
                    
                  }}%
                </q-circular-progress>
              </q-item-section>
              <q-item-section side>
                <!-- <q-circular-progress
                  v-if="expanded == true"
                  show-value
                  class="text-light-orange"
                  :value="Math.round((item.childs.filter((o:any) => o.tipo === 'task' ).map((o:any) => o.porcentaje_real_incidencia).reduce((a:any, b:any) => a + b, 0))/(item.childs.filter((v:any) => v.tipo === 'task' ).length))"
                  size="50px"
                  color="green"
                  track-color="grey-3"
                >
                  {{
                    Math.round(
                      item.childs
                        .filter((o: any) => o.tipo === 'task')
                        .map((o: any) => o.porcentaje_real_incidencia)
                        .reduce((a: any, b: any) => a + b, 0) /
                        item.childs.filter((v: any) => v.tipo === 'task').length
                    )
                  }}%
                </q-circular-progress> -->
                <q-circular-progress
                  v-if="expanded == true"
                  show-value
                  class="text-light-orange"
                  :value="Math.round((item.childs.filter((o:any) => o.tipo === 'task' ).map((o:any) => o.porcentaje_real_incidencia).reduce((a:any, b:any) => a + b, 0)))"
                  size="50px"
                  color="green"
                  track-color="grey-3"
                >
                  {{                    
                      item.childs
                        .filter((o: any) => o.tipo === 'task')
                        .map((o: any) => o.porcentaje_real_incidencia)
                        .reduce((a: any, b: any) => a + b, 0) 
                    
                  }}%
                </q-circular-progress>
              </q-item-section>
            </template>
            <ViewHijos :hijos="item.childs" />
          </q-expansion-item>
        </q-list>
      </div>
    </q-card-section>
  </q-card>
</template>
<style scoped></style>
