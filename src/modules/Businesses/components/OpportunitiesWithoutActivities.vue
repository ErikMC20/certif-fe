<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useBusinessesStore } from '../store';
import OpportunityItem from './OpportunityItem.vue';

  interface Emits {
  (event: 'openOpportunity', id?: string): void;
}

const emits = defineEmits<Emits>();

const $q = useQuasar();
const businessesStore = useBusinessesStore();

const openOpportunity = (id: string) => {
  emits('openOpportunity', id);
  // opportunityDialogRef.value?.openDialogAccountTab(id);
};

$q.notify({
  message: 'Your oppportunities without activities',
});
</script>

<template>
  <span class="text-h6">
    Mostrando
    {{ businessesStore.opportunitiesWithoutActivities.length }} Oportunidades
  </span>
  <q-list bordered>
    <OpportunityItem
      :key="index"
      :opportunity="opp"
      @click="openOpportunity(opp.id)"
      v-for="(opp, index) in businessesStore.opportunitiesWithoutActivities.sort(
        (a, b) => b.monto - a.monto
      )"
    />
  </q-list>
</template>
