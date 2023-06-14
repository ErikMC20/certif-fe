<script lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue';
import { useDialogTabs } from 'src/composables/Dialog/useDialog';
import { ReadLeadFormat } from '../../utils/types';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import {
  ViewGeneral,
  ViewDocuments,
  ViewQuotes,
  ViewSurveysConducted,
} from '../../views';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { useLeadsStore } from '../../store/LeadsStore';
import { useAsyncState } from '@vueuse/core';
import { useQuasar, QSpinnerPuff } from 'quasar';
import { useLead } from '../../composables/useLead/index';
import {
  updateModuleRecord,
  getRecordModuleInfo,
} from 'src/services/GlobalService';
</script>

<script lang="ts" setup>
const OpportunityDialog = defineAsyncComponent(
  () =>
    import('src/modules/Opportunities/components/Dialogs/OpportunityDialog.vue')
);
const AccountDialog = defineAsyncComponent(
  () => import('src/modules/Accounts/components/Dialogs/AccountDialog.vue')
);

//* Emit functions
const emits = defineEmits<{ (event: 'formSave'): void }>();
const OpDialogRef = ref<InstanceType<typeof OpportunityDialog> | null>(null);
const accountDialogRef = ref<InstanceType<typeof AccountDialog> | null>(null);
const closeAfterSavingAccount = ref(false);
const isLeadConverted = computed(
  () => !!state.value.opportunity_id_c && state.value.estado_c === 'Ganado'
);
//* Store values
const leadsStore = useLeadsStore();

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
    name: 'surveysConducted',
    component: ViewSurveysConducted,
    label: 'Encuestas Realizadas',
    enabledForCreation: false,
  },
];

const loadingView = ref(false);
const showCloseDialog = ref(false);
const deleteLeadDialog = ref(false);
const dataAccountRelLead = ref();

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
  titleDialog: 'Nuevo Lead',
  iconDialog: 'pen',
});

const { localId, userCRM, convertToOpportunity, createAccountFormat } =
  useLead();
const { state, isLoading, execute } = useAsyncState(
  async () => {
    return await leadsStore.getLead(id.value);
  },
  {} as ReadLeadFormat,
  { immediate: false }
);

//* reference variables
const generalFormRef = ref<InstanceType<typeof ViewGeneral> | null>(null);
//* computed variables
const isEditing = computed(() => !!generalFormRef.value?.isSomeCardEditing);
const saveForm = (idNew: string) => {
  titleDialog.value = 'Detalle del Prospecto:';
  loadingView.value = false;
  id.value = idNew;
  execute();
  emits('formSave');
};

//* methods
const clearData = () => {
  id.value = '';
  resetValues();
};

const resetDialog = () => {
  closeAfterSavingAccount.value = false;
  resetValues();
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
    await leadsStore.deleteLead(id.value);
    $q.notify({
      type: 'warning',
      message: 'Se ha eliminado el Lead correctamente',
    });
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

type dataAcc = {
  id: string;
  name: string;
};
const openDialogAccountTab = async (
  idModule?: string,
  dataAccount?: dataAcc,
  dialogTitle?: string,
  icon?: string
) => {
  dataAccountRelLead.value = dataAccount;
  openDialogTab(idModule, dialogTitle, icon);
  if (id.value) {
    localId.value = id.value;
    await execute();
  }
};

const openInLegacy = () => {
  window.open(
    `${HANSACRM3_URL}/index.php?module=HANO_Lead&action=DetailView&record=${id.value}`
  );
};

const openDialogOportunidad = async (id?: string) => {
  //console.log('kasd');

  await OpDialogRef.value?.openDialogAccountTab(id ? id : '');
};

const refreshVG = async () => {
  await Promise.all([
    // We need this validation because not all views are ViewGeneral.
    !!generalFormRef.value?.execute
      ? generalFormRef.value?.execute()
      : // We are creating a fake promise that automatically resolves to true
        new Promise((resolve) => resolve(true)),
    execute(),
  ]);
};

const convertLead = async () => {
  closeAfterSavingAccount.value = true;
  try {
    $q.loading.show({
      spinner: QSpinnerPuff,
      message: 'Obteniendo Datos',
    });
    await convertToOpportunity(id.value);
    await OpDialogRef.value?.openDialogAccountTab('');
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error al obtener los datos',
    });
  } finally {
    $q.loading.hide();
  }
};

const createAccountFromLead = async (type: any) => {
  try {
    $q.loading.show({
      spinner: QSpinnerPuff,
      message: 'Obteniendo Datos',
    });
    const accountData = await createAccountFormat(id.value, type);
    OpDialogRef.value?.fillRelatedAccount(type, accountData);
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error al obtener los datos',
    });
  } finally {
    $q.loading.hide();
  }
};

const updateLeadWithOpportunity = async (oppId?: string) => {
  if (!!oppId)
    try {
      console.log('my id...', oppId);
      $q.loading.show({
        spinner: QSpinnerPuff,
        message: 'Actualizando Lead',
      });
      await updateModuleRecord<{
        opportunity_id_c: string;
        estado_c: string;
        modified_user_id: string;
      }>('HANO_Lead', localId.value, {
        opportunity_id_c: oppId,
        estado_c: 'Ganado',
        modified_user_id: userCRM.value.id,
      });
      $q.notify({
        type: 'positive',
        message: 'Se ha convertido el estado del lead a ganado',
      });
      console.log('getting opportunity info');
      const opportunityData = await getRecordModuleInfo<{
        id: string;
        name: string;
        account_id: string;
      }>('Opportunities', oppId, {
        allData: false,
        fields: ['name', 'account_id'],
      });
      console.log('opportunity...', opportunityData);
      if (!!opportunityData.account_id) {
        console.log('creating relation between modules...');
        // * Create a relation between opportunity account and opportunity
        // await createRelationBetweenModules(
        //   'Opportunities',
        //   oppId,
        //   'Accounts',
        //   opportunityData.account_id
        // );

        accountDialogRef.value?.openDialogAccountTab(
          opportunityData.account_id
        );
      }
      $q.notify({
        type: 'positive',
        message: 'Se ha convertido el lead correctamente',
      });
      closeAfterSavingAccount.value = false;
      await refreshVG();
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Error al actualizar Lead',
      });
      console.log(error);
    } finally {
      $q.loading.hide();
    }
};

defineExpose({
  clearData,
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
    @before-hide="resetDialog"
  >
    <template #header>
      <q-card class="bg-primary" flat v-if="isLoading">
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
        <q-btn size="md" round flat class="q-ml-md" color="white">
          <q-icon name="hub" color="white"></q-icon>
        </q-btn>
        <q-toolbar-title
          class="header-dialog"
          :class="$q.dark.isActive ? 'text-red' : 'text-white'"
        >
          <div v-if="!id" class="flex">
            <span>{{ `${titleDialog}` }}</span>
          </div>
          <!-- <div v-else>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label lines="4">{{ state.name }}</q-item-label>
                  <q-item-label overline class="text-grey-5"><q-icon name="fiber_manual_record" color="deep-orange-4" /> Leads


                  </q-item-label>
                  <q-chip
                            dense
                            size="sm"
                            class="q-ml-md"
                            color="deep-orange-4"
                            text-color="white"
                            :label="state.oportunity_id"
                          />
                </q-item-section></q-item></q-list>
          </div> -->

          <div v-else>
            <q-list>
              <q-item class="q-ml-sm">
                <q-item-section v-show="$q.screen.xs">
                  <div>
                    <div>
                      <div class="row items-center">
                        <q-item-label overline class="text-grey"
                          >Leads
                        </q-item-label>
                        <q-chip
                          dense
                          class="q-ml-md"
                          color="orange"
                          :label="state.oportunity_id"
                        />
                      </div>
                      <q-item-label
                        :style="{
                          'white-space': 'break-spaces',
                        }"
                        >{{ state.name }}</q-item-label
                      >
                    </div>
                  </div>
                </q-item-section>
                <q-item-section v-show="!$q.screen.xs">
                  <div class="row">
                    <div style="margin: auto 0"></div>
                    <div>
                      <q-item-label>{{ state.name }}</q-item-label>
                      <div class="row">
                        <q-item-label
                          style="margin: auto 0"
                          overline
                          class="text-grey"
                          ><q-icon
                            name="fiber_manual_record"
                            color="deep-orange-4"
                          />
                          Leads
                        </q-item-label>
                        <q-chip
                          dense
                          size="sm"
                          class="q-ml-md"
                          color="deep-orange-4"
                          clickable
                          v-if="isLeadConverted"
                          @click="openDialogOportunidad(state.opportunity_id_c)"
                          :label="'Oportunidad: ' + state.oportunity_id"
                          text-color="white"
                        />
                        <!-- <q-btn color="deep-orange-4" class="q-mr-md"  size="xs" :label="state.oportunity_id" @click="openDialogOportunidad(state.opportunity_id_c)" /> -->
                      </div>
                      <!-- <pre>{{state}}</pre> -->
                    </div>
                  </div>
                </q-item-section>
                <!-- <q-item-section avatar> </q-item-section> -->
              </q-item>
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
              <q-item
                @click="convertLead"
                v-if="!isLeadConverted"
                clickable
                v-close-popup
              >
                <q-item-section avatar class="q-pa-none">
                  <q-icon name="compare_arrows" color="orange" />
                </q-item-section>
                <q-item-section> Convertir Lead a Oportunidad</q-item-section>
              </q-item>
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
        <q-btn
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
      <!-- <pre>{{ state }}</pre> -->
      <q-page
        :class="$q.platform.is.mobile ? 'q-pa-none' : 'q-pa-md'"
        style="margin-top: -50px"
      >
        <component
          :is="activeTabComponent"
          :id="id"
          :dataAccount="dataAccountRelLead"
          :nameModule="''"
          @submitComplete="saveForm"
          @submitFail="loadingView = false"
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
        Si cierra la edicion se perderan los datos no guardados
      </span>
    </template>
  </AlertComponent>
  <AlertComponent
    title="¿Eliminar Lead?"
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
      <span class="q-py-sm"> ¿Esta seguro de eliminar este Lead? </span>
    </template>
  </AlertComponent>
  <OpportunityDialog
    ref="OpDialogRef"
    :get-draft-data="closeAfterSavingAccount"
    close-after-saving
    @create-account="createAccountFromLead"
    @form-save="updateLeadWithOpportunity"
  />
  <AccountDialog ref="accountDialogRef" @form-save="refreshVG" />
</template>
