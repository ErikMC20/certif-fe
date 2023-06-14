<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { QInput } from 'quasar';
import {
  CountryOptions,
  CountryContactsBaseModel,
  CountryContact,
  CountryContactsLocal,
} from '../../utils/types';

import { useIdGenerator } from '../../composables';
import { AccountStore } from '../../store/AccountStore';
import { RowTableModel } from '../../utils/types/index';
import TableDialog from '../Dialogs/TableDialog.vue';

const props = defineProps<{
  modelValue: CountryContact[];
  options: CountryOptions[];
}>();

const emits = defineEmits<{
  (event: 'update:modelValue', values: CountryContactsBaseModel[]): void;
}>();

const { readRepeatedEmailsPhones } = AccountStore();

// component variables
const accountPhone = ref({ country: 'BO' } as CountryContactsLocal);
const accountPhonesLocal = ref([] as CountryContactsLocal[]);
const isPrincipalContact = ref(false);
const whatsappActive = ref(false);
const idToEdit = ref<string | null>(null);
const deletedContacts = ref([] as CountryContact[]);
// fields reference
const inputPhoneRef = ref<InstanceType<typeof QInput> | null>(null);
// endfields reference

const { generateLocalId } = useIdGenerator();

const countrySelected = computed(() => {
  const selected = props.options.find(
    (val) => val.id === accountPhone.value.country
  );
  return selected || { code: '+591', id: 'BO' };
});

const makeLocalContact = ({
  id,
  phone,
  country_code,
  country,
  principal,
  whatsapp,
}: CountryContact): CountryContactsLocal => {
  return {
    id: id || generateLocalId(),
    phone,
    country_code,
    country,
    principal: principal === '1',
    whatsapp: whatsapp === '1',
    created: true,
  };
};

const makeExternalContact = (val: CountryContactsLocal): CountryContact => {
  if (val.created === true)
    return {
      id: val.id,
      phone: val.phone,
      country_code: val.country_code,
      country: val.country,
      principal: val.principal ? '1' : '0',
      whatsapp: val.whatsapp ? '1' : '0',
    };
  else {
    return {
      id: '',
      phone: val.phone,
      country_code: val.country_code,
      country: val.country,
      principal: val.principal ? '1' : '0',
      whatsapp: val.whatsapp ? '1' : '0',
    };
  }
};

const makeExternalContacts = (
  localPhones: CountryContactsLocal[]
): CountryContact[] => {
  const externalContacts = localPhones.map((val) => makeExternalContact(val));
  return externalContacts;
};

const resetLocalValue = (resetEdit = false) => {
  accountPhone.value = { country: 'BO' } as CountryContactsLocal;
  isPrincipalContact.value = false;
  whatsappActive.value = false;
  if (inputPhoneRef.value) {
    setTimeout(() => {
      if (inputPhoneRef.value) inputPhoneRef.value.resetValidation();
    }, 50);
  }
  if (resetEdit) idToEdit.value = null;
};

const makePrincipal = (id: string) => {
  accountPhonesLocal.value = accountPhonesLocal.value.map((val) => {
    if (val.id !== id) {
      return { ...val, principal: false };
    }
    return val;
  });
};

const createContact = () => {
  const generatedId = generateLocalId();
  accountPhonesLocal.value.push({
    id: generatedId,
    phone: accountPhone.value.phone,
    country_code: countrySelected.value.code,
    country: countrySelected.value.id,
    principal: isPrincipalContact.value,
    whatsapp: whatsappActive.value,
    created: false,
  });
  if (isPrincipalContact.value) makePrincipal(generatedId);
  resetLocalValue();
  emits('update:modelValue', makeExternalContacts(accountPhonesLocal.value));
};

const readContact = (id: string | null) => {
  resetLocalValue();
  idToEdit.value = id;
  const assignToLocal = accountPhonesLocal.value.find(
    (value) => value.id !== null && value.id === id
  );
  if (assignToLocal) {
    accountPhone.value = { ...assignToLocal };
    isPrincipalContact.value = assignToLocal.principal;
    whatsappActive.value = assignToLocal.whatsapp;
  }
  skipRepeatedContactValidation.value = true;
};

const updateContact = (id: string | null) => {
  if (id === null) return;
  accountPhonesLocal.value = accountPhonesLocal.value.map((val) => {
    if (val.id === id) {
      return {
        ...val,
        country_code: countrySelected.value.code,
        code: countrySelected.value.id,
        phone: accountPhone.value.phone,
        principal: isPrincipalContact.value,
        whatsapp: whatsappActive.value,
      };
    }
    return val;
  });
  if (isPrincipalContact.value === true) makePrincipal(id);
  resetLocalValue(true);
  emits('update:modelValue', makeExternalContacts(accountPhonesLocal.value));
};

const deleteContact = (id: string) => {
  const targetContact = accountPhonesLocal.value.find((val) => val.id !== id);
  if (targetContact)
    deletedContacts.value.push(makeExternalContact(targetContact));

  accountPhonesLocal.value = accountPhonesLocal.value.filter(
    (val) => val.id !== id
  );
  emits('update:modelValue', makeExternalContacts(accountPhonesLocal.value));
};

const resetDeletedEmails = () => {
  deletedContacts.value = [];
};

const onSubmit = () => {
  if (idToEdit.value) {
    updateContact(idToEdit.value);
  } else {
    createContact();
  }
};
const onReset = () => {
  console.log('resetting');
};

const createLocalPhones = (val: CountryContact[]) => {
  val.map((value) => accountPhonesLocal.value.push(makeLocalContact(value)));
};

const repeatedDialogOpen = ref(false);
const repeatedDialogData = ref([] as RowTableModel[]);
const skipRepeatedContactValidation = ref(false);
const checkRepeatedPhone = async (val: string) => {
  if (skipRepeatedContactValidation.value) {
    skipRepeatedContactValidation.value = false;
    return true;
  }

  if (accountPhonesLocal.value.some((value) => value.phone === val))
    return 'Ya existe un telefono similar registrado.';

  const dataRepeated = await readRepeatedEmailsPhones(val);
  console.log(val, dataRepeated);
  if (dataRepeated.length > 0) {
    repeatedDialogData.value = dataRepeated;
    repeatedDialogOpen.value = true;
    return 'Se han encontrado datos repetidos';
  }
  return true;
};

// const validateField = () => {
//   return inputPhoneRef.value?.validate();
// };

//* function validations
// const countPhones = () => {
//   return accountPhonesLocal.value.length > 0
//     ? true
//     : 'Debe tener al menos un numero';
// };

//* End function validations

onMounted(() => {
  createLocalPhones(props.modelValue);
});

defineExpose({
  deletedContacts,
  resetDeletedEmails,
  createLocalPhones,
});
</script>

<template>
  <q-dialog v-model="repeatedDialogOpen">
    <TableDialog :data="repeatedDialogData" />
  </q-dialog>
  <div class="q-my-sm">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <div>
        <q-input
          v-model.trim="accountPhone.phone"
          type="text"
          ref="inputPhoneRef"
          outlined
          dense
          mask="###-#############"
          unmasked-value
          label="Numero"
          :rules="[
            (val) => !!val || 'Se requiere',
            (val) => val.length > 6 || 'Ingrese un número válido',
            checkRepeatedPhone,
          ]"
        >
          <template #before>
            <q-select
              v-model="accountPhone.country"
              :options="props.options"
              dense
              option-value="id"
              option-label="name_es"
              options-dense
              style="min-width: 100px"
              outlined
              map-options
              emit-value
            >
              <template v-slot:prepend>
                <img
                  :src="`https://countryflagsapi.com/png/${countrySelected.id}`"
                  style="width: 25px; height: 20px; border-radius: 3px"
                />
              </template>
              <template v-if="accountPhone.country" #selected>
                <span class="q-pa-none">{{ countrySelected.id }}</span>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-avatar class="q-mx-sm" size="20px" color="teal"
                    ><img
                      :src="`https://countryflagsapi.com/png/${scope.opt.id}`"
                  /></q-avatar>
                  {{ scope.opt.name_es }}
                </q-item>
              </template>
            </q-select>
          </template>
          <template #after>
            <q-checkbox v-model="isPrincipalContact" indeterminate-icon="help">
              <q-tooltip>Seleccionar como principal</q-tooltip>
            </q-checkbox>
            <q-checkbox
              v-model="whatsappActive"
              checked-icon="whatsapp"
              unchecked-icon="whatsapp"
              color="positive"
            >
              <q-tooltip> Activo en whatsapp </q-tooltip>
            </q-checkbox>
          </template>
        </q-input>
      </div>
      <div class="q-my-none">
        <q-btn
          icon="add"
          :label="idToEdit ? 'Editar Telefono' : 'Añadir Contacto'"
          rounded
          size="sm"
          type="submit"
          color="primary"
        />
      </div>
    </q-form>

    <q-card
      v-for="(phone, index) in accountPhonesLocal"
      :key="index"
      class="q-my-sm"
    >
      <q-card-section>
        <div class="row">
          <div class="col-3 flex items-center">{{ phone.country_code }}</div>
          <div class="col-5 flex items-center">{{ phone.phone }}</div>
          <div class="col-3 flex items-center">
            {{ phone.principal ? 'Principal' : 'Secundario' }}
          </div>
          <div class="col-1 flex items-center">
            <q-btn round flat icon="more_vert">
              <q-menu auto-close :offset="[110, 0]">
                <q-list style="min-width: 150px">
                  <q-item @click="readContact(phone.id)" clickable>
                    <q-item-section>Editar</q-item-section>
                  </q-item>
                  <q-item @click="deleteContact(phone.id)" clickable>
                    <q-item-section>Eliminar</q-item-section>
                  </q-item>
                </q-list>
              </q-menu></q-btn
            >
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<style lang="scss" scoped>
.dialog-repeated {
  max-width: 100rem;
}
</style>
