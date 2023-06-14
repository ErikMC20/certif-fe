<script lang="ts">
import { ref, onMounted, computed } from 'vue';
import DirectionGenerator from '../MainInputs/DirectionGenerator.vue';
import { DirectionComponentModel, DirectionValueModel } from '../types';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
import CardLabels from '../Labels/CardLabels.vue';
import { StatusCard } from 'src/components/types';
</script>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    idLocal?: string;
    data: DirectionComponentModel;
    options: DirectionValueModel[];
    directionCRM3?: string;
  }>(),
  {
    idLocal: '',
  }
);

//* variables
const localIdContact = ref('');
const localData = ref({} as DirectionComponentModel);
const localDataCurrent = ref({} as DirectionComponentModel);

//* references
const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>(null);

//* computed variables
const isEditing = computed(() => {
  return baseCardRef.value?.isEditing === 'edit';
});

const formatDirection = computed(() => {
  if (localDataCurrent.value.address_street_generated_c)
    return localDataCurrent.value.address_street_generated_c
      .replace('_gnrtd', '')
      .replaceAll(',|', '');
  else return '';
});

//* methods
const restoreData = () => {
  localDataCurrent.value = localData.value;
};

const constructorComp = (
  data?: DirectionComponentModel,
  id?: string,
  forceData?: boolean
) => {
  // console.log('your data: ', data, 'your id: ', id);
  // if (!id) {
  //   changeStatusTo('edit');
  //   return;
  // }
  // localIdContact.value = id;
  // if (data) {
  //   localData.value = data;
  //   restoreData();
  //   changeStatusTo('read');
  // }
  if (id) {
    localIdContact.value = id;
  }
  if (data && !id) {
    localData.value = data;
    restoreData();
    changeStatusTo('edit');
    return;
  }
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

const cancelChanges = () => {
  baseCardRef.value?.onClickCancel();
};

//* initial function
onMounted(() => {
  constructorComp(props.data, props.idLocal);
});

defineExpose({
  constructorComp,
  changeStatusTo,
  captureCurrentData,
  cancelChanges,
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
        <div>
          <q-banner rounded dense class="bg-primary text-white">
            <span>Direccion CRM 3</span> <br/>
            {{ directionCRM3 || `-Sin Dirección-` }}
          </q-banner>

          <!-- <q-icon color="blue" name="info_outline" size="sm" class="q-mt-sm">
            <q-tooltip
              class="bg-primary"
              anchor="center left"
              self="center right"
              :offset="[10, 10]"
            >
              Dirección desde CRM 3: {{ directionCRM3 || 'Sin direccion' }}
            </q-tooltip>
          </q-icon> -->
        </div>
        <CardLabels
          full-width
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
