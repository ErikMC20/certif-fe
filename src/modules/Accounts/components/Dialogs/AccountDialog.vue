<script lang="ts">
import { ref, computed, provide } from 'vue';
import {
  ViewGeneral2,
  ViewContacts,
  ViewDocuments,
} from '../../components/index';

import { useDialogTabs as useDialogTabsT } from 'src/composables/Dialog/useDialog';
import { AccountModel, AccountDataDraft } from '../../utils/types/index';
import { AccountStore } from '../../store/AccountStore';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import {
  selectedRepeatedKey,
  contactSelectedKey,
} from '../../utils/ProvideKeys';
import { RowTableCINITModel } from '../../../../components/types/index';
</script>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    closeOnSelected?: boolean;
  }>(),
  {
    closeOnSelected: false,
  }
);

//* Emit functions
const emits = defineEmits<{
  (event: 'savedForm'): void;
  (event: 'capturedAccount', value: RowTableCINITModel): void;
  (
    event: 'capturedCurrentAccount',
    value: { idAccount: string; idContact?: string }
  ): void;
}>();

//* variables
const tabsDefinition = [
  // {
  //   name: 'general',
  //   component: ViewGeneral,
  //   label: 'General',
  //   enabledForCreation: true,
  // },
  {
    name: 'general2',
    component: ViewGeneral2,
    label: 'General',
    enabledForCreation: true,
  },
  {
    name: 'Documentos',
    component: ViewDocuments,
    label: 'Documentos',
    enabledForCreation: false,
  },
  {
    name: 'contact',
    component: ViewContacts,
    label: 'Contactos',
    enabledForCreation: false,
  },
];

const accountStore = AccountStore();

const headerData = ref({ name: '', accountType: '', code: '' });
const currentDialogType = ref('Privada' as AccountModel);
const loadingForm = ref(false);

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
} = useDialogTabsT(tabsDefinition, {
  titleDialog: 'Detalle de la Cuenta:',
  iconDialog: 'pen',
});

//* references variables
const generalFormRef = ref<InstanceType<typeof ViewGeneral2> | null>(null);

//* computed variables
const isEditingTab = computed(() => {
  return generalFormRef.value?.isSomeCardEditing;
});

//* methods for events
const displayHeaderData = (data: {
  name: string;
  accountType: string;
  code: string;
}) => {
  headerData.value = data;
};

const saveForm = async (idNew?: string) => {
  console.log('saved form....');
  titleDialog.value = 'Detalle de la Cuenta:';
  loadingForm.value = false;
  if (!!idNew) {
    id.value = idNew;
    if (Object.values(accountStore.accountDraft).length > 0) {
      emits('capturedCurrentAccount', { idAccount: id.value });
    }
  }
  emits('savedForm');
};

//* methods
const clearData = () => {
  id.value = '';
  resetValuesModule();
};

const resetValuesModule = () => {
  accountStore.cleanSelectedAccount();
  accountStore.clearDraft();
  resetValues();
};

const saveCurrentForm = () => {
  generalFormRef.value?.onSubmit();
  loadingForm.value = true;
};

const openDialogAccountTab = (
  id?: string,
  dialogType = 'Privada' as AccountModel,
  dialogTitle?: string,
  icon?: string,
  draft?: AccountDataDraft
) => {
  currentDialogType.value = dialogType;
  openDialogTab(id, dialogTitle, icon);

  if (!!draft) {
    accountStore.setDraftData(draft);
  }
};

const cancelAllChanges = () => {
  console.log('cancelling all changes');
  if (!id.value) {
    open.value = false;

    return;
  }

  generalFormRef.value?.cancelChanges();
};

const selectRepeated = (value: RowTableCINITModel) => {
  emits('capturedAccount', value);
  emits('capturedCurrentAccount', { idAccount: value.id });
  if (props.closeOnSelected) {
    open.value = false;
  }
};

const contactSelected = (idContact: string) => {
  emits('capturedCurrentAccount', { idAccount: id.value, idContact });
  if (props.closeOnSelected) {
    open.value = false;
  }
};

const openInLegacy = () => {
  window.open(
    `${HANSACRM3_URL}/index.php?module=Accounts&action=DetailView&record=${id.value}`
  );
};

//* Provide / Inject feature
provide(selectedRepeatedKey, selectRepeated);
provide(contactSelectedKey, contactSelected);
//* End Provide / Inject feature

defineExpose({
  clearData,
  openDialogAccountTab,
});
</script>
<template>
  <dialog-component
    sizeDialog="dialog-xl"
    v-model="open"
    :footerDisabled="!isEditingTab"
    :headerDisabled="false"
    :iconDialog="iconDialog"
    :persistent="isEditingTab"
    @before-hide="resetValuesModule"
  >
    <template #header>
      <q-toolbar
        class="header-dialog"
        :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'"
      >
        <!-- <q-circular-progress
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
        </q-circular-progress> -->
        <q-btn size="md" round class="q-ml-md" color="white" flat>
          <q-icon name="person" color="white"></q-icon>
          <!-- <q-tooltip class="bg-white text-primary" :offset="[10, 10]">
            Modulo de Cuentas
          </q-tooltip> -->

          <q-popup-proxy
            v-if="!!id"
            transition-show="flip-up"
            transition-hide="flip-down"
          >
            <q-banner class="bg-primary text-white">
              <q-list style="min-width: 100px">
                <q-item @click="openInLegacy" clickable v-close-popup>
                  <q-item-section>Abrir esta cuenta en el CRM 3</q-item-section>
                </q-item>
              </q-list>
            </q-banner>
          </q-popup-proxy>
        </q-btn>
        <q-toolbar-title
          class="header-dialog"
          :class="$q.dark.isActive ? 'text-red' : 'text-white'"
        >
          <div v-if="titleDialog !== 'Detalle de la Cuenta:'" class="flex">
            <span>{{ `${titleDialog}` }}</span>
          </div>
          <div v-else>
            <q-list>
              <q-item>
                <q-item-section v-show="$q.screen.xs">
                  <q-item-label lines="4">{{ headerData.name }}</q-item-label>
                  <q-item-label overline class="text-grey-5"
                    >{{ headerData.accountType }} | Cod.:
                    {{ headerData.code }}</q-item-label
                  >
                </q-item-section>
                <q-item-section v-show="!$q.screen.xs">
                  <q-item-label>{{ headerData.name }}</q-item-label>
                  <q-item-label overline class="text-grey-5"
                    ><q-icon name="fiber_manual_record" color="deep-orange-4" />
                    Cuenta {{ headerData.accountType }} | Codigo:
                    {{ headerData.code }}</q-item-label
                  >
                </q-item-section>

                <!-- <q-item-section v-show="!$q.screen.xs">
                          <q-item-label>{{ headerData.name }}
                          <span  class="text-grey-4 overline">| Cuenta {{ headerData.accountType }} | Codigo:
                            {{ headerData.code }}</span>
                          </q-item-label>

                        </q-item-section> -->

                <q-item-section avatar> </q-item-section>
              </q-item>
            </q-list>
          </div>
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
          :disable="!id && !tab.enabledForCreation"
          :label="tab.label"
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
          :accountType="currentDialogType"
          :idAccount="id"
          :nameAccount="headerData.name"
          @exposeData="displayHeaderData"
          @submittingForm="saveForm"
          @submitFail="loadingForm = false"
          ref="generalFormRef"
        />
      </q-page>
    </template>
    <template #footer>
      <q-btn
        color="primary"
        class="q-mr-md"
        :loading="loadingForm"
        @click="saveCurrentForm"
        >Guardar</q-btn
      >
      <q-btn color="negative" @click="cancelAllChanges">Cancelar</q-btn>
    </template>
  </dialog-component>
</template>
