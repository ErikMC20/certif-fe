<script setup lang="ts">
import { ref } from 'vue';
import { useDialogTabs } from 'src/composables/useDialog';
import { DialogComponent } from 'src/components';
import { useAssignmentStore } from '../../store/useAssignmentStore';
import ViewApprovation from '../../views/ViewAppovation.vue';

defineProps<{
  projectId?: string;
}>();

const tabsDefinition = [
  {
    name: 'general',
    component: ViewApprovation,
    label: 'INDIVIDUAL',
    enabledForCreation: true,
  },
];

const {
  id,
  open,
  titleDialog,
  activeTabComponent,
  openDialogTab,
  resetValues,
} = useDialogTabs(tabsDefinition, {
  titleDialog: 'APROBAR ASIGNACION',
});

const dialogGlobalRef = ref<InstanceType<typeof DialogComponent> | null>(null);
const dynamicTabRef = ref<InstanceType<typeof ViewApprovation> | null>(null);
const assignmetStore = useAssignmentStore();

const clearDataValues = () => {
  assignmetStore.clearDataAssignment();
  resetValues();
};

const onCloseDialog = () => {
  dialogGlobalRef.value?.hideDialog();
};

const saveCurrentForm = (type: string) => {
  dynamicTabRef.value?.onShowConfirm(type);
};

const saveForm = () => {
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
    size-dialog="dialog-lg"
    v-model="open"
    :footerDisabled="false"
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
    </template>
    <template #body>
      <q-page>
        <component
          :is="activeTabComponent"
          :moduleId="id"
          :projectId="projectId"
          @submit-complete="saveForm"
          ref="dynamicTabRef"
        />
      </q-page>
    </template>
    <template #footer>
      <div class="flex justify-between col-12">
        <div>
          <q-btn
            color="primary"
            icon="save"
            label="APROBAR"
            class="q-mr-sm"
            @click="saveCurrentForm('Approved')"
          />
          <q-btn
            color="negative"
            icon="close"
            label="RECHAZAR"
            @click="saveCurrentForm('Rejected')"
          />
        </div>
        <q-btn
          color="white"
          text-color="dark"
          label="CERRAR vista"
          @click="showCloseDialog"
        />
      </div>
    </template>
  </dialog-component>
</template>
