import { defineStore } from 'pinia';
import { Loading, QSpinnerPuff } from 'quasar';
import { api } from 'boot/axios';
import { axios_LB_03 } from 'src/conections/axiosCRM';
import {
  ProspectResponseModel,
  ProspectInfoModel,
  CreationBodyProspect,
} from '../utils/types';
import { useContact } from 'src/composables/core';
import { ProspectService } from '../services/ProspectsService';
import {
  PhoneModel,
  EmailModel,
  phonesUpdateModel,
  emailsUpdateModel,
} from '../../../components/types/index';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import { useProspect } from '../composables';
import { CRM4_LB_03 } from 'src/conections/api_conectors';

type UpdateProspectOptions = {
  idUser?: string;
  phones?: phonesUpdateModel;
  emails?: emailsUpdateModel;
};

const languageStore = useFormOptionsStore();
const { createFormDraft } = useProspect();

export const useProspectStore = defineStore('Prospect', {
  state: () => ({
    selectedProspect: null as ProspectResponseModel | null,
    draftProspect: null as CreationBodyProspect | null,
    ProspectCRM: [],
    CRM4_LB_03: process.env.CRM4_LB_03,
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
  getters: {
    getSelectedProspectId(state) {
      return state.selectedProspect?.data.id
        ? state.selectedProspect?.data.id
        : '';
    },
    getSelectedHeader(state): {
      name: string;
      stateProspect: string;
      accountId: string;
      accountName: string;
    } {
      const result = languageStore.prospectOptions.status.find(
        (status: { label: string; value: string }) =>
          status.value === state.selectedProspect?.data.attributes.status
      );
      if (result) {
        return {
          name:
            state.selectedProspect?.data.attributes.full_name || 'No Asignado',
          stateProspect: result.label || 'Sin estado',
          accountId: state.selectedProspect?.data.attributes.account_id || '',
          accountName:
            state.selectedProspect?.data.attributes.account_name || '',
        };
      }
      return {
        name:
          state.selectedProspect?.data.attributes.full_name || 'No Asignado',
        stateProspect:
          state.selectedProspect?.data.attributes.status || 'Sin estado',
        accountId: state.selectedProspect?.data.attributes.account_id || '',
        accountName: state.selectedProspect?.data.attributes.account_name || '',
      };
    },
    getDescription(state) {
      return state.selectedProspect?.data.attributes.description || '';
    },
    getCRM3Direction(state) {
      return (
        state.selectedProspect?.data?.attributes?.primary_address_street || ''
      );
    },
    getDateEntered(state) {
      if (state.selectedProspect) {
        return state.selectedProspect.data.attributes.date_entered;
      }
      return '';
    },
    getProspectForm(state): ProspectInfoModel | null {
      if (typeof state.selectedProspect === 'object') {
        const prospectData = state.selectedProspect;
        if (prospectData)
          return {
            infoData: {
              salutation: prospectData?.data.attributes.salutation,
              first_name: prospectData?.data.attributes.first_name,
              last_name: prospectData?.data.attributes.last_name,
              title: prospectData?.data.attributes.title,
              ci_c: prospectData?.data.attributes.ci_c,
              primary_address_country:
                prospectData?.data.attributes.primary_address_country,
              primary_address_state_list_c:
                prospectData?.data.attributes.primary_address_state_list_c,
              primary_address_city:
                prospectData?.data.attributes.primary_address_city,
              description: prospectData?.data.attributes.description,
              assigned_user_id: prospectData?.data.attributes.assigned_user_id,
              status: prospectData?.data.attributes.status,
              created_by_name: prospectData?.data.attributes.created_by_name,
              modified_by_name: prospectData?.data.attributes.modified_by_name,
              //date_entered: prospectData?.data.attributes.date_entered,
              date_modified: prospectData?.data.attributes.date_modified,
              lead_source: prospectData?.data.attributes.lead_source || '',
            },
            mainPhone: {
              code: prospectData?.data.attributes.phone_mobile_cd_c || '',
              phone: prospectData?.data.attributes.phone_mobile || '',
              whatsapp: prospectData?.data.attributes.phone_mobile_wp_c || '',
            },
            officePhone: {
              code: prospectData?.data.attributes.phone_work_cd_c || '',
              phone: prospectData?.data.attributes.phone_work || '',
              whatsapp: prospectData?.data.attributes.phone_work_wp_c || '',
            },
            emails: prospectData?.data_emails.attributes_emails || [],
            phones: prospectData?.data_phones.attributes_phones || [],
            directionData: {
              address_street_generated_c:
                prospectData?.data.attributes.address_street_generated_c || '',
              latitude: prospectData?.data.attributes.jjwg_maps_lat_c || 0,
              longitude: prospectData?.data.attributes.jjwg_maps_lng_c || 0,
            },
          };
      }
      return null;
    },
    getDraftProspect(state): ProspectInfoModel | null {
      if (state.draftProspect) {
        return createFormDraft(state.draftProspect);
      }
      return null;
    },
  },
  actions: {
    async convertProspect(
      moduleId: string,
      idAccount: string,
      idContact?: string
    ) {
      try {
        Loading.show({
          spinner: QSpinnerPuff,
          message: 'Convirtiendo el prospecto',
        });
        const data = {
          attributes: {
            account_id: idAccount,
            contact_id: idContact || '',
            converted: 1,
            status: 'Converted',
          },
        };
        await ProspectService().updateProspect2(moduleId, data);
      } catch (error) {
        throw error;
      } finally {
        Loading.hide();
      }
    },
    createDraft(data: object) {
      this.draftProspect = data as CreationBodyProspect;
      console.log('aassb', data);
    },
    async createProspect(data: object) {
      try {
        Loading.show({
          spinner: QSpinnerPuff,
          message: 'Creando el Prospecto',
        });
        const response = await axios_LB_03.post('/prospect-new', data);
        this.selectedProspect = response.data;
      } catch (error) {
        console.log(error);
        throw new Error('No se puede guardar el prospecto');
      } finally {
        Loading.hide();
      }
    },
    async getProspect(id: string) {
      try {
        const response = await ProspectService().readProspect(id);
        this.selectedProspect = response;
        return response;
      } catch (error) {
        console.log(error);
      } finally {
      }
    },
    createBodyContact(
      idUser: string,
      phones?: PhoneModel[],
      emails?: EmailModel[]
    ) {
      return {
        idUser: idUser || '',
        emails: emails || [],
        phones: phones || [],
      };
    },
    async updateProspect(
      moduleId: string,
      data: object,
      options: UpdateProspectOptions = {}
    ) {
      const {
        idUser = '',
        phones = {} as phonesUpdateModel,
        emails = {} as emailsUpdateModel,
      } = options;
      const {
        createProspectPhonesEmails,
        updateProspectPhonesEmails,
        deleteProspectPhonesEmails,
      } = ProspectService();
      try {
        Loading.show({
          group: 'udpate',
          spinner: QSpinnerPuff,
          message: 'Actualizando el Prospecto',
        });
        await ProspectService().updateProspect(moduleId, data);
        if (!!idUser) {
          console.log('your idUser', idUser);
          Loading.show({
            group: 'udpate',
            spinner: QSpinnerPuff,
            message: 'Actualizando Telefonos y Correos',
          });
          const { updateBodyContact, deletedBodyContact, createdBodyContact } =
            useContact(idUser, phones, emails);
          await createProspectPhonesEmails(moduleId, createdBodyContact);
          await updateProspectPhonesEmails(moduleId, updateBodyContact);
          await deleteProspectPhonesEmails(moduleId, deletedBodyContact);
        }
      } catch (error) {
        console.log(error);
      } finally {
        Loading.hide('udpate');
      }
    },
    cleanSelectedProspect() {
      this.selectedProspect = null;
    },
    async getListProspect(
      page: number,
      cantidad: number,
      sortBy: string,
      order: string,
      filter: object
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
          `${CRM4_LB_03}/Prospect_advanced_filter/?params=${JSON.stringify(
            params
          )}`
        );
        const total = await api.get(
          `${CRM4_LB_03}/Prospect-total/?filter=${JSON.stringify({
            filter: filter,
          })}`
        );
        console.log('aqui esta entrando', data);

        return { data, total };
      } catch (error) {
        throw error;
      }
    },
    async deleteProspect(id: string) {
      try {
        Loading.show({
          spinner: QSpinnerPuff,
          message: 'Eliminando el prospecto',
        });
        await ProspectService().deleteProspect(id);
      } catch (error) {
        throw error;
      } finally {
        Loading.hide();
      }
    },
    // async readProspects(id: string) {
    //   try {
    //     const response = await api.get(
    //       `${CRM4_LB_01}/Prospect-getProspect/${id}`
    //     );
    //     // console.log('your response', response.data.data[0]);
    //     return response.data.data[0];
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },

    // async getProspectsOportunities(id: string, div: string) {
    //   //const div='03';
    //   try {
    //     const response = await api.get(
    //       `${CRM4_LB_01}/Prospect_get_opportunities/${id}/${div}`
    //     );
    //     //console.log('your response', response.data.data);
    //     return response.data.data;
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },

    async getProspectsQuotes(id: string, div: string) {
      //const div='03';
      try {
        const response = await api.get(
          `${CRM4_LB_03}/Prospect_Get_Quotes/${id}/${div}`
        );
        //console.log('your response', response.data.data);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getProspectsDocuments(id: string) {
      try {
        const response = await api.get(
          `${CRM4_LB_03}/Prospect_Get_Documents/${id}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getProspectsContact(id: string) {
      try {
        const response = await api.get(
          `${CRM4_LB_03}/Prospect_Get_Contacts/${id}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getProspectsHistoryChanges(id: string) {
      try {
        const response = await api.get(
          `${CRM4_LB_03}/Prospect_Get_HistoryChanges/${id}`
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
          `${CRM4_LB_03}/Get_HistoryInitial/${id}/${module}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async Get_list_Activities(id: string, dateStart: string, dateEnd: string) {
      try {
        const { data } = await api.get(
          `${CRM4_LB_03}/Get_list_Activities/${id}/${dateStart}/${dateEnd}`
        );
        return data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getProspectsCampaing(id: string, div: string) {
      //const div='03';
      try {
        const response = await api.get(
          `${CRM4_LB_03}/Prospect_Get_Campaigns/${id}/${div}`
        );
        //console.log('your response', response.data.data);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
