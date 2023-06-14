<script lang="ts">
import { ref, computed, provide } from 'vue';
import {
  ViewDocuments,
  ViewOpportunities,
  ViewQuotes,
  ViewFamilies,
  ViewReservas,
  ViewEntregas,
} from '../../components/index';
import ViewGeneral from '../view.general.vue';
import { useDialogTabs } from 'src/composables/Dialog/useDialog';
import { ContactGeneralModel } from '../../utils/types/index';
import { useQuasar } from 'quasar';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { selectedRepeatedKey } from '../../utils/ProvideKeys';
</script>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    closeOnChange?: boolean;
  }>(),
  {
    closeOnChange: false,
  }
);

const emits = defineEmits<{
  (event: 'contactChange', id?: string): void;
}>();
//* variables: hardcoded variables
const tabsDefinition = [
  {
    name: 'general',
    component: ViewGeneral,
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
    name: 'Familiares',
    component: ViewFamilies,
    label: 'Familiares',
    enabledForCreation: false,
  },
];
const currentData = ref({} as ContactGeneralModel);
const closedDisabled = ref(false);
const loadingForm = ref(false);
const fromConversion = ref(false);

//* composable values
const $q = useQuasar();
const {
  id,
  open,
  titleDialog,
  activeTabName,
  activeTabComponent,
  swapCurrentTab,
  openDialogTab,
  resetValues,
} = useDialogTabs(tabsDefinition, {
  titleDialog: 'Nuevo Contacto',
  iconDialog: 'contact_phone',
});

//* references
const dynamicTabRef = ref<InstanceType<typeof ViewGeneral> | null>(null);
const headerData = ref({ name: '', ci: '' });

//* computed variables
const isEditingTab = computed(() => {
  return dynamicTabRef.value?.isSomeCardEditing;
});

// methods
const submitForm = () => {
  dynamicTabRef.value?.onSubmit(true);
  loadingForm.value = true;
};

const onFormSaved = (idContact: string, closeAfterSave = false) => {
  titleDialog.value = 'Detalle del Contacto';
  id.value = idContact;
  loadingForm.value = false;
  closedDisabled.value = false;
  emits('contactChange', id.value);
  if (props.closeOnChange) open.value = false;
  if (closeAfterSave) open.value = false;
};

const disableClose = () => {
  closedDisabled.value = true;
};

const notifyUser = () => {
  if (closedDisabled.value) {
    $q.notify({
      color: 'warning',
      message: 'Debe llenar el contacto',
    });
  }
};

const openDialogWithData = (
  data: ContactGeneralModel,
  id?: string,
  dialogTitle?: string,
  icon?: string,
  options: { fromConversion?: boolean } = {}
) => {
  const { fromConversion: fromConversionLocal = false } = options;
  if (fromConversionLocal) {
    fromConversion.value = true;
  }
  currentData.value = data;
  // dynamicTabRef.value?.assignValues(data);
  openDialogTab(id, dialogTitle, icon);
};

const setAccountId = (userId: string) => {
  dynamicTabRef.value?.setAccountId(userId);
};

const displayHeaderData = (data: { name: string; ci: string }) => {
  headerData.value = data;
};

const cancelAllChanges = () => {
  console.log('cancelling changes');
  if (!id.value) {
    open.value = false;
    return;
  }
  dynamicTabRef.value?.cancelChanges();
};

const openInLegacy = () => {
  window.open(
    `${HANSACRM3_URL}/index.php?module=Contacts&action=DetailView&record=${id.value}`
  );
};

const selectRepeated = (id: string) => {
  emits('contactChange', id);
  open.value = false;
  return id;
};

provide(selectedRepeatedKey, {
  fromConversion: fromConversion,
  selectedRepeatedCb: selectRepeated,
});

defineExpose({
  isEditingTab,
  openDialogTab,
  openDialogWithData,
  setAccountId,
});
</script>
<template>
  <dialog-component
    v-model="open"
    icon-dialog="pen"
    :headerDisabled="false"
    :footerDisabled="!isEditingTab"
    :persistent="isEditingTab"
    sizeDialog="dialog-xl"
    @shake="notifyUser"
    @before-hide="resetValues"
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
        >
          <q-icon name="group" size="xs" />
        </q-circular-progress> -->

        <q-btn size="md" round class="q-ml-md" color="white" flat>
          <q-icon name="group" color="white"></q-icon>
          <q-popup-proxy
            v-if="!!id"
            transition-show="flip-up"
            transition-hide="flip-down"
          >
            <q-banner class="bg-primary text-white">
              <q-list style="min-width: 100px">
                <q-item @click="openInLegacy" clickable v-close-popup>
                  <q-item-section
                    >Abrir este Contacto en el CRM 3</q-item-section
                  >
                </q-item>
              </q-list>
            </q-banner>
          </q-popup-proxy>
          <q-tooltip class="bg-white text-primary" :offset="[10, 10]">
            Modulo de Contactos
          </q-tooltip>
        </q-btn>
        <q-toolbar-title
          class="header-dialog"
          :class="$q.dark.isActive ? 'text-white' : 'text-bold'"
        >
          <div v-if="titleDialog !== 'Detalle del Contacto'" class="flex">
            <span class="text-white text-h6">{{ `${titleDialog}` }}</span>
          </div>
          <div v-else>
            <q-list>
              <q-item>
                <q-item-section v-show="$q.screen.xs ? false : true">
                  <q-item-label lines="4" class="text-white text-h6"
                    >{{ headerData.name }}
                  </q-item-label>
                  <q-item-label overline class="text-grey-5">
                    <q-icon name="fiber_manual_record" color="deep-orange-4" />
                    Contactos | CI: {{ headerData.ci }}</q-item-label
                  >
                </q-item-section>
                <q-item-section v-show="!$q.screen.xs ? false : true">
                  <q-item-label overline class="text-white"
                    >{{ headerData.name }}
                  </q-item-label>
                  <q-item-label overline class="text-grey-5"
                    >CI: {{ headerData.ci }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-toolbar-title>
        <q-btn
          dense
          flat
          icon="close"
          color="white"
          v-if="!closedDisabled"
          v-close-popup
        >
          <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
        </q-btn>
      </q-toolbar>
      <q-tabs
        v-model="activeTabName"
        @update:modelValue="swapCurrentTab"
        dense
        inline-label
        outside-arrows
        mobile-arrows
        :class="
          $q.dark.isActive ? 'bg-dark' : 'bg-primary text-grey-6 text-bold'
        "
        indicator-color="deep-orange-4"
        active-color="white"
        align="justify"
        narrow-indicator
      >
        <q-tab
          v-for="(tab, index) in tabsDefinition"
          :key="index"
          :name="tab.name"
          :disable="!id && !tab.enabledForCreation"
          :label="tab.label"
        />
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
          ref="dynamicTabRef"
          :id="id"
          :idAccount="''"
          :nameAccount="''"
          :data="currentData"
          :from-conversion="fromConversion"
          @submittingForm="onFormSaved"
          @submitFail="loadingForm = false"
          @exposeData="displayHeaderData"
          @disableCloseDialog="disableClose"
        />
      </q-page>
    </template>
    <template #footer>
      <q-btn
        color="primary"
        class="q-mr-md"
        :loading="loadingForm"
        @click="submitForm"
        >Guardar</q-btn
      >
      <q-btn color="negative" v-if="!closedDisabled" @click="cancelAllChanges"
        >Cancelar</q-btn
      >
    </template>
  </dialog-component>
</template>
