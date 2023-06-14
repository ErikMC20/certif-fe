<script lang="ts">
import { ref, onMounted } from 'vue';
import AdvancedFilter from '../components/AdvancedFilter.vue';
import UpdateMasive from '../components/UpdateMassive.vue';
import TableSkeleton from 'src/components/MainTable/TableSkeleton.vue';
import DeliveriesDialog from '../../Deliveries/components/Dialogs/DeliveriesDialog.vue';
import {
  PaginationTable,
  OptionWithChildren
} from '../utils/types';

import templateStore from 'src/stores/template/templateStore';
import { userStore } from 'src/modules/Users/store/UserStore';
import { DeliveriesTableStore } from 'src/modules/Deliveries/store/DeliveriesTableStore';
//import { LeadsTableStore } from '../../../../src/modules/leads/store/LeadsTableStore';
//import UpdateMassive from '../components/UpdateMassive.vue';
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
const tableStore = DeliveriesTableStore();
const template = templateStore();
const user = userStore();
const $q = useQuasar();

const animationSlopes = ref(false);
const activeFilterSlopes = ref(false);
const activeFilterRejectd = ref(false);
const activeFilterDelivered = ref(false);
const animationCancelled = ref(false);
const animationDelivered = ref(false);

const {
  setVisibleColumn,
  setPagination,
  deleteMultiple,
  getListDeliveries,
} = tableStore;

//* References
const reserveDialogRef = ref<InstanceType<typeof DeliveriesDialog> | null>(null);
const filterAdvanced = ref<InstanceType<typeof AdvancedFilter> | null>(null);
const updateMassiveRef = ref<InstanceType<typeof UpdateMasive> | null>(null);

/* Methods */
const onRequestTable = async (val: {
  pagination: PaginationTable;
  filter: OptionWithChildren;
}) => {
  await setPagination(val.pagination);
  await getListDeliveries(val);
};

// const onUpdateMultiple = (selected: OptionBase[]) => {
//   const contacts = selected.map((el: OptionBase) => {
//     return { id: el.id };
//   });
//   const data = updateMassiveRef.value?.data;
//   updateMultiple(data, contacts);
// };

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
  await reserveDialogRef.value?.openDialogDeliveryTab(id ? id : '');
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

const DataFilterCancelled = () => {
  activeFilterRejectd.value= !activeFilterRejectd.value;
  if(activeFilterRejectd.value==true){
    activeFilterDelivered.value=false;
    animationDelivered.value= false;
    activeFilterSlopes.value=false;
    animationSlopes.value= false;
    animationCancelled.value= true;
    tableStore.data_filter.estado='04';
  }else{
    animationCancelled.value= false;
    tableStore.data_filter.estado='';
  }
  try {
    tableStore.setFilterData();
    tableStore.reloadList();
  } catch (error) {
    console.log(error);
  }
};

const DataFilterDelivered = () => {
  activeFilterDelivered.value= !activeFilterDelivered.value;
  if(activeFilterDelivered.value==true){
    activeFilterRejectd.value=false;
    animationCancelled.value= false;
    activeFilterSlopes.value=false;
    animationSlopes.value= false;
    animationDelivered.value= true;
    tableStore.data_filter.estado='01';
  }else{
    animationDelivered.value= false;
    tableStore.data_filter.estado='';
  }
  try {
    tableStore.setFilterData();
    tableStore.reloadList();
  } catch (error) {
    console.log(error);
  }
};

const DataFilterSlopes = () => {
  activeFilterSlopes.value= !activeFilterSlopes.value;
  if(activeFilterSlopes.value==true){
    activeFilterDelivered.value=false;
    animationDelivered.value= false;
    activeFilterRejectd.value=false;
    animationCancelled.value= false;
    animationSlopes.value= true;
    tableStore.data_filter.estado='02';
  }else{
    animationSlopes.value= false;
    tableStore.data_filter.estado='';
  }
  try {
    tableStore.setFilterData();
    tableStore.reloadList();
  } catch (error) {
    console.log(error);
  }
};

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
      searchPlaceholder="Busqueda por: nombre, placa y lugar de entrega"
      @visibleColumns="setVisibleColumn"
      @submitFilter="onSubmitDataFilter"
      @clearFilter="onClearDataFilter"
      @update:props="onRequestTable"
      @openDetails="openDialog"
      @deleteMultiple="deleteMultiple"
      @updateData="onUpdateDataTable"
      v-if="isReady"
      :defaultRows="$q.screen.xs || $q.screen.sm  ? true:false"
    >
    <template #rows="{propsTable}">
      <q-tr :props="propsTable" >
        <q-td class="text-left" auto-width>
            <q-checkbox left-label v-model="propsTable.selected" flat dense  />
        </q-td>
        <q-td key="nombre" :props="propsTable">
          <a
           class="text-bold cursor-pointer flex items-center text-primary" @click="() => openDialog(propsTable.row.id)"
         >{{propsTable.row.nombre}}</a>
         {{propsTable.row.a_mercado}}
          </q-td>
          <q-td key="cuenta" :props="propsTable">
         <a
          class="text-bold cursor-pointer flex items-center text-primary"
        >{{propsTable.row.cuenta}}</a>
        {{propsTable.row.tipo_cuenta}}
         </q-td>
         <q-td key="score_percentage" :props="propsTable">
          <q-chip size="sm" >
              {{ propsTable.row.score_percentage || 'Sin encuesta' }}
          </q-chip>
          </q-td>
          <q-td key="estado" :props="propsTable">
          <q-chip  :icon="
            propsTable.row.estado=='Entregado' ? 'check'
            :propsTable.row.estado=='Cancelado' ? 'close':'motion_photos_off'" 
            size="sm"  square 
          :color="
           propsTable.row.estado=='Entregado' ? 'green-1'
          :propsTable.row.estado=='Rechazado' ? 'red-1'
          :propsTable.row.estado=='En progreso' ? 'orange-1':'grey-3'" 
          class="text-weight-bold" 
          :class="
           propsTable.row.estado=='Entregado' ? 'text-green-9'
          :propsTable.row.estado=='Cancelado' ? 'text-red'
          :propsTable.row.estado=='En progreso' ? 'text-orange':'text-grey'" >
              {{ propsTable.row.estado }}
          </q-chip>
          </q-td>
          <q-td key="fecha_creacion" :props="propsTable">
          <q-chip size="sm"  square color="grey-2"  class="text-weight-bold" >
             {{ propsTable.row.fecha_creacion }}
          </q-chip>
          </q-td>
          <q-td key="lugar" :props="propsTable">
          {{ propsTable.row.lugar }}
          </q-td>
          <q-td key="f_entrega" :props="propsTable">
          <q-chip  size="sm" square color="grey-2" class="text-weight-bold">
            {{ propsTable.row.f_entrega }}
          </q-chip>
          </q-td>
          <q-td key="descripcion" :props="propsTable">
          {{ propsTable.row.descripcion}}
         
          </q-td>
          <q-td key="placa" :props="propsTable">
          {{ propsTable.row.placa}}
         
          </q-td>
        
          
          <q-td key="reserva" :props="propsTable">
         
          <a
           class="text-bold cursor-pointer flex items-center text-primary"
         >{{propsTable.row.reserva}}</a>
        
          </q-td>
 
      </q-tr>
    </template>

    <template #searchButton>
      <div class="q-gutter-sm">
        <transition v-if="animationDelivered == true" :appear="animationDelivered == true ? true : false" :enter-active-class="
                            animationDelivered == true ? ' animated slideOutUp ' : ''
                          ">
          <q-btn size="sm" :color="activeFilterDelivered == false ? 'green-3' : 'green-8'" :label="tableStore.totalE+' Entregados'" icon="check"
            @click="DataFilterDelivered" :class="$q.screen.xs  ? 'full-width':''"/>
        </transition>
        <transition v-else :appear="animationDelivered == false ? true : false" :enter-active-class="
                            animationDelivered == false ? ' animated slideOutDown ' : ''
                          ">
          <q-btn size="sm" :color="activeFilterDelivered == false ? 'green-3' : 'green-8'" :label="tableStore.totalE+' Entregados'" @click="DataFilterDelivered"
            v-if="animationDelivered == false" :class="$q.screen.xs  ? 'full-width':''"/>
        </transition>
    
        <transition v-if="animationSlopes == true" :appear="animationSlopes == true ? true : false" :enter-active-class="
                            animationSlopes == true ? ' animated slideOutUp ' : ''
                          ">
          <q-btn size="sm" :color="activeFilterSlopes == false ? 'orange' : 'orange-8'" :label="tableStore.totalP+' En Progreso'" icon="check"
            @click="DataFilterSlopes" :class="$q.screen.xs  ? 'full-width':''"/>
        </transition>
        <transition v-else :appear="animationSlopes == false ? true : false" :enter-active-class="
                            animationSlopes == false ? ' animated slideOutDown ' : ''
                          ">
          <q-btn size="sm" :color="activeFilterSlopes == false ? 'orange-3' : 'orange-8'" :label="tableStore.totalP+' En Progreso'" @click="DataFilterSlopes"
            v-if="animationSlopes == false" :class="$q.screen.xs  ? 'full-width':''"/>
        </transition>

        <transition v-if="animationCancelled == true" :appear="animationCancelled == true ? true : false" :enter-active-class="
                            animationCancelled == true ? ' animated slideOutUp ' : ''
                          ">
          <q-btn size="sm" :color="activeFilterRejectd == false ? 'red-3' : 'red-8'" :label="tableStore.totalC+' Cancelados'" icon="check"
            @click="DataFilterCancelled" :class="$q.screen.xs  ? 'full-width':''"/>
        </transition>
        <transition v-else :appear="animationCancelled == false ? true : false" :enter-active-class="
                            animationCancelled == false ? ' animated slideOutDown ' : ''
                          ">
          <q-btn size="sm" :color="activeFilterRejectd == false ? 'red-3' : 'red-8'" :label="tableStore.totalC+' Cancelados'" @click="DataFilterCancelled"
            v-if="animationCancelled == false" :class="$q.screen.xs  ? 'full-width':''"/>
        </transition>
      </div>
    </template>

      <template v-slot:buttons>
        <q-btn
          color="primary"
          label="Nueva Entrega"
          @click="() => openDialog()"
          v-if="!$q.screen.xs"
          disable
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
  </div>
  <DeliveriesDialog ref="reserveDialogRef" @form-save="formSaved" />
</template>
