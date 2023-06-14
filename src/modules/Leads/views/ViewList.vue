<script lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue';
import AdvancedFilter from '../components/AdvancedFilter.vue';
import UpdateMasive from '../components/UpdateMassive.vue';
import TableSkeleton from 'src/components/MainTable/TableSkeleton.vue';

import {
  PaginationTable,
  OptionWithChildren,
  OptionBase,
} from '../utils/types';

import templateStore from 'src/stores/template/templateStore';
import { userStore } from 'src/modules/Users/store/UserStore';
import { LeadsTableStore } from '../store/LeadsTableStore';
// import UpdateMassive from '../components/UpdateMassive.vue';
// import { tableStore } from '../../../stores/TableStore';
import { useQuasar } from 'quasar';
</script>

<script lang="ts" setup>
const LeadDialog = defineAsyncComponent(() => import('../components/Dialogs/LeadDialog.vue'));
const AccountDialog = defineAsyncComponent(() => import('src/modules/Accounts/components/Dialogs/AccountDialog.vue'));
const ContactDialog = defineAsyncComponent(() => import('src/modules/Contacts/components/Dialogs/ContactDialog.vue'));
const ProspectDialog = defineAsyncComponent(() => import('src/modules/Prospects/components/Dialogs/ProspectDialog.vue'));

const props = defineProps<{
  nameModule?: string;
  idUser?: string;
  menu?: string;
}>();

const isReady = ref(true);
const tableStore = LeadsTableStore();
const template = templateStore();
const user = userStore();
const $q = useQuasar();

const {
  setVisibleColumn,
  setPagination,
  deleteMultiple,
  updateMultiple,
  getListLeads,
} = tableStore;

//* References
const accountDialogRef = ref<InstanceType<typeof AccountDialog> | null>(null);
const ContactDialogRef = ref<InstanceType<typeof ContactDialog> | null>(null);
const leadDialogRef = ref<InstanceType<typeof LeadDialog> | null>(null);
const ProspectDialogRef = ref<InstanceType<typeof ProspectDialog> | null>(null);
const filterAdvanced = ref<InstanceType<typeof AdvancedFilter> | null>(null);
const updateMassiveRef = ref<InstanceType<typeof UpdateMasive> | null>(null);

/* Methods */
const onRequestTable = async (val: {
  pagination: PaginationTable;
  filter: OptionWithChildren;
}) => {
  await setPagination(val.pagination);
  await getListLeads(val);
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

const formSaved = async () => {
  await tableStore.reloadList();
};

const openDialog = async (id?: string) => {
  await leadDialogRef.value?.openDialogAccountTab(id ? id : '');
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

/** Mounted function */
onMounted(async () => {
  isReady.value = false;
  await tableStore.getUserConfig();
  isReady.value = true;
});

(() => {
  constructorComp(props.menu, props.idUser);
})();

const openDialogAccount = async (id?: string) => {
  accountDialogRef.value?.openDialogAccountTab(id ? id : '');
};
const openDialogContact = async (id?: string) => {
  await ContactDialogRef.value?.openDialogTab(id, 'Detalle del Contacto');
};
const openDialogProspect = async (id?: string) => {
  await ProspectDialogRef.value?.openDialogAccountTab(id, 'Detalle del Prospecto');
};
</script>

<template>
  <div :class="$q.platform.is.desktop ? 'q-pa-md' : ''">
    <table-component
      :rows="tableStore.data_table.rows"
      :columns="tableStore.data_table.columns"
      :total="tableStore.pagination.rowsNumber"
      :rowsPerPage="tableStore.pagination.rowsPerPage"
      :sortBy="tableStore.pagination.sortBy"
      :descending="tableStore.pagination.descending"
      :visible="tableStore.visible_columns"
      :dataFilter="tableStore.data_filter"
      :loading="tableStore.loading"
      searchPlaceholder="Busqueda por: nombre"
      @visibleColumns="setVisibleColumn"
      @submitFilter="onSubmitDataFilter"
      @clearFilter="onClearDataFilter"
      @update:props="onRequestTable"
      @openDetails="openDialog"
      @deleteMultiple="deleteMultiple"
      @updateMultiple="onUpdateMultiple"
      @updateData="onUpdateDataTable"
      v-if="isReady"
      :defaultRows="$q.screen.xs || $q.screen.sm  ? true:false"
    >
    <template #rows="{propsTable}">
      <q-tr :props="propsTable"  >
        <q-td class="text-left" auto-width>
            <q-checkbox left-label v-model="propsTable.selected" flat dense  />
        </q-td>
        <q-td v-for="{ name } in propsTable.cols" :key="name" :props="propsTable">
          <template v-if="name=='nombre'"   >
            <!-- <pre>{{ propsTable.row }}   </pre>         -->
            <a class="text-bold cursor-pointer flex items-center text-primary"  @click="() => openDialog(propsTable.row.id)">{{propsTable.row[name]}}</a>
          </template>
          <template v-else-if="name=='cuenta'"   >
            <a class="text-bold cursor-pointer flex items-center text-primary" @click="() => openDialogAccount(propsTable.row.account_id)">{{propsTable.row[name]}}</a>
          </template>
          <template v-else-if="name=='contacto'"   >
            <a class="text-bold cursor-pointer flex items-center" @click="openDialogContact(propsTable.row.contact_id)">
            <q-item-section>
              <q-item-label
                lines="5"
                :class="$q.dark.isActive ? 'text-white' : 'text-primary'"
                >{{ propsTable.row.contacto }}
              </q-item-label>
            </q-item-section>
          </a>
          </template>
          <template v-else-if="name=='prospecto'"   >
            <a class="text-bold cursor-pointer flex items-center" @click="openDialogProspect(propsTable.row.prospect_id)">
            <q-item-section>
              <q-item-label
                lines="5"
                :class="$q.dark.isActive ? 'text-white' : 'text-primary'"
                >{{ propsTable.row.prospecto }}
              </q-item-label>
            </q-item-section>
          </a>
          </template>
          <span v-else>
            {{propsTable.row[name]}}
          </span>
        </q-td>
      </q-tr>
    </template>
      <template v-slot:buttons>
        <q-btn
          color="primary"
          label="Nuevo lead"
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
          <q-btn fab color="accent" icon="add" @click="() => openDialog()" />
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
    <!-- <pre>{{ tableStore.data_table.rows }}</pre> -->
  </div>
  <LeadDialog ref="leadDialogRef" @form-save="formSaved" />
  <AccountDialog ref="accountDialogRef" @form-save="formSaved" />
  <ContactDialog ref="ContactDialogRef" />
  <ProspectDialog ref="ProspectDialogRef" />
</template>
