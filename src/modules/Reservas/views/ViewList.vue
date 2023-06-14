<script lang="ts">
import { ref, onMounted } from 'vue';
import AdvancedFilter from '../components/AdvancedFilter.vue';
import UpdateMasive from '../components/UpdateMassive.vue';
import TableSkeleton from 'src/components/MainTable/TableSkeleton.vue';
import ReservasDialog from '../../Reservas/components/Dialogs/ReservasDialog.vue';
import AccountDialog from 'src/modules/Accounts/components/Dialogs/AccountDialog.vue';
import ContactDialog from 'src/modules/Contacts/components/Dialogs/ContactDialog.vue';
import GeneralDialog from 'src/modules/Quotes/components/Dialogs/GeneralDialog.vue';
import DeliveriesDialog from '../../Deliveries/components/Dialogs/DeliveriesDialog.vue';
import {
  PaginationTable,
  OptionWithChildren,
  OptionBase
} from '../utils/types';

import templateStore from 'src/stores/template/templateStore';
import { userStore } from 'src/modules/Users/store/UserStore';
import { ReservasTableStore } from 'src/modules/Reservas/store/ReservasTableStore';
//import UpdateMassive from '../components/UpdateMassive.vue';
import { useQuasar } from 'quasar';
</script>
<script lang="ts" setup>
const props = defineProps<{
  nameModule?: string;
  idUser?: string;
  menu?: string;
}>();

const isReady = ref(true);
const tableStore = ReservasTableStore();
const template = templateStore();
const user = userStore();
const $q = useQuasar();
const animationBlocked = ref(false);
const activeFilterBlocked = ref(false);
const activeFilterRejectd = ref(false);
const activeFilterConfirmed = ref(false);
const animationRejected = ref(false);
const animationConfirmed = ref(false);
const {
  setVisibleColumn,
  setPagination,
  deleteMultiple,
 // updateMultiple,
  getListReservas,
} = tableStore;

//* References
const accountDialogRef = ref<InstanceType<typeof AccountDialog> | null>(null);
const contactDialogRef = ref<InstanceType<typeof ContactDialog> | null>(null);
const quotesDialogRef = ref<InstanceType<typeof GeneralDialog> | null>(null);
const deliveryDialogRef = ref<InstanceType<typeof DeliveriesDialog> | null>(null);
const reserveDialogRef = ref<InstanceType<typeof ReservasDialog> | null>(null);
const filterAdvanced = ref<InstanceType<typeof AdvancedFilter> | null>(null);
const updateMassiveRef = ref<InstanceType<typeof UpdateMasive> | null>(null);

/* Methods */
const onRequestTable = async (val: {
  pagination: PaginationTable;
  filter: OptionWithChildren;
}) => {
  await setPagination(val.pagination);
  await getListReservas(val);
};

const onUpdateMultiple = (selected: OptionBase[]) => {
  const contacts = selected.map((el: OptionBase) => {
    return { id: el.id };
  });
  const data = updateMassiveRef.value?.data;
  //updateMultiple(data, contacts);
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
  await reserveDialogRef.value?.openDialogReserveTab(id ? id : '');
};

const openDialogAccount = async (id?: string) => {
  await accountDialogRef.value?.openDialogAccountTab(id ? id : '');
};

const openDialogContact = async (id?: string) => {
  await contactDialogRef.value?.openDialogWithData('',id ? id : '');
};

const openDialogAquotes = async (id?: string) => {
  await quotesDialogRef.value?.openDialogQuotesTab(id ? id : '');
};

const openDialogDelivery = async (id?: string) => {
  await deliveryDialogRef.value?.openDialogDeliveryTab(id ? id : '');
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

const DataFilterRejected = () => {
  activeFilterRejectd.value= !activeFilterRejectd.value;
  if(activeFilterRejectd.value==true){
    activeFilterConfirmed.value=false;
    animationConfirmed.value= false;
    activeFilterBlocked.value=false;
    animationBlocked.value= false;
    animationRejected.value= true;
    tableStore.data_filter.estado='rejected';
  }else{
    animationRejected.value= false;
    tableStore.data_filter.estado='';
  }
  try {
    tableStore.setFilterData();
    tableStore.reloadList();
  } catch (error) {
    console.log(error);
  }
};

const DataFilterConfirmed = () => {
  activeFilterConfirmed.value= !activeFilterConfirmed.value;
  if(activeFilterConfirmed.value==true){
    activeFilterRejectd.value=false;
    animationRejected.value= false;
    activeFilterBlocked.value=false;
    animationBlocked.value= false;
    animationConfirmed.value= true;
    tableStore.data_filter.estado='confirmed';
  }else{
    animationConfirmed.value= false;
    tableStore.data_filter.estado='';
  }
  try {
    tableStore.setFilterData();
    tableStore.reloadList();
  } catch (error) {
    console.log(error);
  }
};

const DataFilterBlocked = () => {
  activeFilterBlocked.value= !activeFilterBlocked.value;
  if(activeFilterBlocked.value==true){
    activeFilterConfirmed.value=false;
    animationConfirmed.value= false;
    activeFilterRejectd.value=false;
    animationRejected.value= false;
    animationBlocked.value= true;
    tableStore.data_filter.estado='Sin registrar';
  }else{
    animationBlocked.value= false;
    tableStore.data_filter.estado='';
  }
  try {
    tableStore.setFilterData();
    tableStore.reloadList();
  } catch (error) {
    console.log(error);
  }
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
      searchPlaceholder="Busqueda por: nombre, estado y chasis"
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
        <q-td key="numero" :props="propsTable">
          <span class="text-blue-10">{{ propsTable.row.numero}}</span>
          </q-td>
        <q-td key="nombre" :props="propsTable">
          <a
           class="text-bold cursor-pointer flex items-center text-primary" @click="() => openDialog(propsTable.row.id)"
         >{{propsTable.row.nombre}}</a>
         {{propsTable.row.a_mercado}}
          </q-td>
          <q-td key="estado" :props="propsTable">
          <q-chip  :icon="propsTable.row.estado=='Confirmado' ? 'check':propsTable.row.estado=='Rechazado' ? 'close':'motion_photos_off'" size="sm"  square :color="propsTable.row.estado=='Confirmado' ? 'green-1':propsTable.row.estado=='Rechazado' ? 'red-1':'grey-3'" class="text-weight-bold" 
            :class="propsTable.row.estado=='Confirmado' ? 'text-green-9':propsTable.row.estado=='Rechazado' ? 'text-red':'text-grey'" >
              {{ propsTable.row.estado }}
            </q-chip>
          </q-td>
          <q-td key="fecha_creacion" :props="propsTable">
          <q-chip size="sm"  square color="grey-2"  class="text-weight-bold" >
             {{ propsTable.row.fecha_creacion }}
          </q-chip>
          </q-td>
          <q-td key="d_transcurridos" :props="propsTable">
          <q-chip size="sm"  square color="orange-2"  class="text-weight-bold" >
             {{ propsTable.row.d_transcurridos }}
          </q-chip>
          </q-td>
          <q-td key="f_vencimiento" :props="propsTable">
          <q-chip size="sm"  square color="grey-2"  class="text-weight-bold" >
            <q-icon name="event" class="q-mr-sm" /> {{ propsTable.row.f_vencimiento }}
          </q-chip>
          </q-td>
          <q-td key="descripcion" :props="propsTable"  >
          
          <div :style="{ width: tableStore.visible_columns.length < 6 ? 'auto' : '100px' }"
            class="truncate"            
          >
            {{ propsTable.row.descripcion }} 
            <q-tooltip 
              :offset="[10, 10]" 
              class="bg-primary" 
              v-if="JSON.stringify(propsTable.row.descripcion ?? '').length > 13" 
            >
              {{ propsTable.row.descripcion }}
            </q-tooltip>
          </div>
         
          </q-td>
          <q-td key="cuenta" :props="propsTable">
          
          <a
           class="text-bold cursor-pointer flex items-center text-primary" @click="() => openDialogAccount(propsTable.row.idAccount)"
         >{{propsTable.row.cuenta}}</a>
         {{propsTable.row.tipo_cuenta}}
          </q-td>
          <q-td key="contacto" :props="propsTable">
          
          <a
           class="text-bold cursor-pointer flex items-center text-primary"  @click="() => openDialogContact(propsTable.row.idContact)"
         >{{propsTable.row.contacto}}</a>
        
          </q-td>
          <q-td key="cotizacion" :props="propsTable">
         
          <a
           class="text-bold cursor-pointer flex items-center text-primary"  @click="() => openDialogAquotes(propsTable.row.idQuotes)"
         >{{propsTable.row.cotizacion}}</a>
         
          </q-td>
          <q-td key="entrega" :props="propsTable">
         
          <a
           class="text-bold cursor-pointer flex items-center text-primary" @click="() => openDialogDelivery(propsTable.row.idDelivery)"
         >{{propsTable.row.entrega}}</a>
         
          </q-td>
      </q-tr>
    </template>
    <template #searchButton>
      <div class="q-gutter-sm">
        <transition v-if="animationConfirmed == true" :appear="animationConfirmed == true ? true : false" :enter-active-class="
                            animationConfirmed == true ? ' animated slideOutUp ' : ''
                          ">
          <q-btn size="sm" :color="activeFilterConfirmed == false ? 'green-3' : 'green-8'" :label="tableStore.totalConfirmed +' Confirmados'" icon="check"
            @click="DataFilterConfirmed" :class="$q.screen.xs  ? 'full-width':''"/>
        </transition>
        <transition v-else :appear="animationConfirmed == false ? true : false" :enter-active-class="
                            animationConfirmed == false ? ' animated slideOutDown ' : ''
                          ">
          <q-btn size="sm" :color="activeFilterConfirmed == false ? 'green-3' : 'green-8'" :label="tableStore.totalConfirmed +' Confirmados'" @click="DataFilterConfirmed"
            v-if="animationConfirmed == false" :class="$q.screen.xs  ? 'full-width':''"/>
        </transition>

        <transition v-if="animationRejected == true" :appear="animationRejected == true ? true : false" :enter-active-class="
                            animationRejected == true ? ' animated slideOutUp ' : ''
                          ">
          <q-btn size="sm" :color="activeFilterRejectd == false ? 'red-3' : 'red-8'" :label="tableStore.totalR+' Rechazados'" icon="check"
            @click="DataFilterRejected" :class="$q.screen.xs  ? 'full-width':''"/>
        </transition>
        <transition v-else :appear="animationRejected == false ? true : false" :enter-active-class="
                            animationRejected == false ? ' animated slideOutDown ' : ''
                          ">
          <q-btn size="sm" :color="activeFilterRejectd == false ? 'red-3' : 'red-8'" :label="tableStore.totalR+' Rechazados'" @click="DataFilterRejected"
            v-if="animationRejected == false" :class="$q.screen.xs  ? 'full-width':''"/>
        </transition>
    
        <transition v-if="animationBlocked == true" :appear="animationBlocked == true ? true : false" :enter-active-class="
                            animationBlocked == true ? ' animated slideOutUp ' : ''
                          ">
          <q-btn size="sm" :color="activeFilterBlocked == false ? 'grey-5' : 'grey-8'" :label="tableStore.totalB+' Pendientes'" icon="check"
            @click="DataFilterBlocked" :class="$q.screen.xs  ? 'full-width':''"/>
        </transition>
        <transition v-else :appear="animationBlocked == false ? true : false" :enter-active-class="
                            animationBlocked == false ? ' animated slideOutDown ' : ''
                          ">
          <q-btn size="sm" :color="activeFilterBlocked == false ? 'grey-5' : 'grey-8'" :label="tableStore.totalB+' Pendientes'" @click="DataFilterBlocked"
            v-if="animationBlocked == false" :class="$q.screen.xs  ? 'full-width':''"/>
        </transition>
      </div>
    </template>
    <template v-slot:buttons>
      <q-btn color="primary" disabled label="Nueva Reserva" @click="() => openDialog()" v-if="!$q.screen.xs">
      </q-btn>
      <q-page-sticky position="bottom-right" :offset="[18, 18]" style="z-index: 1" v-else>
        <q-btn fab color="accent" icon="add" @click="() => openDialog()" />
      </q-page-sticky>
    
    </template>
    <template v-slot:filterContent>
      <AdvancedFilter ref="filterAdvanced" @submitFilter="onSubmitDataFilter" />
    </template>
      <template #updateContent>
        <UpdateMasive ref="updateMassiveRef" />
      </template>
    </table-component>
    <TableSkeleton v-else />
  </div>
  <ReservasDialog ref="reserveDialogRef" @form-save="formSaved" />
  <AccountDialog ref="accountDialogRef" @form-save="formSaved" />
  <ContactDialog ref="contactDialogRef" @form-save="formSaved" />
  <GeneralDialog ref="quotesDialogRef" @form-save="formSaved" />
  <GeneralDialog ref="quotesDialogRef" @form-save="formSaved" />
  <DeliveriesDialog ref="deliveryDialogRef" @form-save="formSaved" />
  
</template>

<style lang="scss" scoped>
.truncate {
  /**Major Properties**/
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
