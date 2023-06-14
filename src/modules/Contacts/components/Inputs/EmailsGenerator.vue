<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { QInput } from 'quasar';
import {
  EmailAccountExternalModel,
  EmailAccountLocalModel,
} from '../../utils/types/index';
import { useIdGenerator } from '../../composables';
//import { AccountStore } from '../../store/AccountStore';
import { RowTableModel } from '../../utils/types/index';
import TableDialog from '../Dialogs/TableDialog.vue';

//const { readRepeatedEmailsPhones } = AccountStore();

const props = withDefaults(
  defineProps<{
    modelValue: EmailAccountExternalModel[];
    currentId: string;
  }>(),
  {
    currentId: '',
  }
);
const emits = defineEmits<{
  (event: 'update:modelValue', values: EmailAccountExternalModel[]): void;
}>();

const { generateLocalId } = useIdGenerator();

const emailInput = ref<InstanceType<typeof QInput> | null>(null);

const currentEmail = ref({
  email_address: '',
  primary_address: false,
} as EmailAccountLocalModel);

const accountEmails = ref([] as EmailAccountLocalModel[]);

const isValidEmail = (val: string) => {
  const emailPattern =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return emailPattern.test(val) || 'El email no es valido';
};

const resetValues = () => {
  currentEmail.value = {
    email_address: '',
    primary_address: false,
  } as EmailAccountLocalModel;
  setTimeout(() => {
    emailInput.value?.resetValidation();
  }, 100);
};

const converToExternal = (
  emails: EmailAccountLocalModel[]
): EmailAccountExternalModel[] => {
  return emails.map((value) => {
    if (value.isLocal)
      return {
        id: '',
        email_address: value.email_address,
        primary_address: value.primary_address,
      };
    return {
      id: value.id,
      email_address: value.email_address,
      primary_address: value.primary_address,
    };
  });
};

const convertToLocal = (
  emails: EmailAccountExternalModel[]
): EmailAccountLocalModel[] => {
  return emails
    .filter((val) => val.id)
    .map((value) => {
      return {
        id: value.id,
        email_address: value.email || value.email_address,
        primary_address: value.primary_address,
        isLocal: false,
      };
    });
};

const updateToParent = (emails: EmailAccountLocalModel[]) => {
  console.log('updating to parents');
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

const createEmail = (val: EmailAccountLocalModel) => {
  const idGenerated = generateLocalId();
  accountEmails.value.push({
    id: idGenerated,
    email_address: val.email_address,
    primary_address: val.primary_address,
    isLocal: true,
  });
  makePrincipal(idGenerated);
  resetValues();
  updateToParent(accountEmails.value);
};

const readEmail = (id: string | undefined) => {
  if (id) {
    console.log('reading value', id);
    const value = accountEmails.value.find((val) => val.id === id);
    if (value)
      currentEmail.value = {
        id,
        email_address: value.email_address,
        primary_address: value.primary_address,
        isLocal: value.isLocal,
      };
    skipRepeatedEmailValidation.value = true;
  }
};

const updateEmail = (id: string | undefined) => {
  if (id) {
    console.log('updating value', id);
    accountEmails.value = accountEmails.value.map((v) => {
      if (v.id === id) {
        return {
          ...v,
          email_address: currentEmail.value.email_address,
          primary_address: currentEmail.value.primary_address,
        };
      }
      return v;
    });
    makePrincipal(id);
    resetValues();
    updateToParent(accountEmails.value);
  }
};

const deleteEmail = (id: string | undefined) => {
  if (id) {
    console.log('deleting value', id);
    accountEmails.value = accountEmails.value.filter((val) => val.id !== id);
    updateToParent(accountEmails.value);
  }
};

const onSubmit = () => {
  console.log('submitting');
  if (currentEmail.value.id !== undefined) {
    updateEmail(currentEmail.value.id);
  } else {
    createEmail(currentEmail.value);
  }
};

const onReset = () => {
  console.log('resetting');
};

const createLocalEmails = (val: EmailAccountExternalModel[]) => {
  console.log('Creating', val);
  accountEmails.value = convertToLocal(val);
};

const repeatedDialogOpen = ref(false);
const repeatedDialogData = ref([] as RowTableModel[]);
const skipRepeatedEmailValidation = ref(false);
const checkRepeatedEmail = async (val: string) => {
  console.log('cheking....', val);
  if (skipRepeatedEmailValidation.value) {
    skipRepeatedEmailValidation.value = false;
    return true;
  }
  const dataRepeated = [] as RowTableModel[];
  // const dataRepeated = await readRepeatedEmailsPhones(val);
  console.log('Repeated...', dataRepeated, props.currentId);
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

onMounted(() => {
  createLocalEmails(props.modelValue);
});

defineExpose({
  createLocalEmails,
});
</script>

<template>
  <q-dialog v-model="repeatedDialogOpen">
    <q-card>
      <TableDialog :data="repeatedDialogData" />
    </q-card>
  </q-dialog>
  <div class="q-my-sm">
    <q-form @submit="onSubmit" @reset="onReset" class="q-mt-md q-gutter-md">
      <q-input
        outlined
        dense
        ref="emailInput"
        v-model="currentEmail.email_address"
        type="text"
        label="Correo electronico"
        :rules="[isValidEmail, checkRepeatedEmail]"
      >
        <template #after>
          <q-checkbox left-label v-model="currentEmail.primary_address"
            ><q-tooltip>Seleccionar como principal </q-tooltip></q-checkbox
          >
        </template>
      </q-input>
      <div class="q-my-none">
        <q-btn
          size="sm"
          rounded
          :icon="currentEmail.id !== undefined ? 'edit' : 'add'"
          :label="
            currentEmail.id !== undefined ? 'Editar Correo' : 'Añadir correo'
          "
          type="submit"
          color="primary"
        />
      </div>
    </q-form>

    <q-card
      v-for="(email, index) in accountEmails"
      :key="index"
      class="q-my-sm"
    >
      <q-card-section>
        <div class="row justify-between">
          <div class="col-auto flex items-center">
            {{ email.email_address }}
          </div>
          <div class="col-3 flex items-center">
            {{ email.primary_address ? 'Principal' : 'Secundario' }}
          </div>
          <div class="col-1 flex items-center">
            <q-btn round flat icon="more_vert">
              <q-menu auto-close :offset="[110, 0]">
                <q-list style="min-width: 150px">
                  <q-item clickable>
                    <q-item-section @click="readEmail(email.id)"
                      >Editar</q-item-section
                    >
                  </q-item>
                  <q-item clickable>
                    <q-item-section @click="deleteEmail(email.id)"
                      >Eliminar</q-item-section
                    >
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
