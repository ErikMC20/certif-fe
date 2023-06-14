<script setup lang="ts">
import ProjectTaskDialog from 'src/modules/ProjectTask/components/Dialogs/ProjectTaskDialog.vue';
import { getTasksInProgress } from '../../services/useProjectService';
import { useAsyncState } from '@vueuse/core';
import { ref } from 'vue';

const props = defineProps<{
  moduleId: string;
}>();

const projectTaskDialogRef = ref<InstanceType<typeof ProjectTaskDialog> | null>(
  null
);

const { state, isLoading } = useAsyncState(async () => {
  return await getTasksInProgress(props.moduleId);
}, []);

//functions
const openDialog = (id: string, title: string) => {
  projectTaskDialogRef.value?.openDialog(id, title);
};
</script>

<template>
  <q-scroll-area style="height: 50dvh" v-if="state.length > 0">
    <q-list bordered separator>
      <template v-for="(item, index) in state" :key="index">
        <q-item clickable v-ripple @click="openDialog(item.id, item.tarea)">
          <q-item-section avatar>
            <q-circular-progress
              show-value
              size="40px"
              :thickness="0.2"
              color="blue-9"
              track-color="grey-3"
              class="q-ma-none text-dark"
              :value="item.progreso"
            >
              {{ item.progreso }}%
            </q-circular-progress>
          </q-item-section>
          <q-item-section>
            <q-item-label lines="2">
              <span class="text-blue-9"> {{ item.numero }} &nbsp;</span>
              {{ item.tarea }}
            </q-item-label>
            <q-item-label lines="2" caption>
              Incidencia: {{ item.incidencia }}%
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <small class="text-grey-8">
              Desde: {{ item.fecha_inicio }} <br />
              Hasta: {{ item.fecha_fin }}
            </small>
          </q-item-section>

          <q-item-section side>
            <q-item-label lines="2">
              <q-badge
                style="width: 100px"
                color="grey-3"
                text-color="dark"
                class="q-pa-sm"
                :label="`${item.cantidad_avance} / ${item.cantidad} ${item.unidad}`"
              />
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="arrow_right" />
          </q-item-section>
        </q-item>
      </template>
    </q-list>
    <q-inner-loading :showing="isLoading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-scroll-area>
  <q-item v-else>
    <q-item-section>
      <q-item-label>Sin tareas en progreso</q-item-label>
      <q-item-label caption lines="2">
        Debe hacer las asignacion de tareas primero.
      </q-item-label>
    </q-item-section>
  </q-item>

  <ProjectTaskDialog ref="projectTaskDialogRef" />
</template>

<style scoped></style>
