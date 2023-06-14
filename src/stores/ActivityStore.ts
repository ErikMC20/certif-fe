import { defineStore } from 'pinia';
// import { Loading, QSpinnerPuff, QSpinnerGears } from 'quasar';
import { api } from 'boot/axios';

import { InfoDataMeetingModel } from '../components/types/index';
import {
  getRecordsByModule,
  createMeetingService,
  updateMeetingService,
} from 'src/services/MeetingsServices';
import { RemindersDatum } from '../components/types/index';

import { ActivityServices } from '../services/ActivityServices';
import { userStore } from 'src/modules/Users/store/UserStore';
import { Loading, QSpinnerPuff } from 'quasar';
import Notification from 'src/modules/Prospects/utils/notify';
import { updateMeetingAttributesService } from 'src/services/MeetingsServices';
const {
  getPhonesProspect,
  saveCall,
  getCallStatus,
  getCallType,
  getProspect,
  updateCall,
  getCalls,
  getNote,
  saveNote,
  updateNote,
  deleteCall,
  getPhonesSecun,
  getPhonesSecunId,
  saveComent,
  getPhonesRelaContact,
  deleteNote,
  getModules,
  getModuleTypeID,
  getFiltroPro,
  getFiltroAco,
  getFiltroCon,
  getFiltroLed,
} = ActivityServices();
const user = userStore();
export const useActivityStore = defineStore('Activity', {
  state: () => ({
    CRM4_LB_03: process.env.CRM4_LB_03,
    tel: '',
    callstatus: '',
    calltype: '',
    requestBase: {
      pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: 'fecha_creacion',
        descending: 'desc' ? true : false,
      },
      filter: {},
    },
    recordsModule: [] as { [key: string]: string }[],
    relacion: {},
  }),
  getters: {
    getsRecordsModule(state) {
      return state.recordsModule;
    },
  },
  actions: {
    async Get_list_Activities(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_03}/Get_list_Activities/${id}`
        );
        // console.log('your response', response.data.data[0]);
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    async readRecordsPerModule(moduleName: string, rowsPerPage = '10') {
      try {
        const response = await getRecordsByModule(moduleName, rowsPerPage);
        this.recordsModule = response;
      } catch (error) {
        throw error;
      }
    },
    async createMeeting(
      attributes: InfoDataMeetingModel,
      reminders: {
        user_invitees: string[];
        contact_invitees: string[];
        lead_invitees: string[];
        prospect_invitees: string[];
        reminders_data: RemindersDatum[];
      },
      attributes_comment: { [key: string]: string }
    ) {
      try {
        const creationMeetingBody = {
          meeting: {
            type: 'Meeting',
            attributes,
          },
          attributes_comment,
          ...reminders,
        };
        Loading.show({
          spinner: QSpinnerPuff,
          message: 'Creando la reunión',
        });
        console.log(JSON.stringify(creationMeetingBody));
        await createMeetingService(creationMeetingBody);
      } catch (error) {
        throw error;
      } finally {
        Loading.hide();
      }
    },
    async udpateMeeting(
      id: string,
      attributes: InfoDataMeetingModel,
      reminders: {
        user_invitees: string[];
        contact_invitees: string[];
        lead_invitees: string[];
        prospect_invitees: string[];
        reminders_data: RemindersDatum[];
      }
    ) {
      try {
        const updateMeetingBody = {
          meeting: {
            type: 'Meeting',
            id,
            attributes,
          },
          ...reminders,
        };
        Loading.show({
          spinner: QSpinnerPuff,
          message: 'Actualizando la reunión',
        });
        // console.log('updating...');
        // console.log(JSON.stringify(updateMeetingBody))
        await updateMeetingService(updateMeetingBody);
      } catch (error) {
        throw error;
      } finally {
        Loading.hide();
      }
    },
    async getPhonesPro(moduletype: string, id_prospect: string) {
      this.tel = await getPhonesProspect(moduletype, id_prospect);
      return this.tel;
    },
    async getCallStatusPro() {
      this.callstatus = await getCallStatus();
      return this.callstatus;
    },
    async getCallTypePro() {
      this.calltype = await getCallType();
      return this.calltype;
    },
    async saveCallPro(data: any, assigned: string, datacoment: any) {
      try {
        console.log('Guardando datos', data);
        const {
          asunto,
          telefono,
          tipollamada,
          estadollamada,
          dateestartCall,
          duracionhoraCall,
          duracionminutoCall,
          // dateendCall,
          descripcion,
          idrelaUserCall,
          prioridad,
          modulorela,
        } = data;

        const {
          bean_module,
          bean_id,
          visualizacion_c,
          relevance,
          description,
        } = datacoment;
        const dataSend = {
          attributes: {
            name: asunto,
            phone_c: telefono.phone,
            direction: tipollamada.value,
            status: estadollamada.value,
            date_start: dateestartCall,
            duration_hours: duracionhoraCall,
            duration_minutes: duracionminutoCall,
            // date_end: dateendCall,
            description: descripcion,
            parent_type: modulorela,
            parent_id: idrelaUserCall,
            created_by: user.userCRM.id,
            modified_user_id: user.userCRM.id,
            assigned_user_id: assigned,
            prioridad_c: prioridad,
            users: assigned,
          },
          attributes_comment: {
            bean_module: bean_module,
            bean_id: bean_id,
            assigned_user_id: assigned,
            created_by: user.userCRM.id,
            modified_user_id: user.userCRM.id,
            visualizacion_c: visualizacion_c,
            relevance: relevance,
            description: description,
          },
        };
        await saveCall(dataSend);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async getProspectPro(id_prospect: string) {
      this.calltype = await getProspect(id_prospect);
      return this.calltype;
    },
    async updateCallProStatus(id_pros: string) {
      try {
        // console.log('actualizando 1', id_pros);
        const dataSend = {
          attributes: {
            status: 'Held',
            modified_user_id: user.userCRM.id,
          },
        };
        // console.log('actualizado 2', dataSend);
        await updateCall(dataSend, id_pros);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async getCallsPro(id_call: string) {
      this.calltype = await getCalls(id_call);
      return this.calltype;
    },
    async updateCallPro(data: any, assigned: string, id_pros: string) {
      try {
        // console.log('Actualizawndo datos', data);
        const {
          asunto,
          telefono,
          tipollamada,
          estadollamada,
          dateestartCall,
          duracionhoraCall,
          duracionminutoCall,
          // dateendCall,
          descripcion,
          idrelaUserCall,
          prioridad,
          modulorela,
        } = data;
        // console.log('Actualizawndo datos222', data);
        const dataSend = {
          attributes: {
            name: asunto,
            phone_c: telefono.phone,
            direction: tipollamada.value,
            status: estadollamada.value,
            date_start: dateestartCall,
            duration_hours: duracionhoraCall,
            duration_minutes: duracionminutoCall,
            // date_end: dateendCall,
            description: descripcion,
            parent_type: modulorela,
            parent_id: idrelaUserCall,
            modified_user_id: user.userCRM.id,
            assigned_user_id: assigned,
            prioridad_c: prioridad,
          },
        };
        // console.log('Actualizawndo datos333', dataSend);
        await updateCall(dataSend, id_pros);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async getNotePro(id_note: string) {
      this.calltype = await getNote(id_note);
      return this.calltype;
    },
    async saveNotePro(data: any, assigned: string, datacoment: any) {
      try {
        // console.log('Guardando datos', dataChanging);
        const {
          asunto,
          descripcion,
          tipoarchivo,
          nombrearchivo,
          parent_pros,
          parent_typepros,
          filecontents,
        } = data;
        const {
          bean_module,
          bean_id,
          visualizacion_c,
          relevance,
          description,
        } = datacoment;
        const dataSend = {
          attributes: {
            name: asunto,
            description: descripcion,
            parent_type: parent_typepros,
            parent_id: parent_pros,
            file_mime_type: tipoarchivo,
            filename: nombrearchivo,
            created_by: user.userCRM.id,
            modified_user_id: user.userCRM.id,
            assigned_user_id: assigned,
            filecontents: filecontents,
          },
          attributes_comment: {
            bean_module: bean_module,
            bean_id: bean_id,
            assigned_user_id: assigned,
            created_by: user.userCRM.id,
            modified_user_id: user.userCRM.id,
            visualizacion_c: visualizacion_c,
            relevance: relevance,
            description: description,
          },
        };
        console.log(dataSend);
        await saveNote(dataSend);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async updateNotePro(data: any, assigned: string, id_note: string) {
      try {
        // console.log('Actualizawndo datos', data);
        const {
          asunto,
          descripcion,
          tipoarchivo,
          nombrearchivo,
          parent_pros,
          parent_typepros,
          filecontents,
        } = data;
        // console.log('Actualizawndo datos222', data);
        const dataSend = {
          attributes: {
            name: asunto,
            description: descripcion,
            parent_type: parent_typepros,
            parent_id: parent_pros,
            file_mime_type: tipoarchivo,
            filename: nombrearchivo,
            created_by: user.userCRM.id,
            modified_user_id: user.userCRM.id,
            assigned_user_id: assigned,
            filecontents: filecontents,
          },
        };
        // console.log('Actualizawndo datos333', dataSend);
        await updateNote(dataSend, id_note);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async deleteCallPro(id_call: string) {
      try {
        // console.log('Eliminando datos');
        await deleteCall(id_call, user.userCRM.id);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async getPhoneSecunPro() {
      this.calltype = await getPhonesSecun();
      return this.calltype;
    },
    async getPhoneSecunIdPro(id_phoneSecun: string) {
      this.calltype = await getNote(id_phoneSecun);
      return this.calltype;
    },
    async saveComentPro(data: any, assigned: string) {
      try {
        // console.log('Guardando datos', dataChanging);
        const {
          description,
          bean_module,
          bean_id,
          visualizacion_c,
          relevance,
        } = data;
        const dataSend = {
          comment: {
            bean_id: bean_id,
            created_by: user.userCRM.id,
            modified_user_id: user.userCRM.id,
            bean_module: bean_module,
            visualizacion_c: visualizacion_c,
            relevance: relevance,
            assigned_user_id: assigned,
            description: description,
          },
        };
        await saveComent(dataSend);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async getPhonesRelaContactPro(tabla_name: string, id_props: string) {
      this.calltype = await getPhonesRelaContact(tabla_name, id_props);
      return this.calltype;
    },
    async deleteNotePro(id_call: string) {
      try {
        // console.log('Eliminando datos');
        await deleteNote(id_call, user.userCRM.id);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async getModulesPro() {
      this.calltype = await getModules();
      return this.calltype;
    },
    async getModuleTypeIDPro(modulo: string, id_mod: string) {
      this.calltype = await getModuleTypeID(modulo, id_mod);
      return this.calltype;
    },
    async getFiltroProRela(params: any) {
      this.relacion = await getFiltroPro(params);
      return this.relacion;
    },
    async getFiltroAcoRela(params: any) {
      this.relacion = await getFiltroAco(params);
      return this.relacion;
    },
    async getFiltroConRela(params: any) {
      this.relacion = await getFiltroCon(params);
      return this.relacion;
    },
    async getFiltroLedRela(params: any) {
      this.relacion = await getFiltroLed(params);
      return this.relacion;
    },
  },
});
