<script lang="ts">
import { ref, computed, watch } from 'vue';
import { useDialogTabs } from 'src/composables/Dialog/useDialog';
import { ReadLeadFormat } from '../../utils/types';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import {
  ViewGeneral,
  ViewContacts,
  ViewQuotes,
  ViewDocuments,
  ViewSurveysConducted,
  ViewProspects,
  ViewReservas,
  ViewContract,
  ViewProyects,
  ViewEntregas,
} from '../../views';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { useQuasar, QSpinnerPuff } from 'quasar';
import { useOpportunity } from '../../composables/useOppotunity';
import { OpportunityGlobal } from 'src/modules/Opportunities/utils/types';
import {
  AccountModel,
  AccountDataDraft,
} from 'src/modules/Accounts/utils/types/index';
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
const emits = defineEmits<{
  (event: 'formSave', id?: string): void;
  (event: 'createAccount', type: AccountModel): void;
}>();

const $q = useQuasar();

//* variables
const tabsDefinition = [
  {
    name: 'general',
    component: ViewGeneral,
    label: 'General',
    enabledForCreation: true,
  },
  {
    name: 'documents',
    component: ViewDocuments,
    label: 'Documentos',
    enabledForCreation: false,
  },
  {
    name: 'quotes',
    component: ViewQuotes,
    label: 'Cotizaciones',
    enabledForCreation: false,
  },
  {
    name: 'contact',
    component: ViewContacts,
    label: 'Contactos',
    enabledForCreation: false,
  },
  // {
  //   name: 'prospect',
  //   component: ViewProspects,
  //   label: 'Prospectos',
  //   enabledForCreation: false,
  // },
  // {
  //   name: 'proyect',
  //   component: ViewProyects,
  //   label: 'Proyectos',
  //   enabledForCreation: false,
  // },

  // {
  //   name: 'contract',
  //   component: ViewContract,
  //   label: 'Contratos',
  //   enabledForCreation: false,
  // },
  {
    name: 'reserve',
    component: ViewReservas,
    label: 'Reservas',
    enabledForCreation: false,
  },
  {
    name: 'entregas',
    component: ViewEntregas,
    label: 'Entregas',
    enabledForCreation: false,
  },
  {
    name: 'surveysConducted',
    component: ViewSurveysConducted,
    label: 'Encuestas Realizadas',
    enabledForCreation: false,
  },
];

const loadingView = ref(false);
const showCloseDialog = ref(false);
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
  titleDialog: 'Nueva Oportunidad',
  iconDialog: 'pen',
});

const {
  isLoading: isDataLoading,
  localId,
  opportunityGlobalData,
  opportunityDraft,
  getOpportunityGlobal,
  deleteOpportunity,
} = useOpportunity();

//* reference variables
const generalFormRef = ref<InstanceType<typeof ViewGeneral> | null>(null);
//* computed variables
const isEditing = computed(() => !!generalFormRef.value?.isSomeCardEditing);

const saveForm = async (idNew: string) => {
  titleDialog.value = 'Detalle del Prospecto:';
  loadingView.value = false;
  id.value = idNew;
  // await getOpportunityGlobal(id.value, true);

  emits('formSave', id.value);
  if (props.closeAfterSaving) {
    open.value = false;
  }
};

//* methods
const clearData = () => {
  console.log('cleaning data');

  id.value = '';
  localId.value = '';
  resetValues();
  opportunityDraft.value = {} as OpportunityGlobal;
};

const saveCurrentForm = async () => {
  console.log('submitting something');
  loadingView.value = true;
  try {
    await generalFormRef.value?.onSubmit();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al guardar lead',
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
    await deleteOpportunity(id.value);
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

const openDialogAccountTab = async (
  idModule?: string,
  dialogTitle?: string,
  icon?: string
) => {
  id.value = '';
  console.log('this is your id', idModule);
  openDialogTab(idModule, dialogTitle, icon);
  if (id.value) {
    await getOpportunityGlobal(id.value);
  }
};

const openInLegacy = () => {
  window.open(
    `${HANSACRM3_URL}/index.php?module=Opportunities&action=DetailView&record=${id.value}`
    // `crm-qas.hansa.com.bo/index.php?module=Opportunities&action=DetailView&record=${id.value}`
  );
};
const refreshVG = async () => {
  if (id.value) await getOpportunityGlobal(id.value);
};

const createNewAccount = (type: AccountModel) => {
  emits('createAccount', type);
};

const fillRelatedAccount = (
  type: AccountModel,
  accountData: AccountDataDraft
) => {
  console.log('related Account', accountData);
  generalFormRef.value?.fillRelatedAccount(type, accountData);
};

watch(localId, (value) => {
  id.value = value;
});

defineExpose({
  clearData,
  fillRelatedAccount,
  openDialogAccountTab,
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
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label lines="4">{{
                    opportunityGlobalData.name
                  }}</q-item-label>
                  <q-item-label overline class="text-grey-5">
                    <q-icon name="fiber_manual_record" color="deep-orange-4" />
                    Oportunidad Nro. <b>{{opportunityGlobalData.number_c}}</b></q-item-label
                  >
                </q-item-section></q-item
              >
            </q-list>
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
        <!-- <q-btn
        class="q-ml-md "
        size="sm"
        outline
        flat
        dense
        round
        color="white"
        text-color="white"
        :icon="!$q.screen.xs ? 'close' : 'arrow_forward'"
        @click="showCloseDialog = true"
        >
          <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
        </q-btn> -->
        <q-btn
          class="q-ml-md"
          dense
          flat
          color="white"
          :icon="!$q.screen.xs ? 'close' : 'arrow_forward'"
          @click="showCloseDialog = true"
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
          <!-- <q-badge color="red" floating >2</q-badge> -->
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
          @create-account="createNewAccount"
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
    v-model="showCloseDialog"
    @confirm="onCloseDialog"
    @denegate="showCloseDialog = false"
  >
    <template #body>
      <span class="q-py-sm">
        Si cierra la edición se perderán los datos no guardados
      </span>
    </template>
  </AlertComponent>
  <AlertComponent
    title="¿Eliminar Oportunidad?"
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
      <span class="q-py-sm"> ¿Está seguro de eliminar esta oportunidad? </span>
    </template>
  </AlertComponent>
</template>
