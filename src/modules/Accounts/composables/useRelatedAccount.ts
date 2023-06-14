import { computed, onMounted, ref, watchEffect } from 'vue';
import {
  searchAccounts,
  deleteItem,
  getListRelatedAccounts,
  genericModel,
  addItem,
} from '../services/AccountRelatedService';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import Notification from '../utils/notify';

export const useRelatedAccounts = (parentId: string) => {
  const showDelete = ref(false);
  const showAdd = ref(false);
  const edit = ref(false);
  const loading = ref(false);
  const isCreation = ref(parentId);
  const search = ref('');
  const listAccounts = ref([] as genericModel[]);
  const listSelected = ref([] as genericModel[]);
  const itemSelected = ref({
    index: 0,
    user: {} as genericModel,
  });

  const selectItem = (index: number, user: genericModel, type: string) => {
    itemSelected.value = {
      index: index,
      user: user,
    };
    if (type === 'add') showAdd.value = !showAdd.value;
    else showDelete.value = !showDelete.value;
  };

  const removeItem = async () => {
    if (parentId) {
      loading.value = true;
      const { resp } = await deleteItem(itemSelected.value.user.id, parentId);
      resp.code == 200 ? showAlert('delete') : '';
      loading.value = false;
    } else listSelected.value.splice(itemSelected.value.index, 1);
  };

  const insertItem = async () => {
    if (parentId) {
      search.value = '';
      loading.value = true;

      const { resp } = await addItem(itemSelected.value.user.id, parentId);
      resp.code == 200 ? showAlert('create') : '';
      loading.value = false;
    } else {
      existItem(itemSelected.value.user.id) ??
        listSelected.value.push(itemSelected.value.user);
    }

    search.value = '';
  };

  onMounted(async () => {
    if (parentId) listSelected.value = await getListRelatedAccounts(parentId);
  });

  watchEffect(async () => {
    if (search.value.length >= 3) {
      loading.value = true;
      listAccounts.value = await searchAccounts(search.value);
      loading.value = false;
    }
  });

  /**
   * Sarch item in listSelected and return if this exists
   * @param id
   * @returns boolean
   */
  const existItem = (id: string) => {
    const exist = listSelected.value.find((el: genericModel) => el.id == id);
    return exist;
  };

  const showAlert = async (status: string) => {
    listSelected.value = await getListRelatedAccounts(parentId);
    if (status === 'create') {
      Notification('positive', 'check', 'Se agregó una cuenta relacionada.');
    } else {
      Notification(
        'warning',
        'delete_forever',
        'Se eliminó una cuenta relacionada.'
      );
    }
  };

  const editList = () => {
    edit.value = true;
    /**/
  };

  const cancelEdit = () => {
    edit.value = false;
    /**/
  };

  const clearData = () => {
    itemSelected.value = { user: {}, index: 0 };
  };

  const totalSelected = computed(() => {
    return listSelected.value.length;
  });

  return {
    showDelete,
    showAdd,
    edit,
    search,
    loading,
    isCreation,
    totalSelected,
    listAccounts,
    listSelected,
    itemSelected,
    selectItem,
    insertItem,
    removeItem,
    editList,
    cancelEdit,
    clearData,
    HANSACRM3_URL,
  };
};

export const useUtils = () => {
  const propsCreateAlert = {
    icon: 'person_add_alt_1',
    iconColor: 'positive',
    iconSize: '50px',
    title: '¿ Agregar cuenta relacionada ?',
    message: 'Esta cuenta se agregará a la lista de cuentas relacionadas.',
    btnColor: 'positive',
    btnText: 'Si, agregar',
  };

  const propsDeleteAlert = {
    icon: 'warning',
    iconColor: 'warning',
    iconSize: '50px',
    title: '¿ Eliminar cuenta relacionada ?',
    message: 'Esta cuenta se eliminará de la lista de cuentas relacionadas.',
    btnColor: 'negative',
    btnText: 'Si, eliminar',
  };

  return {
    propsCreateAlert,
    propsDeleteAlert,
  };
};
