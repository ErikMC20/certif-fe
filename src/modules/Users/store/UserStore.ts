import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { axios_LB_01 } from 'src/conections/axiosCRM';
import { HANSACRM3_URL } from 'src/conections/api_conectors';

interface GenericObjectModel {
  [key: string]: string;
}

export const userStore = defineStore('user', {
  state: () => ({
    userCRM: useLocalStorage('userCRM', {} as GenericObjectModel),
    token: '',
    module: '',
  }),
  getters: {
    getProfileURL(state) {
      return `${HANSACRM3_URL}/upload/users/${state.userCRM.id}`;
    },
  },
  actions: {
    /**
     * Función que trae la información del usario por medio de su ID
     * y genera su token de seguridad para el localstorage
     * @param idUser {String}  id del usuario
     *
     */
    async insertUser(idUser: string) {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('userCRM') || '');
      if (!token || !!user) {
        try {
          const { data } = await axios_LB_01.get(`/users/login/${idUser}`);
          this.saveToken(data.token, data.userCRM);
        } catch (error) {
          throw error;
        }
      } else {
        if (user.id !== idUser) {
          try {
            const { data } = await axios_LB_01.get(`/users/login/${idUser}`);
            this.saveToken(data.token, data.userCRM);
          } catch (error) {
            throw error;
          }
        }
      }
    },

    /**
     * Funcion permite guardar el token en el localstorage del navegador
     * @param token {string} token del usuario
     */
    saveToken(token: string, userCRM: GenericObjectModel) {
      localStorage.setItem('token', token);
      localStorage.setItem('userCRM', JSON.stringify(userCRM));
      this.token = token;
      this.userCRM = userCRM;
    },

    deleteToken() {
      localStorage.removeItem('token');
      localStorage.removeItem('userCRM');
      this.token = '';
      this.userCRM = {};
    },
  },
});
