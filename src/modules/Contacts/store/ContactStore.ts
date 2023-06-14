import { defineStore } from 'pinia';
import { api } from 'boot/axios';
export const ContactStore = defineStore('Contacts', {
  state: () => ({
    CRM4_LB_01: process.env.CRM4_LB_01,
  }),
  getters: {},
  actions: {
    async readContacts(id: string) {
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

    async getContactsOportunities(id: string, div: string) {
      //const div='03';
      try {
        const response = await api.get(
          `${this.CRM4_LB_01}/contacts_get_opportunities/${id}/${div}`
        );
        //console.log('your response', response.data.data);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getContactsQuotes(id: string, div: string) {
      //const div='03';
      try {
        const response = await api.get(
          `${this.CRM4_LB_01}/Contacts_Get_Quotes/${id}/${div}`
        );
        //console.log('your response', response.data.data);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getContactsDocuments(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_01}/Contacts_Get_Documents/${id}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getContactsRelatives(id: string, div: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_01}/Contacts_Get_Relatives/${id}/${div}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getContactHistoryChanges(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_01}/contacts-getHistoryChanges/${id}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getContactsDeliveries(id: string, div: string) {
      //const div='03';
      try {
        const response = await api.get(
          `${this.CRM4_LB_01}/contact_get_deliveries/${id}/${div}`
        );
        //console.log('your response', response.data.data);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getContactsReservations(id: string, div: string) {
      //const div='03';
      try {
        const response = await api.get(
          `${this.CRM4_LB_01}/contact_get_reservations/${id}/${div}`
        );
        //console.log('your response', response.data.data);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
