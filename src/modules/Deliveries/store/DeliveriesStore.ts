

import { defineStore } from 'pinia';
import { useDeliveriesService } from '../services/DeliveriesService';
import { api } from 'boot/axios';

const {
  createDelivery: createDeliveryService,
  getDelivery: getDeliveryService,
  getDeliveryFormatted: getDeliveryFormattedService,
  deleteDelivery: deleteDeliveryService,
  updateDelivery: updateDelivery,
  updatePlaca:updatePlaca,
} = useDeliveriesService();
// import { api } from 'boot/axios';
// import { axios_LB_02 } from 'src/conections/axiosCRM';
import { CardInfoLead, RelationInfoLead } from '../utils/types';

export const useDeliveriesStore = defineStore('deliveries', {
  state: () => ({
    draft: {},
    CRM4_LB_02: process.env.CRM4_LB_02,
  }),
  actions: {
    async createDelivery(
      leadInfo: CardInfoLead,
      leadRelation: RelationInfoLead,
      firstComment: string,
      assignedUser: string
    ) {
      try {
        return await createDeliveryService(
          leadInfo,
          leadRelation,
          firstComment,
          assignedUser
        );
      } catch (error) {
        throw error;
      }
    },

    async deleteDelivery(id: string) {
      try {
        await deleteDeliveryService(id);
      } catch (error) {
        throw error;
      }
    },


    async getDelivery(id: string) {
      try {
        return await getDeliveryService(id);
      } catch (error) {
        throw error;
      }
    },
    async getDeliveryFormatted(id: string) {
      try {
        return await getDeliveryFormattedService(id);
      } catch (error) {
        throw error;
      }
    },

    async getHistoryChanges(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_02}/HANE_Entregas_Get_History_Changes/${id}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getHistoryInitial(id: string, module: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_02}/Get_HistoryInitial/${id}/${module}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    
    async updateDelivery(
      leadId: string,
      leadInfo: CardInfoLead,
      leadRelation: RelationInfoLead
    ) {
      try {
        return await updateDelivery(leadId, leadInfo, leadRelation);
      } catch (error) {
        throw error;
      }
    },

    async getRelationDelivery(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_02}/HANE_Entregas_Relation_Get/${id}`
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getProductDeliveries(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_02}/HANE_Entregas_Product_Deliveries/${id}`
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },

    async updateProductBaseDelivery(
      leadId: string,
      leadInfo: CardInfoLead,
      leadRelation: RelationInfoLead
    ) {
      try {
        return await updatePlaca(leadId, leadInfo, leadRelation);
      } catch (error) {
        throw error;
      }
    },

    async documentsByDelivery(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_02}/HANE_Entregas_Get_Documents/${id}`
        );
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getDeliverySurveysConducted(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_02}/HANE_Entregas_Encuestas_Realizadas/${id}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

  },
});


