<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { EmailModel } from '../types/index';
import { useIdGenerator } from '../../composables/General/generator';
import EmailInputCustom from './EmailInputCustom.vue';

//* local types
interface EmailLocalModel extends EmailModel {
  isNew: boolean;
  deleted: boolean;
}

const props = defineProps<{
  emails: EmailModel[];
  localId?: string;
}>();

//* local variables
const { generateLocalId } = useIdGenerator();
const localEmails = ref([] as EmailLocalModel[]);
const reassigning = ref(false);

//* computed variables
const activeEmails = computed(() => {
  const newValues = localEmails.value.filter(
    (e: EmailLocalModel) => !e.deleted
  );
  console.log(newValues);
  return newValues;
});

//* methods
const generateNewEmail = (): EmailLocalModel => ({
  id: `${generateLocalId()}`,
  email_address: '',
  primary_item: activeEmails.value.length > 0 ? '0' : '1',
  isNew: true,
  deleted: false,
});

const onDeleteEmail = (id?: string) => {
  console.log('id to delete', id);
  reassigning.value = true;
  setTimeout(() => {
    if (id) {
      localEmails.value = localEmails.value.map((email) =>
        email.id === id ? { ...email, deleted: true } : email
      );
    }
    reassigning.value = false;
  }, 100);
};

const convertToLocal = (emails: EmailModel[]): EmailLocalModel[] => {
  console.log('To Local...', emails);
  return emails.map((email) => ({
    ...email,
    primary_item: !!email.primary_item ? '1' : '0',
    isNew: email.inherited ? true : false,
    deleted: false,
  }));
};

const convertToExternal = (email: EmailLocalModel): EmailModel => ({
  id: email.id || '',
  email_address: email.email_address,
  email_address_caps: !!email.email_address
    ? email.email_address?.toUpperCase()
    : '',
  primary_item: email.primary_item,
});

const setPrimary = (id?: string) => {
  if (id)
    localEmails.value = localEmails.value.map((email) => {
      if (email.id === id) return email;
      return { ...email, primary_item: '0' };
    });
};

const captureNewEmails = (): EmailModel[] => {
  return localEmails.value
    .filter((email) => email.isNew && !email.deleted)
    .filter((email) => !!email.email_address)
    .map((email) => convertToExternal({ ...email, id: '' }));
};

const captureEmails = (): EmailModel[] => {
  return localEmails.value
    .filter((email) => !email.deleted && !email.isNew)
    .map((email) => convertToExternal(email));
};

const captureDeletedEmails = (): EmailModel[] => {
  return localEmails.value
    .filter((email) => email.deleted && !email.isNew)
    .map((email) => convertToExternal(email));
};

const captureActiveEmails = (): EmailModel[] => {
  return localEmails.value
    .filter((email) => !email.deleted)
    .map((email) => convertToExternal(email));
};

const constructorComp = (emails: EmailModel[]) => {
  localEmails.value = convertToLocal(emails);
  console.log(localEmails.value.length);
  if (localEmails.value.length === 0 && !props.localId) {
    localEmails.value.push(generateNewEmail());
  }
};

onMounted(() => {
  constructorComp(props.emails);
});

defineExpose({
  constructorComp,
  captureNewEmails,
  captureEmails,
  captureDeletedEmails,
  captureActiveEmails,
});
</script>
<template>
  <!-- <pre>{{ localEmails }}</pre>
  <pre>{{ activeEmails }}</pre> -->
  <q-item-label header style="font-weight: normal">
    <q-icon name="contact_mail" color="primary" size="xs" /> Correos del cliente
    <q-circular-progress size="xs" color="primary" class="q-ma-md" />
  </q-item-label>
  <div v-if="reassigning">
    <transition v-for="(email, index) in activeEmails" :key="index">
      <EmailInputCustom
        :id="localId"
        :email-id="email.id || ''"
        v-model:email="email.email_address"
        v-model:primary="email.primary_item"
        @delete-item="onDeleteEmail"
      >
        <template #checkbox>
          <q-checkbox
            v-model="email.primary_item"
            true-value="1"
            false-value="0"
            @update:model-value="setPrimary(email.id)"
            ><q-tooltip>Seleccionar como principal </q-tooltip></q-checkbox
          ></template
        >
      </EmailInputCustom>
    </transition>
  </div>
  <transition v-else v-for="(email, index) in activeEmails" :key="index">
    <EmailInputCustom
      :id="localId"
      :email-id="email.id || ''"
      v-model:email="email.email_address"
      v-model:primary="email.primary_item"
      @delete-item="onDeleteEmail"
    >
      <template #checkbox>
        <q-checkbox
          v-model="email.primary_item"
          true-value="1"
          false-value="0"
          @update:model-value="setPrimary(email.id)"
          ><q-tooltip>Seleccionar como principal </q-tooltip></q-checkbox
        ></template
      >
    </EmailInputCustom>
  </transition>

  <q-btn
    class="q-ml-sm add-phone q-pa-md"
    @click="localEmails.push(generateNewEmail())"
  >
    <template #default>
      <div>
        <q-icon name="add" color="primary" class="q-mr-md" />
        <span>Añadir Nuevo</span>
      </div>
    </template>
  </q-btn>
</template>

<style lang="scss" scoped>
.button-input {
  display: flex;
  justify-content: center;
  margin: auto 0;
}

.add-phone {
  border-radius: 3px;
}

.q-btn:before {
  content: none;
}
</style>
