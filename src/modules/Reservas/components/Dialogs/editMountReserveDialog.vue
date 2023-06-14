<script lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useQuasar } from 'quasar';
  import CardInfoMountReserve from '../Cards/CardEditMountReserve/CardInfoMountReserve.vue';
  import { Loading, QSpinnerPuff } from 'quasar';
  import { ReservasTableStore } from 'src/modules/Reservas/store/ReservasTableStore';
  import { useReservasStore } from 'src/modules/Reservas/store/ReservasStore';
  import { userStore } from 'src/modules/Users/store/UserStore';
  import { api } from '../../../../boot/axios';
  import Notification from 'src/modules/Accounts/utils/notify';
</script>
<script lang="ts" setup>
  //* Emit functions
  const emits = defineEmits < { (event: 'cerrarDialog'): void }> ();

  //* Props
  const props = withDefaults(
    defineProps < {
      idReserve: string;
      idMountReserve?: string;
    } > (),
    {
      idMountReserve: '',
    }
  );

  //* Store values
  const tableStore = ReservasTableStore();
  const reserveStore = useReservasStore();
  const user = userStore();

  //* InstanceType
  const baseCardMountReserve = ref < InstanceType < typeof CardInfoMountReserve > | null > (null);

  //* Variables
  const $q = useQuasar();
  const listTipo = ref({});
  const open = ref(false);

  //* Values Default
  const dataRegOp =
  {
    type: 'HANQ_Monto_reserva',
    id: '',
    attributes: {
      modified_user_id: '1',
      name: '',
      monto: 0,
      description: '',
      currency_id: '-99',
      tipo: '',
    }
  };

  const dataMountReserve = {
    attributes: {
      created_by: '1',
      name: '',
      description: '',
      assigned_user_id: '',
      SecurityGroups: '',
      monto: 0,
      currency_id: '-99',
      tipo: '01_Vehiculo',
      hanq_monto_reserva_hanq_reservashanq_reservas_ida: ''
    }
  }

  //* methods
  const guardarCambio = async () => {
    Loading.show({
      spinner: QSpinnerPuff,
      message: 'Guardando informacion',
    })

    try {
      const cardInfoEdit = baseCardMountReserve.value?.exposeData();
      dataRegOp.id = props.idMountReserve;
      dataRegOp.attributes.name = cardInfoEdit?.name || '';
      dataRegOp.attributes.modified_user_id = user.userCRM.id || '';
      dataRegOp.attributes.currency_id = cardInfoEdit?.currency_id || '';
      dataRegOp.attributes.monto = cardInfoEdit?.monto || 0;
      dataRegOp.attributes.description = cardInfoEdit?.description || '';
      dataRegOp.attributes.tipo = cardInfoEdit?.tipo || '';
      const response1 = await api.patch(
        `${process.env.CRM4_LB_GLOBAL}/module-update`,
        dataRegOp
      );
      open.value = false;
      emits('cerrarDialog');
      Loading.hide();
      Notification(
        'positive',
        'check',
        '<strong> Acción existosa </strong>'
      );

    } catch (error) {
      Loading.hide();
      Notification(
        'negative',
        'warning',
        '<strong> Ops! algo salió mal </strong> <br/>Ocurrió un error al realizar la acción.'
      );
      throw error;
    }
  };

  const crearMonto = async () => {
    Loading.show({
      spinner: QSpinnerPuff,
      message: 'Guardando informacion',
    })
    const cardInfcreate = baseCardMountReserve.value?.exposeData();
    dataMountReserve.attributes.created_by = user.userCRM.id;
    dataMountReserve.attributes.assigned_user_id = user.userCRM.id;
    dataMountReserve.attributes.name = cardInfcreate?.name || '';
    dataMountReserve.attributes.monto = cardInfcreate?.monto || 0;
    dataMountReserve.attributes.currency_id = cardInfcreate?.currency_id || '';
    dataMountReserve.attributes.tipo = cardInfcreate?.tipo || '';
    dataMountReserve.attributes.description = cardInfcreate?.description || '';
    dataMountReserve.attributes.hanq_monto_reserva_hanq_reservashanq_reservas_ida = props.idReserve;
    const response = await api.post(
      `${process.env.CRM4_LB_02}/create-monto-reserve`,
      dataMountReserve
    );

    open.value = false;
    emits('cerrarDialog');
    Loading.hide();
  };

  const info = async () => {
    Loading.show({
      spinner: QSpinnerPuff,
      message: 'Cargando datos',
    });
    const response = await reserveStore.getMountDetailReserve(props.idMountReserve || '');
    Loading.hide();
  };

  const cancelTask = () => {
    emits('cerrarDialog');
  };

  const formSaved = async () => {
    await tableStore.reloadList();
  };

  //* computed variables
  const isEditing = computed(() => {
    return [
      baseCardMountReserve.value?.isEditing,
    ].some((value) => !!value);
  });

  //* defineExpose
  defineExpose({
    open,
  });
</script>

<template>
  <dialog-component size-dialog="dialog-sm" v-model="open" :footerDisabled="!isEditing" :headerDisabled="false"
    :iconDialog="''" :persistent="false" ref="generateDialog">
    <template #header>
      <div class="bg-primary-3 text-black">
        <q-toolbar class="bg-primary q-pa-lg">
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-avatar text-color="white">
                  <q-icon name="task" size="md"></q-icon>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-white text-h5">Monto de Reserva</q-item-label>
                <q-item-label class="text-grey-4 text-caption" lines="1"
                  v-if="idMountReserve!=''">Detalle</q-item-label>
                <q-item-label class="text-grey-4 text-caption" lines="1" v-else>Creación</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-space />
          <q-btn dense flat color="white" :icon="!$q.screen.xs ? 'close' : 'arrow_back_ios'" v-close-popup>
            <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-toolbar>
      </div>
    </template>
    <template #body>
      <div class="row q-pa-md q-col-gutter-sm">
        <div class="col-12 col-sm-12 q-gutter-y-sm">
          <div class="row" style="height: 75vh">
            <q-card style="width: 100%">
              <CardInfoMountReserve :id="props.idMountReserve" class="col-12" ref="baseCardMountReserve" />
            </q-card>
          </div>
        </div>
      </div>
    </template>
    <template #footer v-if="isEditing">
      <q-btn color="primary" class="q-mr-md" @click="guardarCambio" v-if="idMountReserve!=''">Guardar</q-btn>
      <q-btn color="primary" class="q-mr-md" @click="crearMonto" v-else>Crear y relacionar</q-btn>
      <q-btn color="negative" v-close-popup @click="cancelTask">Cancelar</q-btn>
    </template>
  </dialog-component>
</template>
<style lang="scss" scoped></style>