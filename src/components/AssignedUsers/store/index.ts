import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { RolAssignedUser } from '../utils/types/types';
export const AssignedUserStore = defineStore('assignedStore', {
  state: () => ({
    //role:'' as string | object,
    role: {} as RolAssignedUser,
    CRM4_NS_02: process.env.CRM4_NS_02,
  }),
  getters: {},
  actions: {
    //*Action para obtener rol del usuario en Cuentas.
    async getRolAccount(usuario_id: string) {
      try {
        const {
          data: {
            view_detail: { panel_assigned_users },
          },
        } = await api.get(`${this.CRM4_NS_02}/api/accounts/${usuario_id}`);
        this.role = panel_assigned_users;
      } catch (error) {
        console.log('Error al obtener el rol:', error);
      }
    },

    //** ACTION PARA OBTENER EL ROL DE FILTRO DE USUARIOS ASIGNADOS */
    async getRolAssignedUser(idUser: string) {
      try {
        const { data } = await api.get(`${this.CRM4_NS_02}/users/${idUser}`);
        this.role = data;
      } catch (error) {
        throw error;
      }
    },
  },
});
