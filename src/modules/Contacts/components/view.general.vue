<script lang="ts">
export default {
  name: 'ViewGeneral',
};
import { onMounted, ref, computed } from 'vue';
import {
  DetailContactModel,
  ContactGeneralModel,
  PhoneContactModel,
  EmailContactModel,
  DirectionContactComponentModel,
} from '../utils/types/index';

// *COMPONENTS
import DirectionContactCard from 'src/components/MainCard/DirectionCard.vue';
import DataContactCard from 'src/components/MainCard/ContactCard.vue';
import { assignedUserService } from '../services/ContactAssignedUserService';

import InfoContactCard from './Cards/InfoContactCard.vue';
import ViewComments from './Cards/ViewComments.vue';
import ViewChangecontrol from './Cards/ViewChangecontrol.vue';
// *STORE
import { userStore } from 'src/modules/Users/store/UserStore';
// *COMPOSABLES
import { useAsyncState } from '@vueuse/core';
// *SERVICES
import services from '../services/ContactEventService';
</script>

<script setup lang="ts">
import ContactRelations from './Relations/ContactRelations.vue';
import AssignedSingleUser2 from 'src/components/AssignedUsers/AssignedSingleUser2.vue';
import moment from 'moment';
import { QInput } from 'quasar';
import PhoneInput from 'src/components/MainInputs/PhoneInput.vue';
import { LegacyPhoneModel } from '../../Accounts/utils/types/index';
import { PhoneModel, EmailModel } from '../../../components/types/index';
import { axios_LB_01 } from 'src/conections/axiosCRM';

const props = withDefaults(
  defineProps<{
    id?: string;
    data?: ContactGeneralModel;
    fromConversion?: boolean;
  }>(),
  {
    id: '',
    fromConversion: false,
  }
);

const emits = defineEmits<{
  (event: 'submittingForm', values: string, closeAfterSave?: boolean): void;
  (event: 'submitFail'): void;
  (event: 'exposeData', values: object): void;
  (event: 'disableCloseDialog'): void;
}>();

//* composable values
const { userCRM } = userStore();
const { addUserAssigned } = assignedUserService();

//* request services
const {
  state,
  isLoading,
  execute: execDataService,
} = useAsyncState(
  (
    service: 'create' | 'read' | 'update' | 'delete',
    id?: string,
    body?: object
  ) => {
    if (service === 'create') {
      if (body) return services.createContact(body);
    }
    if (service === 'read') {
      if (id) {
        return services.readContact(id);
      }
    }
    if (service === 'update') {
      if (id && body) return services.updateContact(id, body);
    }
    if (service === 'delete') {
      if (id) return services.deleteContact(id);
    }
  },
  {} as ContactGeneralModel,
  {
    immediate: false,
    resetOnExecute: false,
  }
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

const descCRM3 = ref('');

//* Variables: Global Data
const currentContact = ref({} as ContactGeneralModel);
const commentCreate = ref('');
const tab = ref('comentarios');
const localIdContact = ref('');
const closeAfterSave = ref(props.data?.info_contact?.detail_contact?.inherited);

//* Variables: Data divided in parts
const infoCardDataLocal = ref({} as DetailContactModel);
const phonesContactLocal = ref([] as PhoneContactModel[]);
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
const emailsContactLocal = ref([] as EmailContactModel[]);
const directionContactLocal = ref({} as DirectionContactComponentModel);
const assignedUserId = ref(
  props.data?.info_contact?.detail_contact?.assigned_user_id || ''
);
const directionCRM3 = ref('');

//* references
const infoContactCardRef = ref<InstanceType<typeof InfoContactCard> | null>(
  null
);
const dataContactCardRef = ref<InstanceType<typeof DataContactCard> | null>(
  null
);
const directionContactCardRef = ref<InstanceType<
  typeof DirectionContactCard
> | null>(null);
const assignedSingleUserRef = ref<InstanceType<
  typeof AssignedSingleUser2
> | null>(null);
const commentRef = ref<InstanceType<typeof QInput> | null>(null);
const phoneMainRef = ref<InstanceType<typeof PhoneInput> | null>(null);
const phoneOfficeRef = ref<InstanceType<typeof PhoneInput> | null>(null);

//* Computed variables
const isSomeCardEditing = computed(() => {
  return [
    infoContactCardRef.value?.isEditing,
    dataContactCardRef.value?.isEditing,
    directionContactCardRef.value?.isEditing,
  ].some((value) => value);
});

//* Methods
const updateAssignedUserId = (id: string) => {
  assignedUserId.value = id;
};
const validateCards = async (skipFields = false) => {
  const validInfoCard = await infoContactCardRef.value?.validateFields();
  const validComment = await commentRef.value?.validate();

  const validFields: (boolean | undefined)[] = [];

  if (infoContactCardRef.value?.isEditing) {
    validFields.push(validInfoCard);
  }

  if (dataContactCardRef.value?.isEditing) {
    const isMainPhonevalid = await phoneMainRef.value?.validatePhone();
    validFields.push(isMainPhonevalid);
  }

  if (!localIdContact.value) validFields.push(validComment);

  return validFields.every((val) => !!val);
};

/**
 * This method assign the current values to cards
 * @param data General Data content
 */
const assignValues = (data: ContactGeneralModel): void => {
  console.log('assigning this', data.phone_email_contact);
  infoCardDataLocal.value = data.info_contact
    .detail_contact as DetailContactModel;
  mainPhone.value.phone = data.phone_email_contact.phone_mobile;
  mainPhone.value.code = data.phone_email_contact.phone_mobile_cd_c;
  mainPhone.value.whatsapp = data.phone_email_contact.phone_mobile_wp_c;
  officePhone.value.phone = data.phone_email_contact.phone_work;
  officePhone.value.code = data.phone_email_contact.phone_work_cd_c;
  officePhone.value.whatsapp = data.phone_email_contact.phone_work_wp_c;
  console.log(mainPhone.value);
  console.log(officePhone.value);
  phonesContactLocal.value = data.phone_email_contact.phones;
  emailsContactLocal.value = data.phone_email_contact.emails;
  directionContactLocal.value = {
    address_street_generated_c:
      data.info_contact.direction_contact.address_street_generated_c,
    latitude: data.info_contact.direction_contact.jjwg_maps_lat_c,
    longitude: data.info_contact.direction_contact.jjwg_maps_lng_c,
  };
  console.log(
    'old direction',
    data.info_contact.direction_contact.primary_address_street
  );
  directionCRM3.value =
    data.info_contact.direction_contact.primary_address_street || '';

  emits('exposeData', {
    name:
      data.info_contact.detail_contact.first_name +
      ' ' +
      data.info_contact.detail_contact.last_name,
    ci: data.info_contact.detail_contact.ci_c,
  });

  infoContactCardRef.value?.constructorComp(
    infoCardDataLocal.value,
    infoCardDataLocal.value.id
  );

  dataContactCardRef.value?.constructorComp(
    phonesContactLocal.value,
    emailsContactLocal.value,
    infoCardDataLocal.value.id
  );

  directionContactCardRef.value?.constructorComp(
    directionContactLocal.value,
    infoCardDataLocal.value.id
  );

  if (data.info_contact.detail_contact.inherited) {
    // assign values to inputs
    mainPhone.value = {
      code: data.phone_email_contact.phone_mobile_cd_c,
      phone: data.phone_email_contact.phone_mobile,
      whatsapp: data.phone_email_contact.phone_mobile_wp_c,
    };

    officePhone.value = {
      code: data.phone_email_contact.phone_work_cd_c,
      phone: data.phone_email_contact.phone_work,
      whatsapp: data.phone_email_contact.phone_work_wp_c,
    };
    // phoneMainRef.value?.assignValues(
    //   {
    //     code: data.phone_email_contact.phone_mobile_cd_c,
    //     phone: data.phone_email_contact.phone_mobile,
    //     whatsapp: data.phone_email_contact.phone_mobile_wp_c,
    //   },
    //   true
    // );
    // phoneOfficeRef.value?.assignValues(
    //   {
    //     code: data.phone_email_contact.phone_mobile_cd_c,
    //     phone: data.phone_email_contact.phone_work,
    //     whatsapp: data.phone_email_contact.phone_mobile_wp_c,
    //   },
    //   true
    // );
  }

  if (data.comments?.description) {
    commentCreate.value = data.comments.description;
  }
};

const createPayload = (typePayload: 'create' | 'update') => {
  const { id: idUsuario } = userCRM;
  console.log(
    'usuario asignado heredado: ',
    props.data?.info_contact?.detail_contact?.assigned_user_id
  );
  const detailInfo = infoContactCardRef.value?.captureCurrentData();
  const contactInfo =
    dataContactCardRef.value
      ?.captureCurrentData()
      .phones.activePhones?.map((phone) => phone.phone) || [];

  if (detailInfo) {
    const crm3Address = directionCRM3.value;
    const formattedAddress = directionContactCardRef.value
      ?.captureCurrentData()
      .address_street_generated_c.replace('_gnrtd', '')
      .replaceAll(',|', '');
    const plainAddress =
      !!crm3Address && !formattedAddress ? crm3Address : formattedAddress;


    const payloadBase = {
      info_contact: {
        detail_contact: {
          ...detailInfo,
          birthdate: detailInfo.birthdate
            ? moment(detailInfo.birthdate, 'DD-MM-YYYY').format('YYYY-MM-DD')
            : '',
          modified_user_id: idUsuario,
          assigned_user_id: assignedUserId.value,
          phone_mobile: mainPhone.value.phone || '',
          phone_mobile_wp_c: mainPhone.value.whatsapp || '',
          phone_mobile_cd_c: mainPhone.value.code || '',
          phone_work: officePhone.value.phone || '',
          phone_work_wp_c: officePhone.value.whatsapp || '',
          phone_work_cd_c: officePhone.value.code || '',
          // phone_fax: contactInfo.join(' - ') || '',
        },
        direction_contact: {
          address_street_generated_c:
            directionContactCardRef.value?.captureCurrentData()
              .address_street_generated_c,
          primary_address_street: plainAddress,
          jjwg_maps_lat_c:
            directionContactCardRef.value?.captureCurrentData().latitude,
          jjwg_maps_lng_c:
            directionContactCardRef.value?.captureCurrentData().longitude,
          jjwg_maps_address_c: plainAddress,
        },
      },
    };

    if (typePayload === 'create') {
      const payloadToSend = {
        ...payloadBase,
        phone_email_contact: {
          phones:
            dataContactCardRef.value?.captureCurrentData().phones.newPhones ||
            [],
          emails:
            dataContactCardRef.value?.captureCurrentData().emails.newEmails ||
            [],
        },
        comments: {
          module: 'Contacts',
          idmodule: null,
          visualizacion_c: 'interno',
          description: commentCreate.value,
          relevance: 'medium',
          modulecoments: 'HANPC_Comentarios',
          id_user: idUsuario,
        },
      };
      payloadToSend.info_contact.detail_contact.created_by = idUsuario;
      return payloadToSend;
    } else {
      return {
        ...payloadBase,
      };
    }
  }
};

const createBodyContact = (phones?: PhoneModel[], emails?: EmailModel[]) => ({
  idUser: userCRM.id || '',
  emails: emails || [],
  phones: phones || [],
});

const onSubmit = async (skipFields = false) => {
  const validCards = await validateCards(skipFields && !!localIdContact.value);
  if (validCards) {
    if (!!localIdContact.value) {
      const payload = createPayload('update');
      if (dataContactCardRef.value?.isEditing) {
        const { phones, emails } =
          dataContactCardRef.value.captureCurrentData();
        const bodyContact = createBodyContact(
          phones.currentPhones,
          emails.currentEmails
        );
        const bodyContactDeleted = createBodyContact(
          phones.deletedPhones,
          emails.deletedEmails
        );
        const bodyContactNew = createBodyContact(
          phones.newPhones,
          emails.newEmails
        );
        await executeContactService(
          0,
          'create',
          'contacts',
          localIdContact.value,
          bodyContactNew
        );

        await executeContactService(
          0,
          'update',
          'contacts',
          localIdContact.value,
          bodyContact
        );

        await executeContactService(
          0,
          'delete',
          'contacts',
          localIdContact.value,
          bodyContactDeleted
        );
      }

      await execDataService(0, 'update', localIdContact.value, payload);
      currentContact.value = state.value;
      assignValues(currentContact.value);
      emits('submittingForm', localIdContact.value);
    } else {
      const payload = createPayload('create');
      console.log('hello...', payload);
      if (payload?.info_contact.detail_contact.inherited) {
        delete payload.info_contact.detail_contact.inherited;
        delete payload.info_contact.detail_contact.inherited_module;
      }

      await execDataService(0, 'create', undefined, payload);
      localIdContact.value = state.value.info_contact?.detail_contact?.id;
      currentContact.value = state.value;
      assignValues(currentContact.value);
      if (state.value.info_contact.detail_contact.id)
        emits(
          'submittingForm',
          state.value.info_contact.detail_contact.id,
          closeAfterSave.value
        );
    }
  } else {
    emits('submitFail');
  }
};

const onReset = () => {
  console.log('resetting');
};

const setAccountId = (userId: string) => {
  infoContactCardRef.value?.setAccountId(userId);
};

const constructorComp = async (id?: string, data?: ContactGeneralModel) => {
  if (data && Object.values(data).length > 0) {
    currentContact.value = data;
    console.log(currentContact.value);
    assignValues(currentContact.value);
    if (props.fromConversion) return;
    emits('disableCloseDialog');
    return;
  }
  if (id) {
    localIdContact.value = id;
    await execDataService(0, 'read', localIdContact.value);
    if (state.value) {
      currentContact.value = state.value;
      descCRM3.value =
        currentContact.value.info_contact.detail_contact.description;

      assignValues(currentContact.value);
    }
  }
};

//* initial function
onMounted(async () => {
  await constructorComp(props.id, props.data);
});

const onChangeUserAssigned = async (id: string) => {
  await addUserAssigned(props.id, id, userCRM.id);
  emits('submittingForm', localIdContact.value);
};

const cancelChanges = () => {
  if (infoContactCardRef.value?.isEditing)
    infoContactCardRef.value.cancelChanges();
  if (dataContactCardRef.value?.isEditing)
    dataContactCardRef.value.cancelChanges();
  if (directionContactCardRef.value?.isEditing) {
    directionContactCardRef.value.cancelChanges();
  }
};

defineExpose({
  isSomeCardEditing,
  onSubmit,
  assignValues,
  setAccountId,
  cancelChanges,
});
</script>

<template>
  <form @submit.prevent.stop="onSubmit" @reset.prevent.stop="onReset">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6 col-lg-7 col-xl-7 q-gutter-y-md">
        <InfoContactCard
          ref="infoContactCardRef"
          :id-local="localIdContact"
          :initial-data-contact="infoCardDataLocal"
          :loading="isLoading"
        />
        <contact-card-component
          ref="dataContactCardRef"
          :id-local="id"
          :phones="phonesContactLocal"
          :emails="emailsContactLocal"
          :loading="isLoading"
          module="contacts"
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
              :local-id="id"
              title="Teléfono Principal"
              description="Teléfono Principal"
            />
            <PhoneInput
              ref="phoneOfficeRef"
              v-model="officePhone"
              :options="countries"
              :local-id="id"
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

        <br />
        <direction-card-component
          ref="directionContactCardRef"
          :id-local="id"
          :data="directionContactLocal"
          :options="[]"
          :directionCRM3="directionCRM3"
          :loading="isLoading"
        />
        <!-- </div> -->
      </div>
      <div class="col-12 col-md-6 col-lg-5 col-xl-5 q-gutter-y-sm">
        <AssignedSingleUser2
          ref="assignedSingleUserRef"
          :module="
            data?.info_contact?.detail_contact?.inherited_module || 'contacts'
          "
          :moduleId="data?.info_contact?.detail_contact?.account_id || id"
          @changeUser="onChangeUserAssigned"
          @new-assigned-id="updateAssignedUserId"
          :default-user-id="data?.info_contact?.detail_contact.assigned_user_id"
        />
        <q-separator inset></q-separator>

        <div class="q-gutter-y-md">
          <q-card>
            <q-card-section style="padding: 0px">
              <!--TODO: AQUI SE NECESITA CORREGIR EL XQ NO DA LO RESPONSIVO -->

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
                  name="relations"
                  icon="person"
                  label="Cuentas"
                  :disable="!localIdContact"
                />
                <q-tab
                  name="historychanges"
                  icon="history"
                  label="Historial"
                  :disable="!localIdContact"
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
                  v-if="!!id"
                >
                  <ViewComments
                    :idContacts="id"
                    :descCRM3="descCRM3"
                  ></ViewComments>
                </q-tab-panel>
                <q-tab-panel
                  name="comentarios"
                  style="min-height: 500px"
                  class="q-pd-sm"
                  v-else
                >
                  <!--<ViewComments v-if="props.id" ref="commentsRef" :id="'0'"></ViewComments> -->
                  <q-input
                    autogrow
                    outlined
                    bottom-slots
                    v-model="commentCreate"
                    placeholder="Escriba su comentario"
                    dense
                    color="primary"
                    ref="commentRef"
                    :rules="[(val) => !!val || 'El campo es requerido']"
                  >
                    <template v-slot:before>
                      <q-avatar>
                        <img :src="services.readImageUser" />
                      </q-avatar>
                    </template>
                  </q-input>
                </q-tab-panel>
                <q-tab-panel name="relations">
                  <ContactRelations :account-id="id" />
                </q-tab-panel>
                <q-tab-panel name="historychanges" v-if="id !== null">
                  <ViewChangecontrol :idContacts="id"></ViewChangecontrol>
                </q-tab-panel>
                <q-tab-panel name="historychanges" v-else>
                  <ViewChangecontrol :idContacts="'0'"></ViewChangecontrol>
                </q-tab-panel>
              </q-tab-panels>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </form>
</template>
