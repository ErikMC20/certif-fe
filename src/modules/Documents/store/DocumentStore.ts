import { defineStore } from 'pinia';
import { api } from 'boot/axios';
export const DocumentStore = defineStore('Documents', {
  state: () => ({
    DocumentsCRM:[],
    CRM4_LB_01: process.env.CRM4_LB_01,
  }),
  getters: {
  },
  actions: {
    async getListDocuments(
      page: number,
      cantidad: number,
      sortBy: string,
      order: string,
      filter: string
    ) {
      try {
        const params = {
          page: page,
          rowsPerPage: cantidad,
          filter: filter,
          sortBy: sortBy,
          order: order,
        };
        console.log(JSON.stringify(params));

        const { data } = await api.get(
          `${this.CRM4_LB_01}/documents-viewList/?params=${JSON.stringify(params)}`
        );
        const total = await api.get(
          `${this.CRM4_LB_01}/documents-total/?filter=${JSON.stringify({
            filter: filter,
          })}`
        );
        console.log('aqui esta entrando', total.data);

        return { data, total };
      } catch (error) {
        throw error;
      }
    },
    async readDocuments(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_01}/contacts-getContacts/${id}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data[0];
      } catch (error) {
        console.log(error);
      }
    },

    async relacionDocuments(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_01}/documents-getRelationDoc/${id}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },
  },


});
    
    