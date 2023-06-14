<script lang="ts" setup>
import { ref } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { getRecordModuleInfo } from 'src/services/GlobalService';
import RelationDetailCard from './RelationDetailCard.vue';
import AdvancedFilterAccount from 'src/modules/Accounts/components/AdvancedFilter/AdvancedFilterAccount.vue';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';

const props = withDefaults(
  defineProps<{
    id: string;
    moduleName: string;
    editMode?: boolean;
  }>(),
  {
    moduleName: 'Name Module',
    editMode: false,
  }
);

const emits = defineEmits<{
  (event: 'assign'): void;
  (event: 'update:id', id: string): void;
  (event: 'delete', id: string): void;
}>();

const advancedAccountFilterRef = ref<InstanceType<
  typeof AdvancedFilterAccount
> | null>(null);

const defaultData = {
  title: '',
  subtitle1: '',
  description: '',
};
const accountFiltered = ref(
  {} as {
    [key: string]: string | null;
  }
);
const selectAccountDialog = ref(false);

const getAccountDetail = async (id: string, assign = false) => {
  if (assign) isLoading.value = true;
  const response = await getRecordModuleInfo('Accounts', id, {
    allData: false,
    fields: ['name', 'assigned_user_name', 'tipocuenta_c'],
  });
  const account = {
    title: response.name as string,
    subtitle1: response.tipocuenta_c as string,
    description: response.assigned_user_name as string,
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

const assignAccount = async () => {
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

const { state, isLoading } = useAsyncState(async () => {
  console.log(!!props.id ? 'with Props' : 'no props');
  if (props.id) {
    return await getAccountDetail(props.id);
  }
  return defaultData;
}, defaultData);
</script>

<template>
  <RelationDetailCard
    v-if="!id"
    :module-name="moduleName"
    title="No Seleccionado"
    icon="account_circle"
    no-data
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
        ¿Esta seguro de asignar a {{ accountFiltered.nombre }} como cuenta
        relacionado?
      </span>
    </template>
  </AlertComponent>
</template>
