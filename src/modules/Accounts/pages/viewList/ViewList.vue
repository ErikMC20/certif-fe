<script lang="ts">
import {
  AccountModel,
  OptionBase,
  OptionWithChildren,
  PaginationTable
} from '../../utils/types';
import AdvancedFilter from '../../components/AdvancedFilter/AdvancedFilterTable.vue';
import UpdateMultiple from '../../components/UpdateMultipleAccounts/UpdateMultiple.vue';
import AccountDialog from '../../components/Dialogs/AccountDialog.vue';
import TableSkeleton from 'src/components/MainTable/TableSkeleton.vue';
import { ref, onMounted } from 'vue';
import { listComposable } from '../../composables';
import { AccountTableStore, AccountStore } from '../../store';
import templateStore from 'src/stores/template/templateStore';
import { userStore } from 'src/modules/Users/store/UserStore';
import { useQuasar } from 'quasar';
import Notification from '../../../../composables/notify';
</script>
<script lang="ts" setup>
const props = defineProps<{
  nameModule: string;
  idUser?: string;
  menu?: string;
}>();

//* composable variables
const $q = useQuasar();

//* Imports and variables
const isReady = ref(true);
const tableStore = AccountTableStore();
const accountStore = AccountStore();
const template = templateStore();
const user = userStore();
const { loading, deleMultiple, updateMultiple, getList } = listComposable();
const { setVisibleColumn, setPagination } = tableStore;

//* Reference variables
const accountDialogRef = ref<InstanceType<typeof AccountDialog> | null>(null);
const filterAdvanced = ref<InstanceType<typeof AdvancedFilter> | null>(null);
const updateMultipleRef = ref<InstanceType<typeof UpdateMultiple> | null>(null);

/**
 * This function get the data of Selected User from backend
 * @param id Id of Selected User
 */
const openSelectedValue = (id: string) => {
  accountDialogRef.value?.openDialogAccountTab(id);
};

const savedForm = () => {
  tableStore.reloadList();
};

/** Methods */
const openDialog = (dialogTitle: string, dialogType: AccountModel) => {
  console.log('Opening a Void dialog with title', dialogTitle);
  accountDialogRef.value?.openDialogAccountTab(
    undefined,
    dialogType,
    dialogTitle
  );
};

const onRequestTable = async (val: {
  pagination: PaginationTable;
  filter: OptionWithChildren;
}) => {
  await setPagination(val.pagination);
  await getList(val);
};

const onUpdateMultiple = async (selected: OptionBase[]) => {
  const accounts = selected.map((el: OptionBase) => {
    return { id: el.id };
  });

  const data = updateMultipleRef.value?.data;
  try {
    $q.loading.show({
      message: 'Actualizando los usuarios asignados',
    });
    await updateMultiple(data, accounts);
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'error al asignar usuarios',
    });
  } finally {
    $q.loading.hide();
  }
};

const onSubmitDataFilter = async () => {
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
    console.log(tableStore);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const onUpdateDataTable = async () => {
  try {
    loading.value = true;
    await tableStore.reloadList();
    $q.notify({
      type: 'positive',
      color: 'positive',
      message: 'Actualización correcta',
      caption: 'Se han actualizado los datos',
    });
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
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

(async() => {
  constructorComp(props.menu, props.idUser);
  const resp_rol = await user.getRolActions('Accounts');
  accountStore.roles_accounts = resp_rol
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
      :withAvatar="true"
      searchPlaceholder="Busqueda por: nombre, nit, ci, codigo, email, telefono"
      @visibleColumns="setVisibleColumn"
      @submitFilter="onSubmitDataFilter"
      @clearFilter="onClearDataFilter"
      @update:props="onRequestTable"
      @openDetails="openSelectedValue"
      @deleteMultiple="deleMultiple"
      @updateMultiple="onUpdateMultiple"
      @updateData="onUpdateDataTable"
      v-if="isReady"
    >
      <template #buttons>
        <q-btn
          target="_blank"
          href="https://tableros.hansa.com.bo/reports/report/03%20-%20Automotriz/Cuentas/Facturas%20del%20Cliente"
          class=""
          icon="equalizer"
          :color="$q.dark.isActive ? 'grey-3' : 'primary'"
          dense
          flat
          :label="`${$q.screen.xs ? '' : ''}`"
        >
          <q-tooltip class="bg-primary" :offset="[10, 10]">
            Facturas Power BI
          </q-tooltip>
        </q-btn>
        <q-btn-dropdown
          color="primary"
          label="Nueva cuenta"
          v-if="!$q.screen.xs"
        >
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section
                @click="openDialog('Nueva Cuenta Empresa', 'Empresa')"
              >
                <q-item-label>Empresa</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section
                @click="openDialog('Nueva Cuenta Privada', 'Privada')"
              >
                <q-item-label>Privada</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-page-sticky
          position="bottom-right"
          :offset="[18, 18]"
          style="z-index: 1"
          v-else
        >
          <q-fab icon="add" direction="up" color="primary">
            <q-fab-action
              @click="openDialog('Nueva Cuenta Empresa', 'Empresa')"
              color="primary"
              icon="person_add"
              external-label
              label-position="left"
              label="Cuenta Empresa"
            />
            <q-fab-action
              @click="openDialog('Nueva Cuenta Privada', 'Privada')"
              color="primary"
              icon="group_add"
              external-label
              label-position="left"
              label="Cuenta Privada"
            />
          </q-fab>
        </q-page-sticky>
      </template>
      <template v-slot:filterContent>
        <AdvancedFilter
          ref="filterAdvanced"
          @submitFilter="onSubmitDataFilter"
        />
      </template>
      <template #updateContent>
        <UpdateMultiple ref="updateMultipleRef" />
      </template>
    </table-component>
    <TableSkeleton v-else />
  </div>
  <AccountDialog ref="accountDialogRef" @saved-form="savedForm" />
</template>

<style lang="scss">
.header-dialog {
  font-size: 0.9rem;
  @media screen and (min-width: $breakpoint-xs) {
    font-size: 1.15rem;
    display: flex;
  }
}
</style>
