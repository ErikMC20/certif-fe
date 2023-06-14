<script lang="ts" setup>
import { ref, computed } from 'vue';
import { CardInfo } from '../../../utils/types';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
import { QInput } from 'quasar';
const props = withDefaults(
  defineProps<{
    id?: string;
    data?: CardInfo;
    readMode?: boolean;
  }>(),
  {
    readMode: true,
  }
);
const baseCardDelivery = ref<InstanceType<typeof ViewCardVue> | null>(null);
const montoref = ref<InstanceType<typeof QInput> | null>(null);
const languageStore = useFormOptionsStore();
const dataCreateReserve=ref( {
    fecha_entrega: '',
    lugar_entrega_c: ''
})

//* Computed variables
const isEditingInfoDelivery = computed(() => baseCardDelivery.value?.isEditing === 'edit');

//* methods
const validateInputs = async () => {
  const validatedFields = await Promise.all([
    montoref.value?.validate(),
  ]);
  return validatedFields.every((field) => !!field);
};

const restoreValues = () => {
   dataCreateReserve.value.fecha_entrega='';
   dataCreateReserve.value.lugar_entrega_c='';
};
const exposeData = () => {
  return dataCreateReserve.value;
};

defineExpose({
  validateInputs,
  exposeData,
  isEditingInfoDelivery,
});
</script>
<template>
  <view-card-component
    :controls="!!id"
    :initial-status="readMode == true ? 'edit' : 'read'"
    icon-name="attach_money"
    ref="baseCardDelivery"
    title="Datos basicos para crear la entrega"
    @cancel-change="restoreValues"
  >
    <template #edit>
      <div class="row q-col-gutter-lg">
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="dataCreateReserve.fecha_entrega"
          type="date"
          label="Fecha de cierre"
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="dataCreateReserve.lugar_entrega_c"
          :options="languageStore.deliveryOptions.place.data"
          type="text"
          label="Lugar de entrega"
          option-value="value"
          option-label="label"
          hide-dropdown-icon
          emit-value
          map-options
        />
      </div>
    </template>
    <template #read>
     <!-- <pre>{{ data }}</pre>  -->
     <div class="row q-col-gutter-lg">
        <q-input
        label-color="primary"
        filled
        bg-color="grey-2"
        readonly
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="dataCreateReserve.fecha_entrega"
          type="date"
          label="Fecha de cierre"
        />
        <q-select
        label-color="primary"
        filled
        bg-color="grey-2"
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="dataCreateReserve.lugar_entrega_c"
          :options="languageStore.deliveryOptions.place.data"
          readonly
          type="text"
          label="Lugar de entrega"
          option-value="value"
          option-label="label"
          hide-dropdown-icon
          emit-value
          map-options
        />
      </div>
    </template>
  </view-card-component>
 
</template>
