<script lang="ts">
import { ref, computed } from 'vue';
import { useAsyncState } from '@vueuse/core';

import { getPlanningsList } from '../services/useProjectService';
import { base } from '../utils/types';

import ModuleSkeleton from '../components/Skeletons/ModuleSkeleton.vue';
import { GoalsDialog } from 'src/modules/Goals/components';
</script>
<script setup lang="ts">
const props = defineProps<{
  moduleId: string;
}>();

defineEmits<{
  (event: 'submitComplete', values: string): void;
}>();

//refs
const goalsDialogRef = ref<InstanceType<typeof GoalsDialog> | null>(null);

//variables
const filter = ref('');

//functions
const { state, execute, isLoading } = useAsyncState(async () => {
  const data = await getPlanningsList(props.moduleId);
  return data;
}, [] as base[]);

const listApproved = computed(() => {
  if (filter.value == '') {
    return state.value.filter((objeto: base) => objeto.estado == 'Aprobado');
  }
  return state.value.filter(
    (objeto: base) =>
      objeto.name.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 &&
      objeto.estado == 'Aprobado'
  );
});

const formSaved = async () => {
  goalsDialogRef.value?.onCloseDialog();
  await execute();
};

const openItemSelected = (id: string, title: string) => {
  goalsDialogRef.value?.openDialog(id, title);
};
</script>

<template>
  <ModuleSkeleton v-if="isLoading" />
  <q-card v-else class="no-border-radius" style="height: 70vh; width: 100%">
    <q-card-section>
      <div class="row col-12 justify-between q-px-sm">
        <div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-xs-12 q-mb-sm">
          <q-input
            bottom-slots
            dense
            v-model="filter"
            placeholder="Buscar por nombre"
          >
            <template v-slot:append>
              <q-icon name="search" v-if="!filter" />
              <q-icon
                name="clear"
                v-else
                @click="filter = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>
        </div>
        <div class="col-xl-4 col-lg-6 col-md-7 col-sm-12 col-xs-12 q-mb-sm">
          <div class="row justify-end q-gutter-sm">
            <slot name="buttons"> </slot>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-md-3 q-pa-sm">
        <template v-if="listApproved.length > 0">
          <q-list bordered class="q-mb-sm">
            <q-item
              clickable
              v-for="(item, index) in listApproved"
              :key="index"
              @click="openItemSelected(item.id, item.name)"
            >
              <q-item-section avatar>
                <q-icon color="blue-9" name="checklist" size="md" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption
                  >Objetivos de la planificación</q-item-label
                >
                <q-item-label class="text-body2">
                  (OBJETIVOS): {{ item.name }}
                  <small class="text-orange">Aprobada</small>
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption> Inicio</q-item-label>
                <q-item-label class="text-body1">
                  <q-icon name="event" color="blue-9" size="xs" />
                  {{ item.fecha_inicio }}
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption> Fin</q-item-label>
                <q-item-label class="text-body1">
                  <q-icon name="event" color="blue-9" size="xs" />
                  {{ item.fecha_cierre }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </template>

        <template v-else>
          <q-card flat class="my-card column flex-center">
            <img
              src="list-empty.png"
              alt="lista vacia"
              style="width: 220px; height: 200px"
            />
            <br /><br />
            <div class="text-h6 text-dark text-center">
              Lista vacía <br />
              <small class="text-grey-5"
                >No se encontraron áreas de trabajo...</small
              >
            </div>
          </q-card>
        </template>
      </div>
    </q-card-section>
  </q-card>

  <GoalsDialog
    ref="goalsDialogRef"
    @form-saved="formSaved"
    :module-id="moduleId"
  />
</template>

<style lang="scss" scoped>
.userName {
  max-width: 150px;
  line-break: auto;
  white-space: normal;
  margin-left: 0.5rem;
  font-size: 0.7rem;
}
</style>
