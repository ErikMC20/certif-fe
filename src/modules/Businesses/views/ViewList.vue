<script lang="ts" setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';
import QuickFilter from '../components/QuickFilter.vue';
import KanbanPage from '../components/KanbanExample/KanbanPage.vue';
import CardSkeleton from '../components/CardSkeleton.vue';
import StatsFooter from '../components/StatsFooter.vue';
import ExpiredActivities from '../components/ExpiredActivities.vue';
import ExpiredOpportunities from '../components/ExpiredOpportunities.vue';
import OpportunitiesWithoutActivities from '../components/OpportunitiesWithoutActivities.vue';
import DialogComponent from '../components/Dialog/DialogComponent.vue';

import { useBusinesses } from '../composables/Core/useBusinesses/index';

const OpportunityDialog = defineAsyncComponent(
  () => import('src/modules/Opportunities/components/Dialogs/OpportunityDialog.vue')
);

const {
  isLoading,
  dialogs,
  businessesAmount,
  openDialog,
  searchByParams,
  filterInitialBusinesses,
  reloadData,
} = useBusinesses();

const opportunityDialogRef = ref<InstanceType<typeof OpportunityDialog> | null>(null);

const openOpportunityDialog = (id?: string) => {
  opportunityDialogRef.value?.openDialogAccountTab(id);
};

onMounted(() => {
  filterInitialBusinesses();
});
</script>
<template>
  <q-page class="main-page" padding>
    <QuickFilter @open-opportunity="openOpportunityDialog" @submit="searchByParams" />
    <div v-if="isLoading"><CardSkeleton /></div>
    <div v-else-if="businessesAmount === 0">NO data</div>
    <KanbanPage @open-opportunity="openOpportunityDialog" v-else />

    <StatsFooter @value-selected="openDialog" />
  </q-page>
  <DialogComponent v-model="dialogs.expiredActivities" title="Actividades Vencidas">
    <template #body>
      <ExpiredActivities />
    </template>
  </DialogComponent>
  <DialogComponent v-model="dialogs.expiredOpportunities" title="Oportunidades Vencidas">
    <template #body>
      <ExpiredOpportunities @open-opportunity="openOpportunityDialog" />
    </template>
  </DialogComponent>
  <DialogComponent
    v-model="dialogs.opportunitiesWithoutActivities"
    title="Oportunidades sin actividad"
  >
    <template #body>
      <OpportunitiesWithoutActivities @open-opportunity="openOpportunityDialog" />
    </template>
  </DialogComponent>
  <OpportunityDialog ref="opportunityDialogRef" @form-save="reloadData()" />
</template>

<style lang="scss" scoped>
.main-page {
  padding-bottom: 59px;
  display: flex;
  height: 100%;
  flex-direction: column;
}
#data > * {
  margin: 0px 5px;
}

#data {
  /* Firefox */
  * {
    scrollbar-width: auto;
    scrollbar-color: #4f4f4f #ffffff;
  }

  /* Chrome, Edge, and Safari */
  *::-webkit-scrollbar {
    width: 8px;
  }

  *::-webkit-scrollbar-track {
    background: #ffffff;
  }

  *::-webkit-scrollbar-thumb {
    background-color: #4f4f4f;
    border-radius: 10px;
    border: 3px solid #ffffff;
  }
}
</style>
