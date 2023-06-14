import {
  OptionBase,
  OptionWithChildren,
  PaginationTable,
} from '../utils/types/index';
import { ref } from 'vue';
import accountTableService from '../services/AccountTableService';
import { userStore } from 'src/modules/Users/store/UserStore';
import { AccountTableStore } from '../../Accounts/store/AccountTableStore';
import Notification from '../utils/notify';

const user = userStore();
const { getListAccounts, reloadList } = AccountTableStore();
const { deleteMultipleAccounts, updateMultipleAccounts } =
  accountTableService();

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
      await getListAccounts(
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
      const res = await deleteMultipleAccounts(user.userCRM.id, accountIDS);
      if (res.code === 204) {
        reloadList();
        Notification(
          'positive',
          'check',
          `<strong> Acción exitosa¡ </strong> <br/> ${
            accountIDS.length > 1
              ? `Se eliminaron ${accountIDS.length} registros de la tabla.`
              : 'Se eliminó un registro de la tabla.'
          }`
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
  const updateMultiple = async (data: any, selectAccounts: OptionBase[]) => {
    try {
      const res = await updateMultipleAccounts(
        user.userCRM.id,
        selectAccounts,
        data
      );
      if (res.code === 200) {
        reloadList();
        Notification(
          'positive',
          'check',
          `<strong> Acción exitosa¡ </strong> <br/> ${
            selectAccounts.length > 1
              ? `Se actualizaron ${selectAccounts.length} registros de la tabla.`
              : 'Se actualizó un registro de la tabla.'
          }`
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
