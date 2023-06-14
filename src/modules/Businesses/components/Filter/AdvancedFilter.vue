<script setup lang="ts">
import { ref } from 'vue';
import AdvancedFilterFields from '../Dialog/Fields/AdvancedFilterFields.vue';
import { FilterFormat } from '../../utils/types';
import { useBusinesses } from '../../composables/Core';

interface Emits {
  (e: 'submitFilter'): void;
  (e: 'clearFilter'): void;
}

const emits = defineEmits<Emits>();
const { filter, searchFromFilter } = useBusinesses();

const advancedFilterRef = ref<InstanceType<typeof AdvancedFilterFields> | null>(
  null
);

const loading = ref(false);

const searchFromAdvancedFilter = async () => {
  // filter.value.term = '';
  await searchFromFilter();
  emits('submitFilter');
};

const resetFilter = () => {
  advancedFilterRef.value?.resetData();
};
</script>

<template>
  <dialog-component
    :headerDisabled="false"
    :footerDisabled="false"
    sizeDialog="dialog-sm"
    :loading="loading"
    keep-alive
  >
    <template #header>
      <q-toolbar class="bg-grey-9 q-pa-md">
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-avatar text-color="white">
                <q-icon name="filter_alt" size="md"></q-icon>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-white text-h5">Búsqueda</q-item-label>
              <q-item-label class="text-grey-4 text-caption" lines="1">
                Avanzada
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-space />
        <q-btn
          dense
          flat
          color="white"
          :icon="!$q.screen.xs ? 'close' : 'arrow_back_ios'"
          v-close-popup
        >
          <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
        </q-btn>
      </q-toolbar>
    </template>
    <template #body>
      <AdvancedFilterFields ref="advancedFilterRef" />
    </template>
    <template #footer>
      <q-btn
        color="primary"
        class="q-mr-md"
        icon="search"
        @click="searchFromAdvancedFilter"
        label="Buscar"
      >
      </q-btn>
      <q-btn
        color="primary"
        icon="filter_alt_off"
        outline
        @click="resetFilter"
        label="Limpiar"
      ></q-btn>
    </template>
  </dialog-component>
</template>

<style scoped lang="scss"></style>
