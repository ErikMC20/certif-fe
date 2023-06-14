<script lang="ts">
import { ref, computed } from 'vue';
import { ViewGeneral } from '../../views';
import { useDialog } from 'src/composables';
import { DialogComponent } from 'src/components';
import { usePlanningStore } from '../../store/usePlanningStore';
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
const planningStore = usePlanningStore();
const { useDialogTabs } = useDialog;

//composables
const {
  id,
  open,
  titleDialog,
  activeTabComponent,
  openDialogTab,
  resetValues,
} = useDialogTabs(tabsDefinition, {
  titleDialog: 'NUEVA PLANIFICACION',
});

//const refs
const dialogGlobalRef = ref<InstanceType<typeof DialogComponent> | null>(null);
const dynamicTabRef = ref<InstanceType<typeof ViewGeneral> | null>(null);

//variables
const fullscreen = ref(false);
const isEditing = computed(() => !!dynamicTabRef.value?.isSomeCardEditing);

const clearData = () => {
  id.value = '';
  resetValues();
};

const clearDataValues = () => {
  planningStore.clearDataPlanning();
  resetValues();
};

const saveForm = (idNew: string, title: string) => {
  titleDialog.value = title;
  id.value = idNew;
  emits('formSaved');
};

const onCloseDialog = () => {
  clearDataValues();
  fullscreen.value = false;
  dialogGlobalRef.value?.hideDialog();
};

const showCloseDialog = () => {
  onCloseDialog();
};

const saveCurrentForm = () => {
  dynamicTabRef.value?.onSubmit();
};

const openDialog = async (
  id?: string,
  dialogTitle?: string,
  status?: boolean
) => {
  openDialogTab(id, dialogTitle);
};

//emits
const emits = defineEmits<{ (event: 'formSaved'): void }>();

//expose
defineExpose({
  clearData,
  openDialog,
  onCloseDialog,
});
</script>

<template>
  <dialog-component
    maximized
    ref="dialogGlobalRef"
    :size-dialog="fullscreen ? 'dialog-fullscreen' : 'dialog-xl'"
    v-model="open"
    :footerDisabled="!isEditing"
    :headerDisabled="fullscreen"
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

        <q-icon name="note" color="white" size="sm" />
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
          @click="showCloseDialog"
        >
          <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
        </q-btn>
      </q-toolbar>
    </template>
    <template #body>
      <q-page :class="fullscreen ? '' : 'q-pa-md'">
        <component
          :is="activeTabComponent"
          :moduleId="id"
          :projectId="projectId"
          @submit-complete="saveForm"
          @full-screen="(val:boolean) => fullscreen = val"
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

<style lang="scss" scoped></style>
