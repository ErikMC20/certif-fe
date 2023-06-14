<script lang="ts">
  import { ref, computed } from 'vue';
  import { useDialogTabs } from 'src/composables/Dialog/useDialog';
  import { ProspectModel, FaiiSubmitModel } from '../../utils/types';
  import { useProspectStore } from '../../store/ProspectStore';
  import {
    ViewGeneral,
    ViewDocuments,
    ViewCampaigns,
    ViewActivitis,
    ViewQuotes,
    ViewContacts,
    ViewSurveys,
  } from '../../views';
  import { useQuasar, QSpinnerPuff } from 'quasar';
  import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
  import ConversionDialog from './ConversionDialog.vue';
  import DialogComponent from 'src/components/MainDialog/DialogComponent.vue';
  import AccountDialog from 'src/modules/Accounts/components/Dialogs/AccountDialog.vue';
  import { AccountModel } from '../../../Accounts/utils/types/index';
  import { useProspect } from '../../composables/useProspect/index';
  import { HANSACRM3_URL } from 'src/conections/api_conectors';
  import { RowTableCINITModel } from '../../../../components/types/index';
  import { useAsyncState } from '@vueuse/core';
  import { getRecordModuleInfo } from 'src/services/GlobalService';
  import ContactDialog from 'src/modules/Contacts/components/Dialogs/ContactDialog.vue';
</script>

// TODO form saved is fired after the dialog is opened
<script lang="ts" setup>
  //* Emit functions
  const emits = defineEmits < { (event: 'formSaved'): void }> ();

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
      name: 'contact',
      component: ViewContacts,
      label: 'Contactos',
      enabledForCreation: false,
    },
    {
      name: 'campaigns',
      component: ViewCampaigns,
      label: 'Campañas',
      enabledForCreation: false,
    },

    {
      name: 'Cotizaciones',
      component: ViewQuotes,
      label: 'Cotizaciones',
      enabledForCreation: false,
    },

    // {
    //   name: 'activitis',
    //   component: ViewActivitis,
    //   label: 'Actividades',
    //   enabledForCreation: false,
    // },
    // {
    //   name: 'surveys',
    //   component: ViewSurveys,
    //   label: 'Encuestas',
    //   enabledForCreation: false,
    // },
  ];

  const headerData = ref({
    name: '',
    stateProspect: '',
    accountId: '',
    accountName: '',
  });
  const loadingView = ref(false);
  const prospectStore = useProspectStore();
  const closeDialogState = ref(false);
  const deleteProspectDialog = ref(false);
  const conversionDialog = ref(false);

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
    titleDialog: 'Nuevo Prospecto',
    iconDialog: 'pen',
  });
  const $q = useQuasar();
  const { convertToAccountFormat, formattedStatus } = useProspect();

  //* reference variables
  const dialogGlobalRef = ref < InstanceType < typeof DialogComponent > | null > (null);
  const dynamicTabRef = ref < InstanceType < typeof ViewGeneral > | null > (null);
  const accountDialogRef = ref < InstanceType < typeof AccountDialog > | null > (null);
  const contactDialogRef = ref < InstanceType < typeof ContactDialog > | null > (null);

  //* computed variables
  // conditions or other things. (read only)
  //const loadingView2 = computed(() => !!dynamicTabRef.value?.isLoading);
  const isEditing = computed(() => !!dynamicTabRef.value?.isSomeCardEditing);

  //* methods (events)
  const displayHeaderData = (data: { name: string }) => {
    headerData.value = {
      ...data,
      stateProspect: '',
      accountId: '',
      accountName: '',
    };
  };

const saveForm = async(idNew: string) => {
  console.warn('Here save form!!!!!')
  titleDialog.value = 'Detalle del Prospecto';
  headerData.value = prospectStore.getSelectedHeader;
  loadingView.value = false;
  id.value = idNew;
  await execute()
  emits('formSaved');
};

  const { state, isLoading, execute } = useAsyncState(
    async () => {
      if (!!id.value) {
        const response = await prospectStore.getProspect(id.value);
        const info: { [key: string]: string | undefined } = {
          id: response?.data.id,
          name: response?.data.attributes.full_name,
          state: await formattedStatus(response?.data.attributes.status || ''),
          accountId: response?.data.attributes.account_id,
          accountName: response?.data.attributes.account_name,
          contactId: response?.data.attributes.contact_id,
        };
        if (!!info.contactId) {
          const otherResponse = await getRecordModuleInfo(
            'Contacts',
            info.contactId,
            {
              allData: false,
              fields: ['name'],
            }
          );
          info.contactName =
            typeof otherResponse.name === 'string' ? otherResponse.name : '';
        }
        return info;
      }

      return {
        name: '',
        state: '',
      };
    },
    {} as {
      name: string;
      state: string;
      accountId?: string;
      accountName?: string;
      contactId?: string;
      contactName?: string;
    },
    { immediate: false }
  );

  //* methods
  const clearData = () => {
    id.value = '';
    resetValues();
  };

  const cleanDataValues = () => {
    prospectStore.cleanSelectedProspect();
    resetValues();
  };

  const convertToAccount = async (type: AccountModel) => {
    console.log('convirtiendo');
    try {
      $q.loading.show({
        spinner: QSpinnerPuff,
        message: 'Obteniendo datos',
      });
      const accountFormat = await convertToAccountFormat(id.value, type);
      console.log(
        'Your prospect is fetched with the following data:',
        accountFormat
      );
      switch (type) {
        case 'Privada':
          accountDialogRef.value?.openDialogAccountTab(
            undefined,
            type,
            'Nueva cuenta Privada',
            undefined,
            accountFormat
          );
          return;
        case 'Empresa':
          accountDialogRef.value?.openDialogAccountTab(
            undefined,
            type,
            'Nueva cuenta Empresa',
            undefined,
            accountFormat
          );
          return;

        default:
          break;
      }
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Error en el proceso',
        caption: 'Ha ocurrido un error al capturar los datos del prospecto',
      });
    } finally {
      $q.loading.hide();
    }
  };

  const deleteModuleRecord = async () => {
    console.warn('Here delete module record!!!!!')
    try {
      await prospectStore.deleteProspect(id.value);
      $q.notify({
        type: 'warning',
        message: 'Prospecto eliminado',
        caption: 'Se ha eliminado el prospecto exitosamente',
      });
      open.value = false;
      emits('formSaved');
    } catch (error) {
      console.log(error);
      $q.notify({
        type: 'negative',
        message: 'Error en el proceso',
        caption: 'No se ha podido eliminar el prospecto',
      });
    }
  };

  const saveCurrentForm = () => {
    dynamicTabRef.value?.onSubmit();
    loadingView.value = true;
  };

  const onCloseDialog = () => {
    // console.log('On close dialog');
    dialogGlobalRef.value?.hideDialog();
  };

  const showCloseDialog = () => {
    if (dynamicTabRef.value?.isSomeCardEditing) {
      closeDialogState.value = true;
      return;
    }
    onCloseDialog();
  };

  const openDialogAccountTab = async (
    id?: string,
    dialogTitle?: string,
    icon?: string
  ) => {
    openDialogTab(id, dialogTitle, icon);
    if (!!id) await execute();
  };

  const onSubmitFail = (message: string, options: FaiiSubmitModel = {}) => {
    const {
      messageAction1,
      messageAction2,
      action = () => true,
      action2 = () => true,
    } = options;

    let actionsNotify = [];

    if (!!messageAction1) {
      actionsNotify.push({
        label: messageAction1,
        color: 'white',
        handler: action,
      });
    }

    if (!!messageAction2) {
      actionsNotify.push({
        label: messageAction2,
        color: 'white',
        handler: action2,
      });
    }

    $q.notify({
      type: 'negative',
      color: 'negative',
      message: 'Error',
      caption: message,
      actions: actionsNotify,
    });
    loadingView.value = false;
  };

  const openAccount = (id?: string) => {
    $q.notify({
      type: 'positive',
      message: 'Abriendo cuenta',
      caption: 'Abriendo la cuenta del prospecto',
    });
    accountDialogRef.value?.openDialogAccountTab(id);
  };

  const openContact = (id?: string) => {
    contactDialogRef.value?.openDialogTab(id, 'Detalle del Contacto');
  };

  const show = (grid?: boolean) => {
    $q.bottomSheet({
      message: 'Acciones',
      grid,
      actions: [
        {
          label: 'Convertir Prospecto',
          icon: 'transform',
          id: 'convert',
        },
        {
          label: 'Duplicar Prospecto',
          icon: 'control_point_duplicate',
          id: 'duplicate',
        },
        {
          label: 'Eliminar Prospecto',
          icon: 'delete',
          id: 'delete',
        },
      ],
    })
      .onOk((action) => {
        if (action.id === 'convert') {
          $q.notify('Convertir prospecto...');
        } else if (action.id === 'duplicate') {
          $q.notify('Duplicar prospecto...');
        } else if (action.id === 'delete') {
          $q.notify('Eliminar prospecto');
          deleteProspectDialog.value = true;
        }
        // console.log('Action chosen:', action.id)
      })
      .onCancel(() => {
        // console.log('Dismissed')
      })
      .onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
  };

  const assignAccount = async (
    val: RowTableCINITModel,
    accountInfo?: { id: string }
  ) => {
    console.warn('Here assigning account!!!')
    await prospectStore.convertProspect(id.value, val.id);
    await dynamicTabRef.value?.execute();
    $q.notify({
      type: 'positive',
      message: 'Prospecto convertido',
      caption: `Cuenta padre: ${val.name}, ${val.tipo_cuenta}`,
    });
    emits('formSaved');
  };

  const convertProspect = async (values: {
    idAccount: string;
    idContact: string;
  }) => {
    console.warn('Here converting prospect!!!!')
    await prospectStore.convertProspect(
      id.value,
      values.idAccount,
      values.idContact
    );
    await Promise.all([execute(), dynamicTabRef.value?.execute()]);
    $q.notify({
      type: 'positive',
      message: 'Prospecto convertido',
      caption: 'Se ha convertido el prospecto',
    });
    conversionDialog.value = false;
    emits('formSaved');
  };

  const openInLegacy = () => {
    window.open(
      `${HANSACRM3_URL}/index.php?module=Leads&action=DetailView&record=${id.value}`
    );
  };

  defineExpose({
    clearData,
    openDialogAccountTab,
  });
</script>

<template>
  <dialog-component ref="dialogGlobalRef" size-dialog="dialog-xl" v-model="open" :footerDisabled="!isEditing"
    :headerDisabled="false" :iconDialog="iconDialog" :persistent="false" @before-hide="cleanDataValues">
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
      <q-toolbar v-else class="header-dialog" :class="[
          $q.dark.isActive ? 'bg-dark' : 'bg-primary',
          $q.screen.lt.sm ? 'q-py-sm' : '',
        ]">
          <q-icon name="group_add" class="q-ml-md" color="white" size="md">
            <q-tooltip class="bg-white text-primary" :offset="[10, 10]">
            Modulo de Prospectos
          </q-tooltip>
        </q-icon>


        <!-- <q-circular-progress
          show-value
          font-size="16px"
          class="text-white q-my-md q-ml-md"
          :value="100"
          size="35px"
          :thickness="0.1"
          color="orange"
          v-if="!$q.screen.xs"
        >
          <q-icon name="group_add" size="xs" />
        </q-circular-progress> -->
        <div class="row justify-between"  :style="{ width: 'inherit' }">
          <q-toolbar-title class="header-dialog" :class="$q.dark.isActive ? 'text-red' : 'text-white'">
            <div v-if="!id" class="flex q-ml-md">
              <span>{{ `${titleDialog}` }}</span>
            </div>
            <div v-else>
              <q-list>
                <q-item class="q-ml-sm">
                  <q-item-section v-show="$q.screen.xs">
                    <div>
                      <div>
                        <div class="row items-center">
                          <q-item-label overline class="text-grey">Prospecto
                          </q-item-label>
                          <q-chip dense class="q-ml-md" color="orange" :label="state.state" />
                        </div>
                        <q-item-label :style="{
                            'white-space': 'break-spaces',
                          }">{{ state.name }}</q-item-label>
                      </div>
                    </div>
                  </q-item-section>
                  <q-item-section v-show="!$q.screen.xs">
                    <div class="row">
                      <div style="margin: auto 0"></div>
                      <div>
                        <q-item-label>{{ state.name }}</q-item-label>
                        <div class="row">
                          
                          <q-item-label style="margin: auto 0" overline class="text-grey"><q-icon name="fiber_manual_record" color="deep-orange-4" />  Prospecto
                          </q-item-label>
                          <q-chip dense size="sm" class="q-ml-md" color="deep-orange-4" text-color="white" :label="state.state" />
                          <q-separator v-if="!!state.accountId" spaced inset vertical dark />
                          <q-item-label v-if="!!state.accountId" style="margin: auto 0" overline
                            class="text-grey">Cuenta:
                          </q-item-label>
                          <q-chip v-if="!!state.accountId" dense size="sm"  class="q-ml-md" color="deep-orange-4" clickable
                            @click="openAccount(state.accountId)" :label="state.accountName" text-color="white" />
                          <q-separator spaced inset vertical dark />
                          <q-item-label v-if="!!state.contactId" style="margin: auto 0" overline
                            class="text-grey">Contactos:
                          </q-item-label>
                          <q-chip text-color="white" v-if="!!state.contactId" dense size="sm" class="q-ml-md" color="deep-orange-4" clickable
                            @click="openContact(state.contactId)" :label="state.contactName" />
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
        </div>
        <!-- <div class="q-ma-xs" v-if="titleDialog === 'Detalle del Prospecto'">
          <q-btn
           round
           size="xs"
           color="white"
           icon="task"
           outline
         ><q-tooltip class="bg-white text-primary">Crear tarea</q-tooltip></q-btn>
        </div>
        <div class="q-ma-md" v-if="titleDialog === 'Detalle del Prospecto'">
          <q-btn

           round
           size="xs"
           color="white"

           icon="call"
           outline


           ><q-tooltip class="bg-white text-primary">Crear llamada</q-tooltip></q-btn>

        </div> -->

        <div v-if="id">
          <q-btn v-if="$q.screen.xs" round size="md" color="primary" unelevated icon="more_horiz" @click="show()" />

          <!-- <q-btn size="md" color="primary" icon="more_vert" round unelevated>
            <q-menu auto-close :offset="[110, 0]">
              <q-list style="min-width: 150px">
                <q-item @click="deleteProspectDialog = true" clickable>
                  <q-item-section>Eliminar</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn> -->

          <q-btn v-else style="width: max-content" label="Opciones" icon-right="arrow_drop_down" color="white" size="sm"
            outline>
            <q-menu fit anchor="bottom left" self="top left">
              <q-list dense style="min-width: 100px">
                <q-item @click="openInLegacy" clickable v-close-popup>
                  <q-item-section avatar class="q-pa-none">
                    <q-icon name="open_in_new" color="blue" />
                  </q-item-section>
                  <q-item-section>Abrir en CRM 3</q-item-section>
                </q-item>
                <!-- <q-item disable clickable v-close-popup>
                  <q-item-section avatar class="q-pa-none">
                    <q-icon name="copy_all" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Duplicar</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator /> -->
                <q-item v-if="!headerData.accountId" @click="conversionDialog = true" clickable>
                  <!-- <q-item-section side>
                    <q-icon name="keyboard_arrow_left" />
                  </q-item-section> -->
                  <q-item-section avatar class="q-pa-none">
                    <q-icon name="compare_arrows" color="orange" />
                  </q-item-section>
                  <q-item-section>Convertir Prospecto</q-item-section>

                  <!-- <q-menu anchor="top end" self="top start">
                    <q-list>
                      <q-item @click="conversionDialog = true" dense clickable>
                        <q-item-section>
                          <q-item-label>Cuenta Empresa</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item
                        @click="convertToAccount('Privada')"
                        dense
                        clickable
                      >
                        <q-item-section>
                          <q-item-label>Cuenta Privada</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu> -->
                </q-item>
                <q-separator />
                <q-item @click="deleteProspectDialog = true" clickable v-close-popup>
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

          <!-- <q-btn-dropdown
            v-else
            label="Opciones"
            color="orange"
            text-color="black"
          >
            <q-list>
              <q-item
                @click="deleteProspectDialog = true"
                clickable
                v-close-popup
              >
                <q-item-section avatar class="q-pa-none">
                  <q-icon name="delete" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Eliminar</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown> -->
        </div>
        <div class="q-ma-md">
          <q-btn round color="white" icon="close" flat v-if="$q.screen.gt.xs" @click="showCloseDialog">
            <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
      <q-tabs v-model="activeTabName" @update:modelValue="swapCurrentTab" inline-label mobile-arrows :class="
          $q.dark.isActive ? 'bg-dark' : 'bg-primary text-grey-6 text-bold'
        " indicator-color="deep-orange-4" active-color="white" align="justify" dense narrow-indicator>
        <q-tab v-for="(tab, index) in tabsDefinition" :key="index" :name="tab.name" :label="tab.label"
          :disable="!tab.enabledForCreation && !id">
          <!-- <q-badge color="red" floating >2</q-badge> -->
        </q-tab>
      </q-tabs>
    </template>
    <template #body>
      <q-toolbar
       class="header-dialog"
       :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'"
     ></q-toolbar>
    
      <q-page :class="$q.platform.is.mobile ? 'q-pa-none' : 'q-pa-md'"  style="margin-top: -50px;">
        <component :is="activeTabComponent" :id="id" @exposeData="displayHeaderData" @submit-complete="saveForm"
          @submitFail="onSubmitFail" ref="dynamicTabRef" />
      </q-page>
    </template>
    <template #footer v-if="isEditing">
      <q-btn color="primary" class="q-mr-md" :loading="loadingView" @click="saveCurrentForm">Guardar</q-btn>
      <q-btn color="negative" @click="showCloseDialog">Cancelar</q-btn>
    </template>
  </dialog-component>
  <AlertComponent title="¿Cerrar Formulario?" icon="warning" iconColor="warning" iconSize="50px" btn-color="primary"
    btn-text="Si, salir" v-model="closeDialogState" @confirm="onCloseDialog" @denegate="closeDialogState = false">
    <template #body>
      <span class="q-py-sm">
        Si cierra la edicion se perderan los datos no guardados
      </span>
    </template>
  </AlertComponent>
  <AlertComponent title="¿Eliminar Prospecto?" icon="warning" iconColor="negative" iconSize="50px" btn-color="negative"
    btn-text="Si, eliminar" v-model="deleteProspectDialog" @confirm="deleteModuleRecord"
    @denegate="deleteProspectDialog = false">
    <template #body>
      <span class="q-py-sm">¿Está seguro de eliminar este prospecto?</span>
    </template>
  </AlertComponent>
  <ConversionDialog :id="id" v-model="conversionDialog" @assigned-values="convertProspect" />
  <AccountDialog ref="accountDialogRef" close-on-selected @captured-account="assignAccount" />
  <ContactDialog ref="contactDialogRef" />
</template>
