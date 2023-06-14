<script lang="ts">
import { AdvancedFilterAccount, AdvancedFilterContact } from '..';
import { base, ClientInformation } from '../../utils/types';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
import { ref, computed } from 'vue';
import AccountDialog from 'src/modules/Accounts/components/Dialogs/AccountDialog.vue';
import ContactDialog from 'src/modules/Contacts/components/Dialogs/ContactDialog.vue';
import RelacionadoOpo from 'src/components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoOpo.vue';
import { QInput } from 'quasar';
</script>
<script setup lang="ts">
//props
const props = withDefaults(
  defineProps<{
    id?: string;
    data?: ClientInformation;
    readMode?: boolean;
  }>(),
  {
    readMode: false,
  }
);

//refs
const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>(null);

const accountDialogRef = ref<InstanceType<typeof AccountDialog> | null>(null);
const contactDialogRef = ref<InstanceType<typeof ContactDialog> | null>(null);
const accountFilterAdvanced = ref<InstanceType<
  typeof AdvancedFilterAccount
> | null>(null);
const contactFilterAdvanced = ref<InstanceType<
  typeof AdvancedFilterContact
> | null>(null);

const oportunitiesFilterAdvanced = ref<InstanceType<
  typeof RelacionadoOpo
> | null>(null);

//inputs refs for validation
const clientInputRef = ref<InstanceType<typeof QInput> | null>(null);

//variables
const alert = ref(false);
const select = ref<base>({});
const listOpportunities = ref<base[]>([]);

const isEditing = computed(() => baseCardRef.value?.isEditing === 'edit');
const inputData = ref(
  !!props.data
    ? { ...props.data }
    : {
        account_id_c: '',
        contact_id_c: '',
        account_c: '',
        contact_c: '',
      }
);

//functions
const validateInputs = async () => {
  const validatedFields = await Promise.all([clientInputRef.value?.validate()]);
  console.log(validatedFields);
  return validatedFields.every((field) => !!field);
};

const restoreValues = () => {
  if (props.data) inputData.value = { ...props.data };
};

const exposeCardData = () => {
  return inputData.value;
};

const openFilter = (type: string) => {
  switch (type) {
    case 'account':
      accountFilterAdvanced.value?.openDialog();
      break;
    case 'contact':
      contactFilterAdvanced.value?.openDialog();
      break;
    case 'oportunitie':
      oportunitiesFilterAdvanced.value?.openDialog();
      break;
  }
};

const selectItem = (item: base, type: string) => {
  select.value = item;
  switch (type) {
    case 'account':
      inputData.value.account_id_c = item.id;
      inputData.value.account_c = item.nombre;
      break;
    case 'contact':
      inputData.value.contact_id_c = item.id;
      inputData.value.contact_c = item.nombre;
      contactFilterAdvanced.value?.onClose();
      break;
  }
};

const deleteItem = (item: string, type: string) => {
  switch (type) {
    case 'account':
      select.value = { prefix: 'La cuenta', nombre: item, type: 'account' };
      break;
    case 'contact':
      select.value = { prefix: 'El contacto', nombre: item, type: 'contact' };
      break;
  }
  alert.value = !alert.value;
};

const confirmDelete = () => {
  switch (select.value.type) {
    case 'account':
      inputData.value.account_id_c = '';
      inputData.value.account_c = '';
      break;
    case 'contact':
      inputData.value.contact_id_c = '';
      inputData.value.contact_c = '';
      break;
    case 'oportunitie':
      break;
  }
};

const denegateDelete = () => {
  select.value = {};
  alert.value = false;
};

const openDialog = (id: string, type: string) => {
  switch (type) {
    case 'account':
      accountDialogRef.value?.openDialogAccountTab(id);
      break;
    case 'contact':
      contactDialogRef.value?.openDialogTab(id, inputData.value.contact_c);
      break;
  }
};

//lifecicle

//exposes
defineExpose({
  validateInputs,
  exposeCardData,
  isEditing,
});
</script>

<template>
  <view-card-component
    :controls="!!id"
    :initial-status="id ? 'read' : 'edit'"
    icon-name="feed"
    ref="baseCardRef"
    title="Información del cliente"
    @cancel-change="restoreValues"
    class="q-mb-sm"
  >
    <template #edit>
      <q-card-section class="row q-col-gutter-sm q-pa-sm">
        <q-input
          v-model="inputData.account_c"
          type="text"
          label="Cuenta"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md text-blue"
          ref="clientInputRef"
          :rules="[(val:string) => !!val || 'Campo requerido']"
          readonly
        >
          <template v-slot:append>
            <q-btn
              color="negative"
              icon="close"
              dense
              @click="deleteItem(inputData.account_c, 'account')"
              v-if="inputData.account_c !== ''"
            />
            <q-btn
              color="primary"
              icon="person_search"
              dense
              @click="openFilter('account')"
            />
          </template>
        </q-input>

        <q-input
          v-model="inputData.contact_c"
          type="text"
          label="Contacto"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md text-blue"
          readonly
        >
          <template v-slot:append>
            <q-btn
              color="negative"
              icon="close"
              dense
              @click="deleteItem(inputData.contact_c ?? '', 'contact')"
              v-if="inputData.contact_c !== ''"
            />
            <q-btn
              color="primary"
              icon="person_search"
              dense
              @click="openFilter('contact')"
            />
          </template>
        </q-input>
      </q-card-section>
    </template>
    <template #read>
      <q-card-section class="row q-col-gutter-sm q-pa-sm">
        <q-input
          v-model="inputData.account_c"
          type="text"
          label="Cuenta"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md text-blue"
          readonly
        >
          <template v-slot:append>
            <q-btn
              color="primary"
              icon="open_in_new"
              dense
              @click="openDialog(inputData.account_id_c ?? '', 'account')"
            />
          </template>
        </q-input>

        <q-input
          v-model="inputData.contact_c"
          type="text"
          label="Contacto"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md text-blue"
          readonly
        >
          <template v-slot:append>
            <q-btn
              color="primary"
              icon="open_in_new"
              dense
              v-if="inputData.contact_id_c"
              @click="openDialog(inputData.contact_id_c ?? '', 'contact')"
            />
          </template>
        </q-input>
      </q-card-section>
    </template>
  </view-card-component>
  <AdvancedFilterAccount
    ref="accountFilterAdvanced"
    @select-item="(val:base) => selectItem(val, 'account')"
  />

  <AdvancedFilterContact
    ref="contactFilterAdvanced"
    @select-item="(val:base) => selectItem(val, 'contact')"
    :account_id="inputData.account_id_c ?? ''"
    :altAccountId="inputData.account_id_c ?? ''"
  />
  <AccountDialog ref="accountDialogRef" @saved-form="() => {}" />
  <ContactDialog ref="contactDialogRef" @saved-form="() => {}" />

  <alert-component
    v-model="alert"
    title="¿Estas seguro de eliminar este registro?"
    icon="warning"
    iconColor="orange-5"
    iconSize="80px"
    btnText="Si, eliminar"
    btnColor="negative"
    @confirm="confirmDelete"
    @denegate="denegateDelete"
  >
    <template #body>
      {{ select.prefix }} &nbsp;
      <b>
        {{ select.nombre }}
      </b>
      &nbsp; se desvinculará del proyecto.
    </template>
  </alert-component>
</template>
<style lang="scss" scoped>
.title-card {
  font-size: 1em;
}
</style>
