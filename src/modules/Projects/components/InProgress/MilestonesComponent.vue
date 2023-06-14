<script setup lang="ts">
import { getMilestonesInProgress } from '../../services/useProjectService';
import { useAsyncState } from '@vueuse/core';

const props = defineProps<{
  moduleId: string;
}>();

const { state, isLoading } = useAsyncState(async () => {
  return await getMilestonesInProgress(props.moduleId);
}, []);
</script>

<template>
  <q-scroll-area style="height: 400px" v-if="state.length > 0">
    <q-list bordered separator>
      <template v-for="(item, index) in state" :key="index">
        <q-item clickable>
          <!-- <q-item-section avatar>
            <q-icon
              name="check_circle"
              color="green-9"
              v-if="item.avance === 100"
            />
            <q-icon
              name="check_circle"
              color="grey-5"
              v-if="item.avance < 50"
            />
            <q-icon
              name="check_circle"
              color="warning"
              v-if="item.avance >= 50 && item.avance < 100"
            />
          </q-item-section> -->
          <q-item-section>
            <q-item-label lines="2">
              {{ item.name }}
            </q-item-label>

            <q-item-label lines="2" caption>
              Incidencia: {{ item.incidencia }}%
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <small class="text-grey-8">
              Del: {{ item.fecha_inicio }} <br />
              Hasta: {{ item.fecha_fin }}
            </small>
            <!-- <div
              class="text-grey-6 text-left"
              style="font-size: 0.8em; width: 100px"
            >
              TAREAS:
              <span
                class="q-ml-sm"
                :class="item.completadas > 0 ? 'text-orange' : ''"
              >
                {{ item.completadas }} / {{ item.total }}
              </span>
            </div> -->
          </q-item-section>
          <q-item-section side>
            <div class="flex items-center" style="width: 150px">
              <q-linear-progress
                rounded
                size="10px"
                :value="item.avance * 0.01"
                color="primary"
                style="width: 100px"
              />
              <small class="q-ml-sm">
                {{ item.completadas }} / {{ item.total }}
              </small>
            </div>
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
      <q-item-label>Sin hitos registrados</q-item-label>
      <q-item-label caption lines="2">
        Debe crear y aprobar una planificacion primero.
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<style scoped></style>
