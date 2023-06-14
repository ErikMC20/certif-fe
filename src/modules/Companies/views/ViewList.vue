<script setup lang="ts">
import { onMounted, ref } from 'vue';
//import { useCompaniesStore } from '../store/companies';
import { TableSkeleton } from 'src/components';
import { userStore } from 'src/modules/Users/store/UserStore';
import CompanyDialog from '../components/Dialogs/CompanyDialog.vue';
import { useCompanyTableStore } from '../store/UseCompanyTableStore';

import {
Filter,
Pagination,
base
} from '../utils/types';


//properties
const props = withDefaults(
  defineProps<{
    idUser?: string;
    moduleId?: string;
  }>(),
  {
    idUser: '',
  }
);

// const prueba = ()=>{
//   await axios_LB_05.get()
// }

//Stores
const user = userStore();
const table = useCompanyTableStore();
const { setVisibleColumn, getListCompanies, reloadList, setPagination } =
  useCompanyTableStore();

//Refs
// const filterAdvancedRef = ref<InstanceType<typeof AdvancedFilterTable> | null>(
//   null
// );
// const projectDialogRef = ref<InstanceType<typeof ProjectDialog> | null>(null);
// const accountDialogRef = ref<InstanceType<typeof AccountDialog> | null>(null);

// const updateMassiveRef = ref<InstanceType<
//   typeof UpdateMassiveComponent
// > | null>(null);
const companyDialogRef = ref<InstanceType<typeof CompanyDialog> | null>(
  null
);


const onRequestTable = async (val: {
  pagination: Pagination;
  filter: Filter;
}) => {
 // await setPagination(val.pagination);
  await getListCompanies(val);
};

const onDeleteMultiple = (selected: base[]) => {
  const items = selected.map((el: base) => {
    return { id: el.id };
  });
  table.deleteMultiple(items);
};

const onUpdateMultiple = (selected: base[]) => {
  const items = selected.map((el: base) => {
    return { id: el.id };
  });
  // const data = <UpdateMassiveModel>updateMassiveRef.value?.getData();
  // table.updateMultiple(data, items);
};

const onSubmitDataFilter = () => {
  try {
    // table.data_filter = filterAdvancedRef.value?.dataFilter;
   // table.setFilterData();
    table.reloadList();
  } catch (error) {
    throw error;
  }
};

const onClearDataFilter = () => {
  try {
    // filterAdvancedRef.value?.clearFilter();
    table.clearFilterData();
    table.setFilterData();
    table.reloadList();
  } catch (error) {
    throw error;
  }
};

const onUpdateDataTable = async () => {
  try {
    await reloadList();
  } catch (error) {
    throw error;
  }
};

const openDialog = () => {
  console.log('opening... dialog');
  companyDialogRef.value?.openDialogTab();
};


const openItemSelected = (id: string, title:string) => {
  companyDialogRef.value?.openDialogTab(id, title);
};

onMounted(async () => {
  //isReady.value = false;
  //await getUserConfig();
  //isReady.value = true;
  //if (props.moduleId) openItemSelected(props.moduleId);
});

const constructorComp = async (idUser?: string) => {
  if (idUser) user.insertUser(idUser);
};

(() => {
  constructorComp(props.idUser);
})();
</script>

<template>

  <div :class="$q.platform.is.desktop ? 'q-pa-md' : 'q-pa-sm'">
    <table-component
      :rows="table.data_table.rows"
      :columns="table.data_table.columns"
      :total="table.pagination.rowsNumber"
      :rowsPerPage="table.pagination.rowsPerPage"
      :sortBy="table.pagination.sortBy"
      :descending="table.pagination.descending"
      :visible="table.visible_columns"
      :dataFilter="table.data_filter"
      :loading="table.loading"
      :defaultRows="false"
      :style="'height: 95dvh'"
      searchPlaceholder="Busqueda por: Razon_social, nro_resolucion_min,"
      @visibleColumns="setVisibleColumn"
      @submitFilter="onSubmitDataFilter"
      @updateMultiple="onUpdateMultiple"
      @deleteMultiple="onDeleteMultiple"
      @updateData="onUpdateDataTable"
      @update:props="onRequestTable"
      @clearFilter="onClearDataFilter"
      @openDialog="openDialog"

      v-if="true"
    >
      <template #rows="{ propsTable }">
        <q-tr :props="propsTable">
          <q-td class="text-left" >
            <q-checkbox v-model="propsTable.selected" flat dense />
          </q-td>
          <q-td key="name" :props="propsTable" :style="'width: 100px;'">
            <span class="text-blue-9 cursor-pointer" @click="openItemSelected(propsTable.row.id,  propsTable.row.name)">
              {{ propsTable.row.name }}
            </span>
          </q-td>
          <q-td key="razon_social_c" :props="propsTable" :style="'width: 100px;'">
            {{ propsTable.row.razon_social_c }}
          </q-td>
          <q-td key="direccion_c" :props="propsTable" :style="'width: 100px;'">
            {{ propsTable.row.direccion_c }}
          </q-td>
          <q-td key="resolucion_ministerial_c" :props="propsTable">
            {{ propsTable.row.resolucion_ministerial_c }}
          </q-td>
          <q-td key="phone_office" :props="propsTable">
            {{ propsTable.row.phone_office }}
          </q-td>
          <q-td key="ownership" :props="propsTable">
            {{ propsTable.row.ownership }}
          </q-td>
          <!--<q-td key="id_representante" :props="propsTable">
            <div
              class="text-primary"
              style="display: flex; align-items: center"
            >
              <small
                :style="'width: 150px;line-break: auto;white-space: normal;margin-left: 0.5rem;'"
              >
                {{ propsTable.row.nombre_representante }}
              </small>
            </div>
            <div></div>
          </q-td>-->
        </q-tr>
      </template>
      <template v-slot:buttons>
        <q-btn
          color="primary"
          label="Nuevo"
          v-if="!$q.screen.xs"
          @click="openDialog()"
        >
        </q-btn>
        <q-page-sticky :offset="[18, 0]" position="bottom-right" v-else>
          <q-btn
            fab
            color="primary"
            icon="add"
            @click="openDialog()"
          />
        </q-page-sticky>
      </template>
      <template #updateContent>
      </template>
      <template #filterContent>
      </template>
    </table-component>
    <TableSkeleton v-else />
  </div>
  <CompanyDialog ref="companyDialogRef" />
</template>
