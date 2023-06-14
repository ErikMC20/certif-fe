<script lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDialogTabs } from 'src/composables/Dialog/useDialog';
import { ReadLeadFormat } from '../../utils/types';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import {
  ViewGeneral,
  ViewTechnicalData,
  ViewImages,
  ViewDocuments,
  ViewVideos,
  ViewProducts,
} from '../../views';
import ViewProductAttribute from '../../views/ViewProductAttribute.vue';
import { useQuotationStore } from '../../store/QuotationStore';
import { useAsyncState } from '@vueuse/core';
import { useQuasar, QSpinnerPuff } from 'quasar';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
</script>
<script lang="ts" setup>
//* Emit functions
const emits = defineEmits<{ (event: 'formSave'): void }>();
//* Store values
const leadsStore = useQuotationStore();
const formStore = useFormOptionsStore();
const $q = useQuasar();

//* variables
const tabsDefinition = [
  {
    name: 'general',
    component: ViewGeneral,
    label: 'General',
    enabledForCreation: true,
  },
  {
    name: 'productos',
    component: ViewProducts,
    label: 'Productos',
    enabledForCreation: false,
  },
  {
    name: 'technicalData',
    component: ViewTechnicalData,
    label: 'Cabecera y Datos Tecnicos',
    enabledForCreation: false,
  },
  {
    name: 'productAttribute',
    component: ViewProductAttribute,
    label: 'Atributos Productos',
    enabledForCreation: false,
  },
  {
    name: 'Images',
    component: ViewImages,
    label: 'Galeria de Imagenes',
    enabledForCreation: false,
  },
  {
    name: 'documents',
    component: ViewDocuments,
    label: 'Documentos',
    enabledForCreation: false,
  },
  {
    name: 'videos',
    component: ViewVideos,
    label: 'Videos',
    enabledForCreation: false,
  },
];

const loadingView = ref(false);
const showCloseDialog = ref(false);
const deleteLeadDialog = ref(false);
// const isEditing = ref(true);
onMounted(async () => {
  await formStore.getLeadsOptions();
});

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
  titleDialog: 'Modelo de Cotización',
  iconDialog: 'pen',
});

const { state, isLoading, execute } = useAsyncState(
  async () => {
    await formStore.getHANQModelOptions();
    return await leadsStore.getLead(id.value);
  },
  {} as ReadLeadFormat,
  { immediate: false }
);

//* reference variables
const viewTechnicalDataRef = ref<InstanceType<typeof ViewTechnicalData> | null>(
  null
);
const productAttributeRef = ref<InstanceType<
  typeof ViewProductAttribute
> | null>(null);
//* computed variables

const isEditing = computed(() => viewTechnicalDataRef.value?.isSomeCardEditing);

const saveForm = (idNew: string) => {
  titleDialog.value = 'Detalle del Prospecto:';
  loadingView.value = false;
  id.value = idNew;
  execute();
  emits('formSave');
};

//* methods
const clearData = () => {
  id.value = '';
  resetValues();
};

const saveCurrentForm = async () => {
  console.log('submitting something');
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
  console.log('On close dialog');
  open.value = false;
  localStorage.removeItem('listalmacenAlm');
  localStorage.removeItem('listalmacenPro');
};

const deleteModuleRecord = async () => {
  try {
    $q.loading.show({
      spinner: QSpinnerPuff,
      message: 'Eliminando el Lead',
    });
    await leadsStore.deleteLead(id.value);
    $q.notify({
      type: 'warning',
      message: 'Se ha eliminado el Lead correctamente',
    });
    emits('formSave');
    open.value = false;
  } catch (error) {
    console.log(error);
    $q.notify({
      type: 'negative',
      message: 'Error en el proceso',
      caption: 'No se ha podido eliminar el Lead',
    });
  } finally {
    $q.loading.hide();
  }
};

const openDialogAccountTab = async (
  idModule?: string,
  dialogTitle?: string,
  icon?: string
) => {
  openDialogTab(idModule, dialogTitle, icon);
  if (id.value) {
    await execute();
  }
};

defineExpose({
  clearData,
  openDialogAccountTab,
});
</script>

<template>
  <dialog-component
    size-dialog="dialog-xl"
    v-model="open"
    :footerDisabled="false"
    :headerDisabled="false"
    :iconDialog="iconDialog"
    :persistent="false"
    @before-hide="resetValues"
  >
    <template #header>
      <q-card class="bg-primary" flat v-if="isLoading">
        <q-item>
          <q-item-section avatar>
            <q-skeleton type="QAvatar" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <q-skeleton type="text" />
            </q-item-label>
            <q-item-label caption>
              <q-skeleton type="text" />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card>
      <q-toolbar
        v-else
        class="header-dialog"
        :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'"
      >
        <q-circular-progress
          show-value
          font-size="16px"
          class="text-white q-ma-md"
          :value="100"
          size="35px"
          :thickness="0.1"
          color="orange"
          v-if="!$q.screen.xs"
        >
          <q-icon name="person" size="xs" />
        </q-circular-progress>
        <q-item-section>
          <q-item-label class="text-white">Modelo de Cotización</q-item-label>
        </q-item-section>
        <q-toolbar-title
          class="header-dialog"
          :class="$q.dark.isActive ? 'text-red' : 'text-white'"
        >
          <div v-if="!id" class="flex">
            <span>{{ `${titleDialog}` }}</span>
          </div>
          <div v-else>
            {{ state.name }}
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
              <!-- <q-item @click="openInLegacy" clickable v-close-popup>
                <q-item-section avatar class="q-pa-none">
                  <q-icon name="open_in_new" color="blue" />
                </q-item-section>
                <q-item-section>Abrir en CRM 3</q-item-section>
              </q-item> -->
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
        indicator-color="white"
        active-color="white"
        align="justify"
        dense
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
      <q-page :class="$q.platform.is.mobile ? 'q-pa-none' : 'q-pa-md'">
        <component
          :is="activeTabComponent"
          :id="id"
          :nameModule="''"
          @submitComplete="saveForm"
          @submitFail="loadingView = false"
          ref="generalFormRef"
        />
      </q-page>
      <!-- <pre>{{ isEditing }}footer</pre> -->
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
      <span class="q-py-sm"> ¿Esta seguro de eliminar este Lead? </span>
    </template>
  </AlertComponent>
</template>
