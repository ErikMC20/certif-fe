<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBusinesses } from '../composables/Core';
import QuoteItem from './Items/QuoteItem.vue';
import ReservationItem from './Items/ReservationItem.vue';
interface Props {
  id: string;
  destination: string;
}
const props = defineProps<Props>();
const isLoading = ref(false);
const rules = ref<string[]>([]);
const { getRules, getOpportunityData } = useBusinesses();
const opportunityData = ref({
  name: '',
});

const getOpportunity = async (id?: string) => {
  if (id) {
    isLoading.value = true;
    const response = await getOpportunityData(props.id, ['name']);
    rules.value = getRules(props.destination) || [];
    opportunityData.value = {
      name: (response?.name as string) || 'Sin Nombre',
    };
    isLoading.value = false;
  }
};

onMounted(async () => {
  if (props.id) {
    getOpportunity(props.id);
  }
});
</script>

<template>
  <div v-if="isLoading">cargando...</div>
  <div v-else-if="rules.length === 0">Sin reglas</div>
  <div v-else>
    <span class="text-h6">Oportunidad: {{ opportunityData.name }}</span>
    <br />
    <span>Reglas</span>
    <q-list class="q-mt-sm" bordered>
      <QuoteItem v-if="rules.includes('quotes')" :id="props.id" />
      <ReservationItem v-if="rules.includes('reserve')" :id="props.id" />
    </q-list>
  </div>
</template>

<style scoped></style>
