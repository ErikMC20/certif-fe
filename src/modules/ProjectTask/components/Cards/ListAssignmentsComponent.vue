<script setup lang="ts">
import { defineProps } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { getAllAssignmentByTask } from '../../services/useTasksService';
const props = defineProps<{
  moduleId: string;
}>();

const { state } = useAsyncState(async () => {
  return await getAllAssignmentByTask(props.moduleId);
}, []);

const setStatusColor = (status: string) => {
  const statusName = [
    {
      name: 'En revision',
      color: 'blue-1',
      textColor: 'blue',
      icon: 'watch_later',
    },
    {
      name: 'Pendiente',
      color: 'grey-4',
      textColor: 'grey-7',
      icon: 'mode',
    },
    {
      name: 'En progreso',
      color: 'yellow-2',
      textColor: 'yellow-9',
      icon: 'timeline',
    },
    {
      name: 'On_Hold',
      color: 'yellow-2',
      textColor: 'yellow-9',
      icon: 'watch_later',
    },
    {
      name: 'Cerrado',
      color: 'green-2',
      textColor: 'green-9',
      icon: 'done_all',
    },
    {
      name: 'Aprobado',
      color: 'green-2',
      textColor: 'green-9',
      icon: 'done_all',
    },
    {
      name: 'Rechazado',
      color: 'red-2',
      textColor: 'red-9',
      icon: 'close',
    },
  ];
  return statusName.find((el) => el.name === status);
};
</script>
<template>
  <div>
    <q-scroll-area style="height: calc(100dvh - 170px)">
      <q-timeline color="secondary" class="q-pa-md">
        <q-timeline-entry
          v-for="(item, index) in state"
          :icon="setStatusColor(item.status_c)?.icon"
          :color="setStatusColor(item.status_c)?.textColor"
          :key="index"
          class="q-mb-md"
        >
          <template #subtitle>
            {{ item.fecha_literal }}
          </template>
          <template #title>
            {{ item.area }}
          </template>

          <q-card class="my-card">
            <q-item>
              <!-- <q-item-section avatar>
              <q-avatar class="" color="grey-4">
                {{ item.tasks }}
              </q-avatar>
            </q-item-section> -->

              <q-item-section>
                <q-item-label>COD: {{ item.code_c }} </q-item-label>
                <q-item-label caption>
                  <q-badge
                    :label="'TAREAS ASIGNADAS: ' + item.tasks"
                    class="q-pa-xs"
                    outline
                    color="primary"
                  />
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  color=""
                  text-color="dark"
                  flat
                  dense
                  size="20px"
                  icon="add"
                />
              </q-item-section>
            </q-item>
            <q-separator inset />
            <q-card-section horizontal>
              <q-card-section
                style="font-size: 0.9em"
                class="q-gutter-sm text-grey-7"
              >
                <div>Area :</div>
                <div>Fecha inicio :</div>
                <div>Fecha fin :</div>
                <div>Estado :</div>
                <div>Estado de carga :</div>
              </q-card-section>
              <q-card-section class="q-gutter-sm" style="font-size: 0.9em">
                <div>
                  <span class="text-dark">{{ item.area }}</span>
                </div>
                <div>
                  <span class="text-dark">{{ item.fecha_inicio }}</span>
                </div>
                <div>
                  <span class="text-dark">{{ item.fecha_fin }}</span>
                </div>
                <div>
                  <q-badge
                    :color="setStatusColor(item.status_c)?.color"
                    :text-color="setStatusColor(item.status_c)?.textColor"
                    class="q-pa-xs"
                    :label="item.status_c"
                  />
                </div>
                <div>
                  <q-badge class="q-pa-xs bg-white">
                    <q-icon
                      :name="setStatusColor(item.status_c)?.icon"
                      :color="setStatusColor(item.status_c)?.textColor"
                    />
                    <span
                      :class="
                        'text-' + setStatusColor(item.status_c)?.textColor
                      "
                    >
                      {{ item.operation_status_c }}
                    </span>
                  </q-badge>
                </div>
              </q-card-section>
            </q-card-section>
          </q-card>
        </q-timeline-entry>
      </q-timeline>
    </q-scroll-area>
  </div>
</template>

<style scoped></style>
