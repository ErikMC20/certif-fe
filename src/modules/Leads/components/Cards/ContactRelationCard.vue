<script lang="ts" setup>
import { ref } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { useQuasar } from 'quasar';
import { getRecordModuleInfo } from 'src/services/GlobalService';
import RelationDetailCard from './RelationDetailCard.vue';
import AdvancedFilterContact from 'src/modules/Accounts/components/AdvancedFilter/AdvancedFilterContact.vue';
import { ContactFiltered } from '../../utils/types';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id: any;
    moduleName: string;
    editMode?: boolean;
    accountId?: string;
    errorMessage?: string;
  }>(),
  {
    moduleName: 'Name Module',
    editMode: false,
    accountId: '',
  }
);

const emits = defineEmits<{
  (event: 'assign'): void;
  (event: 'update:id', id: string): void;
  (event: 'delete', id: string): void;
}>();

const $q = useQuasar();

const advancedFilterContactRef = ref<InstanceType<typeof AdvancedFilterContact> | null>(
  null
);

const defaultData = {
  title: '',
  subtitle1: '',
  description: '',
  phone_mobile: '',
  email1: '',
};
const contactFiltered = ref({} as ContactFiltered);
const selectContactDialog = ref(false);
const validated = ref(false);

const getContactDetail = async (id: string, assign = false) => {
  if (assign) isLoading.value = true;
  const response = await getRecordModuleInfo<{
    name: string;
    assigned_user_name: string;
    phone_mobile: string;
    email1: string;
  }>('Contacts', id, {
    allData: false,
    fields: ['name', 'assigned_user_name', 'phone_mobile', 'email1'],
  });
  const contact = {
    title: response.name as string,
    description: response.assigned_user_name as string,
    phone_mobile: response.phone_mobile,
    email1: response.email1
  };
  if (assign) {
    state.value = contact;
    isLoading.value = false;
  }
  return contact;
};

const openContactFilter = () => {
  advancedFilterContactRef.value?.openDialog();
};

const selectItem = (contact: ContactFiltered) => {
  contactFiltered.value = contact;
  selectContactDialog.value = true;
};

const assignContact = async () => {
  emits('update:id', contactFiltered.value.id);
  advancedFilterContactRef.value?.onClose();
  getContactDetail(contactFiltered.value.id, true);
};

const deleteValue = async () => {
  emits('update:id', '');
  state.value = defaultData;
};

const validate = () => {
  reset();
  validated.value = true;
  return !!props.id;
};

const reset = () => {
  validated.value = false;
};

const { state, isLoading } = useAsyncState(async () => {
  if (props.id) {
    const response = await getContactDetail(props.id);
    return response;
  }
  return defaultData;
}, defaultData);

defineExpose({
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
    icon="perm_contact_calendar"
    no-data
    :error="!props.id && validated"
    :error-message="props.errorMessage"
  >
    <template v-if="editMode" #options>
      <q-btn
        @click="openContactFilter"
        class="q-my-xs"
        color="primary"
        icon="open_in_new"
        round
        size="xs"
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
    icon="perm_contact_calendar"
    :id="props.id"
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
        @click="openContactFilter"
      />
    </template>
  </RelationDetailCard>
  <AdvancedFilterContact
    ref="advancedFilterContactRef"
    title="Búsqueda de Contactos"
    :account_id="''"
    :alt-account-id="accountId"
    @select-item="selectItem"
  />
  <AlertComponent
    title="¿Asignar Contacto?"
    icon="warning"
    iconColor="warning"
    iconSize="50px"
    btn-color="primary"
    btn-text="Si, asignar"
    v-model="selectContactDialog"
    @confirm="assignContact"
    @denegate="selectContactDialog = false"
  >
    <template #body>
      <span class="q-py-sm">
        ¿Esta seguro de asignar a {{ contactFiltered.nombre }} como contacto relacionado?
      </span>
    </template>
  </AlertComponent>
</template>
