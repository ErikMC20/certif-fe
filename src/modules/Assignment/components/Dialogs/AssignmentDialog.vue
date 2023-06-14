<script></script>
<script setup lang="ts">
import { ref } from 'vue';

import { useDialogTabs } from 'src/composables/useDialog';
import { DialogComponent } from 'src/components';
import { ViewGeneral, ViewGeneral2 } from '../../views';
import { useAssignmentStore } from '../../store/useAssignmentStore';

defineProps<{
  projectId?: string;
}>();

const tabsDefinition = [
  {
    name: 'general',
    component: ViewGeneral,
    label: 'INDIVIDUAL',
    enabledForCreation: true,
  },
  {
    name: 'general2',
    component: ViewGeneral2,
    label: 'MASIVA',
    enabledForCreation: true,
  },
];

const {
  id,
  open,
  titleDialog,
  activeTabName,
  activeTabComponent,
  openDialogTab,
  swapCurrentTab,
  resetValues,
} = useDialogTabs(tabsDefinition, {
  titleDialog: 'NUEVA ASIGNACION DE TAREAS',
});
const dialogGlobalRef = ref<InstanceType<typeof DialogComponent> | null>(null);
const dynamicTabRef = ref<InstanceType<typeof ViewGeneral> | null>(null);
//const isEditing = computed(() => !!dynamicTabRef.value?.isSomeCardEditing);
const isEditing = ref(true);
const assignmetStore = useAssignmentStore();

const clearDataValues = () => {
  assignmetStore.clearDataAssignment();
  resetValues();
};
const onCloseDialog = () => {
  dialogGlobalRef.value?.hideDialog();
};
const saveCurrentForm = () => {
  dynamicTabRef.value?.onSubmit();
};
const saveForm = (idNew: string, title?: string) => {
  // titleDialog.value = title || '';
  // id.value = idNew;
  //close on dialog when save form
  dialogGlobalRef.value?.hideDialog();
  emit('formSaved');
};

const showCloseDialog = () => {
  openDialogTab();
};

const emit = defineEmits<{ (event: 'formSaved'): void }>();

defineExpose({
  openDialogTab,
  onCloseDialog,
});
</script>

<template>
  <dialog-component
    ref="dialogGlobalRef"
    size-dialog="dialog-xl"
    v-model="open"
    :footerDisabled="!isEditing"
    :headerDisabled="false"
    :persistent="true"
    @before-hide="clearDataValues"
  >
    <template #header>
      <q-toolbar
        class="header-dialog"
        :class="[
          $q.dark.isActive ? 'bg-dark' : 'bg-primary',
          $q.screen.lt.sm ? 'q-py-sm' : '',
        ]"
      >
        <q-btn
          dense
          flat
          color="white"
          v-if="$q.screen.xs"
          icon="arrow_back_ios"
          @click="showCloseDialog"
        />

        <q-circular-progress
          show-value
          font-size="20px"
          class="text-white q-ma-sm"
          :value="0.1"
          size="40px"
          :thickness="0.05"
          color="white"
          track-color="grey-3"
        >
          <q-icon name="note" />
        </q-circular-progress>

        <div class="row justify-between" :style="{ width: 'inherit' }">
          <q-toolbar-title
            class="header-dialog"
            :class="$q.dark.isActive ? 'text-red' : 'text-white'"
          >
            <div class="flex q-ml-md">
              <span>{{ `${titleDialog}` }} </span>
            </div>
          </q-toolbar-title>
        </div>
        <q-btn
          dense
          flat
          color="white"
          v-if="$q.screen.gt.xs"
          icon="close"
          @click="open = false"
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
        </q-tab>
      </q-tabs>
    </template>
    <template #body>
      <q-page :class="$q.screen.sm ? 'q-pa-sm' : 'q-pa-md'">
        <component
          :is="activeTabComponent"
          :moduleId="id"
          :projectId="projectId"
          @submit-complete="saveForm"
          ref="dynamicTabRef"
        />
      </q-page>
    </template>
    <template #footer v-if="isEditing">
      <q-btn
        color="primary"
        icon="save"
        label="Guardar"
        class="q-mr-sm"
        @click="saveCurrentForm"
      />
      <q-btn color="negative" label="Cancelar" @click="showCloseDialog" />
    </template>
  </dialog-component>
</template>
