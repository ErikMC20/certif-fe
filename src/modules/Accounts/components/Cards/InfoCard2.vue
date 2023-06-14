<script lang="ts" setup>
import { DetailAccountModel, AccountModel } from '../../utils/types/index';
import { ref, computed } from 'vue';
import AccountInput from '../Inputs/AccountInput.vue';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
const props = defineProps<{
  accountId?: string;
  accountType: AccountModel;
  initialData: DetailAccountModel;
}>();

const localId = ref(props.accountId || '');
let localValue = props.initialData || ({} as DetailAccountModel);
const inputData = ref(
  Object.values(localValue).length > 0
    ? ({ ...localValue } as DetailAccountModel)
    : ({
        account_type: 'Customer',
        regimen_tributario_c: '01',
        billing_address_country: 'BO',
        industry: 'N0',
        subindustry_c: 'N0_N05',
        tipo_documento_c: props.accountType === 'Empresa' ? '03' : '01',
        tipocuenta_c: props.accountType,
      } as DetailAccountModel)
);
const localAccountType = ref(props.accountType || 'Privada');

//* Ref variables
const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>(null);
const inputAccountGeneratorRef = ref<InstanceType<typeof AccountInput> | null>(
  null
);

//* Computed variables
const isEditing = computed(() => baseCardRef.value?.isEditing === 'edit');

const restoreData = () => {
  console.log('restoring data');
  inputData.value = { ...localValue };
};

const validateFields = async () => {
  return inputAccountGeneratorRef.value?.validateFields();
};

const captureCurrentData = () => {
  return inputData.value;
};

const cancelChanges = () => {
  baseCardRef.value?.onClickCancel();
};

defineExpose({
  isEditing,
  validateFields,
  captureCurrentData,
  cancelChanges,
});
</script>

<template>
  <view-card-component
    :controls="!!localId"
    :initial-status="!!localId ? 'read' : 'edit'"
    icon-name="feed"
    title="Información del cliente"
    @cancel-change="restoreData"
    ref="baseCardRef"
  >
    <template #edit>
      <!-- <pre>{{ inputData }}</pre> -->
      <AccountInput
        ref="inputAccountGeneratorRef"
        :account-type="localAccountType"
        v-model="inputData"
        :edit-mode="!!localId"
      />
    </template>
    <template #read>
      <AccountInput
        :account-type="localAccountType"
        v-model="inputData"
        read-mode
      />
    </template>
  </view-card-component>
</template>
