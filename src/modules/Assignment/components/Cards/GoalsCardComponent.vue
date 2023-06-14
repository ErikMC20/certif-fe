<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAsyncState } from '@vueuse/core';
import {
  getGoalsWorkArea,
  getProjectTask,
} from '../../services/useAssignmentService';
import { Notification } from 'src/composables';
import { GenericModel } from '../../utils/types';
import ProjectTaskDialog from 'src/modules/ProjectTask/components/Dialogs/ProjectTaskDialog.vue';
const props = defineProps<{
  id?: string;
  tasks: GenericModel[];
}>();

const listGoals = ref<any[]>([]);
const filter = ref({
  search: '',
  date_ini: '',
  date_fin: '',
});

const { state } = useAsyncState(async () => {
  return await getProjectTask(props.id ?? '');
}, []);

const onGetGoalsList = async (id: string) => {
  listGoals.value = await getGoalsWorkArea(id);
};

const validateInputs = () => {
  const exists = listGoals.value.filter((el) => el.asignado > 0);
  if (exists.length === 0) {
    Notification('negative', 'close', 'No existen tareas asignadas');
    return;
  }
  return true;
};

const newList = computed(() => {
  const search = filter.value.search.toLocaleLowerCase();
  const dateini = filter.value.date_ini;
  const datefin = filter.value.date_fin;
  return listGoals.value.filter(
    (el: any) =>
      (!search || el.tarea_nombre.toLowerCase().includes(search)) &&
      (!dateini || el.tarea_fecha_inicio >= dateini) &&
      (!datefin || el.tarea_fecha_fin < datefin)
  );
});

const exposeData = () => {
  const res = listGoals.value.reduce((grouped: any, goals: any) => {
    if (!grouped[goals.objetivo_id]) {
      grouped[goals.objetivo_id] = {
        objetivo: goals.objetivo_id,
        tareas: [],
        total_asignado: 0,
      };
    }
    if (goals.asignado > 0) {
      grouped[goals.objetivo_id].total_asignado += goals.asignado;
      grouped[goals.objetivo_id].tareas.push(goals);
    }

    return grouped;
  }, {});

  console.log('Data :', res);
  return res;
};

defineExpose({
  onGetGoalsList,
  exposeData,
  validateInputs,
});
</script>
<template>
  <q-card class="my-card">
    <q-card-section class="q-pa-none">
      <q-toolbar class="q-pa-sm">
        <q-btn flat round dense icon="assignment_ind" color="primary" />
        <q-toolbar-title class="text-grey-9" style="font-size: 0.9rem">
          OBJETIVOS ASIGNADOS
        </q-toolbar-title>
        <!-- <q-btn flat round dense icon="apps" class="q-mr-xs" /> -->
      </q-toolbar>
    </q-card-section>
    <q-separator />
    <q-card-section class="q-pa-none">
      <q-scroll-area style="height: 300px" class="col-md-12" v-if="!id">
        <q-list bordered separator>
          <q-item v-for="(item, index) in newList" :key="index" clickable>
            <q-item-section style="width: 50%">
              <q-item-label lines="2" style="font-size: 1.1em">
                <span class="text-grey-6"> {{ item.tarea_wbs }}&nbsp; </span>
                {{ item.tarea_nombre }}
              </q-item-label>
              <q-item-label caption class="text-primary">
                {{ item.tarea_fecha_inicio }} -
                {{ item.tarea_fecha_fin }}
              </q-item-label>
            </q-item-section>
            <q-item-section side style="width: 20%">
              <q-item-label caption class="text-dark" lines="2">
                Incidencia: {{ item.tarea_incidencia }}%
              </q-item-label>
            </q-item-section>
            <q-item-section side style="width: 30%">
              <div>
                <q-input
                  v-model.number="item.asignado"
                  type="number"
                  dense
                  outlined
                  :min="0"
                  hide-bottom-space
                  no-error-icon
                  :rules="[
                    (val:number) => val <= item.cant_faltante || 'Cantidad excedida.',
                  ]"
                  class="no-border-radius"
                  square
                >
                  <template v-slot:append>
                    <span style="font-size: 0.6em" class="text-grey-7">
                      {{ `/ ${item.cant_faltante} ${item.tarea_unidad}` }}
                    </span>
                  </template>
                </q-input>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <q-list bordered>
        <q-item clickable v-ripple v-for="(item, index) in state" :key="index">
          <q-item-section>
            {{ item.numero }}
            {{ item.tarea }}
          </q-item-section>
          <q-item-section side>
            {{ item.asignado_cantidad }} / {{ item.objetivo_cantidad }}
            {{ item.unidad }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>

  <ProjectTaskDialog />
</template>

<style scoped></style>
