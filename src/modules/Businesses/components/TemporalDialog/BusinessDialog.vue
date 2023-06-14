<script lang="ts" setup>
import { ref } from 'vue';
import { useDialogTabs } from 'src/composables/Dialog/useDialog';
import { ViewGeneral } from '../../views';

const isEditingTab = ref(false);

const tabsDefinition = [
  {
    name: 'general',
    component: ViewGeneral,
    label: 'General',
    enabledForCreation: true,
  },
];
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
  titleDialog: 'Nuevo Lead',
  iconDialog: 'pen',
});

const clearData = () => {
  id.value = '';
  resetValues();
};

const openDialogAccountTab = async (
  idModule?: string,
  dialogTitle?: string,
  icon?: string
) => {
  openDialogTab(idModule, dialogTitle, icon);
  if (id.value) {
    console.log('getting data...');
  }
};

const resetValuesModule = () => {
  console.log('cleaning data....');
};

defineExpose({
  clearData,
  openDialogAccountTab,
});
</script>
<template>
  <dialog-component
    sizeDialog="dialog-xl"
    v-model="open"
    :footerDisabled="!isEditingTab"
    :headerDisabled="false"
    :iconDialog="iconDialog"
    :persistent="isEditingTab"
    @before-hide="resetValuesModule"
  >
    <template #header>
      <q-toolbar
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
        <q-toolbar-title
          class="header-dialog"
          :class="$q.dark.isActive ? 'text-red' : 'text-white'"
        >
          <div v-if="!id" class="flex">
            <span>{{ `${titleDialog}` }}</span>
          </div>
          <div v-else>Name</div>
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
              <q-item clickable v-close-popup>
                <q-item-section avatar class="q-pa-none">
                  <q-icon name="open_in_new" color="blue" />
                </q-item-section>
                <q-item-section>Abrir en CRM 3</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
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
          v-close-popup
          dense
          flat
          color="white"
          :icon="!$q.screen.xs ? 'close' : 'arrow_forward'"
        >
          <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
        </q-btn>
      </q-toolbar>
    </template>
    <template #body>
      <ViewGeneral />
    </template>
  </dialog-component>
</template>
