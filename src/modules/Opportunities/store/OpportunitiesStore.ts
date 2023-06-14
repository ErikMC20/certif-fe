import { defineStore } from 'pinia';
import { useOpportunitiesService } from '../services/OpportunitiesService';

const {
  createOpportunity: createOpportunityService,
  getOpportunity: getOpportunityService,
  getLeadFormatted: getLeadFormattedService,
  deleteLead: deleteLeadService,
  updateLead: udpateLeadService,
  // getAreaMercadoStore,
  // getTipoOportunidad,
  // getFaseOportunidad,
  // getDivisionStore,
} = useOpportunitiesService();
import { api } from 'boot/axios';
import { CardInfoOpportunity, OpportunityGlobal } from '../utils/types';

export const useOpportunitiesStore = defineStore('opportunities', {
  state: () => ({
    draft: {} as OpportunityGlobal,
    CRM4_LB_03: process.env.CRM4_LB_03,
    rol_opportunities: [],
    CRM4_LB_GLOBAL: process.env.CRM4_LB_GLOBAL,
    CRM4_LB_04: process.env.CRM4_LB_04,
  }),
  actions: {
    async createOpportunity(
      opportunityInfo: CardInfoOpportunity,
      leadRelation: CardInfoOpportunity,
      firstComment: string,
      assignedUser: string
    ) {
      try {
        return await createOpportunityService(
          opportunityInfo,
          leadRelation,
          firstComment,
          assignedUser
        );
      } catch (error) {
        throw error;
      }
    },
    async getOpportunity(id: string) {
      try {
        return await getOpportunityService(id);
      } catch (error) {
        throw error;
      }
    },
    async getLeadFormatted(id: string) {
      try {
        return await getLeadFormattedService(id);
      } catch (error) {
        throw error;
      }
    },

    async deleteLead(id: string) {
      try {
        await deleteLeadService(id);
      } catch (error) {
        throw error;
      }
    },

    async updateLead(
      leadId: string,
      opportunityInfo: CardInfoOpportunity,
      leadRelation: CardInfoOpportunity
    ) {
      try {
        return await udpateLeadService(leadId, opportunityInfo, leadRelation);
      } catch (error) {
        throw error;
      }
    },

    async getLeadsDocuments(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_03}/Lead_Get_Documents/${id}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getLeadsSurveysConducted(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_03}/Lead_Get_Encuesta_realizada/${id}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getRelations(id_mod: string, mod_relation: string) {
      //const div='03';
      try {
        const response = await api.get(
          `${this.CRM4_LB_04}/get-relationships-opportunities/${id_mod}/${mod_relation}`
        );
        //console.log('your response', response.data.data);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async gethistorychanges(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_04}/Opportunities_Get_History_Changes/${id}`
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
          `${this.CRM4_LB_04}/Get_HistoryInitial/${id}/${module}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getOpportunitiesLeads(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_04}/Oppotunities_Get_Leads/${id}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    async prueba(data: []) {
      try {
        this.rol_opportunities = data;
      } catch (error) {
        throw error;
      }
    },

    async getOpportunitiesProyect(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_04}/Oppotunities_Get_Proyect/${id}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getOpportunitiesContracts(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_04}/Oppotunities_Get_AOS_Contracts/${id}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getOpportunitiesHanqReservas(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_04}/Oppotunities_Get_HANQ_Reservas/${id}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getEncuestasRealizadas(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_04}/Opportunities_Encuestas_Realizadas/${id}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getListEntregas(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_04}/Opportunities_Entregas/${id}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    // ////////OPTIONS
    // async getDivisionLead() {
    //   this.listdivision = await getDivisionStore();
    //   return this.listdivision;
    // },
    // async getAreaMercaLead(id: string) {
    //   this.listmercado = await getAreaMercadoStore(id);
    //   return this.listmercado;
    // },
    // async getStoreTipoOportunidad(iddivision: string) {
    //   this.data = await getTipoOportunidad(iddivision);
    //   return this.data;
    // },
    // async getStoregetPhaseOpportunitie(iddivision: string) {
    //   this.listmercado = await getFaseOportunidad(iddivision);
    //   return this.listmercado;
    // },
  },
});
