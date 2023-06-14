import { defineStore } from 'pinia';
import { Loading, QSpinnerPuff } from 'quasar';
import {
  getOneWorkArea,
  updateWorkArea,
  createWorkArea,
} from '../services/useWorkAreasService';
import { userStore } from 'src/modules/Users/store/UserStore';
import { BasicInformation } from '../utils/types';
import { AssignedUserModel } from 'src/components/types';

const { userCRM } = userStore();

export const useWorkareaStore = defineStore('workarea', {
  state: () => ({
    isEditing: false,
    loading: false,
    cardsEdit: [false, false],
    payload: {
      id: '',
      codigo_c: '',
      name: '',
      description: '',
      pais_c: 'BO',
      idregion_c: '',
      iddivision_c: userCRM.iddivision,
      idamercado_c: userCRM.idamercado,
      user_id: userCRM.id,
      project_id: '',
      supervisor: '',
      comments: [],
    },
  }),
  getters: {},
  actions: {
    async clearDataWorkArea() {
      this.payload = {
        id: '',
        codigo_c: '',
        name: '',
        description: '',
        pais_c: 'BO',
        idregion_c: '',
        iddivision_c: userCRM.iddivision,
        idamercado_c: userCRM.idamercado,
        user_id: userCRM.id,
        project_id: '',
        supervisor: '',
        comments: [],
      };
      this.loading = false;
    },
    async useCreateWorkArea(
      information: BasicInformation,
      supervisor: string,
      comment: string
    ) {
      console.log('create');
      try {
        Loading.show({
          spinner: QSpinnerPuff,
          message: 'Guardando Información',
        });

        const response = await createWorkArea(information, supervisor, comment);
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
        const { data } = await getOneWorkArea(id);
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
        const response = await updateWorkArea(moduleId, information);
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
