import { defineStore } from 'pinia';
import { useLeadsService } from '../services/LeadsService';

const {
  createLead: createLeadService,
  getLead: getLeadService,
  getLeadFormatted: getLeadFormattedService,
  deleteLead: deleteLeadService,
  updateLead: udpateLeadService,
} = useLeadsService();
import { api } from 'boot/axios';
import { CardInfoLead, RelationInfoLead } from '../utils/types';

export const useLeadsStore = defineStore('leads', {
  state: () => ({
    draft: {},
    CRM4_LB_03: process.env.CRM4_LB_03,
    CRM4_LB_01: process.env.CRM4_LB_01,
  }),
  actions: {
    async createLead(
      leadInfo: CardInfoLead,
      leadRelation: RelationInfoLead,
      firstComment: string,
      assignedUser: string
    ) {
      try {
        return await createLeadService(
          leadInfo,
          leadRelation,
          firstComment,
          assignedUser
        );
      } catch (error) {
        throw error;
      }
    },
    // async createActivityFromLeada(data: TaskGlobalModel) {
    //   try {
    //     createModuleRecord<TaskGlobalModel, TaskGlobalModel>('Tasks', data)
    //   } catch (error) {

    //   }
    // },
    async getLead(id: string) {
      try {
        return await getLeadService(id);
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

    async getLeadsHistoryChanges(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_03}/Lead_Get_HistoryChanges/${id}`
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
          `${this.CRM4_LB_03}/Get_HistoryInitial/${id}/${module}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
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
      leadInfo: CardInfoLead,
      leadRelation: RelationInfoLead
    ) {
      try {
        return await udpateLeadService(leadId, leadInfo, leadRelation);
      } catch (error) {
        throw error;
      }
    },

    async getLeadsQuotes(id: string, div: string) {
      //const div='03';
      try {
        const response = await api.get(
          `${this.CRM4_LB_03}/Lead_Get_Quotes/${id}/${div}`
        );
        //console.log('your response', response.data.data);
        return response.data.data;
      } catch (error) {
        console.log(error);
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

    async getRelationAll(nameModule: string, idModule: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_03}/Lead_Get_All/${nameModule}/${idModule}`
        );
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getRelation(valor: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_01}/account-verify-emails_phones/${valor}`
        );
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
