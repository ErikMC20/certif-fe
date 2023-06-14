<script></script>
<script setup lang="ts">
import { ref } from 'vue';

import { useDialogTabs } from 'src/composables/useDialog';
import { DialogComponent } from 'src/components';
import { useAssignmentStore } from '../../store/useAssignmentStore';
import ViewMyWorkAreas from '../../views/ViewMyWorkAreas.vue';
import ViewMyAssignment from '../../views/ViewMyAssignment.vue';

defineProps<{
  projectId?: string;
}>();

const tabsDefinition = [
  {
    name: 'general',
    component: ViewMyAssignment,
    label: 'ASIGNACIONES',
    enabledForCreation: true,
  },
  {
    name: 'general2',
    component: ViewMyWorkAreas,
    label: 'AREAS DE TRABAJO',
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
  titleDialog: 'MI PANEL',
});
const dialogGlobalRef = ref<InstanceType<typeof DialogComponent> | null>(null);
const dynamicTabRef = ref(null);
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
  // dynamicTabRef.value?.onSubmit();
};
const saveForm = (idNew: string, title?: string) => {
  titleDialog.value = title || '';
  id.value = idNew;
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
    :footerDisabled="true"
    :headerDisabled="false"
    :persistent="true"
    @before-hide="clearDataValues"
  >
    <template #header>
      <q-toolbar class="header-dialog bg-primary">
        <q-btn
          dense
          flat
          color="white"
          v-if="$q.screen.xs"
          icon="arrow_back_ios"
          @click="showCloseDialog"
        />
        <div class="row justify-between" :style="{ width: 'inherit' }">
          <q-toolbar-title class="text-white">
            <div class="flex q-ml-md text-ellipsis">
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
      <q-page class="q-pa-none bg-blue-grey-1">
        <component
          :is="activeTabComponent"
          :projectId="id"
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
<style scoped>
.text-ellipsis {
  font-size: 1em;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 240px;
}
</style>
