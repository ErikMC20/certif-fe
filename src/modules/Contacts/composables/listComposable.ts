import { ref } from 'vue';
import {
  OptionBase,
  PaginationTable,
  OptionWithChildren,
} from '../utils/types';
import contactTableService from '../services/ContactTableService';
import { userStore } from 'src/modules/Users/store/UserStore';
import { ContactTableStore } from '../store/ContactTableStore';
import Notification from 'src/modules/Accounts/utils/notify';

const user = userStore();
const { getListContacts, reloadList } = ContactTableStore();
const { deleteMultipleContacts, updateMultipleContacts } =
  contactTableService();

export const listComposable = () => {
  const loading = ref(false);

  const getList = async (props: {
    pagination: PaginationTable;
    filter: OptionWithChildren;
  }) => {
    const { pagination, filter } = props;
    const { page, rowsPerPage, sortBy, descending } = pagination;

    try {
      loading.value = true;
      await getListContacts(
        page,
        rowsPerPage,
        sortBy,
        descending ? 'desc' : 'asc',
        filter
      );
      loading.value = false;
    } catch (error) {
      Notification(
        'negative',
        'warning',
        'Ocurrió un error al cargar los datos <br/> <small> La petición no se realizó correctamente. <small/>'
      );
      throw error;
    }
  };

  const deleMultiple = async (data: OptionBase[]) => {
    try {
      const accountIDS = data.map((el) => {
        return { id: el.id };
      });
      const res = await deleteMultipleContacts(user.userCRM.id, accountIDS);
      if (res.code === 204) {
        reloadList();
        Notification(
          'positive',
          'check',
          `<strong> Acción exitosa¡ </strong> <br/> Se eliminaron ${accountIDS.length} registro de la tabla.`
        );
      }
    } catch (error) {
      Notification(
        'negative',
        'warning',
        '<strong> Ops! algo salió mal </strong> <br/>Ocurrió un error al eliminar los datos.'
      );
      throw error;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateMultiple = async (data: any, selectContacts: OptionBase[]) => {
    try {
      console.log(data);
      const res = await updateMultipleContacts(
        user.userCRM.id,
        selectContacts,
        data
      );

      if (res.code === 200) {
        reloadList();
        Notification(
          'positive',
          'check',
          `<strong> Acción exitosa¡ </strong> <br/> Se actualizaron ${selectContacts.length} registros de la tabla.`
        );
      }
    } catch (error) {
      Notification(
        'negative',
        'warning',
        '<strong> Ops! algo salió mal </strong> <br/>Ocurrió un error al eliminar los datos.'
      );
      throw error;
    }
  };

  return {
    loading,
    getList,
    deleMultiple,
    updateMultiple,
  };
};

export const dialogComposable = () => {
  const open = ref(false);
  const title = ref('');
  const icon = ref('');
  const handleOpen = (data: { title: string; icon: string }) => {
    open.value = !open.value;
    title.value = data.title;
    icon.value = data.icon;
  };

  return {
    open,
    title,
    icon,
    handleOpen,
  };
};
