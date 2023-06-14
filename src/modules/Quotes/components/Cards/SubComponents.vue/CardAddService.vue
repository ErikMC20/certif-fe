<script lang="ts">
import { ref, onMounted } from 'vue';
import * as utils from '../../../utils/types';
</script>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    dataEdit?: any;
  }>(),
  {
    dataEdit: '',
  }
);

const data = ref({} as utils.serviceProducts);
const bloqueado = ref(true);

const tipodescuentolista = [
  { label: 'Porcentaje', value: 'Percentage' },
  { label: 'Monto', value: 'Amount' },
];

const cancelar = ref(true);

const cerrarCard = () => {
  cancelar.value = false;
  data.value = {
    service_product_qty: 0,
    service_name: '',
    service_product_list_price: 0,
    service_product_discount: 0,
    service_discount: '',
    service_product_unit_price: 0,
    service_product_total_price: 0,
  };
};
const mountservice = () => {
  if (data.value.service_product_qty == 0) {
    data.value.service_product_qty = 1;
  }
  data.value.service_product_unit_price = data.value.service_product_list_price;
  data.value.service_product_total_price =
    Number(data.value.service_product_list_price) *
    Number(data.value.service_product_qty);
  discount();
  emit('recalculototalesServi');
};

const discount = () => {
  if (data.value.service_discount == 'Amount') {
    if (
      Number(data.value.service_product_discount) >
        Number(data.value.service_product_list_price) ||
      Number(data.value.service_product_discount) < 0
    ) {
      data.value.service_product_total_price = 0;
      data.value.service_product_unit_price = 0;
    } else {
      data.value.service_product_total_price =
        (Number(data.value.service_product_list_price) -
          Number(data.value.service_product_discount)) *
        Number(data.value.service_product_qty);
      data.value.service_product_unit_price =
        Number(data.value.service_product_list_price) -
        Number(data.value.service_product_discount);
    }
  } else if (data.value.service_discount == 'Percentage') {
    if (
      Number(data.value.service_product_discount) > 100 ||
      Number(data.value.service_product_discount) < 0
    ) {
      data.value.service_product_unit_price = 0;
      data.value.service_product_total_price = 0;
    } else {
      const aux =
        Number(data.value.service_product_list_price) *
        Number(data.value.service_product_discount);
      data.value.service_product_unit_price =
        Number(data.value.service_product_list_price) - aux / 100;
      data.value.service_product_total_price =
        Number(data.value.service_product_qty) *
        (Number(data.value.service_product_list_price) - aux / 100);
    }
  }
  emit('recalculototalesServi');
};

const amount = (val: any) => {
  if (val < 0) {
    data.value.service_product_qty = 1;
  }
  data.value.service_product_total_price =
    Number(data.value.service_product_unit_price) *
    Number(data.value.service_product_qty);
  emit('recalculototalesServi');
};

const descriptionName = () => {
  if (data.value.service_name != '') {
    bloqueado.value = false;
  }
};

onMounted(() => {
  console.log(props.nameEdit);
  if (props.dataEdit == '') {
    data.value = {
      service_product_qty: 0,
      service_name: '',
      service_product_list_price: 0,
      service_product_discount: 0,
      service_discount: 'Amount',
      service_product_unit_price: 0,
      service_product_total_price: 0,
      service_number: 0,
      // service_id: '0',
      service_procedencia: '',
      service_delivery_time: '',
      service_flag_chasis_c: 0,
      service_parent_type_c: 'HANI_Servicio',
    };
  } else {
    /**
     * ! aquí tienen que estar para editar el producto
     */
    data.value = {
      service_product_qty: props.dataEdit.product_qty,
      service_name: props.dataEdit.name,
      service_product_list_price: props.dataEdit.product_list_price,
      service_product_discount: props.dataEdit.product_discount,
      service_discount: props.dataEdit.discount,
      service_product_unit_price: props.dataEdit.product_unit_price,
      service_product_total_price: props.dataEdit.product_total_price,
      service_number: props.dataEdit.number,
      // service_id: '0',
      service_procedencia: '',
      service_delivery_time: '',
      service_flag_chasis_c: 0,
      service_parent_type_c: 'HANI_Servicio',
    };
  }
});
const emit = defineEmits<{
  (event: 'recalculototalesServi'): void;
  (event: 'recalculototalesProd'): void;
  (event: 'recalculototalesNoSto'): void;
}>();
const exposeData = () => {
  return data.value;
};
defineExpose({
  exposeData,
});
</script>

<template>
  <!-- <pre>{{ dataEdit }}</pre> -->
  <div class="row q-col-gutter-xs col-12" v-if="!!cancelar">
    <div class="col-md-12 col-sm-12 row justify-end">
      <q-btn
        dense
        flat
        outline
        color="primary"
        :icon="!$q.screen.xs ? 'close' : 'arrow_forward'"
        @click="cerrarCard"
      >
        <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
      </q-btn>
      <q-separator></q-separator>
    </div>

    <div
      class="row q-col-gutter-x-xs q-col-gutter-y-lg col-md-6 col-xs-12 flex-center"
    >
      <div class="col-2 flex-center">
        <q-input
          outlined
          v-model="data.service_product_qty"
          label="Cantidad"
          type="number"
          dense
          label-slot
          @update:model-value="amount"
          :readonly="!data.service_name ? true : false"
        >
        </q-input>
      </div>
      <div class="col-10 flex-center">
        <q-input
          outlined
          type="textarea"
          v-model="data.service_name"
          label="Descripción"
          dense
          label-slot
          rows="4"
          cols="50"
          @update:model-value="descriptionName"
        >
        </q-input>
      </div>
    </div>

    <div class="row q-col-gutter-xs col-md-6 col-xs-12 flex-center">
      <div class="col-md-3 col-xs-5">
        <q-input
          outlined
          v-model="data.service_product_list_price"
          label="Precio"
          dense
          label-slot
          type="number"
          @update:model-value="mountservice"
          :readonly="!data.service_name ? true : false"
        >
        </q-input>
      </div>
      <div class="col-md-2 col-xs-4">
        <q-input
          outlined
          v-model="data.service_product_discount"
          label="Descuento"
          dense
          label-slot
          type="number"
          @update:model-value="discount"
          :readonly="bloqueado"
        >
        </q-input>
      </div>
      <div class="col-md-2 col-xs-3">
        <q-select
          v-model="data.service_discount"
          :options="tipodescuentolista"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          outlined
          dense
          label="Tipo de Descuento"
          @update:model-value="discount"
        />
      </div>
      <div class="col-md-3 col-xs-6">
        <q-input
          outlined
          v-model="data.service_product_unit_price"
          label="Precio por unidad"
          dense
          label-slot
          readonly
          type="number"
        >
        </q-input>
      </div>
      <div class="col-md-2 col-xs-6">
        <q-input
          outlined
          v-model="data.service_product_total_price"
          label="Total"
          dense
          label-slot
          readonly
          type="number"
        >
        </q-input>
      </div>
    </div>
  </div>
  <!-- <pre> data-ss {{ dataEdit }}</pre> -->
</template>
