<script lang="ts">
import { ref, computed } from 'vue';
import { useDialogTabs } from 'src/composables/Dialog/useDialog';
import { ReadLeadFormat } from '../../utils/types';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import {
  ViewGeneral,
  ViewDocuments,
  ViewSurveysConducted
} from '../../views';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { useDeliveriesStore } from 'src/modules/Deliveries/store/DeliveriesStore';
import { useAsyncState } from '@vueuse/core';
import { useQuasar, QSpinnerPuff } from 'quasar';
</script>

<script lang="ts" setup>
//* Emit functions
const emits = defineEmits < { (event: 'formSave'): void,(event: 'close'): void }> ();

//* Store values
const deliveriesStore = useDeliveriesStore();

//* reference variables
const generalFormRef = ref<InstanceType<typeof ViewGeneral> | null>(null);

//* variables
const $q = useQuasar();
const loadingView = ref(false);
const showCloseDialog = ref(false);
const deleteLeadDialog = ref(false);


//* Relation
const tabsDefinition = [
  {
    name: 'general',
    component: ViewGeneral,
    label: 'General',
    enabledForCreation: true,
  },
  {
    name: 'documentos',
    component: ViewDocuments,
    label: 'Documentos',
    enabledForCreation: true,
  },
  {
    name: 'encuestas',
    component: ViewSurveysConducted,
    label: 'Encuestas',
    enabledForCreation: true,
  }
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
  titleDialog: 'Nueva Entrega',
  iconDialog: 'pen',
});

//* OnMounted o state
const { state, isLoading, execute } = useAsyncState(
  async () => {
    return await deliveriesStore.getDelivery(id.value);
  },
  {} as ReadLeadFormat,
  { immediate: false }
);

//* methods
const saveForm = (idNew: string) => {
  titleDialog.value = 'Detalle del Prospecto:';
  loadingView.value = false;
  id.value = idNew;
  execute();
  emits('formSave');
};

const clearData = () => {
  id.value = '';
  resetValues();
};

const closeDialog = () => { 
    resetValues()
    emits('close');
  };

const saveCurrentForm = async () => {
  //console.log('submitting something');
  loadingView.value = true;
  try {
    await generalFormRef.value?.onSubmit();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al guardar Reserva',
    });
  }
  loadingView.value = false;
};

const onCloseDialog = () => {
  //console.log('On close dialog');
  open.value = false;
};

const deleteModuleRecord = async () => {
  try {
    $q.loading.show({
      spinner: QSpinnerPuff,
      message: 'Eliminando la Entrega',
    });
    await deliveriesStore.deleteDelivery(id.value);
    $q.notify({
      type: 'warning',
      message: 'Se ha eliminado el Entrega correctamente',
    });
    emits('formSave');
    open.value = false;
  } catch (error) {
    console.log(error);
    $q.notify({
      type: 'negative',
      message: 'Error en el proceso',
      caption: 'No se ha podido eliminar el Entrega',
    });
  } finally {
    $q.loading.hide();
  }
};

const openDialogDeliveryTab = async (
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
    `${HANSACRM3_URL}/index.php?module=HANE_Entregas&action=DetailView&record=${id.value}`
  );
};

//* computed variables
const isEditing = computed(() => !!generalFormRef.value?.isSomeCardEditing);

defineExpose({
  clearData,
  openDialogDeliveryTab,
});
</script>

<template>
  <dialog-component
    size-dialog="dialog-xl"
    v-model="open"
    :footerDisabled="!isEditing"
    :headerDisabled="false"
    :iconDialog="iconDialog"
    :persistent="false"
    @before-hide="closeDialog"
  >
  <template #header>
      <q-card class="bg-primary" flat v-if="isLoading">
        <q-item>
          <q-item-section avatar>
            <q-skeleton type="QAvatar"  />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <q-skeleton type="text" class="bg-primary" />
            </q-item-label>
            <q-item-label caption>
              <q-skeleton type="text" class="bg-primary"/>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card>
      <q-toolbar
        v-else
        class="header-dialog"
        :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'"
      >
        
        <q-btn size="md" round flat class="q-ml-md" color="white">
          <q-icon name="add_shopping_cart" color="white"></q-icon>
          
        </q-btn>
        <q-toolbar-title
          class="header-dialog"
          :class="$q.dark.isActive ? 'text-red' : 'text-white'"
        >
          <div v-if="!id" class="flex">
            <span>{{ `${titleDialog}` }}</span>
          </div>
          <div v-else>
            <!-- {{ state.name }} -->
            <q-list>
              <q-item>
            <q-item-section >
                  <q-item-label lines="4">{{ state.name }}</q-item-label>
                  <q-item-label overline class="text-grey-5"
                    ><q-icon name="fiber_manual_record" color="deep-orange-4" /> Entregas</q-item-label
                  >
                </q-item-section></q-item></q-list>
          </div>
        </q-toolbar-title>
        <q-btn
          v-if="id"
          style="width: max-content"
          label="Opciones"
          icon-right="arrow_drop_down"
          color="white"
          size="sm"
          outline
        >
          <q-menu fit anchor="bottom left" self="top left">
            <q-list dense style="min-width: 100px">
              <q-item @click="openInLegacy" clickable v-close-popup>
                <q-item-section avatar class="q-pa-none">
                  <q-icon name="open_in_new" color="blue" />
                </q-item-section>
                <q-item-section>Abrir en CRM 3</q-item-section>
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
        <q-btn
          dense
          flat
          color="white"
          :icon="!$q.screen.xs ? 'close' : 'arrow_forward'"
          @click="showCloseDialog = true"
        >
          <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
        </q-btn>
      </q-toolbar>
      <q-tabs
        v-model="activeTabName"
        @update:modelValue="swapCurrentTab"
        inline-label
        mobile-arrows
        :class="
          $q.dark.isActive ? 'bg-dark' : 'bg-primary text-grey-6 text-bold'
        "
        indicator-color="deep-orange-4"
        active-color="white"
        align="justify"
        dense
        narrow-indicator
      >
        <q-tab
          v-for="(tab, index) in tabsDefinition"
          :key="index"
          :name="tab.name"
          :label="tab.label"
          :disable="!tab.enabledForCreation && !id"
        >
          <!-- <q-badge color="red" floating >2</q-badge> -->
        </q-tab>
      </q-tabs>
    </template>
    <template #body>
      <q-toolbar
       class="header-dialog"
       :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'"
     ></q-toolbar>
    
      <q-page :class="$q.platform.is.mobile ? 'q-pa-none' : 'q-pa-md'"  style="margin-top: -50px;">
        <component
          :is="activeTabComponent"
          :id="id"
          :nameModule="''"
          @submitComplete="saveForm"
          @submitFail="loadingView = false"
          ref="generalFormRef"
        />
      </q-page>
    </template>
    <template #footer v-if="isEditing">
      <q-btn
        color="primary"
        class="q-mr-md"
        :loading="loadingView"
        @click="saveCurrentForm"
        >Guardar</q-btn
      >
      <q-btn color="negative" v-close-popup>Cancelar</q-btn>
    </template>
  </dialog-component>
  <AlertComponent
    title="¿Cerrar Formulario?"
    icon="warning"
    iconColor="warning"
    iconSize="50px"
    btn-color="primary"
    btn-text="Si, salir"
    v-model="showCloseDialog"
    @confirm="onCloseDialog"
    @denegate="showCloseDialog = false"
  >
    <template #body>
      <span class="q-py-sm">
        Si cierra la edicion se perderan los datos no guardados
      </span>
    </template>
  </AlertComponent>
  <AlertComponent
    title="¿Eliminar Lead?"
    icon="warning"
    iconColor="warning"
    iconSize="50px"
    btn-color="primary"
    btn-text="Si, eliminar"
    v-model="deleteLeadDialog"
    @confirm="deleteModuleRecord"
    @denegate="deleteLeadDialog = false"
  >
    <template #body>
      <span class="q-py-sm"> ¿Esta seguro de eliminar la Reserva? </span>
    </template>
  </AlertComponent>
</template>
