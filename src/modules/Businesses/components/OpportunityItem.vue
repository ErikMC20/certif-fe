<script lang="ts" setup>
import type { OpportunitiesResponse } from '../utils/types';
import { useBusinesses } from '../composables/Core';
import { computed } from 'vue';

interface Props {
  opportunity: OpportunitiesResponse;
}

const props = defineProps<Props>();

const { salesPhase, formatAmount, formatDate } = useBusinesses();

const phaseFormatted = computed(
  () =>
    salesPhase.value.find(
      (phase) => phase.value === props.opportunity.faseDeVenta
    )?.label || null
);
</script>
<template>
  <q-item class="opportunity-item shadow-1" clickable v-ripple>
    <q-item-section avatar>
      <q-avatar size="md" color="primary" text-color="white" icon="work" />
    </q-item-section>
    <q-item-section class="column">
      <div>
        <q-chip color="primary" text-color="white" size="sm">
          {{ phaseFormatted }}
        </q-chip>
      </div>
      <div class="row justify-between">
        <div class="text-primary">{{ props.opportunity.nombre }}</div>
        <div class="text-weight-bold">
          {{ formatAmount(props.opportunity.monto) }}
        </div>
      </div>
      <div :class="[!props.opportunity.cuenta ? 'text-blue-grey-8' : '']">
        {{ props.opportunity.cuenta || 'Sin Cuenta' }}
      </div>
      <div class="text-negative">
        {{ formatDate(props.opportunity.fechaCierre) }}
      </div>
    </q-item-section>
  </q-item>
</template>

<style lang="scss" scoped>
.opportunity-item {
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  // border: 2px solid #858585;
  margin-bottom: 8px;
  background: white;
}
</style>
