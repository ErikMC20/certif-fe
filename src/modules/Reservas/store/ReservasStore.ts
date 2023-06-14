
import { defineStore } from 'pinia';
import { useReservasService } from '../services/ReservasService';
import { api } from 'boot/axios';

const {
  createReserva: createReservaService,
  convertReserva: convertReserva,
  getReservas: getReservasService,
  deleteReserva: deleteReservaService,
  getReservasFormatted:getReservasFormatted,
  updateReserva: updateReserva,
} = useReservasService();
import { CardInfo, RelationInfoLead } from '../utils/types';
export const useReservasStore = defineStore('reservas', {
  state: () => ({
    draft: {},
    CRM4_LB_02: process.env.CRM4_LB_02,
    CRM4_LB_GLOBAL: process.env.CRM4_LB_GLOBAL,
  }),
  actions: {
    async convertReserva(
      leadInfo: CardInfo,
      leadRelation: RelationInfoLead,
      firstComment: string,
      assignedUser: string
    ) {
      try {
        return await convertReserva(
          leadInfo,
          leadRelation,
          firstComment,
          assignedUser
        );
      } catch (error) {
        throw error;
      }
    },

    async deleteReserva(id: string) {
      try {
        await deleteReservaService(id);
      } catch (error) {
        throw error;
      }
    },

    async getReservas(id: string) {
      try {
        return await getReservasService(id);
      } catch (error) {
        throw error;
      }
    },
    async getReservasFormatted(id: string) {
      try {
        return await getReservasFormatted(id);
      } catch (error) {
        throw error;
      }
    },

    async getReservasDocuments(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_02}/HANQ_Reservas_Get_Documents/${id}`
        );
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getReservasDeliveries(id: string,div: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_02}/HANQ_Reservas_Get_Deliveries/${id}/${div}`
        );
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async updateReserva(
      leadId: string,
      leadInfo: CardInfo,
      leadRelation: RelationInfoLead
    ) {
      try {
        return await updateReserva(leadId, leadInfo, leadRelation);
      } catch (error) {
        throw error;
      }
    },

    async getHistoryInitial(id: string, module: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_02}/Get_HistoryInitial/${id}/${module}`
        );
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getHistoryChanges(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_02}/HANQ_Reservas_Get_History_Changes/${id}`
        );
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getMountReserve(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_02}/HANQ_Monto_Reserva_Get_List/${id}`
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getDocOpportunitiesReserve(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_02}/HANQ_Reservas_Opportunities_doc/${id}`
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    
    async getProductQuotesReserve(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_02}/Product_Quotes_Get_List/${id}`
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getCommercilOfferQuotesReserve(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_02}/Commercial_Offer_Aos_Quotes_Get/${id}`
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getRolesUserLoginReserve(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_02}/HANQ_Reservas_Roles_Get/${id}`
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getReservasOpportunities(id: string) {
      const module='Opportunities';
      try {
        const response = await api.get(
          `${this.CRM4_LB_GLOBAL}/module-get/${module}/${id}`
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getMountDetailReserve(id: string) {
      const module='HANQ_Monto_reserva';
      try {
        const response = await api.get(
          `${this.CRM4_LB_GLOBAL}/module-get/${module}/${id}`
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
});

