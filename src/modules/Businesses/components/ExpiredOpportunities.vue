<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useBusinessesStore } from '../store/index';

import OpportunityItem from './OpportunityItem.vue';
import moment from 'moment';

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
  message: 'Your oppportunities',
});
</script>
<template>
  <div>
    <div class="text-h6">
      Mostrando: {{ businessesStore.expiredOpportunities.length }} oportunidades
    </div>
    <q-list>
      <OpportunityItem
        :key="index"
        :opportunity="opp"
        @click="openOpportunity(opp.id)"
        v-for="(opp, index) in businessesStore.expiredOpportunities.sort(
          (a, b) => moment(b.fechaCierre).unix() - moment(a.fechaCierre).unix()
        )"
      />
    </q-list>
  </div>
</template>
