<script lang="ts">
import {
  ViewGeneral,
  ViewPlanning,
  ViewWorkAreas,
  ViewAssignation,
  ViewAdvanceProject,
  ViewReports,
} from '../../views';
import { useDialog } from 'src/composables';
import { useProjectStore } from '../../store/useProjectStore';
import { AlertComponent, DialogComponent } from 'src/components';
import HeaderSkeleton from '../Skeletons/HeaderSkeleton.vue';
import ViewGoals from '../../views/ViewGoals.vue';
import { ref, computed } from 'vue';
import { setStatusColor } from '../../composables';
import { storeToRefs } from 'pinia';
import { useProjectTableStore } from '../../store/useProjectTableStore';
</script>
<script setup lang="ts">
const tabsDefinition = [
  {
    name: 'general',
    component: ViewGeneral,
    label: 'General',
    enabledForCreation: true,
  },
  {
    name: 'planification',
    component: ViewPlanning,
    label: 'Planificacion',
    enabledForCreation: false,
  },
  {
    name: 'work_areas',
    component: ViewWorkAreas,
    label: 'Areas de trabajo',
    enabledForCreation: false,
  },
  {
    name: 'objectives',
    component: ViewGoals,
    label: 'Objetivos',
    enabledForCreation: false,
  },
  {
    name: 'assignation',
    component: ViewAssignation,
    label: 'asignacion',
    enabledForCreation: false,
  },
  {
    name: 'project_advance',
    component: ViewAdvanceProject,
    label: 'avance del proyecto',
    enabledForCreation: false,
  },
  {
    name: 'reports',
    component: ViewReports,
    label: 'REPORTES',
    enabledForCreation: false,
  },
];
//other declarations
const store = useProjectStore();
const tableStore = useProjectTableStore();
const { payload: project, loading } = storeToRefs(store);
const { useDialogTabs } = useDialog;

//composables
const {
  id,
  open,
  activeTabName,
  activeTabComponent,
  swapCurrentTab,
  openDialogTab,
  resetValues,
} = useDialogTabs(tabsDefinition, {
  titleDialog: 'Detalle del proyecto:',
});

//store

//const refs
const dialogGlobalRef = ref<InstanceType<typeof DialogComponent> | null>(null);
const dynamicTabRef = ref<InstanceType<typeof ViewGeneral> | null>(null);

//variables
const isEditing = computed(() => !!dynamicTabRef.value?.isSomeCardEditing);
const closeDialogState = ref(false);

//functions
const clearData = () => {
  id.value = '';
  resetValues();
};

const clearDataValues = () => {
  store.onClearDataProject();
  resetValues();
};

const saveForm = (idNew: string) => {
  id.value = idNew;
  tableStore.reloadList();
};

const onCloseDialog = () => {
  dialogGlobalRef.value?.hideDialog();
};

const showCloseDialog = () => {
  if (dynamicTabRef.value?.isSomeCardEditing) {
    closeDialogState.value = true;
    return;
  }
  onCloseDialog();
};

const saveCurrentForm = async () => {
  try {
    await dynamicTabRef.value?.onSubmit();
  } catch (error) {}
};

const openDialogProject = async (id?: string, dialogTitle?: string) => {
  openDialogTab(id, dialogTitle);
};

//expose
defineExpose({
  clearData,
  openDialogProject,
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
      <template v-if="loading">
        <HeaderSkeleton />
      </template>
      <template v-else>
        <q-toolbar
          class="header-dialog"
          :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'"
        >
          <q-circular-progress
            show-value
            font-size="16px"
            class="text-white q-ma-md"
            :value="100"
            size="50px"
            :thickness="0.1"
            color="orange"
            v-if="!$q.screen.xs"
          >
            <q-icon
              :name="setStatusColor(project.status)?.icon ?? 'task'"
              size="xs"
            />
          </q-circular-progress>
          <q-toolbar-title
            class="header-dialog"
            :class="$q.dark.isActive ? 'text-red' : 'text-white'"
          >
            <q-list>
              <q-item class="q-pa-none" v-if="id">
                <q-item-section v-show="$q.screen.xs" class="q-pa-md">
                  <q-item-label lines="4">{{ project.name }}</q-item-label>
                  <q-item-label overline class="text-grey-5">
                    <q-icon
                      name="fiber_manual_record"
                      size="13px"
                      :color="setStatusColor(project.status)?.textColor"
                    />
                    {{ setStatusColor(project.status)?.text }}
                  </q-item-label>
                </q-item-section>
                <q-item-section v-show="!$q.screen.xs">
                  <q-item-label>{{ project.name }}</q-item-label>
                  <q-item-label overline class="text-grey-5">
                    <q-icon
                      name="fiber_manual_record"
                      size="18px"
                      :color="setStatusColor(project.status)?.textColor"
                    />
                    {{ setStatusColor(project.status)?.text }}
                  </q-item-label>
                </q-item-section>
                <q-item-section avatar> </q-item-section>
              </q-item>
              <q-item class="q-pa-none" v-else>
                <q-item-section v-show="$q.screen.xs">
                  <q-item-label lines="4">{{ `NUEVO PROYECTO` }}</q-item-label>
                  <q-item-label overline class="text-grey-5">
                    <q-icon
                      name="fiber_manual_record"
                      size="18px"
                      color="task"
                    />
                    &nbsp;
                  </q-item-label>
                </q-item-section>
                <q-item-section v-show="!$q.screen.xs">
                  <q-item-label>{{ `NUEVO PROYECTO` }}</q-item-label>
                  <q-item-label overline class="text-grey-5">
                    &nbsp;
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-toolbar-title>
          <q-btn
            dense
            flat
            color="white"
            :icon="!$q.screen.xs ? 'close' : 'arrow_forward'"
            v-close-popup
          >
            <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-toolbar>
      </template>

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
      <q-toolbar
        class="header-dialog"
        :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'"
      ></q-toolbar>
      <q-page
        :class="$q.screen.sm ? 'q-pa-sm' : 'q-pa-md'"
        style="margin-top: -50px"
      >
        <component
          :is="activeTabComponent"
          :moduleId="id"
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
        Si cierra la edicion se perderan los datos no guardados
      </span>
    </template>
  </AlertComponent>
</template>

<style lang="scss" scoped></style>
