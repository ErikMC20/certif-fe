<script lang="ts">
import { ref, onMounted } from 'vue';
import ContactDialog from '../../components/Dialogs/ContactDialog.vue';
import AdvancedFilter from '../../components/AdvancedFilter/AdvancedFilter.vue';
import UpdateMasive from '../../components/UpdateMasive/UpdateMasive.vue';
import TableSkeleton from 'src/components/MainTable/TableSkeleton.vue';
import { listComposable } from '../../composables';
import { ContactTableStore } from '../../store/ContactTableStore';
import {
  OptionBase,
  OptionWithChildren,
  PaginationTable,
} from '../../utils/types';
import templateStore from 'src/stores/template/templateStore';
import { userStore } from 'src/modules/Users/store/UserStore';
import { useQuasar } from 'quasar';
import Notification from '../../../../composables/notify';
</script>

<script lang="ts" setup>
const props = defineProps<{
  nameModule?: string;
  idUser?: string;
  menu?: string;
}>();

const isReady = ref(true);

const tableStore = ContactTableStore();
const template = templateStore();
const user = userStore();
const { loading, deleMultiple, updateMultiple, getList } = listComposable();
const { setVisibleColumn, setPagination } = tableStore;

//* composable variables
const $q = useQuasar();

//* References
const contactDialogRef = ref<InstanceType<typeof ContactDialog> | null>(null);
const filterAdvanced = ref<InstanceType<typeof AdvancedFilter> | null>(null);
const updateMassiveRef = ref<InstanceType<typeof UpdateMasive> | null>(null);

/** Methods */
const onRequestTable = async (val: {
  pagination: PaginationTable;
  filter: OptionWithChildren;
}) => {
  await setPagination(val.pagination);
  await getList(val);
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
    loading.value = true;
    tableStore.data_filter = filterAdvanced.value?.dataFilter;
    tableStore.setFilterData();
    tableStore.reloadList();
    Notification(
      'positive',
      'task_alt',
      'Se busco con exitó el Filtro Avanzado!.',
      1000
    );
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
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

const onClearDataFilter = () => {
  try {
    loading.value = true;
    filterAdvanced.value?.clearFilter();
    tableStore.clearFilterData();
    tableStore.setFilterData();
    tableStore.reloadList();
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const dialogValuesChanged = () => {
  tableStore.reloadList();
};

const openDialog = (id = '', title = 'Detalle del Contacto') => {
  contactDialogRef.value?.openDialogTab(id, title);
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
  <div :class="$q.platform.is.desktop ? 'q-pa-md' : 'q-pa-sm'">
    <table-component
      :rows="tableStore.data_table.rows"
      :columns="tableStore.data_table.columns"
      :total="tableStore.pagination.rowsNumber"
      :rowsPerPage="tableStore.pagination.rowsPerPage"
      :sortBy="tableStore.pagination.sortBy"
      :descending="tableStore.pagination.descending"
      :visible="tableStore.visible_columns"
      :dataFilter="tableStore.data_filter"
      :loading="loading"
      searchPlaceholder="Busqueda por: nombre, ci, correo"
      @visibleColumns="setVisibleColumn"
      @submitFilter="onSubmitDataFilter"
      @clearFilter="onClearDataFilter"
      @update:props="onRequestTable"
      @openDetails="openDialog"
      @deleteMultiple="deleMultiple"
      @updateMultiple="onUpdateMultiple"
      @updateData="onUpdateDataTable"
      v-if="isReady"
    >
      <template v-slot:buttons>
        <q-btn
          color="primary"
          label="Nuevo contacto"
          @click="openDialog('', 'Nuevo Contacto')"
          v-if="!$q.screen.xs"
        >
        </q-btn>
        <q-page-sticky
          position="bottom-right"
          :offset="[18, 18]"
          style="z-index: 1"
          v-else
        >
          <q-btn
            fab
            color="primary"
            icon="add"
            @click="openDialog('', 'Nuevo Contacto')"
          />
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
    </table-component>
    <TableSkeleton v-else />
  </div>
  <ContactDialog ref="contactDialogRef" @contactChange="dialogValuesChanged" />
</template>
