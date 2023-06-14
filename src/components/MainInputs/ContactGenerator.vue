<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { QExpansionItem, QInput, useQuasar } from 'quasar';
import {
  CountryOptions,
  CountryBaseModel,
  Country,
  RowTableModel,
  // CountryLocal,
} from '../types';

import { useIdGenerator } from '../../composables/General/generator';
import { readRepeatedEmailsPhones } from 'src/services/InputServices';
// import { AccountStore } from '../../store/AccountStore';
import { axios_LB_01, axios_LB_05 } from 'src/conections/axiosCRM';
import { userStore } from 'src/modules/Users/store/UserStore';
import { useAsyncState, useClipboard } from '@vueuse/core';
import { CountryLocal } from '../types/index';

type ServiceContactModel = 'create' | 'read' | 'update' | 'delete';

type DescriptionModel = {
  id: string;
  label: string;
  cod_tel: string;
};

const props = withDefaults(
  defineProps<{
    modelValue: Country[];
    options: CountryOptions[];
    localId?: string;
    module?: 'accounts' | 'contacts';
  }>(),
  {
    localId: '',
    module: 'accounts',
  }
);

const emits = defineEmits<{
  (event: 'update:modelValue', values: CountryBaseModel[]): void;
}>();

//* composable variables
const { state, isLoading, execute } = useAsyncState(
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
const { state: optionsDescription } = useAsyncState(
  axios_LB_05.get('/tipo-telefono-list').then((res) => res.data),
  [] as DescriptionModel[]
);
const { generateLocalId } = useIdGenerator();
const { copy } = useClipboard();
const $q = useQuasar();

//* component variables
const phone = ref({
  country: 'BO',
  principal: false,
  whatsapp: false,
  description: '03',
} as CountryLocal);
const phonesLocal = ref([] as CountryLocal[]);

const repeatedDialogOpen = ref(false);
const repeatedDialogData = ref([] as RowTableModel[]);

const editValue = ref({} as CountryLocal);

//* components reference
const inputPhoneRef = ref<InstanceType<typeof QInput> | null>(null);
const inputPhoneEditRef = ref<InstanceType<typeof QInput> | null>(null);
const expansionItemRef = ref<InstanceType<typeof QExpansionItem> | null>(null);

//* computed variables
const countrySelected = computed(() => {
  const selected = props.options.find((val) => val.id === phone.value.country);
  return selected || { code: '+591', id: 'BO' };
});
const countrySelectedEdit = computed((): { code: string; id: string } => {
  return (
    props.options.find((val) => val.id === editValue.value.country) || {
      code: '+591',
      id: 'BO',
    }
  );
});
const optionsAvailable = computed(() => {
  if (optionsDescription.value.length === 0) {
    return [];
  } else {
    if (phonesLocal.value.find((phone) => phone.description === '02'))
      return optionsDescription.value.filter(
        (option: { id: string; label: string; cod_tel: string }) =>
          option.cod_tel !== '02'
      );
  }
  return optionsDescription.value;
});

const optionsAvailableEdit = computed(() => {
  if (optionsDescription.value.length === 0) {
    return [];
  } else {
    if (
      phonesLocal.value.some((phone) => phone.description === '02') &&
      editValue.value.description !== '02'
    ) {
      return optionsDescription.value.filter(
        (option: { id: string; label: string; cod_tel: string }) =>
          option.cod_tel !== '02'
      );
    }
  }
  return optionsDescription.value;
});

//* methods
const getLabelDescription = (val: string | undefined) => {
  if (!val) return 'No Asignado';
  if (optionsDescription.value.length > 0) {
    const description = optionsDescription.value.find(
      (desc: DescriptionModel) => desc.cod_tel === val
    );
    if (description) {
      return description.label;
    }
    return 'No Asignado';
  }
  return 'No Asignado';
};

const createLocalContact = (contact: Country): CountryLocal => {
  const countryBase = {
    id: contact.id || generateLocalId(),
    phone: contact.number || contact.phone,
    country_code: contact.country_code,
    country: contact.code || contact.country,
    principal: contact.primary_item === '1',
    whatsapp: contact.whatsapp === '1',
    description: contact.description || 'No Asignado',
  } as CountryLocal;
  return { ...countryBase, created: true };
};

const createExternalContact = (
  localPhone: CountryLocal,
  created = false
): Country => {
  return {
    id: created ? localPhone.id : '',
    phone: localPhone.phone,
    country_code: localPhone.country_code,
    country: localPhone.country,
    primary_item: localPhone.principal ? '1' : '0',
    whatsapp: localPhone.whatsapp ? '1' : '0',
    description:
      localPhone.description === 'No Asignado' ? '' : localPhone.description,
  };
};

const makeLocalContacts = (contacts: Country[]): CountryLocal[] => {
  return contacts.map((contact) => createLocalContact(contact));
};

const makeExternalContacts = (localContacts: CountryLocal[]): Country[] => {
  return localContacts.map((localContact) =>
    createExternalContact(localContact, localContact.created)
  );
};

const resetLocalValue = () => {
  phone.value = {
    country: 'BO',
    principal: false,
    whatsapp: false,
    description: '03',
  } as CountryLocal;
  if (inputPhoneRef.value) {
    setTimeout(() => {
      if (inputPhoneRef.value) inputPhoneRef.value.resetValidation();
    }, 50);
  }
};

const makePrincipal = (id: string) => {
  phonesLocal.value = phonesLocal.value.map((val) => {
    if (val.id !== id) {
      return { ...val, principal: false };
    }
    return val;
  });
};

const createContactAPI = async (id: string) => {
  const newContact: Country = {
    id: '',
    phone: phone.value.phone,
    country_code: countrySelected.value.code,
    country: countrySelected.value.id,
    primary_item: phone.value.principal ? '1' : '0',
    whatsapp: phone.value.whatsapp ? '1' : '0',
    description: phone.value.description,
  };

  const { userCRM } = userStore();
  const idusuario = userCRM.id;

  const bodyToSend: { idUser: string; emails: never[]; phones: Country[] } = {
    idUser: idusuario,
    emails: [],
    phones: [],
  };

  if (phone.value.principal) {
    const otherPrincipal = phonesLocal.value.map((newValue) => {
      if (newValue.principal) {
        return { ...newValue, principal: false };
      }
      return newValue;
    });

    bodyToSend.phones = [...makeExternalContacts(otherPrincipal)];
    await execute(0, 'update', props.module, id, bodyToSend);
  }

  bodyToSend.phones = [newContact];

  try {
    await execute(0, 'create', props.module, id, bodyToSend);
    return state.value;
  } catch (error) {
    console.log(error);
  }
};

const readPhones = async () => {
  await execute(0, 'read', props.module, props.localId);
  phonesLocal.value = makeLocalContacts(state.value.data.phones);
};

const createContact = async () => {
  const validation = await inputPhoneRef.value?.validate();
  if (!validation) {
    return;
  }
  if (props.localId) {
    await createContactAPI(props.localId);
    await readPhones();
    resetLocalValue();
    return;
  }
  const generatedId = generateLocalId();
  phonesLocal.value.push({
    id: generatedId,
    phone: phone.value.phone,
    country_code: countrySelected.value.code,
    country: countrySelected.value.id,
    principal: phone.value.principal,
    whatsapp: phone.value.whatsapp,
    description: phone.value.description,
    created: false,
  });
  if (phone.value.principal) makePrincipal(generatedId);
  resetLocalValue();
  emits('update:modelValue', makeExternalContacts(phonesLocal.value));
};

const createLocalPhones = (val: Country[]) => {
  phonesLocal.value = makeLocalContacts(val);
};

const checkRepeatedAPI = async (val: string) => {
  const dataRepeated = await readRepeatedEmailsPhones(val);
  if (dataRepeated && dataRepeated.length > 0) {
    if (props.localId) {
      const filteredRepeated = dataRepeated.filter(
        (value) => value.id !== props.localId
      );
      if (filteredRepeated.length > 0) {
        repeatedDialogData.value = filteredRepeated;
        repeatedDialogOpen.value = true;
      }
      return true;
    }
    repeatedDialogData.value = dataRepeated;
    repeatedDialogOpen.value = true;
  }
  return true;
};

const checkRepeatedPhone = async (val: string) => {
  if (phonesLocal.value.some((value) => value.phone === val))
    return 'Ya existe un telefono similar registrado.';

  return checkRepeatedAPI(val);
};

const showExpansionForm = () => {
  expansionItemRef.value?.show();
};

const captureAndUpdate = async (val: CountryLocal, set: () => void) => {
  if (!props.localId) {
    phonesLocal.value = phonesLocal.value.map((phone) => {
      if (phone.id === val.id) {
        return val;
      }
      return phone;
    });
    if (val.principal) {
      makePrincipal(val.id);
    }
    set();
    emits('update:modelValue', makeExternalContacts(phonesLocal.value));
    return;
  }
  const upateContact: Country = {
    id: val.id,
    phone: val.phone,
    country_code: countrySelectedEdit.value.code,
    country: val.country,
    primary_item: val.principal ? '1' : '0',
    whatsapp: val.whatsapp ? '1' : '0',
    description: val.description,
  };

  const { userCRM } = userStore();
  const idusuario = userCRM.id;

  const bodyToSend = {
    idUser: idusuario,
    emails: [],
    phones: [upateContact],
  };

  if (val.principal) {
    const otherPrincipal = phonesLocal.value
      .filter((phone) => phone.id !== val.id)
      .map((newValue) => {
        if (newValue.principal) {
          return { ...newValue, principal: false };
        }
        return newValue;
      });

    bodyToSend.phones = [
      ...bodyToSend.phones,
      ...makeExternalContacts(otherPrincipal),
    ];
  }

  try {
    await execute(0, 'update', props.module, props.localId, bodyToSend);
    set();
    await readPhones();
  } catch (error) {
    console.log(error);
  }
};

const copyToClipboard = (val: string) => {
  copy(val);
  $q.notify('Se ha copiado el numero al portapapeles');
};

const captureAndDelete = async (val: CountryLocal) => {
  if (!props.localId) {
    phonesLocal.value = phonesLocal.value.filter(
      (phone) => phone.id !== val.id
    );
    emits('update:modelValue', makeExternalContacts(phonesLocal.value));
    return;
  }
  const upateContact: Country = {
    id: val.id,
    phone: val.phone,
    country_code: val.country_code,
    country: val.country,
    primary_item: val.principal ? '1' : '0',
    whatsapp: val.whatsapp ? '1' : '0',
  };

  const { userCRM } = userStore();
  const idusuario = userCRM.id;

  const bodyToSend = {
    idUser: idusuario,
    emails: [],
    phones: [upateContact],
  };

  try {
    await execute(0, 'delete', props.module, props.localId, bodyToSend);
    await readPhones();
    emits('update:modelValue', makeExternalContacts(phonesLocal.value));
  } catch (error) {
    console.log(error);
  }
};

const basicValidation = (val: string) => {
  return !!val || 'Se requiere';
};

const basicEdition = (phone: CountryLocal) => {
  const repeatedLocal = phonesLocal.value.filter(
    (value: CountryLocal) => value.id === phone.id
  );
  if (repeatedLocal.length > 0) return 'Se ha encontrado un dato repetido';
  return true;
};

const showAndAssign = (cod: CountryLocal) => {
  editValue.value = { ...cod };
  expansionItemRef.value?.hide();
};

const captureLocal = async () => {
  const isValid = await inputPhoneRef.value?.validate();
  if (isValid) {
    const currentPhone: CountryLocal = {
      id: '',
      created: true,
      phone: phone.value.phone,
      country_code: countrySelected.value.code,
      country: phone.value.country,
      principal: phone.value.principal,
      whatsapp: phone.value.whatsapp,
    };
    return createExternalContact(currentPhone);
  }
  return false;
};

const validatePhone = async () => {
  return await inputPhoneRef.value?.validate();
};

const onReset = () => {
  inputPhoneRef.value?.resetValidation();
};

const checkFilling = () => !!phone.value.phone;

onMounted(() => {
  if (!props.localId) {
    showExpansionForm();
  }
  createLocalPhones(props.modelValue);
});

//* END Extra

defineExpose({
  captureLocal,
  checkFilling,
  createLocalPhones,
  resetLocalValue,
  validatePhone,
});
</script>

<template>
  <q-dialog v-model="repeatedDialogOpen">
    <q-card>
      <table-dialog-component :data="repeatedDialogData" />
    </q-card>
  </q-dialog>
  <div class="q-mx-xs">
    <q-item-label
      v-if="phonesLocal.length > 0"
      header
      style="font-weight: normal"
    >
      <q-icon name="local_phone" color="primary" size="xs" />
      Otros teléfonos
      <q-circular-progress
        v-show="isLoading"
        indeterminate
        size="xs"
        color="primary"
        class="q-ma-md"
      />
    </q-item-label>
    <q-list
      padding
      class="rounded-borders"
      style="max-height: 300px; overflow-y: auto"
    >
      <q-item
        clickable
        v-ripple
        v-for="(currentPhone, index) in phonesLocal"
        :key="index"
      >
        <q-item-section avatar>
          <q-icon
            v-if="!!currentPhone.whatsapp"
            color="positive"
            name="whatsapp"
            size="sm"
          />
          <q-icon v-else color="blue-10" name="local_phone" size="sm" />
        </q-item-section>
        <q-item-section class="text-dark">
          <q-item-label
            >{{ currentPhone.country_code }}-{{
              currentPhone.phone
            }}</q-item-label
          >
          <q-item-label caption class="q-pl-sm text-teal">{{
            getLabelDescription(currentPhone.description)
          }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon
            name="delete"
            color="negative"
            size="xs"
            @click.stop.prevent="captureAndDelete(currentPhone)"
          >
            <q-tooltip>Eliminar</q-tooltip>
          </q-icon>
        </q-item-section>
        <q-item-section side>
          <q-icon
            name="content_copy"
            size="xs"
            @click.stop.prevent="
              copyToClipboard(
                `${currentPhone.country_code} ${currentPhone.phone}`
              )
            "
          />
          <q-tooltip>Copiar Número</q-tooltip></q-item-section
        ><q-popup-edit
          class="shadow-20"
          v-model="currentPhone.country"
          @show="showAndAssign(currentPhone)"
          @hide="editValue = {} as CountryLocal"
          v-slot="status"
        >
          <q-card-section> Editar Teléfono </q-card-section>
          <q-card-section>
            <q-input
              v-model="editValue.phone"
              autofocus
              type="text"
              ref="inputPhoneEditRef"
              outlined
              dense
              mask="###-#############"
              unmasked-value
              label="Número"
              class="col-12"
              @keyup.enter="captureAndUpdate(editValue, status.set)"
              :rules="[
                basicEdition,
                (val) => val.length > 6 || 'Ingrese un número válido',
                checkRepeatedAPI,
              ]"
            >
              <template #before>
                <q-select
                  v-model="editValue.country"
                  :options="options"
                  label="Código"
                  dense
                  option-value="id"
                  option-label="name_es"
                  style="min-width: 50px"
                  map-options
                  emit-value
                >
                  <template v-if="editValue.country" #selected>
                    <q-avatar class="q-mx-sm" size="20px" color="teal"
                      ><img
                        :src="`https://countryflagsapi.com/png/${countrySelectedEdit.id}`"
                    /></q-avatar>
                    {{ countrySelectedEdit.code }}
                  </template>
                </q-select>
              </template>
            </q-input>
            <div class="col-12">
              <div class="row q-gutter-x-sm">
                <q-select
                  v-model="editValue.description"
                  :options="optionsAvailableEdit"
                  label="Descripcion"
                  outlined
                  map-options
                  option-value="cod_tel"
                  option-label="label"
                  emit-value
                  dense
                  style="min-width: 200px"
                />
                <q-checkbox
                  label="Activo en Whatsapp"
                  v-model="editValue.whatsapp"
                  checked-icon="whatsapp"
                  unchecked-icon="whatsapp"
                  color="positive"
                >
                  <q-tooltip> Activo en whatsapp </q-tooltip>
                </q-checkbox>
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="left">
            <q-btn
              color="primary"
              label="Guardar"
              @click="captureAndUpdate(editValue, status.set)"
              :loading="isLoading"
            />
          </q-card-actions>
        </q-popup-edit>
      </q-item>
    </q-list>
    <q-expansion-item
      ref="expansionItemRef"
      expand-separator
      icon="add"
      label="Agregar Teléfono"
      color="primary"
      header-class="text-primary"
    >
      <q-card @keyup.enter="createContact">
        <q-card-section class="q-px-none">
          <div class="row">
            <q-input
              v-model="phone.phone"
              type="text"
              ref="inputPhoneRef"
              outlined
              dense
              :loading="isLoading"
              mask="###-#############"
              unmasked-value
              label="Número"
              class="col-12"
              @blur="onReset"
              :rules="[
                basicValidation,
                (val) => val.length > 6 || 'Ingrese un número válido',
                checkRepeatedPhone,
              ]"
            >
              <template #before>
                <q-select
                  v-model="phone.country"
                  :options="props.options"
                  label="Codigo"
                  dense
                  option-value="id"
                  option-label="name_es"
                  style="min-width: 50px"
                  map-options
                  emit-value
                >
                  <template v-if="phone.country" #selected>
                    <q-avatar class="q-mx-sm" size="20px" color="teal"
                      ><img
                        :src="`https://countryflagsapi.com/png/${countrySelected.id}`"
                    /></q-avatar>
                    {{ countrySelected.code }}
                  </template>
                </q-select>
              </template>
            </q-input>
            <div class="col-12">
              <div class="row q-gutter-x-sm">
                <q-select
                  v-model="phone.description"
                  :options="optionsAvailable"
                  label="Descripcion"
                  outlined
                  map-options
                  option-value="cod_tel"
                  option-label="label"
                  emit-value
                  dense
                  style="min-width: 200px"
                />
                <q-checkbox
                  label="Activo en Whatsapp"
                  v-model="phone.whatsapp"
                  checked-icon="whatsapp"
                  unchecked-icon="whatsapp"
                  color="positive"
                >
                  <q-tooltip> Activo en whatsapp </q-tooltip>
                </q-checkbox>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="left">
          <q-btn
            icon="add"
            color="primary"
            @click="createContact"
            :loading="isLoading"
            label="Añadir Teléfono"
          />
        </q-card-actions>
      </q-card>
    </q-expansion-item>
  </div>
</template>
