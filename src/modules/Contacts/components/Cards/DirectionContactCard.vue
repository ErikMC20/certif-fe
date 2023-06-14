<script lang="ts">
import { ref, onMounted, computed } from 'vue';
import DirectionGenerator from '../Inputs/DirectionGenerator.vue';
import {
  DirectionAccountComponentModel,
  DirectionValueModel,
} from '../../../Accounts/utils/types/index';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
import CardLabels from '../Labels/CardLabels.vue';
import { StatusCard } from 'src/components/types';
</script>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    idLocal?: string;
    data: DirectionAccountComponentModel;
    options: DirectionValueModel[];
  }>(),
  {
    idLocal: '',
  }
);

//* variables
const localIdContact = ref('');
const localData = ref({} as DirectionAccountComponentModel);
const localDataCurrent = ref({} as DirectionAccountComponentModel);

//* references
const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>(null);

//* computed variables
const isEditing = computed(() => {
  return baseCardRef.value?.isEditing === 'edit';
});

const formatDirection = computed(() => {
  if (localDataCurrent.value.address_street_generated_c)
    return localDataCurrent.value.address_street_generated_c.replace(
      '_gnrtd',
      ''
    );
  else return '';
});

//* methods
const restoreData = () => {
  localDataCurrent.value = localData.value;
};

const constructorComp = (
  data?: DirectionAccountComponentModel,
  id?: string
) => {
  console.log('your data: ', data);
  if (!id) {
    changeStatusTo('edit');
    return;
  }
  localIdContact.value = id;
  if (data) {
    localData.value = data;
    restoreData();
    changeStatusTo('read');
  }
};

const changeStatusTo = (newStatus: StatusCard) => {
  baseCardRef.value?.changeStatusTo(newStatus);
};

const captureCurrentData = () => {
  return localDataCurrent.value;
};

//* initial function
onMounted(() => {
  constructorComp(props.data, props.idLocal);
});

defineExpose({
  constructorComp,
  changeStatusTo,
  captureCurrentData,
  restoreData,
  isEditing,
});
</script>

<template>
  <view-card-component
    :controls="!!localIdContact"
    icon-name="location_on"
    title="Dirección del cliente"
    @cancel-change="restoreData"
    ref="baseCardRef"
  >
    <template #edit>
      <DirectionGenerator v-model="localDataCurrent" :options="options" />
    </template>
    <template #read>
      <div class="q-pa-sm">
        <CardLabels
          :labels="[
            {
              title: 'Direccion',
              value: formatDirection,
            },
          ]"
        />
      </div>
    </template>
  </view-card-component>
</template>
