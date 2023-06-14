import { computed } from 'vue';
import { OpportunitiesTableStore } from '../../store/OpportunitiesTableStore';

const opportunitiesStore = OpportunitiesTableStore();

export function useOppportunities() {
  return {
    // Properties

    // Getters
    opportunities: computed(() => opportunitiesStore.pagination.rowsNumber),
    // Functions
  };
}
