import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
export const tableStore = defineStore('table', {
  state: () => ({
    pagination: useStorage('pagination', {
      sortBy: 'fecha_creacion',
      descending: true,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 10,
    }),
    requestBase: {
      pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: 'fecha_creacion',
        descending: 'desc' ? true : false,
      },
      filter: {},
    },
  }),
  actions: {},
});
