<script setup lang="ts">
import { ref } from 'vue';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { useAssignmentTableStore } from '../store/useAssignmentTableStore';
import { setDefaultAvatar } from 'src/composables';
import { TableSkeleton } from 'src/components';
import TableAdvancedFilter from '../components/Filters/TableAdvancedFilter.vue';
import AssignmentDialog from '../components/Dialogs/AssignmentDialog.vue';
import ApprovationDialog from '../components/Dialogs/ApprovationDialog.vue';

const props = defineProps<{
  moduleId: string;
}>();

const aTable = useAssignmentTableStore();

const { getListAssignations, setVisibleColumn } = useAssignmentTableStore();

const assignmentDialogRef = ref<InstanceType<typeof AssignmentDialog> | null>(
  null
);
const approvationDialogRef = ref<InstanceType<typeof ApprovationDialog> | null>(
  null
);

const filterAdvancedRef = ref<InstanceType<typeof TableAdvancedFilter> | null>(
  null
);

// const uploadDialogRef = ref<InstanceType<typeof UploadDialog> | null>(null);
const isReady = ref(true);

const openDialog = () => {
  assignmentDialogRef.value?.openDialogTab();
};
// const openUploadDialog = () => {
//   console.log('dsadsa');
//   uploadDialogRef.value?.openDialog();
// };

const openItemSelected = (id?: string, title?: string) => {
  assignmentDialogRef.value?.openDialogTab(id, title);
};

const openApprovationSelected = (id?: string) => {
  approvationDialogRef.value?.openDialogTab(id);
};

const onRequestTable = async (val: { pagination: any; filter: any }) => {
  await getListAssignations(props.moduleId, val);
};

const onUpdateDataTable = () => {
  console.log('update data table');
  aTable.reloadList(props.moduleId);
};

const onClearDataFilter = () => {
  try {
    filterAdvancedRef.value?.clearFilter();
    aTable.clearFilterData();
    onUpdateDataTable();
  } catch (error) {
    console.log(error);
  }
};

const onSubmitDataFilter = () => {
  try {
    aTable.data_filter = filterAdvancedRef.value?.dataFilter;
    onUpdateDataTable();
  } catch (error) {
    throw error;
  }
};
const setStatusColor = (status: string) => {
  const statusName = [
    {
      name: 'En revision',
      color: 'blue-1',
      textColor: 'blue',
      icon: 'timeline',
    },
    {
      name: 'Pendiente',
      color: 'teal-2',
      textColor: 'teal-7',
      icon: 'mode',
    },
    {
      name: 'En progreso',
      color: 'yellow-2',
      textColor: 'yellow-9',
      icon: 'timeline',
    },
    {
      name: '',
      color: 'yellow-2',
      textColor: 'yellow-9',
      icon: 'watch_later',
    },
    {
      name: 'Cerrado',
      color: 'green-2',
      textColor: 'green-9',
      icon: 'check',
    },
    {
      name: 'Rechazado',
      color: 'red-2',
      textColor: 'red-9',
      icon: 'close',
    },
  ];
  return statusName.find((el) => el.name === status);
};
</script>
<template>
  <div>
    <table-component
      ref="tableRef"
      :rows="aTable.data_table.rows"
      :columns="aTable.data_table.columns"
      :total="aTable.pagination.rowsNumber"
      :rowsPerPage="aTable.pagination.rowsPerPage"
      :sortBy="aTable.pagination.sortBy"
      :descending="aTable.pagination.descending"
      :visible="aTable.visible_columns"
      :dataFilter="aTable.data_filter"
      :loading="aTable.loading"
      :style="'height: calc(100dvh - 150px)'"
      :defaultRows="false"
      searchPlaceholder="Busqueda por: Nombre, Codigo 1, Codigo 2"
      @update:props="onRequestTable"
      @visibleColumns="setVisibleColumn"
      @submitFilter="onSubmitDataFilter"
      @updateMultiple="() => {}"
      @deleteMultiple="() => {}"
      @updateData="onUpdateDataTable"
      @clearFilter="onClearDataFilter"
      @openDialog="openDialog"
      v-if="isReady"
    >
      <template #rows="{ propsTable }">
        <q-tr :props="propsTable">
          <q-td class="text-left">
            <q-checkbox v-model="propsTable.selected" flat dense />
          </q-td>
          <q-td key="codigo" :props="propsTable" :style="'width: 100px;'">
            <div
              class="text-blue-9 cursor-pointer text-break"
              @click="
                openItemSelected(propsTable.row.id, propsTable.row.code_c)
              "
            >
              {{ propsTable.row.code_c }}
            </div>
          </q-td>
          <q-td key="nombre" :props="propsTable">
            {{ propsTable.row.area }}
          </q-td>
          <q-td key="supervisor" :props="propsTable">
            <q-item>
              <q-item-section top avatar>
                <q-avatar size="30px" class="shadow-1">
                  <img
                    :src="`${HANSACRM3_URL}/upload/users/${propsTable.row.id_supervisor}`"
                    @error="setDefaultAvatar"
                  />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ propsTable.row.nombre_supervisor }}
                </q-item-label>
                <small class="text-grey-6"> SUPERVISOR </small>
              </q-item-section>
            </q-item>
          </q-td>
          <q-td key="estado" :props="propsTable">
            <q-badge
              :color="setStatusColor(propsTable.row.estado)?.color"
              :text-color="setStatusColor(propsTable.row.estado)?.textColor"
              :label="propsTable.row.estado"
              class="q-pa-sm"
              style="width: 100px"
            />
          </q-td>

          <q-td key="fecha_inicio" :props="propsTable">
            {{ propsTable.row.fecha_inicio }}
          </q-td>
          <q-td key="fecha_fin" :props="propsTable">
            {{ propsTable.row.fecha_fin }}
          </q-td>

          <q-td key="estado_carga" :props="propsTable">
            <template v-if="propsTable.row.header_id">
              <q-btn
                icon="schedule"
                color="primary"
                label="Pendiente"
                dense
                flat
                class="q-px-sm"
                @click="openApprovationSelected(propsTable.row.header_id)"
                v-if="propsTable.row.estado_carga == 'Pendiente'"
              >
                <template v-slot:append>
                  <q-btn color="primary" icon="check" />
                </template>
              </q-btn>
              <q-btn
                icon="close"
                color="negative"
                label="Rechazado"
                flat
                dense
                @click="openApprovationSelected(propsTable.row.header_id)"
                v-if="propsTable.row.estado_carga == 'Rechazado'"
              />
              <q-btn
                color="grey-4"
                label="En revision"
                text-color="dark"
                flat
                dense
                v-if="propsTable.row.estado_carga == 'En revision'"
              >
                <template v-slot:append>
                  <q-btn color="primary" icon="check" />
                </template>
              </q-btn>
              <q-btn
                icon="check"
                color="positive"
                flat
                label="Aprobado"
                v-if="propsTable.row.estado_carga == 'Aprobado'"
                dense
              />
            </template>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:buttons>
        <q-btn color="primary" label="NUEVA ASIGNACION" @click="openDialog" />
      </template>
      <template #filterContent>
        <TableAdvancedFilter
          ref="filterAdvancedRef"
          @submit-filter="onSubmitDataFilter"
        />
      </template>
    </table-component>
    <TableSkeleton v-else />
  </div>
  <AssignmentDialog
    ref="assignmentDialogRef"
    :project-id="moduleId"
    @formSaved="onUpdateDataTable"
  />

  <ApprovationDialog
    ref="approvationDialogRef"
    @formSaved="onUpdateDataTable"
  />
</template>

<style scoped></style>
