import { computed, onMounted, ref, watchEffect } from 'vue';
import { useQuasar } from 'quasar';
import {
  searchAccounts,
  deleteItem,
  getListRelated,
  genericModel,
  addItem,
} from '../services/ContactRelationsService';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { userStore } from 'src/modules/Users/store/UserStore';

export const useRelatedAccounts = (parentId: string) => {
  const $q = useQuasar();
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
  const { userCRM } = userStore();

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
      await deleteItem(itemSelected.value.user.id, parentId);
      showAlert('delete');
      loading.value = false;
    } else listSelected.value.splice(itemSelected.value.index, 1);
  };

  const insertItem = async () => {
    if (parentId) {
      search.value = '';
      loading.value = true;

      await addItem(userCRM.id, itemSelected.value.user.id, parentId);
      showAlert('create');
      loading.value = false;
    } else {
      existItem(itemSelected.value.user.id) ??
        listSelected.value.push(itemSelected.value.user);
    }

    search.value = '';
  };

  onMounted(async () => {
    if (parentId) listSelected.value = await getListRelated(parentId);
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
    listSelected.value = await getListRelated(parentId);
    if (status === 'create') {
      $q.notify({
        type: 'positive',
        message: 'Se agregó una cuenta relacionada.',
        position: 'bottom-right',
      });
    } else {
      $q.notify({
        icon: 'delete_forever',
        type: 'warning',
        message: 'Se eliminó una cuenta relacionada.',
        position: 'bottom-right',
      });
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
