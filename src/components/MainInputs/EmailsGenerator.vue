<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { QInput, QPopupEdit, QExpansionItem, useQuasar } from 'quasar';
import { EmailExternalModel, EmailLocalModel, RowTableModel } from '../types';
import { useIdGenerator } from '../../composables/General/generator';
import { readRepeatedEmailsPhones } from 'src/services/InputServices';
import { useAsyncState, useClipboard } from '@vueuse/core';
import { axios_LB_01 } from 'src/conections/axiosCRM';
import { userStore } from 'src/modules/Users/store/UserStore';
import { Country } from '../types/index';

const props = withDefaults(
  defineProps<{
    modelValue: EmailExternalModel[];
    currentId: string;
    module?: 'accounts' | 'contacts';
  }>(),
  {
    currentId: '',
    module: 'accounts',
  }
);
const emits = defineEmits<{
  (event: 'update:modelValue', values: EmailExternalModel[]): void;
}>();

const { generateLocalId } = useIdGenerator();
const $q = useQuasar();
const { copy } = useClipboard();
const { state, isLoading, execute } = useAsyncState(
  (
    service: string,
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
  { data: { phones: [], emails: [] } },
  { immediate: false, resetOnExecute: false }
);

const emailInput = ref<InstanceType<typeof QInput> | null>(null);
const emailEditRef = ref<InstanceType<typeof QPopupEdit> | null>(null);
const expansionItemRef = ref<InstanceType<typeof QExpansionItem> | null>(null);

const currentEmail = ref({
  email_address: '',
  primary_address: false,
} as EmailLocalModel);

const currentEmailEdit = ref({
  email_address: '',
  primary_address: false,
} as EmailLocalModel);

const accountEmails = ref([] as EmailLocalModel[]);

const isValidEmail = (val: string) => {
  const emailPattern =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return emailPattern.test(val) || 'El email no es valido';
};

const resetValues = () => {
  currentEmail.value = {
    email_address: '',
    primary_address: false,
  } as EmailLocalModel;
  setTimeout(() => {
    emailInput.value?.resetValidation();
  }, 100);
};

const convertExternal = (email: EmailLocalModel): EmailExternalModel => ({
  id: email.isLocal ? '' : email.id ? email.id : '',
  email_address: email.email_address,
  primary_item: email.primary_address,
});

const converToExternal = (emails: EmailLocalModel[]): EmailExternalModel[] => {
  return emails.map((value) => convertExternal(value));
};

const convertToLocal = (emails: EmailExternalModel[]): EmailLocalModel[] => {
  return emails.map((value) => {
    return {
      id: value.id || generateLocalId(),
      email_address: value.email || value.email_address,
      primary_address: value.primary_item,
      isLocal: false,
    };
  });
};

const updateToParent = (emails: EmailLocalModel[]) => {
  emits('update:modelValue', converToExternal(emails));
};

const makePrincipal = (id: string) => {
  accountEmails.value = accountEmails.value.map((email) => {
    if (email.id !== id) {
      return {
        ...email,
        primary_address: false,
      };
    }
    return email;
  });
};

const createLocalEmail = (val: EmailLocalModel) => {
  const idGenerated = generateLocalId();
  accountEmails.value.push({
    id: idGenerated,
    email_address: val.email_address,
    primary_address: val.primary_address,
    isLocal: true,
  });
  if (val.primary_address) makePrincipal(idGenerated);
  resetValues();
  updateToParent(accountEmails.value);
};

const readEmail = (id: string | undefined) => {
  if (id) {
    const value = accountEmails.value.find((val) => val.id === id);
    if (value)
      currentEmailEdit.value = {
        id,
        email_address: value.email_address,
        primary_address: value.primary_address,
        isLocal: value.isLocal,
      };
    expansionItemRef.value?.hide();
  }
};

const readEmails = async () => {
  await execute(0, 'read', props.module, props.currentId);
  accountEmails.value = convertToLocal(state.value.data.emails);
};

const updateEmail = (id: string | undefined) => {
  if (id) {
    accountEmails.value = accountEmails.value.map((v) => {
      if (v.id === id) {
        return {
          ...v,
          email_address: currentEmailEdit.value.email_address,
          primary_address: currentEmailEdit.value.primary_address,
        };
      }
      return v;
    });
    if (currentEmailEdit.value.primary_address) makePrincipal(id);
    resetValues();
    updateToParent(accountEmails.value);
  }
};

const deleteEmail = async (id: string | undefined) => {
  if (props.currentId) {
    const deleteEmail = accountEmails.value.find((email) => email.id === id);
    if (deleteEmail) {
      await execute(
        0,
        'delete',
        props.module,
        props.currentId,
        bodyBase([convertExternal(deleteEmail)])
      );
      await readEmails();
      return;
    }
  }
  if (id) {
    accountEmails.value = accountEmails.value.filter((val) => val.id !== id);
    updateToParent(accountEmails.value);
  }
};

const bodyBase = (
  emails = [] as EmailExternalModel[],
  phones = [] as Country[]
) => {
  const { userCRM } = userStore();
  const idUser = userCRM.id;
  return {
    idUser,
    emails,
    phones,
  };
};

const copyToClipboard = (val: string) => {
  copy(val);
  $q.notify('Se ha copiado el correo al portapapeles');
};

const onSubmit = async () => {
  if (props.currentId) {
    const bodyToSend = bodyBase([convertExternal(currentEmail.value)]);

    await execute(0, 'create', props.module, props.currentId, bodyToSend);
    await readEmails();
    updateToParent(accountEmails.value);
    resetValues();
    return;
  }
  createLocalEmail(currentEmail.value);
};

const otherPrincipals = (id: string) => {
  const otherPrincipals = accountEmails.value.filter(
    (email) => email.id !== id && email.primary_address
  );
  return otherPrincipals.map((val) => ({
    ...val,
    primary_address: false,
  }));
};

const onSumbmitEdit = async (set: () => void) => {
  if (props.currentId) {
    set();
    console.log('updating API...');

    const bodyToSend = bodyBase([convertExternal(currentEmailEdit.value)]);

    if (currentEmailEdit.value.primary_address && currentEmailEdit.value.id) {
      bodyToSend.emails.push(
        ...converToExternal(otherPrincipals(currentEmailEdit.value.id))
      );
    }

    await execute(0, 'update', props.module, props.currentId, bodyToSend);
    await readEmails();
    return;
  }
  updateEmail(currentEmailEdit.value.id);
  set();
};

const onReset = () => {
  console.log('resetting');
  emailInput.value?.resetValidation();
};

const createLocalEmails = (val: EmailExternalModel[]) => {
  console.log('creating....', val, convertToLocal(val));
  accountEmails.value = convertToLocal(val);
};

const repeatedDialogOpen = ref(false);
const repeatedDialogData = ref([] as RowTableModel[]);
const skipRepeatedEmailValidation = ref(false);
const checkRepeatedEmail = async (val: string) => {
  if (skipRepeatedEmailValidation.value) {
    skipRepeatedEmailValidation.value = false;
    return true;
  }
  // const dataRepeated = [] as RowTableModel[];
  const dataRepeated = await readRepeatedEmailsPhones(val);
  if (
    dataRepeated.filter((val: { id: string }) => val.id !== props.currentId)
      .length > 0
  ) {
    repeatedDialogData.value = dataRepeated;
    repeatedDialogOpen.value = true;
    return 'Se han encontrado datos repetidos';
  }
  return true;
};

const captureCurrentEmail = () => {
  if (!currentEmail.value.email_address) return null;
  return convertExternal(currentEmail.value);
};

onMounted(() => {
  if (!props.currentId) {
    expansionItemRef.value?.show();
  }
  createLocalEmails(props.modelValue);
});

defineExpose({
  createLocalEmails,
  captureCurrentEmail,
});
</script>

<template>
  <q-dialog v-model="repeatedDialogOpen">
    <q-card>
      <table-dialog-component :data="repeatedDialogData" />
    </q-card>
  </q-dialog>
  <q-item-label header style="font-weight: normal">
    <q-icon name="contact_mail" color="primary" size="xs" /> Correos del cliente
    <q-circular-progress
      v-show="isLoading"
      indeterminate
      size="xs"
      color="primary"
      class="q-ma-md"
    />
  </q-item-label>
  <q-item clickable v-for="(email, index) in accountEmails" :key="index">
    <q-item-section avatar style="min-width: 40px">
      <q-icon color="blue-10" name="alternate_email" size="sm" />
    </q-item-section>
    <q-item-section class="text-dark">
      <q-item-label>{{ email.email_address }}</q-item-label>
      <q-item-label caption class="text-teal"
        >Correo
        <q-chip
          v-if="email.primary_address"
          icon="check"
          label="Principal"
          color="primary"
          text-color="white"
          size="xs"
        />
      </q-item-label>
      <q-item-label caption> </q-item-label>
    </q-item-section>
    <q-item-section side v-if="!$q.screen.xs">
      <q-icon
        v-if="!email.primary_address"
        @click.stop.prevent="deleteEmail(email.id)"
        name="delete"
        color="negative"
        size="xs"
      >
        <q-tooltip>Eliminar</q-tooltip>
      </q-icon>
    </q-item-section>
    <q-item-section side>
      <q-icon
        name="content_copy"
        size="xs"
        @click.stop.prevent="copyToClipboard(`${email.email_address}`)"
      />
      <q-tooltip>Copiar Correo</q-tooltip></q-item-section
    >
    <q-popup-edit
      ref="emailEditRef"
      v-model="email.email_address"
      @show="readEmail(email.id)"
      @hide="currentEmailEdit = {} as EmailLocalModel"
      v-slot="status"
    >
      <q-form @submit="onSumbmitEdit(status.set)">
        <q-card flat>
          <q-card-section class="q-px-none">
            <q-input
              outlined
              dense
              :loading="isLoading"
              ref="emailInput"
              v-model="currentEmailEdit.email_address"
              type="text"
              label="Correo electronico"
              :rules="[isValidEmail, checkRepeatedEmail]"
            >
              <template #after>
                <q-checkbox
                  left-label
                  v-model="currentEmailEdit.primary_address"
                  ><q-tooltip
                    >Seleccionar como principal
                  </q-tooltip></q-checkbox
                >
              </template>
            </q-input>
          </q-card-section>
          <q-card-actions align="left">
            <q-btn
              icon="add"
              size="sm"
              :label="
                currentEmailEdit.email_address == ''
                  ? 'Escriba un correo'
                  : 'Guardar correo'
              "
              type="submit"
              :color="
                currentEmailEdit.email_address == '' ? 'primary' : 'orange'
              "
            />
          </q-card-actions>
        </q-card>
      </q-form>
    </q-popup-edit>
  </q-item>
  <q-expansion-item
    expand-separator
    icon="add"
    ref="expansionItemRef"
    label="Agregar Correo Electrónico"
    color="primary"
    header-class="text-primary"
  >
    <q-form @submit="onSubmit" @reset="onReset">
      <q-card flat>
        <q-card-section class="q-px-none">
          <q-input
            outlined
            dense
            :loading="isLoading"
            ref="emailInput"
            v-model="currentEmail.email_address"
            type="text"
            @blur="onReset"
            label="Correo electronico"
            :rules="[isValidEmail, checkRepeatedEmail]"
          >
            <template #after>
              <q-checkbox left-label v-model="currentEmail.primary_address"
                ><q-tooltip>Seleccionar como principal </q-tooltip></q-checkbox
              >
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="left">
          <q-btn
            icon="add"
            label="Añadir Correo"
            type="submit"
            :color="currentEmail.email_address == '' ? 'primary' : 'orange'"
          />
        </q-card-actions>
      </q-card>
    </q-form>
  </q-expansion-item>
</template>
