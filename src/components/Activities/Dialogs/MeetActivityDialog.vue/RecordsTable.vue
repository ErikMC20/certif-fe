<script lang="ts">
import { ref, onMounted } from 'vue';
import { QTable } from 'quasar';

import { useActivityStore } from 'src/stores/ActivityStore';
</script>
<script setup lang="ts">
defineProps<{
  titleTable: string;
}>();

const activityStore = useActivityStore();

const pagination = ref<{
  sortBy?: string | undefined;
  descending?: boolean | undefined;
  page?: number | undefined;
  rowsPerPage?: number | undefined;
  rowsNumber?: number | undefined;
}>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 3,
  rowsNumber: 10,
});
const loadingTable = ref(false);
const filterTable = ref('');
const recordsModule = ref([] as { [key: string]: string }[]);
const serverTable = ref<InstanceType<typeof QTable> | null>(null);
const titleTable = ref('Coincidencias');

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Nombre',
    align: 'left',
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
];

const onRequest = async (props: {
  pagination: {
    sortBy?: string | undefined;
    descending?: boolean | undefined;
    page?: number | undefined;
    rowsPerPage?: number | undefined;
    rowsNumber?: number | undefined;
  };
}) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  loadingTable.value = true;
  console.log('executing this....');
  try {
    await activityStore.readRecordsPerModule('Users', '10');
    recordsModule.value = activityStore.getsRecordsModule;
  } catch (error) {
    console.log(error);
  } finally {
    loadingTable.value = false;
  }
};

const onItemClick = async (item: string) => {
  console.log(item);

  switch (item) {
    case 'Accounts':
      titleTable.value = 'Cuentas';
      break;
    case 'Contacts':
      titleTable.value = 'Contactos';
      break;
    case 'Users':
      titleTable.value = 'Usuarios';
      break;
    case 'Prospects':
      titleTable.value = 'Publico Objetivo';
      break;

    default:
      titleTable.value = 'Coincidencias';
      break;
  }
  loadingTable.value = true;
  try {
    await activityStore.readRecordsPerModule(item, '10');
    recordsModule.value = activityStore.getsRecordsModule;
  } catch (error) {
    console.log(error);
  } finally {
    loadingTable.value = false;
  }
};

onMounted(async () => {
  serverTable.value?.requestServerInteraction();
  await activityStore.readRecordsPerModule('Users', '10');
  titleTable.value = 'Usuarios';
  recordsModule.value = activityStore.getsRecordsModule;
});
</script>

<template>
  <q-table
    style="height: -webkit-fill-available"
    :title="titleTable"
    ref="serverTable"
    row-key="id"
    :rows="recordsModule"
    :columns="columns"
    :v-model:pagination="pagination"
    :loading="loadingTable"
    :filter="filterTable"
    :rows-per-page-options="[5, 10]"
    binary-state-sort
    @request="onRequest"
  />
</template>
