import { api } from 'boot/axios';
import { ref } from 'vue';
import { listModel } from '../models/List';

export const listComposable = () => {
  /**
   * * Datos de prueba
   */
  const list = ref(<listModel>{});
  const getList = async () => {
    const { data } = await api.get(
      '/src/modules/Surveys/composables/API_data.json'
    );
    return data;
  };

  /**
   * * Variable y metodo para abrir el dialog
   */
  const open = ref(false);
  const loading = ref(false);

  return {
    list,
    open,
    loading,
    getList,
  };
};
