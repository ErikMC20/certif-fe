<script></script>
<script setup lang="ts">
import { ref, computed } from 'vue';

import { useDialogTabs } from 'src/composables/useDialog';
import { DialogComponent } from 'src/components';
import ViewUpload from '../../views/ViewUpload.vue';

defineProps<{
  projectId?: string;
}>();

const tabsDefinition = [
  {
    name: 'general',
    component: ViewUpload,
    label: 'General',
    enabledForCreation: true,
  },
];
// const openDialog = async (id?: string, dialogTitle?: string) => {
//   console.log('hola');
//   open.value = true;
// };
const {
  id,
  open,
  titleDialog,
  activeTabComponent,
  openDialogTab,
  resetValues,
} = useDialogTabs(tabsDefinition, {
  titleDialog: 'SUBIR RDO',
});
const dialogGlobalRef = ref<InstanceType<typeof DialogComponent> | null>(null);
const dynamicTabRef = ref<InstanceType<typeof ViewUpload> | null>(null);
//const isEditing = computed(() => !!dynamicTabRef.value?.isSomeCardEditing);

const clearDataValues = () => {
  //console.log('aaaaaa');
};
const onCloseDialog = () => {
  dialogGlobalRef.value?.hideDialog();
};
const saveCurrentForm = () => {
  //const data = dynamicTabRef.value?.onSubmit();
};
const saveForm = (idNew: string, title: string) => {
  titleDialog.value = title;
  id.value = idNew;
  emits('formSaved');
};

const showCloseDialog = () => {
  onCloseDialog();
};
const emits = defineEmits<{ (event: 'formSaved'): void }>();

defineExpose({
  openDialogTab,
  onCloseDialog,
});
</script>

<template>
  <dialog-component
    ref="dialogGlobalRef"
    size-dialog="dialog-lg"
    v-model="open"
    :footerDisabled="true"
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
              <div>{{ `${titleDialog}` }}</div>
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
    </template>
    <template #body>
      <q-page :class="'q-pa-sm'">
        <component
          :is="activeTabComponent"
          :moduleId="id"
          @submit-complete="saveForm"
          ref="dynamicTabRef"
        />
      </q-page>
    </template>
    <template #footer v-if="false">
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
