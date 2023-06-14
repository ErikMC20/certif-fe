<script lang="ts">
export default {
  name: 'GeneralDialog',
};
import { ref, computed } from 'vue';
import { useDialogTabs } from 'src/composables/Dialog/useDialog';
import { OptionBase } from '../../utils/types';
import convertReserveDialog from 'src/modules/Reservas/components/Dialogs/convertReserveDialog.vue';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import LayoutQuotes from './LayoutQuotes.vue';
import ReservasDialog from 'src/modules//Reservas/components/Dialogs/ReservasDialog.vue';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import SendEmailQuotes from './SendEmaiQuotes/SendEmailQuotes.vue';
import {
  ViewGeneral,
  ViewContract,
  ViewDocuments,
  ViewInvoice,
  ViewProject,
  ViewBuy,
} from '../../views';

import { useQuotesStore } from '../../store/QuotesStore';
import { useAsyncState, useBase64 } from '@vueuse/core';
import { useQuasar } from 'quasar';
import { QuotesTableStore } from '../../store/QuotesTableStore';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import axios from 'axios';
import { loadCldr } from '@syncfusion/ej2-base';
</script>
<script lang="ts" setup>
import { AnySoaRecord } from 'dns';
//* Emit functions
const emits = defineEmits<{
  (event: 'reloadQuotes'): void;
}>();
const SendEmailQuotesRef = ref<InstanceType<typeof SendEmailQuotes> | null>(
  null
);
const $q = useQuasar();
const quotesStore = useQuotesStore();
const showCloseDialog = ref(false);
const loadingView = ref(false);
const showAlertDelete = ref(false);
const alertSendEmail = ref(false);
const verificarReserva = ref(false);
const verificaEstado = ref(false);
const idEdit = ref();
const isEditNew = ref(false);
const QTStore = QuotesTableStore();
const formStore = useFormOptionsStore();
const dataDuplicado = ref('');
const listaDuplicado = ref();
const activedup = ref(false);
const estadoEditar = ref(false);
//* variables
const tabsDefinition = [
  {
    name: 'general',
    component: ViewGeneral,
    label: 'General',
    enabledForCreation: true,
  },
  {
    name: 'contract',
    component: ViewContract,
    label: 'Contrato',
    enabledForCreation: false,
  },
  {
    name: 'invoice',
    component: ViewInvoice,
    label: 'Factura',
    enabledForCreation: false,
  },
  {
    name: 'proyect',
    component: ViewProject,
    label: 'Proyecto',
    enabledForCreation: false,
  },
  {
    name: 'buy',
    component: ViewBuy,
    label: 'Orden Compra',
    enabledForCreation: false,
  },
  {
    name: 'documents',
    component: ViewDocuments,
    label: 'Documentos',
    enabledForCreation: false,
  },
];

//* Composable values
const {
  id,
  open,
  titleDialog,
  activeTabName,
  activeTabComponent,
  swapCurrentTab,
  iconDialog,
  resetValues,
  openDialogTab,
} = useDialogTabs(tabsDefinition, {
  titleDialog: 'Nueva Cotización',
  iconDialog: 'pen',
});

const convertDialog = ref();
const reserveDialogRef = ref<InstanceType<typeof ReservasDialog> | null>(null);

const { state, isLoading, execute } = useAsyncState(
  async () => {
    await formStore.getHANQModelOptions();
    return await quotesStore.getModuleTypeIDPro('Quotes', id.value);
  },
  {} as any,
  { immediate: false }
);
const recargarID = (val: string) => {
  console.log(val);
  idEdit.value = val;
  // isEditNew.value = false;
};

// PARA ABRIR EL DIALOG DE COTIZACIONES
const openDialogQuotesTab = async (
  idModule?: string,
  dialogTitle?: string,
  icon?: string
) => {
  idEdit.value = '';
  openDialogTab(idModule, dialogTitle, icon);
  if (id.value) {
    await execute();
  }
};
const dataOpp = ref();
// PARA ABRIR EL DIALOG DE COTIZACIONES
const openDialogQuotesTabOpportunity = async (
  idModule?: string,
  dataOpportunity?: string,
  dialogTitle?: string,
  icon?: string
) => {
  dataOpp.value = dataOpportunity;
  idEdit.value = '';
  openDialogTab(idModule, dialogTitle);
  if (id) {
    await execute();
  }
};

const dataModuleSubPanels = ref({} as any);
// PARA ABRIR EL DIALOG DE COTIZACIONES
const openDialogQuotesTabModuleSubPanels = async (
  idModule?: string,
  dataModuleSubPanel?: string,
  dialogTitle?: string,
  icon?: string
) => {
  dataModuleSubPanels.value = dataModuleSubPanel;
  idEdit.value = '';
  openDialogTab(idModule, dialogTitle);
  if (id) {
    await execute();
  }
};

// PARA CERRAR EL DIALOG DE COTIZACIONES
const onCloseDialog = () => {
  dataDuplicado.value = '';
  listaDuplicado.value = '';
  open.value = false;
};

const showAlertDeletQuotes = () => {
  showAlertDelete.value = true;
};
const clearData = () => {
  id.value = '';
  resetValues();
};

const DeletQuotes = async () => {
  showAlertDelete.value = false;
  open.value = false;
  $q.loading.show();
  await quotesStore.deleteQuotesStore(String(state.value.id));
  $q.loading.hide();
  QTStore.reloadList();
};
//* reference variables
const generalFormRef = ref<InstanceType<typeof ViewGeneral> | null>(null);

// PARA EL BOTON DE BLOQUEAR O EDITAR EN LA PARTE DEL FOTTER
// const isEditing = computed(() => !!generalFormRef.value?.isSomeCardEditing);
const isEditing = computed(() => {
  return [!!generalFormRef.value?.isSomeCardEditing, isEditNew.value].some(
    (value) => !!value
  );
});

const saveCurrentForm = async () => {
  loadingView.value = true;
  try {
    if (!!dataOpp.value) {
      await generalFormRef.value?.saveQuotesNew();
      open.value = false;
      emits('reloadQuotes');
    }

    if (!!dataModuleSubPanels.value) {
      await generalFormRef.value?.saveQuotesNew();
      open.value = false;
      estadoEditar.value = false;
      emits('reloadQuotes');
    }

    if (!dataOpp.value && !dataModuleSubPanels.value) {
      await generalFormRef.value?.saveQuotesNew();
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al guardar la cotización',
    });
  }

  loadingView.value = false;
};

// PARA ABRIR EL DIALOG DE COTIZACIONES
// const openDialogAccountTab = async (
//   idModule?: string,
//   dialogTitle?: string,
//   icon?: string
// ) => {
//   openDialogTab(idModule, dialogTitle, icon);
//   if (id.value) {
//     await execute();
//   }
// };

const openDialogDelivery = async (id?: string) => {
  await reserveDialogRef.value?.openDialogReserveTab(id ? id : '');
};

const openConvertReserve = (
  estado: string,
  oportunidad: string,
  cuenta: string
) => {
  if (estado == 'Confirmed' && oportunidad != '' && cuenta != '') {
    convertDialog.value.open = !convertDialog.value.open;
  } else {
    verificaEstado.value = true;
  }
};
//* reference layoutquotes
const layoutQuotesRef = ref<InstanceType<typeof LayoutQuotes> | null>(null);
const openLayoutQuotes = async () => {
  await execute();
  layoutQuotesRef.value?.openDialog();
};

const datagest = ref();
const conver64Data = ref();
const idModuleQuotes = ref(state.value.id);

const sendLayoutQuotesToEmail = async () => {
  await execute();
  datagest.value = await quotesStore.getemailsTosendLayoutStore(
    state.value.attributes.billing_account_id,
    state.value.attributes.billing_contact_id
  );

  if (!!state.value.attributes.idamercado_c) {
    conver64Data.value = '';
    // conver64Data.value = await quotesStore.getDocumentoBase64Store(
    //   state.value.id,
    //   state.value.attributes.idamercado_c
    // );
    SendEmailQuotesRef.value?.openDialog(
      datagest.value,
      state.value.attributes.name,
      conver64Data.value,
      state.value.id,
      state.value.attributes.idamercado_c,
      state.value.attributes.iddivision_c
    );
  } else {
    console.log('no cuenta con area de mercado');
    alertSendEmail.value = true;
  }
};

const option = <OptionBase | any>ref();

// PARA DUPLICAR UNA COTIZACION================================================================================================>
const duplicandoQuotes = async () => {
  // console.log('duplicando la cotizacion......', id.value);
  activedup.value = true;
  const idaux = id.value;
  open.value = false;
  activedup.value = false;
  dataDuplicado.value = await quotesStore.getQuotesCompletaStore(idaux);
  listaDuplicado.value = await quotesStore.getListArticuloVer2Store(idaux);

  // console.log(listaDuplicado.value);
  openDialogQuotesTab('');
};
// const openDialogQuotesDupli = async (
//   idModule?: string,
//   dialogTitle?: string,
//   icon?: string
// ) => {
//   idEdit.value = '';
//   openDialogTab(idModule, dialogTitle, icon);
//   if (id.value) {
//     await execute();
//   }
// };
// ==============================================================================================================================>

const deleteQuotesDialog = () => {
  option.value = id.value;
  QTStore.deleteMultiple(option.value);
};

const actualizar = () => {
  setTimeout(async () => {
    if (id.value) {
      await execute();
    }
  }, 500);
  //  execute();
};
const idemercado = computed(() => {
  return state.value?.attributes?.idamercado_c || '';
});

const iddivision = computed(() => {
  return state.value?.attributes?.iddivision_c || '';
});

const openInLegacy = () => {
  window.open(
    `${HANSACRM3_URL}/index.php?module=AOS_Quotes&action=DetailView&record=${id.value}`
  );
};

defineExpose({
  clearData,
  openDialogQuotesTab,
  openDialogQuotesTabOpportunity,
  openDialogQuotesTabModuleSubPanels,
});
</script>
<template>
  <dialog-component
    size-dialog="dialog-xl"
    v-model="open"
    :footerDisabled="!isEditing"
    :headerDisabled="false"
    :iconDialog="iconDialog"
    :persistent="isEditing"
    @before-hide="resetValues"
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
        <q-circular-progress
          show-value
          font-size="16px"
          class="text-white q-ma-md"
          :value="100"
          size="35px"
          :thickness="0.1"
          color="orange"
          v-if="!$q.screen.xs"
        >
          <q-icon name="person" size="xs" />
        </q-circular-progress>
        <q-toolbar-title
          class="header-dialog"
          :class="$q.dark.isActive ? 'text-red' : 'text-white'"
        >
          <div v-if="!id" class="flex">
            <span>{{ `${titleDialog}` }}</span>
            <template v-if="dataDuplicado != ''">
              <span class="text-orange"> Cotización Duplicada</span>
            </template>
          </div>
          <div v-else>
            {{ state.attributes.name }}
            <span>Nro.: {{ state.attributes.number }}</span>
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

              <q-item
                @click="verificarReserva = true"
                clickable
                v-close-popup
                v-if="
                  state.attributes?.hanq_reservas_aos_quoteshanq_reservas_ida !=
                  ''
                "
              >
                <q-item-section avatar class="q-pa-none">
                  <q-icon name="swap_horiz" color="blue" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Ver reserva</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                @click="
                  openConvertReserve(
                    state.attributes?.stage || '',
                    state.attributes?.opportunity_id || '',
                    state.attributes?.billing_account_id || ''
                  )
                "
                clickable
                v-close-popup
              >
                <!-- hanq_reservas_aos_quoteshanq_reservas_ida -->
                <q-item-section avatar class="q-pa-none">
                  <q-icon name="swap_horiz" color="blue" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Convertir a reserva</q-item-label>
                </q-item-section>
              </q-item>

              <q-item @click="openLayoutQuotes()" clickable v-close-popup>
                <!-- hanq_reservas_aos_quoteshanq_reservas_ida -->
                <q-item-section avatar class="q-pa-none">
                  <q-icon name="picture_as_pdf" color="blue" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Ver Cotización</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                @click="sendLayoutQuotesToEmail()"
                clickable
                v-close-popup
              >
                <q-item-section avatar class="q-pa-none">
                  <q-icon
                    name="outgoing_mail
                  "
                    color="blue"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Enviar por correo</q-item-label>
                </q-item-section>
              </q-item>
              <q-item @click="duplicandoQuotes" clickable>
                <q-item-section avatar class="q-pa-none">
                  <q-icon
                    name="social_distance
                  "
                    color="blue"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Duplicar Coización</q-item-label>
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
        indicator-color="white"
        active-color="white"
        align="justify"
        dense
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
      <!-- <pre v-if="state.attributes?.hanq_reservas_aos_quoteshanq_reservas_ida != undefined">{{state.attributes.hanq_reservas_aos_quoteshanq_reservas_ida}}</pre> -->

      <q-page :class="$q.platform.is.mobile ? 'q-pa-none' : 'q-pa-md'">
        <!-- <pre>aaaa{{ isEditing }}</pre> -->
        <component
          :is="activeTabComponent"
          :id="id ? id : idEdit"
          :nameModule="''"
          @submitReturnid="recargarID"
          ref="generalFormRef"
          :dataIntro="dataOpp"
          :dataIntroModuleSubPanel="dataModuleSubPanels"
          :dataDupli="dataDuplicado"
          :listaDupli="listaDuplicado"
          :cambioEdit="estadoEditar"
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
      <q-btn color="negative" v-close-popup @click="onCloseDialog"
        >Cancelar</q-btn
      >
    </template>
    <q-inner-loading
      :showing="activedup"
      label="Duplicando la cotización..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </dialog-component>

  <AlertComponent
    title="Campo a llenar faltante..."
    icon="report_off"
    iconColor="red"
    iconSize="50px"
    btn-color="primary"
    btn-text="cancelar"
    :disableCancel="true"
    v-model="alertSendEmail"
  >
    <template #body>
      <span class="q-py-sm"> Seleccione un área de mercado </span>
    </template>
  </AlertComponent>

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
    title="Eliminar Cotización..."
    icon="report_off"
    iconColor="red"
    iconSize="50px"
    btn-color="primary"
    btn-text="Si, salir"
    v-model="showAlertDelete"
    @confirm="DeletQuotes"
    @denegate="showAlertDelete = false"
  >
    <template #body>
      <span class="q-py-sm">
        Se eliminara la cotización {{ state.attributes.name }}
      </span>
    </template>
  </AlertComponent>
  <convertReserveDialog
    ref="convertDialog"
    :idModule="id"
    :module="'1'"
    :data="state"
    @form-saved="actualizar"
  ></convertReserveDialog>
  <q-dialog
    v-model="verificarReserva"
    transition-show="flip-down"
    transition-hide="flip-up"
  >
    <q-card style="width: 40%">
      <q-card-section class="q-ma-md text-center">
        <p class="text-h6 text-weight-bold">
          La cotización ya cuenta con una reserva!!!
        </p>
        <q-separator spaced inset />
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-avatar
                size="60px"
                text-color="green"
                color="green-2"
                icon="check"
              />
            </q-item-section>
            <q-item-section class="text-left"
              ><div class="text-h7">Nombre de la Reserva</div>
              <div class="text-h7 text-primary">
                <a
                  class="text-bold cursor-pointer flex items-center text-primary"
                  @click="
                    () =>
                      openDialogDelivery(
                        state.attributes
                          ?.hanq_reservas_aos_quoteshanq_reservas_ida
                      )
                  "
                  >{{
                    state.attributes?.hanq_reservas_aos_quotes_name || ''
                  }}</a
                >
              </div></q-item-section
            >
          </q-item></q-list
        >
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog
    v-model="verificaEstado"
    transition-show="flip-down"
    transition-hide="flip-up"
  >
    <q-card class="q-pa-none">
      <q-card-section class="text-center q-pa-none">
        <q-list class="text-center justify-center q-pa-none">
          <q-item class="q-pa-none">
            <q-item-section avatar class="bg-red q-pa-md">
              <q-icon name="highlight_off" size="100px" color="white" />
            </q-item-section>
            <q-item-section
              class="q-pa-md"
              v-if="
                state.attributes?.stage != 'Confirmed' ||
                state.attributes?.opportunity_id == '' ||
                state.attributes?.billing_account_id == ''
              "
            >
              <p v-if="state.attributes?.stage != 'Confirmed'">
                La cotización no se encuentra...
              </p>
              <p
                class="text-h6 text-weight-medium"
                v-if="state.attributes?.stage != 'Confirmed'"
              >
                ¡Confirmada!
              </p>
              <p
                v-if="
                  state.attributes?.opportunity_id == '' ||
                  state.attributes?.billing_account_id == ''
                "
              >
                La cotización no tiene relacionada una
              </p>
              <p
                class="text-h6 text-weight-medium"
                v-if="state.attributes?.billing_account_id == ''"
              >
                ¡Cuenta!
              </p>
              <p
                class="text-h6 text-weight-medium"
                v-if="state.attributes?.opportunity_id == ''"
              >
                ¡Oportunidad!
              </p>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
  <!-- <LayoutQuotes
    :id="id"
    :state="state.attributes.idamercado_c"
    ref="layoutQuotesRef"
    :persistent="false"
  /> -->
  <LayoutQuotes
    :id="id"
    :state="idemercado"
    :iddivision="iddivision"
    ref="layoutQuotesRef"
    :persistent="false"
  />

  <SendEmailQuotes
    :guests="[]"
    module="AOS_Quotes"
    :correos="datagest"
    ref="SendEmailQuotesRef"
    :idModule="idModuleQuotes"
  />
  <ReservasDialog ref="reserveDialogRef" />
</template>
