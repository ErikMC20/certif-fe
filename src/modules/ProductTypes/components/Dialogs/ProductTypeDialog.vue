<script lang="ts">
import { ref, computed, watch } from 'vue';
import { useDialogTabs } from 'src/composables/Dialog/useDialog';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';

import ViewGeneral from '../../views/ViewGeneral.vue';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { useQuasar, QSpinnerPuff } from 'quasar';
import { useProductType } from '../../composables/useProductType';
import { useProductTypesStore } from '../../store/productTypes';
import { useProductTypeTableStore } from '../../store/useProductTypeTableStore';
</script>

<script lang="ts" setup>
interface Props {
  getDraftData?: boolean;
  closeAfterSaving?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  closeAfterSaving: false,
});

//* Emit functions
interface Emits {
  (event: 'formSave', id?: string): void;
}

const emits = defineEmits<Emits>();

const $q = useQuasar();

//* variables
const tabsDefinition = [
  {
    name: 'general',
    component: ViewGeneral,
    label: 'General',
    enabledForCreation: true,
  },
];

const loadingView = ref(false);
//const showCloseDialog = ref(false);
const deleteLeadDialog = ref(false);

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
  titleDialog: 'Nuevo Tipo  Producto',
  iconDialog: 'pen',
});

const {
  isLoading: isDataLoading,
  localId,
  createProductType,
  deleteProductType,
  getProductType,
} = useProductType();

//* reference variables
const generalFormRef = ref<InstanceType<typeof ViewGeneral> | null>(null);
//* computed variables
const isEditing = computed(() => !!generalFormRef.value?.isSomeCardEditing);
const closeDialogState = ref(false);

const store = useProductTypesStore();
const tableStore = useProductTypeTableStore();

// const saveForm = async (idNew: string) => {
//   console.log('guardando')
//   titleDialog.value = 'Detalle del Tipo de Producto:';
//   loadingView.value = false;
//   id.value = idNew;

//   emits('formSave', id.value);
//   if (props.closeAfterSaving) {
//     open.value = false;
//   }
// };
const saveForm = (idNew: string) => {
  id.value = idNew;
  //cerrar el dialog aqui
  tableStore.reloadList();
};

//* methods
const clearData = () => {
  console.log('cleaning data');

  id.value = '';
  localId.value = '';
  resetValues();
};

const showCloseDialog = () => {
  if (generalFormRef.value?.isSomeCardEditing) {
    closeDialogState.value = true;
    return;
  }
  onCloseDialog();
};

const saveCurrentForm = async () => {
  //console.log('submitting something');
  loadingView.value = true;
  try {
    await generalFormRef.value?.onSubmit();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al guardar el tipo de producto',
    });
  }
  loadingView.value = false;
};

const onCloseDialog = () => {
  console.log('On close dialog');
  open.value = false;
};

const deleteModuleRecord = async () => {
  try {
    $q.loading.show({
      spinner: QSpinnerPuff,
      message: 'Eliminando el Lead',
    });
    await deleteProductType(id.value);
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

const openDialog = async (
  idModule?: string,
  dialogTitle?: string,
  icon?: string
) => {
  id.value = '';
  console.log('this is your id', idModule);
  openDialogTab(idModule, dialogTitle, icon);
  if (id.value) {
    await getProductType(id.value);
  }
};

const openInLegacy = () => {
  window.open(
    `${HANSACRM3_URL}/index.php?module=ProductType&action=DetailView&record=${id.value}`
    // `crm-qas.hansa.com.bo/index.php?module=Opportunities&action=DetailView&record=${id.value}`
  );
};
const refreshVG = async () => {
  if (id.value) await getProductType(id.value);
};

watch(localId, (value) => {
  id.value = value;
});

defineExpose({
  clearData,
  openDialog,
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
    @before-hide="resetValues"
  >
    <template #header>
      <q-card class="bg-primary" flat v-if="isDataLoading">
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
        <q-icon name="paid" class="q-ml-md" color="white" size="md"></q-icon>

        <q-toolbar-title
          class="header-dialog"
          :class="$q.dark.isActive ? 'text-red' : 'text-white'"
        >
          <div v-if="!id" class="flex">
            <span>{{ `${titleDialog}` }}</span>
          </div>
          <div v-else>
            <div>Detalle del tipo de producto</div>
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
              <q-item @click="refreshVG" clickable v-close-popup>
                <q-item-section avatar class="q-pa-none">
                  <q-icon name="refresh" color="blue" />
                </q-item-section>
                <q-item-section>Actualizar</q-item-section>
              </q-item>
              <!-- <q-separator  inset  /> -->
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
          class="q-ml-md"
          dense
          flat
          color="white"
          :icon="!$q.screen.xs ? 'close' : 'arrow_forward'"
          @click="showCloseDialog = !showCloseDialog"
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
        v-if="tabsDefinition.length > 1"
      >
        <q-tab
          v-for="(tab, index) in tabsDefinition"
          :key="index"
          :name="tab.name"
          :label="tab.label"
          :disable="!tab.enabledForCreation && !id"
        >
        </q-tab>
      </q-tabs>
    </template>
    <template #body>
      <q-toolbar
        class="header-dialog"
        :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'"
      ></q-toolbar>

      <q-page
        :class="$q.platform.is.mobile ? 'q-pa-none' : 'q-pa-md'"
        style="margin-top: -50px"
      >
        <component
          :is="activeTabComponent"
          :id="id"
          :nameModule="''"
          :get-draft-data="props.getDraftData"
          @submitComplete="saveForm"
          @submitFail="loadingView = false"
          @pruebaRefrescar="refreshVG()"
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

  <!-- ******alert antes de cerrar -->
  <AlertComponent
    title="¿Cerrar Formulario?"
    icon="warning"
    iconColor="warning"
    iconSize="50px"
    btn-color="primary"
    btn-text="Si, salir"
    v-model="closeDialogState"
    @confirm="onCloseDialog"
    @denegate="closeDialogState = false"
  >
    <template #body>
      <span class="q-py-sm">
        Si cierra la edición se perderán los datos no guardados
      </span>
    </template>
  </AlertComponent>
  <AlertComponent
    title="¿Eliminar Tipo de Producto?"
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
      <span class="q-py-sm">
        ¿Está seguro de eliminar este tipo de producto?
      </span>
    </template>
  </AlertComponent>
</template>
