import { ref, shallowRef } from 'vue';
import type { Ref } from 'vue';
import { AccountStore } from '../store/AccountStore';
import { AccountModel } from '../utils/types/index';

const { readAccount } = AccountStore();

interface TabDefinition {
  name: string;
  component: object;
  label: string;
}

export const useDialogBase = (open: Ref<boolean>) => {
  return {
    openDialog: () => (open.value = !open.value),
  };
};

export const useDialogTabs = (
  open: Ref<boolean>,
  tabsDefinition: TabDefinition[]
) => {
  const title = ref('');
  const isEditStatus = ref(false);
  const dialogType = ref<AccountModel>('Privada');
  const icon = ref('');
  const tab = ref(tabsDefinition[0].name);
  const isCreationMode = ref(false);
  const selectedComponent = shallowRef<object>(tabsDefinition[0].component);

  const { openDialog } = useDialogBase(open);

  const updateSelected = (value: string) => {
    selectedComponent.value = tabsDefinition.filter(
      (t: TabDefinition) => t.name === value
    )[0].component;
  };

  /**
   * Abre el nuevo dialogo con las opciones establecidas.
   * @param name El titulo del dialog
   * @param isEditingData El estado de Edicion via true/false
   * @param dialogTypeSelected El tipo de dialogo Private|Enterprise
   */
  const openDialogTitle = (
    name = 'Detalle de la Cuenta:',
    isEditingData = true,
    dialogTypeSelected = 'Privada' as AccountModel,
    creationMode = false
  ) => {
    isEditStatus.value = isEditingData;
    dialogType.value = dialogTypeSelected;
    isCreationMode.value = creationMode;
    openDialog();
    if (name) title.value = name;
  };

  const resetValues = () => {
    tab.value = tabsDefinition[0].name;
    selectedComponent.value = tabsDefinition[0].component;
  };

  return {
    icon,
    isEditStatus,
    dialogType,
    isCreationMode,
    tab,
    title,
    selectedComponent,
    openDialog,
    openDialogTitle,
    resetValues,
    updateSelected,
  };
};

export const useDialogFormInfo = () => {
  const getAccount = async (id: string) => {
    const data = await readAccount(id);
    console.log('usedialog', data, id);

    return data;
  };

  return {
    getAccount,
  };
};
