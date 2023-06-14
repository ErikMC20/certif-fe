import { defineStore } from 'pinia';
import { Loading, QSpinnerPuff } from 'quasar';
import {
  getOneAssignment,
  updateAssignment,
  createAssignment,
} from '../services/useAssignmentService';
import { userStore } from 'src/modules/Users/store/UserStore';
import { BasicInformation } from '../utils/types';

const { userCRM } = userStore();

export const useAssignmentStore = defineStore('assignment', {
  state: () => ({
    isEditing: false,
    loading: false,
    cardsEdit: [false, false],
    payload: {
      id: '',
      codigo_c: '',
      name: '',
      description: '',
      cantidad_asig_c: '',
      status_c: '',
      operation_status_c: '',
      user_id: userCRM.id,
      instalacion_id: '',
      estimated_start_date_c: '',
      estimated_end_date_: '',
    },
  }),
  getters: {},
  actions: {
    async clearDataAssignment() {
      this.payload = {
        id: '',
        codigo_c: '',
        name: '',
        description: '',
        cantidad_asig_c: '',
        status_c: '',
        operation_status_c: '',
        user_id: userCRM.id,
        instalacion_id: '',
        estimated_start_date_c: '',
        estimated_end_date_: '',
      };
      this.loading = false;
    },
    async usecreateAssignment(
      information: BasicInformation,
      supervisor: string[],
      comment: string
    ) {
      console.log('create');
      try {
        Loading.show({
          spinner: QSpinnerPuff,
          message: 'Guardando Información',
        });

        const response = await createAssignment(
          information,
          supervisor,
          comment
        );
        this.payload = response.data;
        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error('No se puede guardar el prospecto');
      } finally {
        Loading.hide();
      }
    },
    async getWorkArea(id: string) {
      this.loading = true;
      try {
        const { data } = await getOneAssignment(id);
        this.payload = data;
        return data;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async updateWorkArea(moduleId: string, information: BasicInformation) {
      try {
        const response = await updateAssignment(moduleId, information);
        return response.data;
      } catch (error) {
        console.log(error);
      } finally {
        Loading.hide('udpate');
      }
    },
    changeEditing(status: boolean, card: number) {
      this.cardsEdit[card] = status;
      this.isEditing = this.cardsEdit.some((el) => el == true);
    },
  },
});
