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
const tipoMonto=[
  {
    label:'Vehiculo',
    value:'01_Vehiculo'
  },
  {
    label:'Anticipo',
    value:'02_Anticipo'
  },
  {
    label:'Deposito en garantia',
    value:'03_deposito'
  }
]
const baseCardMountReserve = ref<InstanceType<typeof ViewCardVue> | null>(null);
const montoref = ref<InstanceType<typeof QInput> | null>(null);
const languageStore = useFormOptionsStore();
const montoReserva=ref( {
    monto: '',
    moneda: '-99',
    tipo: '02_Anticipo',
})

//* Computed variables
const isEditingMountReserve = computed(() => baseCardMountReserve.value?.isEditing === 'edit');

//* methods
const validateInputs = async () => {
  const validatedFields = await Promise.all([
    montoref.value?.validate(),
  ]);
  return validatedFields.every((field) => !!field);
};

const restoreValues = () => {
   montoReserva.value.monto='';
   montoReserva.value.moneda='-99';
   montoReserva.value.tipo='02_Anticipo'; 
};
const exposeData = () => {
  return montoReserva.value;
};

defineExpose({
  validateInputs,
  exposeData,
  isEditingMountReserve,
});
</script>
<template>
  <view-card-component
    :controls="!!id"
    :initial-status="readMode == true ? 'edit' : 'read'"
    icon-name="attach_money"
    ref="baseCardMountReserve"
    title="Monto de la reserva"
    @cancel-change="restoreValues"
  >
    <template #edit>
      <div class="row q-col-gutter-lg">
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          ref="montoref"          
          dense
          v-model="montoReserva.monto"
          type="number"
          label="Monto"
          :rules="[(val) => !!val || 'Ingrese un monto']"
        />
        <q-select
        class="col-12 col-sm-6"
        outlined
        dense
        v-model="montoReserva.moneda"
        :options="languageStore.leadCurrency"
        type="text"
        label="Moneda"
        option-value="id"
        option-label="name"
        emit-value
        map-options
      />
        <q-select
        
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="montoReserva.tipo"
          :options="tipoMonto"
          type="text"
          label="Tipo"
          option-value="value"
          option-label="label"
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
        class="col-12 col-sm-6 q-pb-none"
          bg-color="grey-2"
          filled
          
          outlined
          readonly
          dense
          v-model="montoReserva.monto"
          ref="montoref" 
          type="text"
          label="Monto"
          :rules="[(val) => !!val || 'Ingrese un monto']"
        />
        <q-select
        label-color="primary"
        class="col-12 col-sm-6"
          bg-color="grey-2"
          filled
        readonly
        hide-dropdown-icon
        outlined
        dense
        v-model="montoReserva.moneda"
        :options="languageStore.leadCurrency"
        type="text"
        label="Moneda"
        option-value="id"
        option-label="name"
        emit-value
        map-options
      />
        <q-select
        label-color="primary"
        class="col-12 col-sm-6"
          bg-color="grey-2"
          filled
        readonly
        hide-dropdown-icon
          outlined
          dense
          v-model="montoReserva.tipo"
          :options="tipoMonto"
          type="text"
          label="Tipo"
          option-value="value"
          option-label="label"
          emit-value
          map-options
        />
      </div>
    </template>
  </view-card-component>
 
</template>
