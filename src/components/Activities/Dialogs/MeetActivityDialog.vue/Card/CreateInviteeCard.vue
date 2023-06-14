<script lang="ts" setup>
import { ref } from 'vue';
import { createRecord } from 'src/services/GlobalService';
import { useValidator } from 'src/composables/Inputs/useValidator';
import { useQuasar, QInput } from 'quasar';
import { SearchUser } from 'src/components/types';

interface InviteeData {
  firstName: string;
  lastName: string;
  email1: string;
  phoneWork: string;
}

const emits = defineEmits<{
  (event: 'newInvitee', value: SearchUser): void;
}>();

//* variables
const isLoading = ref(false);
const inviteeData = ref({} as InviteeData);

//* composable variables
const $q = useQuasar();
const { makeRequired, makeValidEmail } = useValidator();

//* ref variables
const firstNameInputRef = ref<InstanceType<typeof QInput> | null>();
const lastNameInputRef = ref<InstanceType<typeof QInput> | null>();
const emailInputRef = ref<InstanceType<typeof QInput> | null>();
const phoneInputRef = ref<InstanceType<typeof QInput> | null>();

//*methods
const validateFields = async () => {
  const validFields = await Promise.all([
    firstNameInputRef.value?.validate(),
    lastNameInputRef.value?.validate(),
    emailInputRef.value?.validate(),
    phoneInputRef.value?.validate(),
  ]);
  return validFields.every((field) => !!field);
};

const resetValidationFields = () => {
  firstNameInputRef.value?.resetValidation();
  lastNameInputRef.value?.resetValidation();
  emailInputRef.value?.resetValidation();
  phoneInputRef.value?.resetValidation();
};

const onReset = () => {
  inviteeData.value = {} as InviteeData;
  setTimeout(() => {
    resetValidationFields();
  }, 1);
};

const onSubmit = async () => {
  const areValidFields = await validateFields();
  if (!areValidFields) {
    $q.notify({
      type: 'negative',
      message: 'Por favor corrija los campos',
    });
    return;
  }
  try {
    isLoading.value = true;
    const newRecord = await createRecord('prospects', inviteeData.value);
    onReset();
    $q.notify({
      type: 'positive',
      message: 'Nuevo Invitado',
      caption: `Se ha creado un nuevo invitado ${newRecord.name}`,
    });
    emits('newInvitee', {
      id: newRecord.id,
      module: 'prospects',
      fullname: newRecord.name,
      email_address: newRecord.email1,
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error en el proceso',
      caption: 'Se ha producido un error en el proceso',
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <q-card class="my-card">
    <q-form @reset="onReset" class="q-gutter-md"
      ><q-card-section>
        <q-input
          v-model.trim="inviteeData.firstName"
          ref="firstNameInputRef"
          type="text"
          label="Nombres"
          dense
          outlined
          :rules="[makeRequired]"
        />
        <q-input
          v-model.trim="inviteeData.lastName"
          ref="lastNameInputRef"
          type="text"
          label="Apellidos"
          dense
          outlined
          :rules="[makeRequired]"
        />
        <q-input
          v-model.trim="inviteeData.email1"
          ref="emailInputRef"
          type="text"
          label="Correo electronico"
          dense
          outlined
          :rules="[(val:string) => val && val.length > 0 ? makeValidEmail(val): true]"
        />
        <q-input
          v-model.trim="inviteeData.phoneWork"
          ref="phoneInputRef"
          type="text"
          label="Telefono Principal"
          dense
          outlined
        />
      </q-card-section>
      <q-card-actions align="right"
        ><q-btn
          label="Limpiar"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
        <q-btn
          label="Crear y Añadir"
          type="submit"
          color="primary"
          @click.prevent="onSubmit"
        />
      </q-card-actions>
    </q-form>
    <q-inner-loading :showing="isLoading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>
