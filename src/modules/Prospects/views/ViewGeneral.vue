<script lang="ts">
import { ref, onMounted, computed } from 'vue';
import CardInfo from '../components/Cards/CardInfo.vue';
import ContactCard from 'src/components/MainCard/ContactCard.vue';
import ViewGeneralSkeleton from 'src/components/Skeletons/ViewGeneralSkeleton.vue';
import { useAsyncState } from '@vueuse/core';
import AssignedSingleUser2 from 'src/components/AssignedUsers/AssignedSingleUser2.vue';
import AssignedUser from 'src/components/AssignedUsers/AssignedUser.vue';
import { ProspectService } from '../services/ProspectsService';
import DirectionCard from 'src/components/MainCard/DirectionCard.vue';
import { useFormOptionsStore } from '../../../stores/formOptionsStore';
import { userStore } from 'src/modules/Users/store/UserStore';
import { useProspectStore } from '../store/ProspectStore';
import {
  DirectionComponentModel,
  PhoneModel,
  EmailModel,
} from '../../../components/types/index';
import {
  InfoProspectModel,
  ProspectInfoModel,
  FaiiSubmitModel,
} from '../utils/types';

import ViewComments from '../components/Cards/ViewComments.vue';
import ViewChangecontrol from '../components/Cards/ViewChangecontrol.vue';
//import ViewActivitis from '../components/Cards/ViewActivitis.vue';
import { LegacyPhoneModel } from '../../Accounts/utils/types/index';
import PhoneInput from 'src/components/MainInputs/PhoneInput.vue';
import { QInput } from 'quasar';

// import moment from 'moment';
import ActivitiesComponent from 'src/components/Activities/ActivitiesComponent.vue';
</script>

<script lang="ts" setup>
const props = defineProps<{
  id?: string;
}>();

const emits = defineEmits<{
  (event: 'submitComplete', values: string): void;
  (event: 'submitFail', values: string, options?: FaiiSubmitModel): void;
}>();

// * Store variables
const user = userStore();
const prospectStore = useProspectStore();
const { userCRM } = user;

// * Service variables
const { setUserAssigned } = ProspectService();

/** Const declaration*/

//* Ref declaration
const assignedSingleUserRef = ref();
const infoProspectCardRef = ref<InstanceType<typeof CardInfo> | null>(null);
const phoneMainRef = ref<InstanceType<typeof PhoneInput> | null>(null);
const contactProspectCardRef = ref<InstanceType<typeof ContactCard> | null>(
  null
);
const directionProspectCardRef = ref<InstanceType<typeof DirectionCard> | null>(
  null
);
const commentRef = ref<InstanceType<typeof QInput> | null>();

//* variables
let isRecovering = false;
const selectedProspectData = ref({} as InfoProspectModel);
const phonesProspectData = ref([] as PhoneModel[]);
const emailsProspectData = ref([] as EmailModel[]);
const directionProspectData = ref({} as DirectionComponentModel);
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

const localIdValue = ref(props.id || '');
const commentCreate = ref('');
const tab = ref(props.id ? 'Activities' : 'comentarios');

//* computed variables
const isSomeCardEditing = computed(() =>
  [
    infoProspectCardRef.value?.isEditing,
    contactProspectCardRef.value?.isEditing,
    directionProspectCardRef.value?.isEditing,
  ].some((value) => !!value)
);
const isProspectConverted = ref<boolean>(false);

//* composable variables
const optionsStore = useFormOptionsStore();
const { isLoading, execute } = useAsyncState(async () => {
  await optionsStore.getProspectOptions();
  if (isRecovering) {
    if (!!prospectStore.getDraftProspect) {
      console.log('recovering your values');
      assignValues(prospectStore.getDraftProspect);
      isRecovering = false;
      return;
    }
  }
  if (localIdValue.value) {
    await prospectStore.getProspect(localIdValue.value);
    if (prospectStore.getProspectForm) {
      // TODO Revisar el funcionamiento de este emit, comentado para evitar recargar la pagina al abrir el modulo
      //emits('submitComplete', localIdValue.value);
      isProspectConverted.value =
        prospectStore.getProspectForm.infoData.status === 'Converted';
      assignValues(prospectStore.getProspectForm);
    }
  }
}, null);

//* Methods
const assignValues = (values: ProspectInfoModel, inherited = false) => {
  console.log('assigning this:', values);
  selectedProspectData.value = values.infoData;
  mainPhone.value = values.mainPhone;
  officePhone.value = values.officePhone;
  phonesProspectData.value = values.phones;
  emailsProspectData.value = values.emails;
  directionProspectData.value = values.directionData;
  if (isRecovering) {
    commentCreate.value = values.comment || '';
    //assignedUserId
  }
};

const validateInputs = async (): Promise<boolean> => {
  const validCards: (boolean | undefined)[] = [];
  if (infoProspectCardRef.value?.isEditing) {
    const infoCardState = await infoProspectCardRef.value?.validateCard();
    validCards.push(infoCardState);
  }
  if (contactProspectCardRef.value?.isEditing) {
    const phoneMainValidState = await phoneMainRef.value?.validatePhone();
    validCards.push(phoneMainValidState);
  }
  if (!localIdValue.value) {
    const commentValidState = await commentRef.value?.validate();
    validCards.push(commentValidState);
  }

  return validCards.every((value) => !!value);
};

const createRequestBody = (mode: 'create' | 'update') => {
  const idUsuario = userCRM;
  const directionValues = directionProspectCardRef.value?.captureCurrentData();
  const crm3Address = prospectStore.getCRM3Direction;
  const formattedAddress = directionValues?.address_street_generated_c
    .replace('_gnrtd', '')
    .replaceAll(',|', '');
  const plainAddress =
    !!crm3Address && !formattedAddress ? crm3Address : formattedAddress;

  const basicBody = {
    attributes: {
      ...(infoProspectCardRef.value?.captureCurrentData() || {}),
      phone_mobile: mainPhone.value.phone,
      phone_mobile_wp_c: mainPhone.value.whatsapp,
      phone_mobile_cd_c: mainPhone.value.code,
      phone_work: officePhone.value.phone,
      phone_work_wp_c: officePhone.value.whatsapp,
      phone_work_cd_c: officePhone.value.code,
      assigned_user_id: assignedSingleUserRef.value?.dataSend.assigned_user_id,
      modified_user_id: idUsuario.id,
      address_street_generated_c:
        directionValues?.address_street_generated_c || '',
      jjwg_maps_lat_c: directionValues?.latitude || 0,
      jjwg_maps_lng_c: directionValues?.longitude || 0,
      primary_address_street: plainAddress,
      alt_address_street: plainAddress,
    },
    attributes_phones: {
      items:
        contactProspectCardRef.value?.captureCurrentData().phones.newPhones ||
        [],
    },
    attributes_emails: {
      items:
        contactProspectCardRef.value?.captureCurrentData().emails.newEmails ||
        [],
    },
  };

  if (mode === 'create') {
    return {
      attributes: {
        ...basicBody.attributes,
        created_by: idUsuario.id,
        description: commentCreate.value,
      },
      attributes_phones: basicBody.attributes_phones,
      attributes_emails: basicBody.attributes_emails,
      attributes_comment: {
        bean_module: 'Prospects',
        bean_id: '',
        created_by: idUsuario.id,
        visualizacion_c: 'interno',
        relevance: 'medium',
        description: commentCreate.value,
      },
    };
  }

  return {
    attributes: basicBody.attributes,
    attributes_phones: basicBody.attributes_phones,
    attributes_emails: basicBody.attributes_emails,
  };
};

const onSubmit = async () => {
  const validFields = await validateInputs();
  if (!validFields) {
    emits('submitFail', 'Por favor llene los campos obligatorios');
    return;
  }
  if (!!localIdValue.value) {
    const body = createRequestBody('update');
    if (contactProspectCardRef.value?.isEditing) {
      const { phones, emails } =
        contactProspectCardRef.value?.captureCurrentData();
      await prospectStore.updateProspect(localIdValue.value, body, {
        idUser: userCRM.id,
        phones,
        emails,
      });
      await execute();
      emits('submitComplete', localIdValue.value);
      return;
    }
    await prospectStore.updateProspect(localIdValue.value, body);
    await execute();
    emits('submitComplete', localIdValue.value);
  } else {
    try {
      const body = createRequestBody('create');
      await prospectStore.createProspect(body);
      localIdValue.value = prospectStore.getSelectedProspectId;
      await execute();
      emits('submitComplete', localIdValue.value);
    } catch (e) {
      emits('submitFail', 'Ha ocurrido un error al guardar el prospecto', {
        messageAction1: 'Reintentar',
        // messageAction2: 'Guardar Borrador',
        action: () => onSubmit(),
        // action2: () => console.log('guardar borrador'),
      });
    }
  }
};

/** Methods */
const onChangeUserAssigned = async (id: string) => {
  await setUserAssigned(localIdValue.value, id);
  emits('submitComplete', localIdValue.value);
};

const captureDraft = () => {
  const body = createRequestBody('create');
  console.log(JSON.stringify(body));
  prospectStore.createDraft(body);
};

const recoverDraft = () => {
  console.log('recovering...', prospectStore.getDraftProspect);
  isRecovering = true;
  execute();
};

const restorePhoneData = () => {
  mainPhone.value = prospectStore.getProspectForm?.mainPhone || {
    code: '+591',
    phone: '',
    whatsapp: '0',
  };
  officePhone.value = prospectStore.getProspectForm?.officePhone || {
    code: '+591',
    phone: '',
    whatsapp: '0',
  };
};

/** LifeCicle methods */
onMounted(async () => {
  console.log('hola');
});

defineExpose({
  onSubmit,
  execute,
  isSomeCardEditing,
  isLoading,
});
</script>

<template>
  <div v-if="isLoading">
    <ViewGeneralSkeleton />
  </div>
  <div v-else>
    <div class="row q-pt-md" :class="[$q.screen.gt.xs ? 'q-col-gutter-lg' : '']">
      <div class="col-12 col-md-6">
        <div class="row q-gutter-md">
          <!-- <q-btn
            color="primary"
            icon="check"
            label="OK"
            @click="captureDraft"
          />
          <q-btn
            v-if="!id && !!prospectStore.getDraftProspect"
            color="orange"
            icon="backup"
            label="Recuperar"
            @click="recoverDraft"
          /> -->
          <CardInfo
            :id-local="localIdValue"
            :data="selectedProspectData"
            ref="infoProspectCardRef"
            class="col-12"
            :style="{ width: $q.screen.lt.sm ? 'fit-content' : '' }"
            :readonly="isProspectConverted"
          />
          <contact-card-component
            ref="contactProspectCardRef"
            class="col-12"
            :id-local="localIdValue"
            :phones="phonesProspectData"
            :emails="emailsProspectData"
            :style="{ width: $q.screen.lt.sm ? '-webkit-fill-available' : '' }"
            :readonly="isProspectConverted"
            @cancel-change="restorePhoneData"
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
                    <q-icon
                      v-else
                      color="blue-10"
                      name="local_phone"
                      size="sm"
                    />
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
                    <q-icon
                      v-else
                      color="blue-10"
                      name="local_phone"
                      size="sm"
                    />
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
            ref="directionProspectCardRef"
            class="col-12"
            :id-local="localIdValue"
            :data="directionProspectData"
            :directionCRM3="prospectStore.getCRM3Direction"
            :options="[]"
            :style="{ width: $q.screen.lt.sm ? '-webkit-fill-available' : '' }"
            :readonly="isProspectConverted"
          />
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6">
        <AssignedSingleUser2
          ref="assignedSingleUserRef"
          :module="'leads'"
          :module-id="localIdValue"
          @changeUser="onChangeUserAssigned"
        />
        <!-- <AssignedUser ref="assignedUserRef" module="leads" :module-id="localIdValue" /> -->

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
                <q-tab
                  name="Activities"
                  icon="person"
                  label="Actividades"
                  :disable="!localIdValue"
                />
                <q-tab name="comentarios" icon="comment" label="Comentarios" />

                <q-tab
                  name="historychanges"
                  icon="history"
                  label="Historial"
                  :disable="!localIdValue"
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
                    :id="id"
                    :descCRM3="prospectStore.getDescription"
                  ></ViewComments>
                </q-tab-panel>
                <q-tab-panel
                  name="comentarios"
                  style="min-height: 500px"
                  class="q-pd-sm"
                  v-else
                >
                  <ViewComments
                    v-if="localIdValue"
                    :desc-c-r-m3="selectedProspectData.description || ''"
                    ref="commentsRef"
                    :id="'0'"
                  ></ViewComments>
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
                    <template v-slot:before> </template>
                  </q-input>
                </q-tab-panel>
                <q-tab-panel name="Activities">
                  <ActivitiesComponent
                    :id="localIdValue"
                    :idUser="userCRM.id"
                    module="Leads"
                    :emails="emailsProspectData"
                    :nameReg="selectedProspectData.first_name"
                  ></ActivitiesComponent>
                </q-tab-panel>
                <q-tab-panel name="historychanges" v-if="id !== null">
                  <ViewChangecontrol :id="localIdValue"></ViewChangecontrol>
                </q-tab-panel>
                <q-tab-panel name="historychanges" v-else>
                  <ViewChangecontrol :id="'0'"></ViewChangecontrol>
                </q-tab-panel>
              </q-tab-panels>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>
