<script lang="ts">
import { ref, computed, onMounted } from 'vue';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
import InputAccountGenerator from '../Inputs/InfoAccountGenerator.vue';

import CardLabels from 'src/components/Labels/CardLabels.vue';
import {
  LabelModel,
  DetailAccountModel,
  OptionAccountInfo,
  AccountModel,
} from '../../utils/types/index';
import { useLabelsInfo } from '../../composables/ViewGeneral/General';
import { StatusCard } from 'src/components/types';
</script>

<script setup lang="ts">
const props = defineProps<{
  idLocal?: string;
  initialDataContact: DetailAccountModel;
  accountType: AccountModel;
  options: OptionAccountInfo;
}>();

//* variables
const localIdAccount = ref('');
const localData = ref({
  account_type: 'Customer',
  regimen_tributario_c: '01',
  billing_address_country: 'BO',
  industry: 'N0',
  subindustry_c: 'N0_N05',
} as DetailAccountModel);
const localAccountType = ref('Privada' as AccountModel);
const localDataCurrent = ref({
  account_type: 'Customer',
  regimen_tributario_c: '01',
  billing_address_country: 'BO',
  industry: 'N0',
  subindustry_c: 'N0_N05',
} as DetailAccountModel);
const accountLabels = ref([] as LabelModel[]);

//* references
const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>(null);
const inputAccountGeneratorRef = ref<InstanceType<
  typeof InputAccountGenerator
> | null>(null);

//* computed variables
const isEditing = computed(() => {
  return baseCardRef.value?.isEditing === 'edit';
});

//* methods
const createLabels = (options: OptionAccountInfo) => {
  const { getInfoLabels } = useLabelsInfo(
    localData.value,
    {
      infoClient: { ...options },
      infoDirectionsAccount: [],
      infoCodeCountry: [],
    },
    localAccountType.value
  );
  return getInfoLabels();
};

const restoreData = () => {
  localDataCurrent.value = localData.value;
  // We are using props because we don't need this value to change inside this component
  accountLabels.value = createLabels(props.options);
};

const changeStatusTo = (newStatus: StatusCard) => {
  baseCardRef.value?.changeStatusTo(newStatus);
  // baseRefd.value?.changeStatusTo(newStatus);
};

const constructorComp = (
  data?: DetailAccountModel,
  id?: string,
  accountType?: AccountModel,
  options?: OptionAccountInfo
) => {
  if (!id) {
    changeStatusTo('edit');
    return;
  }
  if (accountType) {
    localAccountType.value = accountType;
  }
  if (data) {
    if (data.id) localIdAccount.value = data.id;
    localData.value = data;
    restoreData();
    changeStatusTo('read');
  }

  if (options) {
    accountLabels.value = createLabels(options);
  }
};

const validateFields = async () => {
  return await inputAccountGeneratorRef.value?.validateFields();
};

const captureCurrentData = () => {
  return localDataCurrent.value;
};

const activateControls = (newId: string) => {
  localIdAccount.value = newId;
};

//* initial function
onMounted(() => {
  constructorComp(
    props.initialDataContact,
    props.idLocal,
    props.accountType,
    props.options
  );
});

defineExpose({
  isEditing,
  activateControls,
  constructorComp,
  captureCurrentData,
  changeStatusTo,
  restoreData,
  validateFields,
});
</script>

<template>
  <view-card-component
    :controls="!!localIdAccount"
    icon-name="feed"
    title="Información del cliente"
    @cancel-change="restoreData"
    ref="baseCardRef"
  >
    <template #edit>
      <InputAccountGenerator
        ref="inputAccountGeneratorRef"
        v-model="localDataCurrent"
        :options="options"
        :account-type="accountType"
        :edit-mode="!!localIdAccount"
      />
    </template>
    <template #read>
      <CardLabels :labels="accountLabels" class="q-px-md" />
    </template>
  </view-card-component>
</template>
