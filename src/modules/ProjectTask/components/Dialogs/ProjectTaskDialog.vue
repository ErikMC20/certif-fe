<script lang="ts">
import { ref, computed } from 'vue';
import { ViewGeneral } from '../../views';
import { useDialog } from 'src/composables';
import { DialogComponent } from 'src/components';
</script>
<script setup lang="ts">
defineProps<{
  projectId?: string;
}>();

const tabsDefinition = [
  {
    name: 'general',
    component: ViewGeneral,
    label: 'Versionar',
    enabledForCreation: true,
  },
];
//other declarations

const { useDialogTabs } = useDialog;

//composables
const { id, open, titleDialog, activeTabComponent, openDialogTab } =
  useDialogTabs(tabsDefinition, {
    titleDialog: 'NUEVA PLANIFICACION',
  });

//const refs
const dialogGlobalRef = ref<InstanceType<typeof DialogComponent> | null>(null);

const onCloseDialog = () => {
  dialogGlobalRef.value?.hideDialog();
};

const openDialog = async (id?: string, dialogTitle?: string) => {
  openDialogTab(id, dialogTitle);
};

//expose
defineExpose({
  openDialog,
  onCloseDialog,
});
</script>

<template>
  <dialog-component
    maximized
    ref="dialogGlobalRef"
    :size-dialog="'dialog-lg'"
    v-model="open"
    :footerDisabled="true"
    :headerDisabled="false"
    :persistent="true"
  >
    <template #header>
      <q-toolbar class="header-dialog bg-white text-blue shadow-2">
        <q-btn
          dense
          flat
          color="white"
          v-if="$q.screen.xs"
          icon="arrow_back_ios"
          @click="onCloseDialog"
        />

        <q-icon name="task" color="blue" size="sm" />
        <div class="row justify-between" :style="{ width: 'inherit' }">
          <q-toolbar-title class="header-dialog">
            <div class="flex q-ml-md">
              <span>{{ `${titleDialog}` }} </span>
            </div>
          </q-toolbar-title>
        </div>
        <q-btn
          dense
          flat
          color="blue"
          v-if="$q.screen.gt.xs"
          icon="close"
          @click="onCloseDialog"
        />
      </q-toolbar>
    </template>
    <template #body>
      <q-page :class="'q-pa-md'">
        <component
          :is="activeTabComponent"
          :moduleId="id"
          ref="dynamicTabRef"
        />
      </q-page>
    </template>
  </dialog-component>
</template>

<style lang="scss" scoped></style>
