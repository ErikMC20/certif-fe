<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { RelationInfoLead } from '../../utils/types';
  import { useQuasar } from 'quasar';
  import { Loading, QSpinnerPuff } from 'quasar';
  import { useReservasStore } from 'src/modules/Reservas/store/ReservasStore';
  import { useAsyncState } from '@vueuse/core';
  import { ReadLeadFormat } from '../../utils/types';
  import {  axios_GLOBAL } from 'src/conections/axiosCRM';
  import {  QTableColumn } from 'quasar';
  import editMountReserveDialog from 'src/modules/Reservas/components/Dialogs/editMountReserveDialog.vue';
  import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
  const props = withDefaults(
    defineProps < { id: string; data?: RelationInfoLead } > (),
    {}
  );
  const reserveStore = useReservasStore();
  const editMountDialog = ref();
  const idMountReserve=ref();
  const show_delete = ref(false);
  const show_delete_relationship = ref(false);
  const selected = ref<{ [key: string]: string }>({});
  const $q = useQuasar();
  const exposeData = () => {
    //return leadRelations.value;
  };
  onMounted(async () => {
    await execute();
  });

  const { state, isLoading, execute } = useAsyncState(
    async () => {
      return await reserveStore.getMountReserve(props.id || '');
    },
    {} as ReadLeadFormat,
    { immediate: false }
  );

  const update=()=>{
    execute();
  };

  const openConvertReserve = (id:string) => {
  idMountReserve.value=id;
  editMountDialog.value.open = !editMountDialog.value.open;
};

const selectItemDeleteRelationship = (item: { [key: string]: string }) => {
  idMountReserve.value=item.id;
  show_delete_relationship.value = true;
  selected.value = item;
};

const onDeleteRelationship = async () => {
  try {
    $q.loading.show({
      message: 'Desvinculando monto de la reserva',
      spinner: QSpinnerPuff,
    });
    await axios_GLOBAL.delete(
        `/deleted-relationships-module/HANQ_Reservas/${props.id}/hanq_monto_reserva_hanq_reservas/${idMountReserve.value}`
      );
      update();
  } catch (error) {
    console.log(error);
  } finally {
    $q.loading.hide();
  }
}

const cancelInsertion = () => {
    selected.value = {};
    show_delete_relationship.value = false;
  };


  defineExpose({
    exposeData,
  });

  const columns :QTableColumn[] = [
    { name: 'tipo', align: 'center', label: 'Tipo', field: 'Tipo' },
    { name: 'moneda', align: 'center', label: 'Moneda', field: 'moneda' },
    { name: 'monto', align: 'right', label: 'Monto de reserva', field: 'monto' },
    { name: 'acciones', align: 'center', label: 'Acciones', field: 'acciones' },
  ]
</script>

<template>
  <view-card-component ref="baseCardRef" :initial-status="id ? 'read' : 'edit'" icon-name="attach_money"
    title="Monto de reserva" >
    <template #edit>
      <div class="row q-col-gutter-lg q-py-md">
      </div>
    </template>
    <template #read>
      <div class="row justify-end">
       <q-btn color="primary" class="justify-end" size="sm"  label="Nuevo"  @click="openConvertReserve('')" />
      </div>
      <div class="col-12">
        <q-table flat :rows="state.data" :columns="columns" row-key="id" hide-bottom >
          <template v-slot:body="props">
            <q-tr :props="props" :class="props.row.tipo !=='' ? '':'text-weight-bold'">
              <q-td key="tipo" :props="props">
                {{ props.row.tipo }}
              </q-td>
              <q-td key="moneda" :props="props">
                {{ props.row.moneda }}
              </q-td>
              <q-td key="monto" :props="props">
                <span class="text-weight-bold">
                  {{props.row.monto.toLocaleString('en-ES', { minimumFractionDigits: 2})}}
                </span>
              </q-td>
              <q-td key="acciones" :props="props" v-if="props.row.tipo!==''">
                <q-btn color="primary" flat icon="edit" round  size="sm"  @click="openConvertReserve(props.row.id)"/>
                <q-btn color="red" flat icon="delete" round  size="sm" @click="selectItemDeleteRelationship(props.row)"/>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <editMountReserveDialog
    ref="editMountDialog"
    :idReserve="props.id"
    :idMountReserve="idMountReserve"
    @cerrar-dialog="update"
  ></editMountReserveDialog>
  <AlertComponent
    v-model="show_delete_relationship"
    icon="person_remove"
    icon-color="warning"
    icon-size="60px"
    btn-color="negative"
    btn-text="Si, desvincular"
    title="¿Desvincular monto de esta reserva?"
    @confirm="onDeleteRelationship"
    @denegate="cancelInsertion"
  >
    <template #body>
      <div class="text-center">
        <strong class="text-negative"> {{ selected.nombre }} </strong>Se desvinculara el monto de la reserva.
      </div>
    </template>
  </AlertComponent>

    </template>
  </view-card-component>

  



</template>
