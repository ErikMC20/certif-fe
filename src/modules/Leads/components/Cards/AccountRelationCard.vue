<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { getRecordModuleInfo } from 'src/services/GlobalService';
import RelationDetailCard from './RelationDetailCard.vue';
import AdvancedFilterAccount from 'src/modules/Accounts/components/AdvancedFilter/AdvancedFilterAccount.vue';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import {
  AccountModel,
  AccountDataDraft,
} from '../../../../../../frontend-quasar-v3-vite/src/modules/Accounts/utils/types/index';

const AccountDialog = defineAsyncComponent(
  () => import('src/modules/Accounts/components/Dialogs/AccountDialog.vue')
);

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id: any;
    moduleName: string;
    editMode?: boolean;
    errorMessage?: string;
    accountCreationAsEvent?: boolean;
  }>(),
  {
    moduleName: 'Name Module',
    editMode: false,
    useAccountCreationAsEvent: false,
  }
);

const emits = defineEmits<{
  (event: 'assign'): void;
  (event: 'update:id', id: string): void;
  (event: 'contactCreated', id: string): void;
  (event: 'delete', id: string): void;
  (event: 'createAccount', type: AccountModel): void;
}>();

const advancedAccountFilterRef = ref<InstanceType<typeof AdvancedFilterAccount> | null>(
  null
);
const accountDialogRef = ref<InstanceType<typeof AccountDialog> | null>(null);

const defaultData = {
  title: '',
  subtitle1: '',
  description: '',
  celular_c: '',
  email1: '',
};
const accountFiltered = ref(
  {} as {
    [key: string]: string | null;
  }
);
const selectAccountDialog = ref(false);
const validated = ref(false);

const getAccountDetail = async (id: string, assign = false) => {
  if (assign) isLoading.value = true;
  const response = await getRecordModuleInfo<{
    name: string;
    tipocuenta_c: string;
    assigned_user_name: string;
    celular_c: string;
    email1: string;
  }>('Accounts', id, {
    allData: false,
    fields: ['name', 'assigned_user_name', 'tipocuenta_c', 'celular_c', 'email1'],
  });
  const account = {
    title: response.name as string,
    subtitle1: response.tipocuenta_c as string,
    description: response.assigned_user_name as string,
    celular_c: response.celular_c,
    email1: response.email1,
  };
  if (assign) {
    state.value = account;
    isLoading.value = false;
  }
  return account;
};

const openAccountFilter = () => {
  advancedAccountFilterRef.value?.openDialog();
};

const selectItem = (item: { [key: string]: string | null }) => {
  accountFiltered.value = item;
  selectAccountDialog.value = true;
};

const assignAccount = async (value?: {
  idAccount: string;
  idContact?: string | undefined;
}) => {
  if (!!value && Object.values(value).length > 0) {
    emits('update:id', value.idAccount);
    advancedAccountFilterRef.value?.onClose();
    getAccountDetail(value.idAccount, true);

    if (!!value.idContact) {
      emits('contactCreated', value.idContact);
    }
    return;
  }

  if (accountFiltered.value.id) {
    emits('update:id', accountFiltered.value.id);
    advancedAccountFilterRef.value?.onClose();
    getAccountDetail(accountFiltered.value.id, true);
  }
};

const deleteValue = async () => {
  emits('update:id', '');
  state.value = defaultData;
};

const validate = () => {
  validated.value = true;
  return !!props.id;
};

const reset = () => {
  validated.value = false;
};

const { state, isLoading, execute } = useAsyncState(async () => {
  console.log(!!props.id ? 'with Props' : 'no props');
  if (props.id) {
    return await getAccountDetail(props.id);
  }
  return defaultData;
}, defaultData);

const createNewAccount = (type: AccountModel) => {
  emits('createAccount', type);
};

const openAccountDialogWithData = (type: AccountModel, accountData: AccountDataDraft) => {
  console.log('finally here opening');
  accountDialogRef.value?.openDialogAccountTab(
    undefined,
    type,
    `Nueva cuenta ${type === 'Empresa' ? 'Empresa' : 'Privada'}`,
    undefined,
    accountData
  );
};

const updateAccount = async () => {
  console.log('update account...');
  await execute();
}

defineExpose({
  openAccountDialogWithData,
  validate,
  reset,
  state,
});
</script>

<template>
  <RelationDetailCard
    v-if="!id"
    :module-name="moduleName"
    title="No Seleccionado"
    icon="account_circle"
    no-data
    :error="!props.id && validated"
    :error-message="props.errorMessage"
    @module-updated="updateAccount()"
  >
    <template v-if="editMode" #options>
      <q-btn
        class="q-my-xs"
        color="primary"
        icon="open_in_new"
        round
        size="xs"
        @click="openAccountFilter"
    /></template>
  </RelationDetailCard>
  <q-card v-else-if="isLoading" bordered flat>
    <q-list bordered>
      <q-item>
        <q-item-section avatar>
          <q-skeleton type="QAvatar" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" width="80%" />
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
  <RelationDetailCard
    v-else
    :module-name="moduleName"
    :title="state.title"
    :description="state.description"
    :subtitle1="state.subtitle1"
    icon="account_circle"
    :id="props.id"
    @module-updated="updateAccount()"
  >
    <template v-if="editMode" #leftOptions>
      <q-btn
        @click="deleteValue"
        class="q-my-xs"
        color="negative"
        icon="remove"
        round
        size="xs"
      />
    </template>
    <template v-if="editMode" #options>
      <q-btn
        class="q-my-xs"
        color="primary"
        icon="open_in_new"
        round
        size="xs"
        @click="openAccountFilter"
      />
    </template>
  </RelationDetailCard>
  <AdvancedFilterAccount
    ref="advancedAccountFilterRef"
    title="Búsqueda de Cuentas"
    @select-item="selectItem"
    enable-creation
  >
    <template v-if="accountCreationAsEvent" #header>
      <q-btn-dropdown color="primary" label="Crear nueva cuenta" class="full-width">
        <q-list>
          <q-item clickable v-close-popup @click="createNewAccount('Privada')">
            <q-item-section>
              <q-item-label>Nueva cuenta privada</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="createNewAccount('Empresa')">
            <q-item-section>
              <q-item-label>Nueva cuenta empresa</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </template>
  </AdvancedFilterAccount>
  <AccountDialog
    ref="accountDialogRef"
    close-on-selected
    @captured-current-account="assignAccount"
  />
  <AlertComponent
    title="¿Asignar Cuenta?"
    icon="warning"
    iconColor="warning"
    iconSize="50px"
    btn-color="primary"
    btn-text="Si, asignar"
    v-model="selectAccountDialog"
    @confirm="assignAccount"
    @denegate="selectAccountDialog = false"
  >
    <template #body>
      <span class="q-py-sm">
        ¿Esta seguro de asignar a {{ accountFiltered.nombre }} como cuenta relacionado?
      </span>
    </template>
  </AlertComponent>
</template>
