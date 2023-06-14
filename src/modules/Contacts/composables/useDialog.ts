import { ref, shallowRef, toRefs } from 'vue';
import type { Ref } from 'vue';
// import { AccountStore } from '../store/AccountStore';
// import { AccountModel } from '../utils/types/index';

// const { readAccount } = AccountStore();

interface TabDefinition {
  name: string;
  component: object;
  label: string;
  enabledForCreation: boolean;
}

interface UseDialogTabsOptions {
  titleDialog?: string;
  iconDialog?: string;
}

export const useDialogBase = () => {
  const open = ref(false);

  /**
   *
   * @param newStatus The value will be the new value of open if exists
   * @returns
   */
  const openDialog = (newStatus?: boolean): void => {
    if (newStatus) {
      open.value = newStatus;
      return;
    }
    open.value = !open.value;
  };
  return {
    open,
    openDialog,
  };
};

export const useDialogTabs = (
  tabsDefinition: TabDefinition[],
  options: UseDialogTabsOptions = {}
) => {
  const {
    titleDialog: defaultDialog = 'Cuadro de Dialogo',
    iconDialog: defaultIcon = 'person',
  } = options;

  const titleDialog = ref(defaultDialog);
  const iconDialog = ref(defaultIcon);
  const activeTabName = ref(tabsDefinition[0].name || '');
  const activeTabComponent = shallowRef<object>(tabsDefinition[0].component);
  const localId = ref('');

  const { open, openDialog } = useDialogBase();

  const swapCurrentTab = (value: string) => {
    activeTabComponent.value = tabsDefinition.filter(
      (t: TabDefinition) => t.name === value
    )[0].component;
  };

  const resetValues = () => {
    localId.value = '';
    titleDialog.value = defaultDialog;
    iconDialog.value = defaultIcon;
    activeTabName.value = tabsDefinition[0].name;
    activeTabComponent.value = tabsDefinition[0].component;
  };

  /**
   * This function opens a new Dialog with given parameters.
   * @param dialogTitle An Optional parameter, it has a default value
   * @param id id of the contact
   */
  const openDialogTab = (
    id = '',
    dialogTitle?: string,
    icon?: string
  ): void => {
    if (id) {
      localId.value = id;
    } else {
    }
    if (dialogTitle) {
      titleDialog.value = dialogTitle;
    }
    if (icon) {
      iconDialog.value = icon;
    }
    openDialog();
  };

  return {
    open,
    id: localId,
    iconDialog,
    activeTabName,
    titleDialog,
    activeTabComponent,
    openDialogTab,
    resetValues,
    swapCurrentTab,
  };
};

export const useDialogFormInfo = () => {
  const getAccount = async (id: string) => {
    // const data = await readAccount(id);
    const data = {};
    console.log('usedialog', data, id);

    return data;
  };

  return {
    getAccount,
  };
};
