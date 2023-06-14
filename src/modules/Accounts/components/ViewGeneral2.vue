<script lang="ts" setup>
import { AccountDataModel } from '../utils/types/index';
import { AccountStore } from '../../Accounts/store';
import { AssignedUserStore } from '../../../components/AssignedUsers/store';
import { contactSelectedKey } from '../utils/ProvideKeys';
import {
  PhoneModel,
  EmailModel,
  DirectionComponentModel,
} from 'src/components/types/index';
import { ref, computed, onMounted, inject, defineAsyncComponent } from 'vue';
import { useAccountModule } from '../composables/Core';
import { useAsyncState } from '@vueuse/core';
import { useCRMValidator } from '../../../composables/core/useValidator/index';
import { useFormOptionsStore } from '../../../stores/formOptionsStore';
import { useQuasar, QInput } from 'quasar';
import { userStore } from '../../Users/store/UserStore';
import {
  AccountModel,
  DetailAccountModel,
  LegacyPhoneModel,
} from '../utils/types/index';
import serviceTabContact from '../services/AccountTabContactsService';

const ActivitiesComponent =defineAsyncComponent(() => import('src/components/Activities/ActivitiesComponent.vue'));
const AdvancedFilterContact =defineAsyncComponent(() => import('./AdvancedFilter/AdvancedFilterContact.vue'));
const AlertComponent =defineAsyncComponent(() => import('src/components/MainAlert/AlertComponent.vue'));
const ContactCard =defineAsyncComponent(() => import('src/components/MainCard/ContactCard.vue'));
const ContactDialog =defineAsyncComponent(() => import('src/modules/Contacts/components/Dialogs/ContactDialog.vue'));
const DirectionCard =defineAsyncComponent(() => import('src/components/MainCard/DirectionCard.vue'));
const InfoCard2 =defineAsyncComponent(() => import('../components/Cards/InfoCard2.vue'));
const ListAssignedUsers =defineAsyncComponent(() => import('src/components/AssignedUsers/ListAssignedUsers.vue'));
const PhoneInput =defineAsyncComponent(() => import('src/components/MainInputs/PhoneInput.vue'));
const RelatedAccounts =defineAsyncComponent(() => import('./RelatedAccounts/RelatedAccounts.vue'));
const ViewChangecontrol =defineAsyncComponent(() => import('./Cards/ViewChangecontrol.vue'));
const ViewComments =defineAsyncComponent(() => import('src/modules/Accounts/components/Cards/ViewComments.vue'));
const ViewGeneralSkeleton =defineAsyncComponent(() => import('src/components/Skeletons/ViewGeneralSkeleton.vue'));

const props = defineProps<{
  idAccount?: string;
  accountType: AccountModel;
}>();

const emits = defineEmits<{
  (event: 'submittingForm', values?: string): void;
  (event: 'submitFail'): void;
  (event: 'exposeData', values: object): void;
}>();

//* InjectedValues
const selectedContact = inject(contactSelectedKey);

//* Store variables
const languageStore = useFormOptionsStore();
const accountStore = AccountStore();
//const { roles_accounts } = AccountStore();
//const { view_detail:{panel_assigned_users} } = roles_accounts
//*const { roles_accounts } = storeToRefs(accountStore)
//*const { view_detail } = roles_accounts.value
const uStore = userStore();
const {
  userCRM: { id: idUser },
} = userStore();
const { getRolAccount } = AssignedUserStore();

//* variables
const localId = ref(props.idAccount || '');
const localTypeAccount = ref<AccountModel>(props.accountType || 'Privada');
const tab = ref('comentarios');
const text = ref('');
const selectedAccountData = ref({} as DetailAccountModel);
const phonesAccountLocal = ref([] as PhoneModel[]);
const mainPhone = ref({
  code: '+591',
  phone: '',
  whatsapp: '0',
} as LegacyPhoneModel);
const officePhone = ref({
  code: '+591',
  phone: '',
  whatsapp: '0',
} as LegacyPhoneModel);
const emailsAccountLocal = ref([] as EmailModel[]);
const directionAccountLocal = ref({} as DirectionComponentModel);
const createContactState = ref(false);
const creationContactMessage = ref('');
const inheritedValues = ref(
  Object.values(accountStore.$state.accountDraft).length > 0
);

//* Ref variables
const advancedFilterRef = ref<InstanceType<
  typeof AdvancedFilterContact
> | null>(null);
const assignedSingleUserRef = ref<InstanceType<
  typeof ListAssignedUsers
> | null>(null);
const commentRef = ref<InstanceType<typeof QInput> | null>();
const contactAccountCardRef = ref<InstanceType<typeof ContactCard> | null>(
  null
);
const contactDialogRef = ref<InstanceType<typeof ContactDialog> | null>(null);
const directionAccountCardRef = ref<InstanceType<typeof DirectionCard> | null>(
  null
);
const infoAccountCardRef = ref<InstanceType<typeof InfoCard2> | null>(null);
const phoneMainRef = ref<InstanceType<typeof PhoneInput> | null>(null);

//* computed variables
const isSomeCardEditing = computed(() =>
  [
    infoAccountCardRef.value?.isEditing,
    contactAccountCardRef.value?.isEditing,
    directionAccountCardRef.value?.isEditing,
  ].some((value) => !!value)
);

//* Composable variables
const { contactCreationData, dataToContact } = useAccountModule();
const { generateValidators } = useCRMValidator();
const $q = useQuasar();
const { addContact } = serviceTabContact();

const { isLoading, execute } = useAsyncState(async () => {
  await languageStore.getAccountLanguage();
  if (!!localId.value) {
    await accountStore.readAccount(localId.value);
    localTypeAccount.value = accountStore.getSelectedAccountInfo.accountType;
    localId.value = accountStore.getSelectedAccountId;
    if (accountStore.getAccountForm) {
      // emit something
      emits('exposeData', accountStore.getSelectedAccountInfo.headerData);
      assignValues(accountStore.getAccountForm);
    }
  }
}, null);

//* Methods
const assignValues = (data: AccountDataModel) => {
  selectedAccountData.value = data.infoData;
  phonesAccountLocal.value = data.phones;
  emailsAccountLocal.value = data.emails;
  mainPhone.value = data.mainPhone;
  officePhone.value = data.officePhone;
  directionAccountLocal.value = data.directionData;
};

const onChangeUserAssigned = async (user_id: string) => {
  await accountStore.addUserAssinged(localId.value, user_id, uStore.userCRM.id);
  emits('submittingForm');
};

const validateCards = async (): Promise<boolean> => {
  let validCards: (boolean | undefined)[] = [];

  if (infoAccountCardRef.value?.isEditing) {
    validCards.push(await infoAccountCardRef.value?.validateFields());
  }

  if (contactAccountCardRef.value?.isEditing) {
    const phoneMainValidState = await phoneMainRef.value?.validatePhone();
    validCards.push(phoneMainValidState);
  }

  if (!localId.value) validCards.push(await commentRef.value?.validate());

  return validCards.length > 0 ? validCards.every((val) => val) : true;
};

const createRequestBody = (mode: 'create' | 'update') => {
  const idUser = uStore.userCRM;

  const directionInfo = directionAccountCardRef.value?.captureCurrentData();
  const crm3Address = accountStore.getSelectedAccountInfo.directionCRM3;
  const formattedAddress = directionInfo?.address_street_generated_c
    .replaceAll(',|', '')
    .replace('_gnrtd', '');

  console.log(directionInfo);

  const plainAddress =
    !!crm3Address && !formattedAddress ? crm3Address : formattedAddress;
  const infoData =
    infoAccountCardRef.value?.captureCurrentData() ||
    ({} as { [key: string]: string });

  const basicBody = {
    info_account: {
      detail_account: {
        ...(infoData || {}),
        modified_user_id: idUser.id,
        celular_c: mainPhone.value.phone || '',
        celular_wp_c: mainPhone.value.whatsapp || '',
        celular_cd_c: mainPhone.value.code || '',
        phone_office: officePhone.value.phone || '',
        phone_office_wp_c: officePhone.value.whatsapp || '',
        phone_office_cd_c: officePhone.value.code || '',
        assigned_user_id:
          assignedSingleUserRef.value?.dataSend.assigned_user_id,
      } as { [key: string]: string },
      direction_account: {
        address_street_generated_c:
          directionInfo?.address_street_generated_c || '',
        jjwg_maps_lat_c: directionInfo?.latitude || 0,
        jjwg_maps_lng_c: directionInfo?.longitude || 0,
        jjwg_maps_address_c: plainAddress,
        billing_address_street: plainAddress,
        shipping_address_street: plainAddress,
        shipping_address_city: infoData.billing_address_city,
        shipping_address_country: infoData.billing_address_country,
      },
    },
  };

  if (infoData.tipocuenta_c === 'Privada') {
    basicBody.info_account.detail_account.name = `${basicBody.info_account.detail_account.names_c} ${basicBody.info_account.detail_account.lastname_c}`;
  }

  if (mode === 'create') {
    return {
      info_account: {
        detail_account: {
          ...basicBody.info_account.detail_account,
          assigned_user_id:
            assignedSingleUserRef.value?.dataSend.assigned_user_id,
          created_by: idUser.id,
        } as { [key: string]: string },
        direction_account: {
          ...basicBody.info_account.direction_account,
        },
      },
      phone_email_account: {
        phones:
          contactAccountCardRef.value?.captureCurrentData().phones.newPhones ||
          [],
        emails:
          contactAccountCardRef.value?.captureCurrentData().emails.newEmails ||
          [],
      },
      assigned_users: [assignedSingleUserRef.value?.dataSend],
      comments: {
        module: 'Accounts',
        idmodule: null,
        visualizacion_c: 'interno',
        description: text.value,
        relevance: 'medium',
        modulecoments: 'HANPC_Comentarios',
        id_user: idUser.id,
      },
    };
  } else {
    return { ...basicBody };
  }
};

const openContactDialog = (message: string, closeAdvancedFilter = false) => {
  console.log('opening with this...', contactCreationData.value);
  contactDialogRef.value?.openDialogWithData(
    contactCreationData.value,
    undefined,
    message
  );
  if (closeAdvancedFilter) {
    advancedFilterRef.value?.onClose();
  }
};

const assignItem = async (value: { id: string; nombre: string }) => {
  //TODO: Adicionar el servicio de addContact aqui, usar Loading and Notification...
  // Ya se tiene userCRM.id y account id por medio de localId...
  try {
    $q.loading.show();
    console.log(JSON.stringify(value));
    await addContact(uStore.userCRM.id, localId.value, value.id);
    $q.notify({
      type: 'positive',
      message: `Se agregó a ${value.nombre} la lista de contactos`,
    });
    advancedFilterRef.value?.onClose();
  } catch (error) {
    console.log(error);
    $q.notify({
      type: 'negative',
      message: 'Error al asignar usuario a la cuenta',
    });
  } finally {
    $q.loading.hide();
  }
};

const onSubmit = async () => {
  if (!(await validateCards())) {
    emits('submitFail');
    return;
  }
  try {
    if (!!localId.value) {
      const body = createRequestBody('update');
      if (contactAccountCardRef.value?.isEditing) {
        const { phones, emails } =
          contactAccountCardRef.value?.captureCurrentData();
        await accountStore.updateAccount(localId.value, body, {
          idUser: uStore.userCRM.id,
          phones,
          emails,
        });
        execute();
        emits('submittingForm', localId.value);
        return;
      }

      const currentAccountType = selectedAccountData.value.tipocuenta_c;
      const newAccountType = body.info_account.detail_account.tipocuenta_c;
      console.log(
        'Nuevo tipo de cuenta...',
        newAccountType || body.info_account.detail_account
      );
      const isContactRequired =
        currentAccountType === 'Empresa' && newAccountType === 'Privada';

      await accountStore.updateAccount(localId.value, body);
      await execute();
      emits('submittingForm', localId.value);
      if (isContactRequired) {
        const contacts = (await accountStore.getAccountsContact(
          localId.value
        )) as {
          [key: string]: string;
        }[];
        const isContactsEmpty = contacts.length === 0;
        const accountHaveNotEqualContact = contacts.every(
          (contact) => contact.ci !== body.info_account.detail_account.nit_ci_c
        );
        if (isContactsEmpty || accountHaveNotEqualContact) {
          body.info_account.detail_account.assigned_user_id =
            selectedAccountData.value.assigned_user_id || '';
          dataToContact(
            body,
            localId.value,
            mainPhone.value,
            officePhone.value
          );
          creationContactMessage.value = 'Nuevo Contacto de cuenta Privada';
          openContactFilter();
          // createContactState.value = true;
        }
      }
    } else {
      const body = createRequestBody('create');
      await accountStore.createAccount(body);
      localId.value = accountStore.getSelectedAccountId;
      await execute();
      dataToContact(body, localId.value, mainPhone.value, officePhone.value);
      $q.notify({
        type: 'positive',
        message: 'Creacion de Cuenta',
        caption: 'Se ha creado una nueva cuenta',
      });
      emits('submittingForm', localId.value);
      if (localTypeAccount.value === 'Empresa') {
        createContactState.value = true;
        return;
      } else if (localTypeAccount.value === 'Privada') {
        creationContactMessage.value = 'Nuevo Contacto de cuenta Privada';
        openContactDialog(creationContactMessage.value);
        // createContactState.value = true;
      }
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al crear la cuenta',
    });
    emits('submitFail');
  }
};

const openContactFilter = () => {
  console.log('asignando contacto');
  advancedFilterRef.value?.openDialog();
};

const cancelChanges = () => {
  if (infoAccountCardRef.value?.isEditing)
    infoAccountCardRef.value?.cancelChanges();
  if (contactAccountCardRef.value?.isEditing)
    contactAccountCardRef.value?.cancelChanges();
  if (directionAccountCardRef.value?.isEditing)
    directionAccountCardRef.value?.cancelChanges();
};

const sendContactData = (id?: string) => {
  if (id && selectedContact) {
    selectedContact(id);
  }
};

onMounted(async () => {
  getRolAccount(idUser); //Obtiene los roles del usuario referente al modulo
  //await accountStore.getRolAccount();
  if (Object.values(accountStore.$state.accountDraft).length > 0) {
    const draft = accountStore.$state.accountDraft;
    localTypeAccount.value = draft.infoDataLocal.tipocuenta_c as AccountModel;
    selectedAccountData.value = draft.infoDataLocal;
    phonesAccountLocal.value = draft.phonesModel;
    emailsAccountLocal.value = draft.emailsModel;
    mainPhone.value = draft.mainPhone;
    officePhone.value = draft.officePhone;
    directionAccountLocal.value = draft.direction;
  }
  await accountStore.readAccount(localId.value);
});

defineExpose({
  onSubmit,
  cancelChanges,
  isSomeCardEditing,
});
</script>

<template>
  <ViewGeneralSkeleton v-if="isLoading" />
  <div class="row q-col-gutter-lg" v-else>
    <div class="col-12 col-md-6">
      <div class="row q-gutter-md">
        <InfoCard2
          :account-id="localId"
          :account-type="localTypeAccount"
          :initial-data="selectedAccountData"
          class="col-12"
          ref="infoAccountCardRef"
        />
        <pre>{{}}</pre>
        <contact-card-component
          ref="contactAccountCardRef"
          :id-local="localId"
          class="col-12"
          :phones="phonesAccountLocal"
          :emails="emailsAccountLocal"
          module="accounts"
        >
          <template #contactHeadEdit="{ countries }">
            <div class="q-pa-md" style="font-weight: normal; color: #757575">
              <q-icon name="local_phone" color="primary" size="xs" />
              Teléfonos
            </div>
            <PhoneInput
              ref="phoneMainRef"
              required
              v-model="mainPhone"
              :options="countries"
              :local-id="localId"
              title="Teléfono Principal"
              description="Teléfono Principal"
            />
            <q-separator class="q-mb-sm" v-show="$q.screen.lt.sm" />
            <PhoneInput
              ref="phoneOfficeRef"
              v-model="officePhone"
              :options="countries"
              :local-id="localId"
              title="Teléfono de Oficina"
              description="Teléfono de Oficina"
            />
          </template>
          <template #contactHeadRead>
            <div class="q-pa-md" style="font-weight: normal; color: #757575">
              <q-icon name="local_phone" color="primary" size="xs" />
              Teléfonos Principales
            </div>
            <q-list padding class="q-py-md">
              <q-item>
                <q-item-section avatar>
                  <q-icon
                    v-if="mainPhone.whatsapp === '1'"
                    color="positive"
                    name="fa-brands fa-whatsapp"
                    size="sm"
                  />
                  <q-icon v-else color="blue-10" name="local_phone" size="sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{
                    `${mainPhone.code || ''} ${
                      mainPhone.phone || 'No Asignado'
                    }`
                  }}</q-item-label>
                  <q-item-label caption lines="2"
                    >Telefono Principal</q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-separator spaced inset />
              <q-item>
                <q-item-section avatar>
                  <q-icon
                    v-if="officePhone.whatsapp === '1'"
                    color="positive"
                    name="fa-brands fa-whatsapp"
                    size="sm"
                  />
                  <q-icon v-else color="blue-10" name="local_phone" size="sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{
                    `${officePhone.code || ''} ${
                      officePhone.phone || 'No Asignado'
                    }`
                  }}</q-item-label>
                  <q-item-label caption lines="2"
                    >Telefono de oficina</q-item-label
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </template>
        </contact-card-component>

        <direction-card-component
          ref="directionAccountCardRef"
          :id-local="localId"
          :data="directionAccountLocal"
          :directionCRM3="accountStore.getSelectedAccountInfo.directionCRM3"
          :options="[]"
          class="col-12"
        />
      </div>
    </div>
    <div class="col-12 col-md-6">
      <!-- <AssignedSingleUser2
        ref="assignedSingleUserRef"
        :module-id="localId"
        :module="'accounts'"
        :withList="true"
        @change-user="onChangeUserAssigned"
      /> -->
      <!-- :rol_module="panel_assigned_users" -->
      <ListAssignedUsers
        ref="assignedSingleUserRef"
        :module="
          inheritedValues
            ? accountStore.$state.accountDraft.moduleOrigin
            : 'Accounts'
        "
        :module-id="
          inheritedValues
            ? accountStore.$state.accountDraft.idModuleOrigin
            : localId
        "
        :withList="true"
        :inherited="inheritedValues"
        :rol_module="view_detail?.panel_assigned_users"
        @change-user="onChangeUserAssigned"
        :default-user-id="accountStore.$state.accountDraft.assignedUserId"
      />

      <q-separator inset></q-separator>
      <div class="q-gutter-y-md">
        <q-card>
          <q-card-section style="padding: 0px">
            <q-tabs
              class="q-ma-none"
              v-model="tab"
              indicator-color="primary"
              :inline-label="!$q.screen.xs"
              :active-color="$q.dark.isActive ? 'orange' : 'primary'"
              align="justify"
              :no-caps="$q.screen.xs ? true : false"
            >
              <q-tab name="comentarios" icon="comment" label="Comentarios" />
              <q-tab
                name="Relation"
                icon="people"
                label="Miembro de"
                :disable="!localId"
              />
              <q-tab
                name="historychanges"
                icon="history"
                label="Historial"
                :disable="!localId"
              />
              <q-tab name="Activities" icon="comment" label="Actividades" />
            </q-tabs>
            <q-separator />
            <q-tab-panels
              v-model="tab"
              animated
              style="min-height: fit-content"
            >
              <q-tab-panel
                name="comentarios"
                style="min-height: 500px"
                class="q-py-sm"
                v-if="!!localId"
              >
                <ViewComments
                  :idAccount="localId"
                  :descCRM3="accountStore.getDescriptionCRM3"
                ></ViewComments>
              </q-tab-panel>
              <q-tab-panel
                name="comentarios"
                style="min-height: 500px"
                class="q-pd-sm"
                v-else
              >
                <q-input
                  autogrow
                  outlined
                  bottom-slots
                  v-model="text"
                  placeholder="Escriba su comentario"
                  dense
                  color="primary"
                  ref="commentRef"
                  :rules="generateValidators(['fieldRequired'])"
                >
                  <template v-slot:before>
                    <q-avatar>
                      <img :src="uStore.getProfileURL" />
                    </q-avatar>
                  </template>
                </q-input>
              </q-tab-panel>
              <q-tab-panel name="Relation" class="q-py-sm">
                <RelatedAccounts
                  ref="relatedAccountsRef"
                  :account-id="localId"
                ></RelatedAccounts>
              </q-tab-panel>
              <q-tab-panel name="historychanges" v-if="!!localId">
                <ViewChangecontrol
                  :idAccount="localId || ''"
                  :created="accountStore.getSelectedAccountInfo.created"
                  :modify="accountStore.getSelectedAccountInfo.modify"
                ></ViewChangecontrol>
              </q-tab-panel>
              <q-tab-panel name="historychanges" v-else>
                <ViewChangecontrol
                  :idAccount="'0'"
                  :created="''"
                  :modify="''"
                ></ViewChangecontrol>
              </q-tab-panel>
              <q-tab-panel name="Activities">
                <ActivitiesComponent
                  :id="localId"
                  :idUser="uStore.userCRM.id"
                  module="Accounts"
                  :emails="[]"
                  :nameReg="''"
                ></ActivitiesComponent>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
  <AlertComponent
    title="Nueva Cuenta Creada"
    icon="warning"
    iconColor="warning"
    iconSize="50px"
    btn-color="primary"
    btn-text="Buscar Contacto"
    :disable-cancel="localTypeAccount === 'Privada'"
    v-model="createContactState"
    @confirm="openContactFilter"
    @denegate="createContactState = false"
  >
    <template #body>
      <span class="q-py-sm">
        ¿Qué acciones desea hacer con la cuenta creada?
      </span>
    </template>
  </AlertComponent>
  <AdvancedFilterContact
    :persistent="localTypeAccount === 'Privada'"
    ref="advancedFilterRef"
    @selectItem="assignItem"
    title="Buscar Contacto"
    :account_id="localId"
  >
    <!-- <template #header-button>
      <q-btn
        color="primary"
        flat
        text-color="white"
        icon="arrow_back"
        @click="
          () => {
            advancedFilterRef?.onClose();
            createContactState = true;
          }
        "
      >
        <q-tooltip> Volver atrás </q-tooltip>
      </q-btn>
      <q-icon name="filter_alt" size="sm" />
    </template> -->
    <template #no-data>
      <q-btn
        color="primary"
        icon="add"
        label="Crear Nuevo"
        @click="openContactDialog(creationContactMessage, true)"
      />
    </template>
  </AdvancedFilterContact>
  <ContactDialog @contact-change="sendContactData" ref="contactDialogRef" />
</template>
