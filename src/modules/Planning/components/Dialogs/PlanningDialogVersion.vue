<script lang="ts">
import { ref, computed } from 'vue';
import { ViewGeneral } from '../../views';
import { useDialog } from 'src/composables';
import { DialogComponent } from 'src/components';
import { usePlanningStore } from '../../store/usePlanningStore';
import ViewVersion from '../../views/ViewVersion.vue';
</script>
<script setup lang="ts">
defineProps<{
  projectId?: string;
}>();

const tabsDefinition = [
  {
    name: 'general',
    component: ViewVersion,
    label: 'General',
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
  dialogGlobalRef.value?.hideDialog();
};

const showCloseDialog = () => {
  onCloseDialog();
};

const saveCurrentForm = () => {
  dynamicTabRef.value?.onSubmit();
};

const openDialog = async (id?: string, dialogTitle?: string) => {
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
          $q.dark.isActive ? 'bg-dark' : 'bg-grey-4',
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
          class="text-dark q-ma-sm"
          :value="100"
          size="40px"
          :thickness="0.07"
          color="dark"
          track-color="grey-3"
        >
          <q-icon name="note" />
        </q-circular-progress>

        <div class="row justify-between" :style="{ width: 'inherit' }">
          <q-toolbar-title
            class="header-dialog"
            :class="$q.dark.isActive ? 'text-red' : 'text-dark'"
          >
            <div class="flex q-ml-md">
              <span>{{ `(versionar) ${titleDialog} ` }} </span>
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
        color="orange"
        icon="save"
        label="Guardar version"
        class="q-mr-sm"
        @click="saveCurrentForm"
      />
      <q-btn color="negative" label="Cancelar" @click="showCloseDialog" />
    </template>
  </dialog-component>
</template>

<style lang="scss" scoped></style>
