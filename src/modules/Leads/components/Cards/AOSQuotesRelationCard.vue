<script lang="ts" setup>
import { ref } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { getRecordModuleInfo } from 'src/services/GlobalService';
import RelationDetailCard from './RelationDetailCard.vue';
import AdvancedProspectFilter from 'src/components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoPro.vue';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';

const props = withDefaults(
  defineProps<{
    id: string;
    moduleName: string;
    editMode: boolean;
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

const defaultData = {
  title: '',
  subtitle1: '',
  description: '',
};
const prospectFiltered = ref({} as { [key: string]: string | null });
const selectProspectDialog = ref(false);

const advancedProspectFilterRef = ref<InstanceType<
  typeof AdvancedProspectFilter
> | null>();

const getProspectDetail = async (id: string, assign = false) => {
  if (assign) isLoading.value = false;
  const response = await getRecordModuleInfo('AOS_Quotes', id, {
    allData: false,
    fields: ['name', 'assigned_user_name'],
  });
  const prospect = {
    title: response.name as string,
    description: response.assigned_user_name as string,
  };
  if (assign) {
    state.value = prospect;
    isLoading.value = false;
  }
  return prospect;
};

const openProspectFilter = () => {
  advancedProspectFilterRef.value?.openDialog();
};

const selectItem = (item: { [key: string]: string | null }) => {
  prospectFiltered.value = item;
  selectProspectDialog.value = true;
};

const assignProspect = async () => {
  console.log('your prospect', prospectFiltered.value.id);
  if (prospectFiltered.value.id) {
    emits('update:id', prospectFiltered.value.id);
    getProspectDetail(prospectFiltered.value.id, true);
  }
};

const deleteValue = async () => {
  emits('update:id', '');
  state.value = defaultData;
};

const { state, isLoading } = useAsyncState(async () => {
  if (props.id) {
    const response = await getProspectDetail(props.id);
    return response;
  }
  return defaultData;
}, defaultData);
</script>

<template>
  <RelationDetailCard
    v-if="!id"
    :module-name="moduleName"
    title="No Seleccionado"
    icon="analytics"
    no-data
  >
    <template v-if="editMode" #options>
      <q-btn
        @click="openProspectFilter"
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
    icon="analytics"
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
        @click="openProspectFilter"
        class="q-my-xs"
        color="primary"
        icon="open_in_new"
        round
        size="xs"
      />
    </template>
  </RelationDetailCard>
  <AdvancedProspectFilter
    account_id="''"
    title="Búsqueda de Prospectos"
    ref="advancedProspectFilterRef"
    @select-item="selectItem"
  />
  <AlertComponent
    title="¿Asignar Prospecto?"
    icon="warning"
    iconColor="warning"
    iconSize="50px"
    btn-color="primary"
    btn-text="Si, asignar"
    v-model="selectProspectDialog"
    @confirm="assignProspect"
    @denegate="selectProspectDialog = false"
  >
    <template #body>
      <span class="q-py-sm">
        ¿Esta seguro de asignar a {{ prospectFiltered.nombre }} como cuenta
        relacionado?
      </span>
    </template>
  </AlertComponent>
</template>
