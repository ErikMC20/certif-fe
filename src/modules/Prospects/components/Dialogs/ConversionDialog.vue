<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar, QSpinnerPuff } from 'quasar';
import { useProspect } from '../../composables';

import AccountDialog from 'src/modules/Accounts/components/Dialogs/AccountDialog.vue';
import ContactDialog from 'src/modules/Contacts/components/Dialogs/ContactDialog.vue';

import { useProspectStore } from '../../store/ProspectStore';

import { AccountModel } from '../../../Accounts/utils/types/index';
import { RowTableCINITModel } from '../../../../components/types/index';
import { getContact } from '../../../Contacts/services/ContactService';
// import { readAccount } from '../';
import AccountService from '../../../Accounts/services/AccountService';
import AdvancedFilterAccount from 'src/modules/Accounts/components/AdvancedFilter/AdvancedFilterAccount.vue';
import AdvancedFilterContact from 'src/modules/Accounts/components/AdvancedFilter/AdvancedFilterContact.vue';
import { QStepper } from 'quasar';

type AssignedContactModel = {
  id: string;
  name: string;
  ci: string;
};

type AssignedAccountModel = {
  id: string;
  name: string;
  typeAccount: AccountModel;
};

const props = defineProps<{
  id: string;
}>();

const emits = defineEmits<{
  (
    event: 'assignedValues',
    value: { idAccount: string; idContact: string }
  ): void;
}>();

const step = ref(1);
const $q = useQuasar();
const { convertToAccountFormat, convertToContactFormat } = useProspect();
const prospectStore = useProspectStore();

const assignedAccount = ref(
  {} as {
    id: string;
    name: string;
    typeAccount: AccountModel;
  }
);

const assignedContact = ref(
  {} as {
    id: string;
    name: string;
    ci: string;
  }
);

const accountDialogRef = ref<InstanceType<typeof AccountDialog> | null>(null);
const contactDialogRef = ref<InstanceType<typeof ContactDialog> | null>(null);
const advancedAccountFilterRef = ref<InstanceType<
  typeof AdvancedFilterAccount
> | null>(null);
const contactAdvancedFilterRef = ref<InstanceType<
  typeof AdvancedFilterContact
> | null>(null);
const stepperRef = ref<InstanceType<typeof QStepper> | null>(null);

const convertToAccount = async (type: AccountModel) => {
  console.log('convirtiendo');
  try {
    $q.loading.show({
      spinner: QSpinnerPuff,
      message: 'Obteniendo datos',
    });
    const accountFormat = await convertToAccountFormat(props.id, type);
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

const convertToContact = async () => {
  try {
    $q.loading.show({
      spinner: QSpinnerPuff,
      message: 'Obteniendo datos',
    });
    const contactFormat = await convertToContactFormat(props.id);
    contactDialogRef.value?.openDialogWithData(
      contactFormat,
      undefined,
      undefined,
      undefined,
      { fromConversion: true }
    );
  } catch (error) {
  } finally {
    $q.loading.hide();
  }
};

const assignAccount = async (
  val: RowTableCINITModel,
  accountInfo?: { id: string }
) => {
  assignedAccount.value = {
    id: val.id,
    name: val.name,
    typeAccount: val.tipo_cuenta as AccountModel,
  };
  // await prospectStore.convertProspect(id.value, val.id);
  // await dynamicTabRef.value?.execute();
  // $q.notify({
  //   type: 'positive',
  //   message: 'Prospecto convertido',
  //   caption: `Cuenta padre: ${val.name}, ${val.tipo_cuenta}`,
  // });
  // emits('formSaved');
};

const assignAccount2 = async (assigned: {
  idAccount: string;
  idContact?: string;
}) => {
  const responseAccount = (await AccountService.readAccount(
    assigned.idAccount,
    {
      assignedFormat: true,
    }
  )) as AssignedAccountModel;

  assignedAccount.value = responseAccount;

  if (assigned.idContact) {
    const responseContact = (await getContact(assigned.idContact, {
      assignContactFormat: true,
    })) as AssignedContactModel;
    assignedContact.value = responseContact;
  }
};

const assignContact = async (id?: string) => {
  console.log('contact', id);
  if (id) {
    try {
      const response = (await getContact(id, {
        assignContactFormat: true,
      })) as AssignedContactModel;
      assignedContact.value = response;
      return;
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Error',
        caption: 'Ocurrió un error al obtener los datos',
      });
    }
  }
};

const moveNextStep = () => {
  stepperRef.value?.next();
};

const movePreviousStep = () => {
  stepperRef.value?.previous();
};

const removeAssignedAccount = () => {
  assignedAccount.value = {} as {
    id: string;
    name: string;
    typeAccount: AccountModel;
    assignedUser: string;
  };
};

const removeAssignedContact = () => {
  assignedContact.value = {} as {
    id: string;
    name: string;
    ci: string;
  };
};

const sendValues = () => {
  if (assignedAccount.value.id && assignedContact.value.id) {
    emits('assignedValues', {
      idAccount: assignedAccount.value.id,
      idContact: assignedContact.value.id,
    });
  } else
    $q.notify({
      type: 'warning',
      message: 'Se necesita mas informacion',
      caption:
        'Se necesita una cuenta y un usuario para convertir el prospecto',
    });
};

const restoreValues = () => {
  assignedContact.value = {} as {
    id: string;
    name: string;
    ci: string;
  };
  assignedAccount.value = {} as {
    id: string;
    name: string;
    typeAccount: AccountModel;
  };
  step.value = 1;
};

const openAccountFilter = () => {
  advancedAccountFilterRef.value?.openDialog();
};

const openContactFilter = () => {
  contactAdvancedFilterRef.value?.openDialog();
};

const selectAccount = (item: { [key: string]: string | null }) => {
  if (!!item.id && !!item.nombre)
    assignedAccount.value = {
      id: item.id,
      name: item.nombre,
      typeAccount: (item.tipo as AccountModel) || 'Privada',
    };
  advancedAccountFilterRef.value?.onClose();
};

const selectContact = (item: { [key: string]: string | null }) => {
  if (!!item.id && !!item.nombre)
    assignedContact.value = {
      id: item.id,
      name: item.nombre,
      ci: item.ci || 'Sin CI',
    };
  contactAdvancedFilterRef.value?.onClose();
};
</script>

<template>
  <q-dialog
    v-bind="$attrs"
    :maximized="$q.platform.has.touch"
    persistent
    @before-hide="restoreValues"
  >
    <q-layout
      view="lHh LpR lff"
      container
      :style="{ 'max-height': $q.screen.lt.sm ? '100vh' : '95vh' }"
      style="height: 900px; width: 70rem; max-width: 100vw"
      class="bg-grey-3"
    >
      <q-header reveal elevated bordered>
        <q-toolbar class="q-pa-lg">
          <q-btn
            v-if="$q.screen.lt.sm"
            color="primary"
            flat
            text-color="white"
            icon="arrow_back_ios"
            v-close-popup
          />
          <q-icon
            :class="$q.screen.lt.sm ? '' : 'q-ml-sm'"
            size="lg"
            name="group"
          />

          <q-toolbar-title>Conversion de Prospecto</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
      </q-header>
      <q-footer reveal elevated bordered></q-footer>
      <q-page-container class="full-height">
        <q-page padding class="q-pa-none">
          <q-card
            style="min-height: inherit"
            flat
            class="xl-dialog row justify-between"
          >
            <q-stepper
              flat
              v-model="step"
              ref="stepperRef"
              color="primary"
              style="width: 100%"
              class="flex column"
              animated
            >
              <q-step
                :name="1"
                title="Asignar Cuenta"
                icon="create_new_folder"
                :done="step > 1"
                class="flex column"
              >
                <div v-if="!assignedAccount.id" class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6 q-gutter-y-sm">
                    <span class="text-h6">Nueva Cuenta</span>
                    <div>
                      <q-btn
                        outline
                        class="col-12"
                        color="primary"
                        icon="person_add"
                        label="Crear cuenta Empresa"
                        @click="convertToAccount('Empresa')"
                      />
                    </div>
                    <div>
                      <q-btn
                        outline
                        class="col-12"
                        color="primary"
                        icon="person_add"
                        label="Crear cuenta Privada"
                        @click="convertToAccount('Privada')"
                      />
                    </div>
                  </div>
                  <div class="col-12 col-sm-6 q-gutter-y-sm">
                    <span class="text-h6">Asignar Cuenta</span>
                    <div>
                      <q-btn
                        outline
                        class="col-12"
                        color="primary"
                        icon="account_box"
                        label="Seleccionar Cuenta"
                        @click="openAccountFilter"
                      />
                    </div>
                  </div>
                </div>
                <q-separator spaced inset />
                <div>
                  <q-card flat class="q-mt-sm">
                    <q-card-section class="text-h6">
                      Cuenta seleccionada
                    </q-card-section>
                    <q-card-section
                      v-if="!assignedAccount.id"
                      class="text-grey-7"
                    >
                      <q-icon name="warning" size="lg" />
                      Aun no se tiene una cuenta seleccionada
                    </q-card-section>
                    <q-card-section v-else horizontal>
                      <q-card-section class="col-auto flex flex-center">
                        <q-avatar
                          size="60px"
                          font-size="40px"
                          color="primary"
                          text-color="white"
                          icon="person"
                        />
                      </q-card-section>
                      <q-card-section class="full-width q-pt-xs">
                        <div class="row flex justify-between">
                          <span class="text-overline"> Cuenta Asignada </span>
                          <div>
                            <q-chip
                              outline
                              clickable
                              size="sm"
                              color="negative"
                              @click="removeAssignedAccount"
                              text-color="white"
                              icon="remove"
                            >
                              eliminar
                            </q-chip>
                          </div>
                        </div>
                        <div class="text-h6 q-mt-none q-mb-xs">
                          {{ assignedAccount.name }}
                        </div>
                        <div class="text-caption text-grey-8">
                          {{ assignedAccount.typeAccount }}
                        </div>
                      </q-card-section>
                    </q-card-section>
                  </q-card>
                </div>
                <div>
                  <q-btn
                    color="primary"
                    icon="navigate_next"
                    label="Continuar"
                    :disable="!assignedAccount.id"
                    @click="moveNextStep"
                  />
                </div>
              </q-step>

              <q-step
                :name="2"
                title="Asignar Contacto"
                icon="create_new_folder"
                :done="step > 2"
                class="full-height"
              >
                <div v-if="!assignedContact.id" class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6 q-gutter-y-sm">
                    <span class="text-h6">Crear Contacto</span>
                    <div>
                      <q-btn
                        outline
                        class="col-12"
                        color="primary"
                        icon="person_add"
                        label="Nuevo Contacto"
                        @click="convertToContact()"
                      />
                    </div>
                  </div>
                  <div class="col-12 col-sm-6 q-gutter-y-sm">
                    <span class="text-h6">Asignar Contacto</span>
                    <div>
                      <q-btn
                        outline
                        class="col-12"
                        color="primary"
                        icon="contacts"
                        label="Seleccionar Contacto"
                        @click="openContactFilter"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <q-card flat class="q-mt-sm">
                    <q-card-section
                      v-if="!assignedContact.id"
                      class="text-grey-7"
                    >
                      <q-icon name="warning" size="lg" />
                      Aun no se tiene un contacto seleccionado
                    </q-card-section>
                    <q-card-section v-else horizontal>
                      <q-card-section class="col-auto flex flex-center">
                        <q-avatar
                          size="60px"
                          font-size="40px"
                          color="primary"
                          text-color="white"
                          icon="person"
                        />
                      </q-card-section>
                      <q-card-section class="full-width q-pt-xs">
                        <div class="row flex justify-between">
                          <span class="text-overline"> Contacto Asignado </span>
                          <div>
                            <q-chip
                              outline
                              clickable
                              size="sm"
                              color="negative"
                              @click="removeAssignedContact"
                              text-color="white"
                              icon="remove"
                            >
                              eliminar
                            </q-chip>
                          </div>
                        </div>
                        <div class="text-h6 q-mt-none q-mb-xs">
                          {{ assignedContact.name }}
                        </div>
                        <div class="text-caption text-grey-8">
                          CI: {{ assignedContact.ci }}
                        </div>
                      </q-card-section>
                    </q-card-section>
                  </q-card>
                </div>
                <div>
                  <q-btn
                    color="primary"
                    icon="navigate_next"
                    label="Continuar"
                    :disable="!assignedContact.id"
                    @click="moveNextStep"
                  />
                  <q-btn
                    v-if="step > 1"
                    flat
                    color="primary"
                    @click="movePreviousStep"
                    label="Atras"
                    class="q-ml-sm"
                  />
                </div>
              </q-step>

              <q-step
                :name="3"
                title="Confirmar Seleccion"
                icon="add_comment"
                class="full-height"
              >
                <q-card flat class="q-mt-sm">
                  <q-card-section
                    v-if="!assignedAccount.id"
                    class="text-grey-7"
                  >
                    <q-icon name="warning" size="lg" />
                    Aun no se tiene una cuenta seleccionada
                  </q-card-section>
                  <q-card-section v-else horizontal>
                    <q-card-section class="col-auto flex flex-center">
                      <q-avatar
                        size="60px"
                        font-size="40px"
                        color="primary"
                        text-color="white"
                        icon="person"
                      />
                    </q-card-section>
                    <q-card-section class="full-width q-pt-xs">
                      <div class="row flex justify-between">
                        <span class="text-overline"> Cuenta Asignada </span>
                        <div>
                          <q-chip
                            outline
                            size="sm"
                            color="positive"
                            text-color="white"
                            icon="add"
                          >
                            seleccionado
                          </q-chip>
                        </div>
                      </div>
                      <div class="text-h6 q-mt-none q-mb-xs">
                        {{ assignedAccount.name }}
                      </div>
                      <div class="text-caption text-grey-8">
                        Tipo de cuenta: {{ assignedAccount.typeAccount }}
                      </div>
                      <!-- <div class="text-caption text-grey-8">
                        {{ assignedAccount.assignedUser || 'no hay' }}
                      </div> -->
                    </q-card-section>
                  </q-card-section>
                </q-card>
                <q-card flat class="q-mt-sm">
                  <q-card-section
                    v-if="!assignedContact.id"
                    class="text-grey-7"
                  >
                    <q-icon name="warning" size="lg" />
                    Aun no se tiene un contacto seleccionado
                  </q-card-section>
                  <q-card-section v-else horizontal>
                    <q-card-section class="col-auto flex flex-center">
                      <q-avatar
                        size="60px"
                        font-size="40px"
                        color="primary"
                        text-color="white"
                        icon="person"
                      />
                    </q-card-section>
                    <q-card-section class="full-width q-pt-xs">
                      <div class="row flex justify-between">
                        <span class="text-overline"> Contacto Asignado </span>
                        <div>
                          <q-chip
                            outline
                            size="sm"
                            color="positive"
                            text-color="white"
                            icon="add"
                          >
                            seleccionado
                          </q-chip>
                        </div>
                      </div>
                      <div class="text-h6 q-mt-none q-mb-xs">
                        {{ assignedContact.name }}
                      </div>
                      <div class="text-caption text-grey-8">
                        CI: {{ assignedContact.ci }}
                      </div>
                    </q-card-section>
                  </q-card-section>
                </q-card>
                <div>
                  <q-btn
                    color="primary"
                    icon="checklist"
                    label="Finalizar"
                    :disable="!assignedAccount.id && !assignedContact.id"
                    @click="sendValues"
                  /><q-btn
                    v-if="step > 1"
                    flat
                    color="primary"
                    @click="movePreviousStep"
                    label="Atras"
                    class="q-ml-sm"
                  />
                </div>
              </q-step>
              <template v-slot:message>
                <q-banner
                  v-if="step === 1"
                  class="bg-primary text-white q-px-lg"
                >
                  <q-avatar size="md" color="white" text-color="primary"
                    >1</q-avatar
                  >
                  Asignar la cuenta para el prospecto
                </q-banner>
                <q-banner
                  v-else-if="step === 2"
                  class="bg-primary text-white q-px-lg"
                >
                  <q-avatar size="md" color="white" text-color="primary"
                    >2</q-avatar
                  >
                  Asignar el contacto para el prospecto
                </q-banner>
                <q-banner v-else class="bg-primary text-white q-px-lg">
                  <q-avatar size="md" color="white" text-color="primary"
                    >3</q-avatar
                  >
                  Se asignara el prospecto a los siguientes datos
                </q-banner>
              </template>
            </q-stepper>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
  <AccountDialog
    ref="accountDialogRef"
    close-on-selected
    @captured-account="assignAccount"
    @captured-current-account="assignAccount2"
  />
  <ContactDialog
    close-on-change
    @contact-change="assignContact"
    ref="contactDialogRef"
  />
  <AdvancedFilterAccount
    ref="advancedAccountFilterRef"
    @select-item="selectAccount"
  />
  <AdvancedFilterContact
    ref="contactAdvancedFilterRef"
    account_id=""
    :alt-account-id="assignedAccount.id"
    @select-item="selectContact"
  />
</template>
