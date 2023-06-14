<script lang="ts">
import { ref, onMounted } from 'vue';
import AdvancedFilter from '../components/AdvancedFilter.vue';
// import UpdateMasive from '../components/UpdateMassive.vue';
import TableSkeleton from 'src/components/MainTable/TableSkeleton.vue';
import GeneralDialog from '../components/Dialogs/GeneralDialog.vue';
import {
  PaginationTable,
  OptionWithChildren,
  OptionBase,
} from '../utils/types';
import { HANSACRM3_URL } from 'src/conections/api_conectors';

import templateStore from 'src/stores/template/templateStore';
import { userStore } from 'src/modules/Users/store/UserStore';
import { QuotationTableStore } from '../store/QuotationTableStore';
// import UpdateMassive from '../components/UpdateMassive.vue';
// import { tableStore } from '../../../stores/TableStore';
import { useQuasar } from 'quasar';
</script>

<script lang="ts" setup>
const props = defineProps<{
  nameModule?: string;
  idUser?: string;
  menu?: string;
}>();

const isReady = ref(true);
const tableStore = QuotationTableStore();
const template = templateStore();
const user = userStore();
const $q = useQuasar();

const {
  setVisibleColumn,
  setPagination,
  deleteMultiple,
  updateMultiple,
  getListQuotationModel,
} = tableStore;

//* References
const generalDialogRef = ref<InstanceType<typeof GeneralDialog> | null>(null);
const filterAdvanced = ref<InstanceType<typeof AdvancedFilter> | null>(null);
// const updateMassiveRef = ref<InstanceType<typeof UpdateMasive> | null>(null);

/* Methods */
const onRequestTable = async (val: {
  pagination: PaginationTable;
  filter: OptionWithChildren;
}) => {
  await setPagination(val.pagination);
  await getListQuotationModel(val);
};

const onUpdateMultiple = (selected: OptionBase[]) => {
  const contacts = selected.map((el: OptionBase) => {
    return { id: el.id };
  });
  // const data = updateMassiveRef.value?.data;
  // updateMultiple(data, contacts);
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
  await generalDialogRef.value?.openDialogAccountTab(id ? id : '');
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
      searchPlaceholder="Busqueda por: Nombre y Codigo AIO"
      @visibleColumns="setVisibleColumn"
      @submitFilter="onSubmitDataFilter"
      @clearFilter="onClearDataFilter"
      @update:props="onRequestTable"
      @openDetails="openDialog"
      @deleteMultiple="deleteMultiple"
      @updateMultiple="onUpdateMultiple"
      @updateData="onUpdateDataTable"
      v-if="isReady"
      :defaultRows="false"
    >
      <template #rows="{ propsTable }">
        <q-tr :props="propsTable">
          <q-td class="text-left" auto-width>
            <q-checkbox left-label v-model="propsTable.selected" flat dense />
          </q-td>
          <q-td key="name" :props="propsTable">
            <a
              class="text-bold cursor-pointer flex items-center"
              @click="openDialog(propsTable.row.id)"
            >
              <q-item-section>
                <q-item-label
                  lines="5"
                  :class="$q.dark.isActive ? 'text-white' : 'text-primary'"
                  >{{ propsTable.row.name }}
                </q-item-label>
                <q-item-label caption class="text-grey">{{
                  propsTable.row.name_amercado
                }}</q-item-label>
              </q-item-section>
            </a>
          </q-td>
          <q-td key="image" :props="propsTable">
            <q-avatar square size="50px" font-size="82px">
              <img
                :src="
                  HANSACRM3_URL +
                  '/upload/' +
                  propsTable.row.id +
                  '_modelo_image1_c'
                "
              />
            </q-avatar>
            <!-- {{
              HANSACRM3_URL +
              '/upload/' +
              propsTable.row.id +
              '_modelo_image1_c'
            }} -->
          </q-td>
          <q-td key="codigoaio_c" :props="propsTable">
            {{ propsTable.row.codigoaio_c }}
          </q-td>
          <q-td key="stock" :props="propsTable">
            {{ propsTable.row.stock }}
          </q-td>
          <q-td key="date_entered" :props="propsTable">
            {{ propsTable.row.date_entered }}
          </q-td>
          <q-td key="name_division" :props="propsTable">
            {{ propsTable.row.name_division }}
          </q-td>
          <q-td key="name_amercado" :props="propsTable">
            {{ propsTable.row.name_amercado }}
          </q-td>
          <q-td key="name_created_by" :props="propsTable">
            {{ propsTable.row.name_created_by }}
          </q-td>
          <q-td key="name_modified_user_id" :props="propsTable">
            {{ propsTable.row.name_modified_user_id }}
          </q-td>
        </q-tr>

        <!-- <pre>{{ propsTable }}</pre> -->
      </template>
      <!-- // ESTO FALTA POR TERMINAR -->

      <!-- <template #item-rows="{ propsTable }">
        <div class="col-xs-12 col-sm-6 grid-style-transition"
        :style="propsTable.selected ? 'transform: scale(0.95);' : ''">
          <q-card
          :class="propsTable.selected ? 'bg-grey-2' : ''"
          class="q-ma-sm"
        >
          <q-card-section>
            <q-checkbox flat v-model="propsTable.selected" dense />
          </q-card-section>
          <q-separator />
          <q-list dense>
            <template v-for="col in propsTable.cols" :key="col.name">
              <q-item>
                <q-item-section>
                  <q-item-label
                    caption
                    :class="$q.dark.isActive ? 'text-white' : 'text-grey'"
                    class="flex item-center"
                    >{{ col.label }}</q-item-label
                  >
                </q-item-section>
                <q-item-section>
                  <a
                    v-if="col.name === 'nombre'"
                    class="text-bold text-accent cursor-pointer flex items-center"
                    @click="onOpenDialogWithID(props.row.id)"
                  >
                    {{ col.value }}
                  </a>
                  <q-item-label
                    caption
                    v-else
                    :class="$q.dark.isActive ? 'text-white' : 'text-black'"
                    style="line-break: anywhere"
                    >{{ col.value }}</q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-separator color="grey-2" />
            </template>
          </q-list>
        </q-card>
        </div>
      </template> -->

      <!-- <template v-slot:buttons>
        <q-btn
          color="primary"
          label="Nuevo Modelo Cotizacion"
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
      </template> -->
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
  <GeneralDialog ref="generalDialogRef" @form-save="formSaved" />
</template>
