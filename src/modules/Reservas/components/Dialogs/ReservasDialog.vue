<script lang="ts">
  import { ref, computed } from 'vue';
  import { useDialogTabs } from 'src/composables/Dialog/useDialog';
  import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
  import convertDeliveryDialog from './convertDeliveryDialog.vue';
  import {ViewGeneral,ViewEntregas, ViewDocuments} from '../../views';
  import DeliveriesDialog from 'src/modules/Deliveries/components/Dialogs/DeliveriesDialog.vue';
  import { HANSACRM3_URL } from 'src/conections/api_conectors';
  import { useReservasStore } from 'src/modules/Reservas/store/ReservasStore';
  import { useAsyncState } from '@vueuse/core';
  import { useQuasar, QSpinnerPuff } from 'quasar';
  import {userStore} from 'src/modules/Users/store/UserStore';
</script>

<script lang="ts" setup>
  //* Emit functions
  const emits = defineEmits < { (event: 'formSave'): void,(event: 'close'): void }> ();

  //* Store values
  const reservasStore = useReservasStore();
  const user = userStore();

  //* InstanceType
  const deliveryDialogRef = ref<InstanceType<typeof DeliveriesDialog> | null>(null);
  const generalFormRef = ref < InstanceType < typeof ViewGeneral > | null > (null);

  //* Variables
  const $q = useQuasar();
  const generateDialog = ref();
  const verificarReserva = ref(false);
  const verificaEstado = ref(false);
  const loadingView = ref(false);
  const showCloseDialog = ref(false);
  const deleteLeadDialog = ref(false);
  const deliverys = ref([] as { [key: string]: string }[]);


  //* Relation
  const tabsDefinition = [
    {
      name: 'general',
      component: ViewGeneral,
      label: 'General',
      enabledForCreation: true,
    },
    {
      name: 'Documentos',
      component: ViewDocuments,
      label: 'Documentos',
      enabledForCreation: false,
    },
    {
      name: 'Entregas',
      component: ViewEntregas,
      label: 'Entregas',
      enabledForCreation: false,
    },
  ];

//* Composable values
  const {
    id,
    open,
    titleDialog,
    iconDialog,
    activeTabName,
    activeTabComponent,
    swapCurrentTab,
    openDialogTab,
    resetValues,
  } = useDialogTabs(tabsDefinition, {
    titleDialog: 'Nueva entrega',
    iconDialog: 'pen',
  });

  //* OnMounted o useAsyncState
  const { state, isLoading, execute } = useAsyncState(
    async () => {
      deliverys.value = await reservasStore.getReservasDeliveries(id.value,user.userCRM.iddivision);
      return await reservasStore.getReservas(id.value);
    },
    {} as any,
    { immediate: false }
  );

  //* methods
  const saveForm = (idNew: string) => {
    titleDialog.value = 'Detalle de la reserva:';
    loadingView.value = false;
    id.value = idNew;
    execute();
    emits('formSave');
  };

  const clearData = () => {
    id.value = '';
    resetValues();
  };

  const saveCurrentForm = async () => {
    //console.log('submitting something');
    loadingView.value = true;
    try {
      await generalFormRef.value?.onSubmit();
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Error al guardar lead',
      });
    }
    loadingView.value = false;
  };

  const onCloseDialog = () => {
    //console.log('On close dialog');
    open.value = false;
  };

  const openDialogDelivery = async (id?: string) => {
    await deliveryDialogRef.value?.openDialogDeliveryTab(id ? id : '');
  };

  const deleteModuleRecord = async () => {
    try {
      $q.loading.show({
        spinner: QSpinnerPuff,
        message: 'Eliminando la Reserva',
      });
      await reservasStore.deleteReserva(id.value);
      $q.notify({
        type: 'warning',
        message: 'Se ha eliminado el Reserva correctamente',
      });
      emits('formSave');
      open.value = false;
    } catch (error) {
      console.log(error);
      $q.notify({
        type: 'negative',
        message: 'Error en el proceso',
        caption: 'No se ha podido eliminar el Reserva',
      });
    } finally {
      $q.loading.hide();
    }
  };

  const openDialogReserveTab = async (
    idModule?: string,
    dialogTitle?: string,
    icon?: string
  ) => {
    openDialogTab(idModule, dialogTitle, icon);
    if (id.value) {
      await execute();
    }
  };

  const openInLegacy = () => {
    window.open(
      `${HANSACRM3_URL}/index.php?module=HANQ_Reservas&action=DetailView&record=${id.value}`
    );
  };

  const openConvertDelivery = (estado:string) => {
    if(estado =='Confirmed'){
      generateDialog.value.open = !generateDialog.value.open;
    }else{
    verificaEstado.value = true;
    } 
  };

  const closeConvertDelivery = () => {
    //console.log('ingreso');
    setTimeout(async () => {
      if (id.value) {
        await execute();
      }
    }, 500);
    //  execute();
  };

  const closeDialog = () => { 
    resetValues()
    emits('close');
  };

  //* computed variables
  const isEditing = computed(() => !!generalFormRef.value?.isSomeCardEditing);

  defineExpose({
    clearData,
    openDialogReserveTab
  });
</script>

<template>

  <dialog-component size-dialog="dialog-xl" v-model="open" :footerDisabled="!isEditing" :headerDisabled="false"
    :iconDialog="iconDialog" :persistent="false" @before-hide="closeDialog">
    <template #header>
      <!-- <pre>{{ state }}</pre> -->
      <q-card class="bg-primary" flat v-if="isLoading">
        <q-item>
          <q-item-section avatar>
            <q-skeleton type="QAvatar" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <q-skeleton type="text" class="bg-primary" />
            </q-item-label>
            <q-item-label caption>
              <q-skeleton type="text" class="bg-primary" />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card>
      <q-toolbar v-else class="header-dialog" :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
        <q-btn size="md" round flat class="q-ml-md" color="white">
          <q-icon name="event" color="white"></q-icon>
        </q-btn>
        <q-toolbar-title class="header-dialog" :class="$q.dark.isActive ? 'text-red' : 'text-white'">
          <div v-if="!id" class="flex">
            <span>{{ `${titleDialog}` }}</span>
          </div>
          <div v-else>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label lines="4">{{ state.name }}</q-item-label>
                  <q-item-label overline class="text-grey-5"><q-icon name="fiber_manual_record" color="deep-orange-4" /> Reservas</q-item-label>
                </q-item-section></q-item></q-list>
          </div>
        </q-toolbar-title>
        <q-btn v-if="id" style="width: max-content" label="Opciones" icon-right="arrow_drop_down" color="white"
          size="sm" outline>
          <q-menu fit anchor="bottom left" self="top left">
            <q-list dense style="min-width: 100px">
              <q-item @click="openInLegacy" clickable v-close-popup>
                <q-item-section avatar class="q-pa-none">
                  <q-icon name="open_in_new" color="blue" />
                </q-item-section>
                <q-item-section>Abrir en CRM 3</q-item-section>
              </q-item>

              <q-item @click="verificarReserva = true" clickable v-close-popup v-if="deliverys.length>0">
                <q-item-section avatar class="q-pa-none">
                  <q-icon name="swap_horiz" color="blue" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Ver entrega </q-item-label>
                </q-item-section>
              </q-item>
              <q-item @click="openConvertDelivery(state.reser_stage_c)" clickable v-close-popup v-else>
                <q-item-section avatar class="q-pa-none">
                  <q-icon name="swap_horiz" color="blue" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Generar entrega</q-item-label>
                </q-item-section>
              </q-item>
               
              <q-item @click="deleteLeadDialog = true" clickable v-close-popup>
                <q-item-section avatar class="q-pa-none">
                  <q-icon name="delete" color="red" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Eliminar</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn dense flat color="white" :icon="!$q.screen.xs ? 'close' : 'arrow_forward'"
          @click="showCloseDialog = true">
          <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
        </q-btn>
      </q-toolbar>
      <q-tabs v-model="activeTabName" @update:modelValue="swapCurrentTab" inline-label mobile-arrows :class="
          $q.dark.isActive ? 'bg-dark' : 'bg-primary text-grey-6 text-bold'
        " indicator-color="deep-orange-4" active-color="white" align="justify" dense narrow-indicator>
        <q-tab v-for="(tab, index) in tabsDefinition" :key="index" :name="tab.name" :label="tab.label"
          :disable="!tab.enabledForCreation && !id">

        </q-tab>
      </q-tabs>
    </template>
    <template #body>
      <q-toolbar
       class="header-dialog"
       :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'"
     ></q-toolbar>
    
      <q-page :class="$q.platform.is.mobile ? 'q-pa-none' : 'q-pa-md'"  style="margin-top: -50px;">
        <component :is="activeTabComponent" :id="id" :nameModule="''" @submitComplete="saveForm"
          @submitFail="loadingView = false" ref="generalFormRef" />
      </q-page>
    </template>
    <template #footer v-if="isEditing">
      <q-btn color="primary" class="q-mr-md" :loading="loadingView" @click="saveCurrentForm">Guardar</q-btn>
      <q-btn color="negative" v-close-popup>Cancelar</q-btn>
    </template>
  </dialog-component>
  <AlertComponent title="¿Cerrar Formulario?" icon="warning" iconColor="warning" iconSize="50px" btn-color="primary"
    btn-text="Si, salir" v-model="showCloseDialog" @confirm="onCloseDialog" @denegate="showCloseDialog = false">
    <template #body>
      <span class="q-py-sm">
        Si cierra la edicion se perderan los datos no guardados
      </span>
    </template>
  </AlertComponent>
  <AlertComponent title="¿Eliminar Lead?" icon="warning" iconColor="warning" iconSize="50px" btn-color="primary"
    btn-text="Si, eliminar" v-model="deleteLeadDialog" @confirm="deleteModuleRecord"
    @denegate="deleteLeadDialog = false">
    <template #body>
      <span class="q-py-sm"> ¿Esta seguro de eliminar la Reserva? </span>
    </template>
  </AlertComponent>

  <convertDeliveryDialog ref="generateDialog" :idModule="id" :module="'1'" :data="state"
    @cerrar-dialog="closeConvertDelivery" />

  <q-dialog v-model="verificarReserva"  transition-show="flip-down" transition-hide="flip-up">
    <q-card style="width: 40%;">
      <q-card-section class="q-ma-md text-center">
        <p class="text-h6  text-weight-bold">La Reserva ya cuenta con una entrega!!!</p>
        <q-separator spaced inset />
        <q-list >
      <q-item >
        <q-item-section avatar>
          <q-avatar size="60px" text-color="green" color="green-2" icon="check"/>
        </q-item-section>
        <q-item-section class="text-left"><div class="text-h7">
           Nombres de la entrega 
        </div>
        <div class="text-h7 text-primary ">
          <p v-for="(reg,index) in deliverys" :key="index" >
            <a
           class="text-bold cursor-pointer flex items-center text-primary" @click="() => openDialogDelivery(reg.id)"
         >{{ reg.nombre }}</a>
        </p>
        </div></q-item-section>
      </q-item></q-list>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="verificaEstado"  transition-show="flip-down" transition-hide="flip-up" >
    <q-card class="q-pa-none">
      <q-card-section class="text-center q-pa-none">    
        <q-list class="text-center justify-center q-pa-none" >
      <q-item class="q-pa-none">
        <q-item-section avatar class="bg-red q-pa-md">
          <q-icon name="highlight_off" size="100px" color="white"  />
        </q-item-section>
        <q-item-section class="q-pa-md" v-if="state.reser_stage_c!='Confirmed'">         
          <p  v-if="state.reser_stage_c!='Confirmed'"> La Reserva no se encuentra</p>
          <p class="text-h6 text-weight-medium" v-if="state?.reser_stage_c!='Confirmed'"> CONFIRMADA!!!</p>         
          <!-- <p  v-if="state.attributes?.opportunity_id=='' || state.attributes?.billing_account_id==''"> La cotización no tiene relacionada una</p>
          <p class="text-h6 text-weight-medium" v-if="state.attributes?.billing_account_id==''"> CUENTA!!!</p>
          <p class="text-h6 text-weight-medium" v-if="state.attributes?.opportunity_id==''"> OPORTUNIDAD!!!</p> -->
      </q-item-section>
      </q-item>
    </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>

  <DeliveriesDialog ref="deliveryDialogRef"/>

</template>