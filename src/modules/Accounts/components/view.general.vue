<script lang="ts">
export default {
  name: 'ViewGeneral',
  components: { ListAssignedUsers },
};

import { ref, computed, onMounted, defineAsyncComponent } from 'vue';

import {
  AccountModel,
  SelectOptionsModel,
  DetailAccountModel,
  AccountGeneralModel,
} from '../utils/types';

import { useQuasar, QInput } from 'quasar';

// *COMPONENTS
import RelatedAccounts from './RelatedAccounts/RelatedAccounts.vue';
import InfoAccountCard from './Cards/InfoCard.vue';
import DirectionAccountCard from 'src/components/MainCard/DirectionCard.vue';
import ContactAccountCard from 'src/components/MainCard/ContactCard.vue';
import AssignedSingleUser2 from 'src/components/AssignedUsers/AssignedSingleUser2.vue';
import ViewComments from './Cards/ViewComments.vue';
import ViewChangecontrol from './Cards/ViewChangecontrol.vue';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
// *STORE
import { userStore } from 'src/modules/Users/store/UserStore';
// *COMPOSABLES (DEVS)
import { useCRMValidator } from '../composables/useCRMValidator';
import { useAsyncState } from '@vueuse/core';

// *COMPOSABLES (PLUGINS)
import { LegacyPhoneModel } from '../utils/types/index';

// *SERVICES
import services from '../services/AccountService';
//import { assignedUserService } from '../services/AccountAssignedUserService';
import { PhoneModel } from 'src/components/types';
import { DetailContactModel } from '../../Contacts/utils/types/index';
import {
  OptionAccountInfo,
  ContactGeneralModel,
} from '../../Contacts/utils/types/index';
import {
  DirectionValueModel,
  CountryOptions,
} from '../../../components/types/index';
import {
  EmailModel,
  DirectionComponentModel,
} from '../../../components/types/index';
import PhoneInput from 'src/components/MainInputs/PhoneInput.vue';
import { axios_LB_01 } from 'src/conections/axiosCRM';
import ListAssignedUsers from 'src/components/AssignedUsers/ListAssignedUsers.vue';
</script>

<script setup lang="ts">
const ContactDialog = defineAsyncComponent(
  () => import('../../Contacts/components/Dialogs/ContactDialog.vue')
);

const props = withDefaults(
  defineProps<{
    accountType: AccountModel;
    idAccount?: string;
  }>(),
  {
    idAccount: '',
  }
);

const emits = defineEmits<{
  (event: 'submittingForm', values?: string): void;
  (event: 'submitFail'): void;
  (event: 'exposeData', values: object): void;
}>();

//* composable values
const { userCRM } = userStore();
const { generateValidators } = useCRMValidator();
// const { addUserAssigned } = assignedUserService();

//* request services
const {
  state,
  isLoading,
  execute: execDataService,
} = useAsyncState(
  (
    service: 'create' | 'read' | 'update' | 'options',
    id?: string,
    body?: object
  ) => {
    if (service === 'create') {
      if (body) return services.createContact(body);
    }
    if (service === 'read') {
      if (id) {
        return services.readAccount(id);
      }
    }
    if (service === 'update') {
      if (id && body) return services.updateContact(id, body);
    }
    if (service === 'options') {
      return services.readOptions();
    }
  },
  {} as AccountGeneralModel,
  { immediate: false, resetOnExecute: false }
);

type ServiceContactModel = 'create' | 'read' | 'update' | 'delete';
const { execute: executeContactService } = useAsyncState(
  (
    service: ServiceContactModel,
    module: 'accounts' | 'contacts',
    id?: string,
    body?: object
  ) => {
    switch (service) {
      case 'create': {
        if (id && body)
          if (module === 'accounts')
            return axios_LB_01.post(
              `create-phones-emails-by-account/${id}`,
              body
            );
          else {
            return axios_LB_01.post(
              `create-phones-emails-by-contact/${id}`,
              body
            );
          }
        return {};
      }
      case 'read': {
        if (id) {
          if (module === 'accounts') {
            return axios_LB_01.get(`/get-phones-emails-account/${id}`);
          } else {
            return axios_LB_01.get(`/get-phones-emails-contact/${id}`);
          }
        }
        return {};
      }
      case 'update': {
        if (id && body) {
          if (module === 'accounts') {
            return axios_LB_01.patch(`/email-phone-update-account/${id}`, body);
          } else {
            return axios_LB_01.patch(`/email-phone-update-contact/${id}`, body);
          }
        }
        return {};
      }
      case 'delete': {
        if (id && body)
          if (module === 'accounts') {
            return axios_LB_01.patch(`/email-phone-delete-account/${id}`, body);
          } else {
            return axios_LB_01.patch(`/email-phone-delete-contact/${id}`, body);
          }
      }
      default: {
        return new Promise((resolve) => resolve({}));
      }
    }
  },
  { data: { phones: [] } },
  { immediate: false, resetOnExecute: false }
);

//* Variables: Globals
const currentAccount = ref({} as AccountGeneralModel);
const cardsOptions = ref({} as SelectOptionsModel);
const $q = useQuasar();

//* Variables: Data
const infoCardDataLocal = ref({} as DetailAccountModel);
const phonesAccountLocal = ref([] as PhoneModel[]);
const mainPhone = ref({} as LegacyPhoneModel);
const officePhone = ref({} as LegacyPhoneModel);
const emailsAccountLocal = ref([] as EmailModel[]);
const directionAccountLocal = ref({} as DirectionComponentModel);
const idusuario = userCRM.id;
const localTypeAccount = ref<AccountModel>(props.accountType || 'Privada');
const localIdAccount = ref(props.idAccount || '');

const infoAccountOptions = ref({} as OptionAccountInfo);
const directionAccountOptions = ref([] as DirectionValueModel[]);
const phonesAccountOptions = ref([] as CountryOptions[]);

const tab = ref('comentarios');
const text = ref('');

//* references
const infoAccountCardRef = ref<InstanceType<typeof InfoAccountCard> | null>(
  null
);
const contactAccountCardRef = ref<InstanceType<
  typeof ContactAccountCard
> | null>();
const directionAccountCardRef = ref<InstanceType<
  typeof DirectionAccountCard
> | null>(null);
const contactDialogRef = ref<InstanceType<typeof ContactDialog> | null>(null);
const phoneMainRef = ref<InstanceType<typeof PhoneInput> | null>(null);
const phoneOfficeRef = ref<InstanceType<typeof PhoneInput> | null>(null);

const assignedSingleUserRef = ref<InstanceType<
  typeof AssignedSingleUser2
> | null>(null);
const commentRef = ref<InstanceType<typeof QInput> | null>(null);
const relatedAccountsRef = ref<InstanceType<typeof RelatedAccounts> | null>(
  null
);

//* Computed variables
const isSomeCardEditing = computed(() => {
  return [
    infoAccountCardRef.value?.isEditing,
    contactAccountCardRef.value?.isEditing,
    directionAccountCardRef.value?.isEditing,
  ].some((val) => val);
});

const createPayload = (typePayload: 'create' | 'update') => {
  const { id: idUsuario } = userCRM;

  const detailInfo = infoAccountCardRef.value?.captureCurrentData();
  const { phones, emails } = contactAccountCardRef.value.captureCurrentData();
  const directionInfo = directionAccountCardRef.value?.captureCurrentData();

  if (detailInfo) {
    const plainAddress = directionInfo?.address_street_generated_c.replace(
      '_gnrtd',
      ''
    );

    const payloadBase = {
      info_account: {
        detail_account: {
          ...detailInfo,
          modified_user_id: idUsuario,
          celular_c: mainPhone.value.phone || '',
          celular_wp_c: mainPhone.value.whatsapp || '',
          celular_cd_c: mainPhone.value.code || '',
          phone_office: officePhone.value.phone || '',
          phone_office_wp_c: officePhone.value.whatsapp || '',
          phone_office_cd_c: officePhone.value.code || '',
          assigned_user_id:
            assignedSingleUserRef.value?.dataSend.assigned_user_id,
          // phone_fax: contactInfo.join('-') || '',
        },
        direction_account: {
          address_street_generated_c:
            directionInfo?.address_street_generated_c || '',
          jjwg_maps_lat_c: directionInfo?.latitude || 0,
          jjwg_maps_lng_c: directionInfo?.longitude || 0,
          jjwg_maps_address_c: plainAddress,
          billing_address_street: plainAddress,
          shipping_address_street: plainAddress,
          shipping_address_city: detailInfo.billing_address_city,
          shipping_address_state: detailInfo.billing_address_state_list_c,
          shipping_address_country: detailInfo.billing_address_country,
        },
      },
    };

    if (detailInfo.tipocuenta_c === 'Privada') {
      payloadBase.info_account.detail_account.name = `${payloadBase.info_account.detail_account.names_c} ${payloadBase.info_account.detail_account.lastname_c}`;
    }

    if (typePayload === 'create') {
      return {
        info_account: {
          detail_account: {
            ...payloadBase.info_account.detail_account,
            assigned_user_id:
              assignedSingleUserRef.value?.dataSend.assigned_user_id,
            created_by: idUsuario,
          },
          direction_account: {
            ...payloadBase.info_account.direction_account,
          },
        },
        phone_email_account: {
          phones: phones.newPhones || [],
          emails: emails.newEmails || [],
        },
        assigned_users: [assignedSingleUserRef.value?.dataSend],
        comments: {
          module: 'Accounts',
          idmodule: null,
          visualizacion_c: 'interno',
          description: text.value,
          relevance: 'medium',
          modulecoments: 'HANPC_Comentarios',
          id_user: idusuario,
        },
      };
    } else {
      return {
        ...payloadBase,
      };
    }
  }
};

const validateFields = async (skipFields = false) => {
  const validInfoCard = await infoAccountCardRef.value?.validateFields();

  let validFields: (boolean | undefined)[] = [];

  if (infoAccountCardRef.value?.isEditing) {
    validFields.push(validInfoCard);
  }

  if (contactAccountCardRef.value?.isEditing && skipFields) {
    const isMainPhoneValid = await phoneMainRef.value?.validatePhone();
    validFields.push(isMainPhoneValid);
  }

  if (!localIdAccount.value) {
    const validComment = await commentRef.value?.validate();
    validFields.push(validComment);
  }

  // Remember val is boolean type
  return validFields.length > 0 ? validFields.every((val) => val) : true;
};

const createBodyAccount = (phones?: PhoneModel[], emails?: EmailModel[]) => ({
  idUser: idusuario || '',
  emails: emails || [],
  phones: phones || [],
});

const onSubmit = async (skipFields = false) => {
  const validFields = await validateFields(
    skipFields && !!localIdAccount.value
  );
  if (validFields) {
    if (!!localIdAccount.value) {
      console.log('update');
      const payload = createPayload('update');

      if (contactAccountCardRef.value?.isEditing) {
        const { phones, emails } =
          contactAccountCardRef.value.captureCurrentData();

        const bodyContact = createBodyAccount(
          phones.currentPhones,
          emails.currentEmails
        );

        const bodyContactDeleted = createBodyAccount(
          phones.deletedPhones,
          emails.deletedEmails
        );

        const bodyContactNew = createBodyAccount(
          phones.newPhones,
          emails.newEmails
        );

        await executeContactService(
          0,
          'create',
          'accounts',
          localIdAccount.value,
          bodyContactNew
        );

        await executeContactService(
          0,
          'update',
          'accounts',
          localIdAccount.value,
          bodyContact
        );

        await executeContactService(
          0,
          'delete',
          'accounts',
          localIdAccount.value,
          bodyContactDeleted
        );
      }

      await execDataService(0, 'update', localIdAccount.value, payload);
      currentAccount.value = state.value;
      assignValues(currentAccount.value);
      emits('submittingForm', localIdAccount.value);
    } else {
      const payload = createPayload('create');
      await execDataService(0, 'create', undefined, payload);

      localIdAccount.value = state.value.info_account?.detail_account?.id;
      currentAccount.value = state.value;

      assignValues(currentAccount.value);

      const dataAsContact = {
        info_contact: {
          detail_contact: {
            ci_c:
              payload?.info_account.detail_account.tipocuenta_c === 'Privada'
                ? payload.info_account.detail_account.nit_ci_c
                : '',
            primary_address_city:
              payload?.info_account.detail_account.billing_address_city,
            primary_address_country:
              payload?.info_account.detail_account.billing_address_country,
            primary_address_state_list_c:
              payload?.info_account.detail_account.billing_address_state_list_c,
            industry_c: payload?.info_account.detail_account.industry,
            subindustry_c: payload?.info_account.detail_account.subindustry_c,
            first_name: payload?.info_account.detail_account.names_c,
            last_name: payload?.info_account.detail_account.lastname_c,
            account_id: state.value.info_account?.detail_account?.id,
            assigned_user_id:
              payload?.info_account.detail_account.assigned_user_id,
            principal_c: 1,
            estado_civil_c: '',
            genero_c: '',
            inherited: true,
            is_parents_c: 0,
            //...payload?.info_account.detail_account,
          } as DetailContactModel,
          direction_contact: {
            ...payload?.info_account.direction_account,
          },
        },
        phone_email_contact: {
          phone_mobile: mainPhone.value.phone,
          phone_mobile_wp_c: mainPhone.value.whatsapp,
          phone_mobile_cd_c: mainPhone.value.code,
          phone_work: officePhone.value.phone,
          phone_work_wp_c: officePhone.value.whatsapp,
          phone_work_cd_c: officePhone.value.code,
          emails: payload?.phone_email_account?.emails.map(
            (val: EmailModel) => ({
              ...val,
              inherited: true,
            })
          ),
          phones: payload?.phone_email_account?.phones.map(
            (val: PhoneModel) => ({
              ...val,
              inherited: true,
            })
          ),
        },
        // assigned_users: {},
        comments: {
          ...payload?.comments,
        },
        // related_contact: {},
      } as ContactGeneralModel;

      emits('submittingForm', state.value.info_account?.detail_account?.id);
      if (payload?.info_account.detail_account.tipocuenta_c === 'Empresa') {
        $q.dialog({
          title: 'Crear primer contacto',
          message: '¿Le gustaria crear el primer contacto para esta cuenta?',
          cancel: 'Cancelar',
          persistent: true,
          ok: 'OK',
        }).onOk(() => {
          contactDialogRef.value?.openDialogWithData(
            dataAsContact,
            undefined,
            'Nuevo contacto de cuenta empresa'
          );
        });
        return;
      }
      contactDialogRef.value?.openDialogWithData(
        dataAsContact,
        undefined,
        'Nuevo contacto de cuenta privada'
      );

      if (state.value.info_account.detail_account.id) {
        localIdAccount.value = state.value.info_account.detail_account.id;
      }
      currentAccount.value = state.value;
      assignValues(currentAccount.value);
    }
  } else {
    emits('submitFail');
  }
};

const onReset = () => {
  console.log('resetting');
};

/**
 * This method assign the current values to cards
 * @param data General Data content
 */
const assignValues = (data: AccountGeneralModel): void => {
  contactAccountCardRef.value?.resetContactInput();
  infoCardDataLocal.value = data.info_account
    .detail_account as DetailAccountModel;
  mainPhone.value.phone = data.phone_email_account.celular_c;
  mainPhone.value.code = data.phone_email_account.celular_cd_c;
  mainPhone.value.whatsapp = data.phone_email_account.celular_wp_c;
  officePhone.value.phone = data.phone_email_account.phone_office;
  officePhone.value.code = data.phone_email_account.phone_office_cd_c;
  officePhone.value.whatsapp = data.phone_email_account.phone_office_wp_c;
  phonesAccountLocal.value = data.phone_email_account.phones;
  emailsAccountLocal.value = data.phone_email_account.emails;
  directionAccountLocal.value = {
    address_street_generated_c:
      data.info_account.direction_account.address_street_generated_c,
    latitude: data.info_account.direction_account.jjwg_maps_lat_c,
    longitude: data.info_account.direction_account.jjwg_maps_lng_c,
  };

  localTypeAccount.value = data.info_account.detail_account
    .tipocuenta_c as AccountModel;

  // Expose data outside this component
  emits('exposeData', {
    name: data.info_account.detail_account.name,
    accountType: data.info_account.detail_account.tipocuenta_c,
    code: data.info_account.detail_account.idcuentasap_c || 'No Asignado',
  });

  infoAccountCardRef.value?.constructorComp(
    infoCardDataLocal.value,
    infoCardDataLocal.value.id,
    infoCardDataLocal.value.tipocuenta_c as AccountModel
  );

  contactAccountCardRef.value?.constructorComp(
    phonesAccountLocal.value,
    emailsAccountLocal.value,
    infoCardDataLocal.value.id
  );

  directionAccountCardRef.value?.constructorComp(
    directionAccountLocal.value,
    infoCardDataLocal.value.id
  );
};

const assignOptions = (data: SelectOptionsModel) => {
  infoAccountOptions.value = data.infoClient;
  directionAccountOptions.value = data.infoDirectionsAccount;
  phonesAccountOptions.value = data.infoCodeCountry;
};

const descCRM3 = ref('');
const constructorComp = async (id?: string, accountType?: AccountModel) => {
  if (accountType) {
    localTypeAccount.value = accountType;
  }
  if (id) {
    localIdAccount.value = id;
    await execDataService(0, 'options');
    if (state.value) {
      cardsOptions.value = state.value;
      assignOptions(cardsOptions.value);
    }
    await execDataService(0, 'read', localIdAccount.value);
    if (state.value) {
      currentAccount.value = state.value;
      descCRM3.value =
        currentAccount.value.info_account.detail_account.description;

      assignValues(currentAccount.value);
    }
  }
  await execDataService(0, 'options');
  if (state.value) {
    cardsOptions.value = state.value;
    assignOptions(cardsOptions.value);
  }
};

// *FIRST FUNCTION TO EXECUTE
onMounted(async () => {
  localTypeAccount.value = await props.accountType;
  await constructorComp(props.idAccount, props.accountType);
});

// const onChangeUserAssigned = async (user_id: string) => {
//   await addUserAssigned(props.idAccount, user_id, userCRM.id);
//   emits('submittingForm');
// };

defineExpose({
  localTypeAccount,
  isSomeCardEditing,
  onSubmit,
  onReset,
});
</script>

<template>
  <form @submit.prevent.stop="onSubmit" @reset.prevent.stop="onReset">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6 col-lg-7 col-xl-7 q-gutter-y-md">
        <InfoAccountCard
          ref="infoAccountCardRef"
          :id-local="idAccount"
          :initial-data-contact="infoCardDataLocal"
          :accountType="localTypeAccount"
          :loading="isLoading"
          :options="infoAccountOptions"
        />
        <contact-card-component
          ref="contactAccountCardRef"
          :id-local="idAccount"
          :phones="phonesAccountLocal"
          :emails="emailsAccountLocal"
          :loading="isLoading"
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
              :local-id="idAccount"
              title="Teléfono Principal"
              description="Teléfono Principal"
            />
            <q-separator class="q-mb-sm" v-show="$q.screen.lt.sm" />
            <PhoneInput
              ref="phoneOfficeRef"
              v-model="officePhone"
              :options="countries"
              :local-id="idAccount"
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
                    name="whatsapp"
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
                    name="whatsapp"
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
          :id-local="idAccount"
          :data="directionAccountLocal"
          :options="directionAccountOptions"
          :loading="isLoading"
        />
      </div>
      <div class="col-12 col-md-6 col-lg-5 col-xl-5 q-gutter-y-sm">
        <!-- <AssignedSingleUser2
          ref="assignedSingleUserRef"
          :moduleId="idAccount"
          :module="'accounts'"
          :withList="true"
          @changeUser="onChangeUserAssigned"
        /> -->
        <ListAssignedUsers :module="'accounts'" :moduleId="idAccount" />

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
                  :disable="!idAccount"
                />
                <q-tab
                  name="historychanges"
                  icon="history"
                  label="Historial"
                  :disable="!idAccount"
                />
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
                  v-if="!!localIdAccount"
                >
                  <ViewComments
                    :idAccount="localIdAccount"
                    :descCRM3="descCRM3"
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
                        <img
                          :src="`${HANSACRM3_URL}/upload/users/${idusuario}`"
                        />
                      </q-avatar>
                    </template>
                  </q-input>
                </q-tab-panel>
                <q-tab-panel name="Relation" class="q-py-sm">
                  <RelatedAccounts
                    ref="relatedAccountsRef"
                    :account-id="idAccount"
                  ></RelatedAccounts>
                </q-tab-panel>
                <q-tab-panel name="historychanges" v-if="idAccount !== null">
                  <ViewChangecontrol :idAccount="idAccount"></ViewChangecontrol>
                </q-tab-panel>
                <q-tab-panel name="historychanges" v-else>
                  <ViewChangecontrol :idAccount="'0'"></ViewChangecontrol>
                </q-tab-panel>
              </q-tab-panels>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </form>
  <ContactDialog ref="contactDialogRef" />
</template>
