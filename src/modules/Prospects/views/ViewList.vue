<script lang="ts">
import { ref, onMounted } from 'vue';
import AdvancedFilter from '../components/AdvancedFilter.vue';
import UpdateMasive from '../components/UpdateMassive.vue';
import TableSkeleton from 'src/components/MainTable/TableSkeleton.vue';

import ProspectDialog from '../components/Dialogs/ProspectDialog.vue';
import {
  ProspectModel,
  PaginationTable,
  OptionWithChildren,
  OptionBase,
} from '../utils/types';

import templateStore from 'src/stores/template/templateStore';
import { userStore } from 'src/modules/Users/store/UserStore';
import { ProspectTableStore } from '../store/ProspectTableStore';
import { useQuasar } from 'quasar';
</script>

<script lang="ts" setup>
import UpdateCampaign from '../components/UpdateCampaign.vue';
const props = defineProps<{
  nameModule?: string;
  idUser?: string;
  menu?: string;
}>();

const isReady = ref(true);
const tableStore = ProspectTableStore();
const template = templateStore();

// * composable variables
const user = userStore();
const $q = useQuasar();

const {
  setVisibleColumn,
  setPagination,
  deleteMultiple,
  updateMultiple,
  updateCampaignMultiple,
  getListProspects,
} = tableStore;

//* References
const prospectDialogRef = ref<InstanceType<typeof ProspectDialog> | null>(null);
const filterAdvanced = ref<InstanceType<typeof AdvancedFilter> | null>(null);
const updateMassiveRef = ref<InstanceType<typeof UpdateMasive> | null>(null);
const updateCampaignRef = ref();
const tableRef = ref();

/* Methods */
const onRequestTable = async (val: {
  pagination: PaginationTable;
  filter: OptionWithChildren;
}) => {
  await setPagination(val.pagination);
  await getListProspects(val);
};

const onUpdateMultiple = (selected: OptionBase[]) => {
  const contacts = selected.map((el: OptionBase) => {
    return { id: el.id };
  });
  const data = updateMassiveRef.value?.data;
  updateMultiple(data, contacts);
};

const onSubmitDataFilter = () => {
  try {
    tableStore.data_filter = filterAdvanced.value?.dataFilter;
    tableStore.data_extra = filterAdvanced.value?.dataExtra;
    tableStore.setFilterData();
    tableStore.reloadList();
  } catch (error) {
    console.log(error);
  }
};

const onUpdateDataTable = async () => {
  try {
    await tableStore.reloadList();

    $q.notify({
      type: 'positive',
      color: 'positive',
      message: 'Actualización correcta',
      caption: 'Se han actualizado los datos',
    });
  } catch (e) {
    console.log(e);
  }
};

const updateCampaignModal = async () => {
  updateCampaignRef.value?.openDialog();
};

const updateCampaignSubmit = async (data: any) => {
  const selectedId = tableRef.value.selected.map((el: OptionBase) => {
    return { id: el.id };
  });

  updateCampaignMultiple(data, selectedId);
  tableRef.value.selected = [];
};

const openSelectedValue = (id: string) => {
  prospectDialogRef.value?.openDialogAccountTab(id);
};

const onClearDataFilter = () => {
  try {
    filterAdvanced.value?.clearFilter();
    tableStore.clearFilterData();
    tableStore.setFilterData();
    tableStore.reloadList();
  } catch (error) {
    console.log(error);
  }
};

const formSaved = () => {
  console.warn('Here form saved!!!!!')
  tableStore.reloadList();
};

const openDialog = async (id?: string) => {
  await prospectDialogRef.value?.openDialogAccountTab(id);
};

const constructorComp = (menu?: string, idUser?: string) => {
  if (menu) {
    template.hiddenMenu(menu);
  }
  if (idUser) {
    user.insertUser(idUser);
  } else {
    user.insertUser('');
  }
};

/** Mounted function */
onMounted(async () => {
  isReady.value = false;
  await tableStore.getUserConfig();
  isReady.value = true;
});

(() => {
  constructorComp(props.menu, props.idUser);
})();
</script>

<template>
  <div :class="$q.platform.is.desktop ? 'q-pa-md' : ''">
    <table-component
      ref="tableRef"
      :rows="tableStore.data_table.rows"
      :columns="tableStore.data_table.columns"
      :total="tableStore.pagination.rowsNumber"
      :rowsPerPage="tableStore.pagination.rowsPerPage"
      :sortBy="tableStore.pagination.sortBy"
      :descending="tableStore.pagination.descending"
      :visible="tableStore.visible_columns"
      :dataFilter="tableStore.data_filter"
      :loading="tableStore.loading"
      searchPlaceholder="Busqueda por: nombre, email y teléfono"
      @visibleColumns="setVisibleColumn"
      @submitFilter="onSubmitDataFilter"
      @clearFilter="onClearDataFilter"
      @update:props="onRequestTable"
      @openDetails="openSelectedValue"
      @deleteMultiple="deleteMultiple"
      @updateMultiple="onUpdateMultiple"
      @updateData="onUpdateDataTable"
      v-if="isReady"
    >
      <template v-slot:buttons>
        <q-btn
          color="primary"
          label="Nuevo Prospecto"
          @click="() => openDialog()"
          v-if="!$q.screen.xs"
        >
        </q-btn>
        <q-page-sticky
          position="bottom-right"
          :offset="[18, 18]"
          style="z-index: 1"
          v-else
        >
          <q-btn fab color="accent" icon="add" @click="openDialog()" />
        </q-page-sticky>
      </template>
      <template v-slot:filterContent>
        <AdvancedFilter
          ref="filterAdvanced"
          @submitFilter="onSubmitDataFilter"
        />
      </template>
      <template #updateContent>
        <UpdateMasive ref="updateMassiveRef" />
      </template>
      <template #massive_actions>
        <q-item clickable v-close-popup @click="updateCampaignModal">
          <q-item-section>
            <q-item-label>Asignar campaña</q-item-label>
          </q-item-section>
        </q-item></template
      >
    </table-component>
    <TableSkeleton v-else />
  </div>
  <UpdateCampaign ref="updateCampaignRef" @submitData="updateCampaignSubmit" />
  <ProspectDialog ref="prospectDialogRef" @form-saved="formSaved" />
</template>
