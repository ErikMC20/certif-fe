import { defineStore } from 'pinia';
export const useGoalsStore = defineStore('goals', {
  state: () => ({
    draft: {},
  }),
  getters: {},
  actions: {
    clearGoalData() {
      console.log('Eliminando datos');
    },
  },
});
