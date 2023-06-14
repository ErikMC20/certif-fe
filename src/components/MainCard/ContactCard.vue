<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import type ViewCardVue from 'src/components/MainCard/ViewCard.vue';
import {
  EmailExternalModel,
  EmailModel,
  PhoneModel,
  CountryOptions,
} from '../types';
import { useAsyncState } from '@vueuse/core';
import { axios_LB_05 } from 'src/conections/axiosCRM';
import PhoneInputAlt from '../MainInputs/PhoneInputAlt.vue';
import EmailInput from '../MainInputs/EmailInput.vue';

const props = withDefaults(
  defineProps<{
    idLocal?: string;
    phones: PhoneModel[];
    emails: EmailModel[];
    module?: 'accounts' | 'contacts';
  }>(),
  {
    module: 'accounts',
  }
);

const { state: countries } = useAsyncState(
  axios_LB_05
    .get('/lang-es-cod-paises-lists')
    .then((response) => response.data),
  [] as CountryOptions[]
);

//* variables
const localIdAccount = ref(props.idLocal || '');
const localPhones = ref([] as PhoneModel[]);
const localEmails = ref([] as EmailModel[]);

const localPhonesCurrent = ref([] as PhoneModel[]);
const localEmailsCurrent = ref([] as EmailExternalModel[]);

//* references
const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>(null);
const emailsGeneratorRef = ref<InstanceType<typeof EmailInput> | null>(null);
const phoneGeneratorRef = ref<InstanceType<typeof PhoneInputAlt> | null>(null);

//* computed variables
const isEditing = computed(() => {
  return baseCardRef.value?.isEditing === 'edit';
});

//* methods
const constructorComp = (
  phones?: PhoneModel[],
  emails?: EmailModel[],
  id?: string
) => {
  if (id) {
    localIdAccount.value = id;

    baseCardRef.value?.changeStatusTo('read');
  }
  if (phones) localPhones.value = phones;
  if (emails) localEmails.value = emails;
  restoreData();
};

const restoreData = () => {
  localPhonesCurrent.value = localPhones.value;
  localEmailsCurrent.value = localEmails.value;

  phoneGeneratorRef.value?.constructorComp(localPhonesCurrent.value);
  emailsGeneratorRef.value?.constructorComp(localEmailsCurrent.value);
};

const captureCurrentData = () => {
  return {
    phones: {
      newPhones: phoneGeneratorRef.value?.captureNewPhones(),
      currentPhones: phoneGeneratorRef.value?.capturePhones(),
      deletedPhones: phoneGeneratorRef.value?.captureDeletedPhones(),
      activePhones: phoneGeneratorRef.value?.captureActivePhones(),
    },
    emails: {
      newEmails: emailsGeneratorRef.value?.captureNewEmails(),
      currentEmails: emailsGeneratorRef.value?.captureEmails(),
      deletedEmails: emailsGeneratorRef.value?.captureDeletedEmails(),
    },
  };
};

const captureCurrentPhone = () => {
  //const value = contactGeneratorRef.value?.captureLocal();
  return {};
};

const captureCurrentEmail = () => {
  // const currentEmail = emailsGeneratorRef.value?.captureCurrentEmail();
  // if (!currentEmail) return [];
  // return [currentEmail];
};

const resetContactInput = () => {
  // contactGeneratorRef.value?.resetLocalValue();
};

const validateCurrentContact = async () => {
  // return contactGeneratorRef.value?.validatePhone();
};

const cancelChanges = () => {
  baseCardRef.value?.onClickCancel();
};

//* initial function
onMounted(() => {
  constructorComp(props.phones, props.emails, props.idLocal);
});
defineExpose({
  isEditing,
  cancelChanges,
  captureCurrentPhone,
  captureCurrentEmail,
  constructorComp,
  captureCurrentData,
  resetContactInput,
  validateCurrentContact,
});
</script>

<template>
  <view-card-component
    icon-name="edit_note"
    title="Teléfonos y Correos"
    ref="baseCardRef"
    :controls="!!idLocal"
    :initial-status="!!idLocal ? 'read' : 'edit'"
  >
    <template #edit>
      <div><slot name="contactHeadEdit" :countries="countries"></slot></div>
      <PhoneInputAlt
        ref="phoneGeneratorRef"
        :phones="localPhonesCurrent"
        :options="countries"
        :local-id="localIdAccount"
      />
      <q-separator class="q-mt-md" />
      <EmailInput
        ref="emailsGeneratorRef"
        :emails="localEmailsCurrent"
        :local-id="localIdAccount"
      />
    </template>
    <template #read>
      <div><slot name="contactHeadRead" :countries="countries"></slot></div>
      <div>
        <q-expansion-item
          v-if="localPhones.length > 0"
          expand-separator
          icon="contacts"
          label="Otros Telefonos"
          color="primary"
          header-class="text-primary"
        >
          <template #header>
            <q-item-label header style="font-weight: normal">
              <q-icon name="local_phone" color="primary" size="xs" />
              Otros teléfonos
            </q-item-label>
          </template>
          <q-list
            v-for="(item, index) in localPhones"
            :key="index"
            padding
            class="q-py-md"
          >
            <q-item>
              <q-item-section avatar>
                <q-icon
                  v-if="item.whatsapp === '1'"
                  color="positive"
                  name="whatsapp"
                  size="sm"
                />
                <q-icon v-else color="blue-10" name="local_phone" size="sm" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{
                  `${item.country_code || ''} ${item.phone}`
                }}</q-item-label>
                <q-item-label caption lines="2">Otros Teléfonos</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </div>
      <div>
        <q-item-label header style="font-weight: normal">
          <q-icon name="contact_mail" color="primary" size="xs" /> Correos del
          cliente
        </q-item-label>
        <q-item v-if="localEmails.length === 0">
          <q-item-section top avatar>
            <q-avatar color="primary" text-color="white" icon="mail" />
          </q-item-section>
          <q-item-section>
            <q-item-label>No existen correos disponibles</q-item-label>
          </q-item-section>
        </q-item>
        <q-list
          v-else
          v-for="(item, index) in localEmails"
          :key="index"
          padding
          class="q-py-md"
        >
          <q-item>
            <q-item-section avatar>
              <q-icon color="blue-10" name="alternate_email" size="sm" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ `${item.email_address || ''}` }}</q-item-label>
              <q-item-label caption lines="2"
                >Correo
                <q-chip
                  v-if="!!item.primary_item"
                  dense
                  size="sm"
                  color="primary"
                  text-color="white"
                  icon="person"
                >
                  Principal
                </q-chip></q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </template>
  </view-card-component>
</template>
