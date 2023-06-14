<script lang="ts">
import { ref, onMounted } from 'vue';
import * as utils from '../../../utils/types';
import RelacionadoProveedor from 'src/components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoProveedor.vue';
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

const data = ref({} as utils.productoProducts);
const advancedFilterProveedor = ref<InstanceType<
  typeof RelacionadoProveedor
> | null>(null);

const tipodescuentolista = [
  { label: 'Porcentaje', value: 'Percentage' },
  { label: 'Monto', value: 'Amount' },
];

const listDeliveryTime = [
  { label: 'Inmediato', value: 'inmediate' },
  { label: '1 días', value: '03_08_01' },
  { label: '2 días', value: '03_08_02' },
  { label: '15 días', value: '03_08_15' },
  { label: '30 días', value: '03_08_30' },
  { label: '45 días', value: '03_08_45' },
  { label: '60 días', value: '03_08_60' },
  { label: 'Otros', value: 'other' },
];

const cancelar = ref(true);
const bloqueado = ref(true);
const bloqueadoProveedor = ref(true);

const cerrarCard = () => {
  cancelar.value = false;
  data.value = {
    product_product_qty: '',
    product_name: '',
    product_part_number: '',
    product_product_list_price: '',
    product_product_discount: '',
    product_discount: '',
    product_product_unit_price: '',
    product_product_total_price: '',
    product_item_description: '',
    product_description: '',
    product_proveedores_c: '',
    product_hanp_proveedores_id_c: '',
    product_product_delivery_time: '',
  };
};

const mountservice = () => {
  data.value.product_product_unit_price = data.value.product_product_list_price;
  data.value.product_product_total_price = String(
    Number(data.value.product_product_list_price) *
      Number(data.value.product_product_qty)
  );
  if (data.value.product_product_qty == '0') {
    data.value.product_product_qty = '1';
  }
  discount();
  emit('recalculototalesNoSto');
};
type item = {
  name: string;
  id: string;
};
const selectRelaProveedor = (item: item) => {
  data.value.product_proveedores_c = String(item.name);
  data.value.product_hanp_proveedores_id_c = String(item.id);
  advancedFilterProveedor.value?.onClose();
};
const openDialogProveedor = () => {
  advancedFilterProveedor.value?.openDialog();
};
const clearProveedor = () => {
  data.value.product_proveedores_c = '';
  data.value.product_hanp_proveedores_id_c = '';
};

const amount = (val: any) => {
  if (val < 0) {
    data.value.product_product_qty = '1';
  }
  data.value.product_product_total_price = String(
    Number(data.value.product_product_unit_price) *
      Number(data.value.product_product_qty)
  );
  emit('recalculototalesNoSto');
};
const descriptionName = () => {
  if (data.value.product_name != '') {
    bloqueado.value = false;
  }
};

const discount = () => {
  if (data.value.product_discount == 'Amount') {
    if (
      Number(data.value.product_product_discount) >
        Number(data.value.product_product_list_price) ||
      Number(data.value.product_product_discount) < 0
    ) {
      data.value.product_product_total_price = '0';
      data.value.product_product_unit_price = '0';
    } else {
      data.value.product_product_total_price = String(
        (Number(data.value.product_product_list_price) -
          Number(data.value.product_product_discount)) *
          Number(data.value.product_product_qty)
      );
      data.value.product_product_unit_price = String(
        Number(data.value.product_product_list_price) -
          Number(data.value.product_product_discount)
      );
    }
  } else if (data.value.product_discount == 'Percentage') {
    if (
      Number(data.value.product_product_discount) > 100 ||
      Number(data.value.product_product_discount) < 0
    ) {
      data.value.product_product_unit_price = '0';
      data.value.product_product_total_price = '0';
    } else {
      const aux =
        Number(data.value.product_product_list_price) *
        Number(data.value.product_product_discount);
      data.value.product_product_unit_price = String(
        Number(data.value.product_product_list_price) - aux / 100
      );
      data.value.product_product_total_price = String(
        Number(data.value.product_product_qty) *
          (Number(data.value.product_product_list_price) - aux / 100)
      );
    }
  }
  emit('recalculototalesNoSto');
};

onMounted(() => {
  if (props.dataEdit == '') {
    data.value = {
      product_product_qty: '0',
      product_name: '',
      product_part_number: '',
      product_product_list_price: '',
      product_product_discount: '0',
      product_discount: 'Amount',
      product_product_unit_price: '0',
      product_product_total_price: '0',
      product_item_description: '',
      product_description: '',
      product_proveedores_c: '',
      product_product_delivery_time: '',
      product_number: 0,
      product_id: '',
      product_procedencia: '',
      // product_delivery_time: '',
      product_flag_chasis_c: 0,
      product_parent_type_c: 'HANI_ItemNoStock',
    };
  } else {
    /**
     * ! aquí tienen que estar para editar el producto
     */
    data.value = {
      product_product_qty: props.dataEdit.product_qty,
      product_name: props.dataEdit.name,
      product_part_number: props.dataEdit.part_number,
      product_product_list_price: props.dataEdit.product_list_price,
      product_product_discount: props.dataEdit.product_discount,
      product_discount: props.dataEdit.discount,
      product_product_unit_price: props.dataEdit.product_unit_price,
      product_product_total_price: props.dataEdit.product_total_price,
      product_item_description: props.dataEdit.item_description,
      product_description: props.dataEdit.description,
      product_proveedores_c: '',
      product_product_delivery_time: props.dataEdit.product_delivery_time,
      product_number: props.dataEdit.number,
      product_id: props.dataEdit.product_id,
      product_procedencia: '',
      // product_delivery_time: '',
      product_flag_chasis_c: 0,
      product_parent_type_c: 'HANI_ItemNoStock',
    };
  }
});
const emit = defineEmits<{
  (event: 'recalculototalesNoSto'): void;
  (event: 'recalculototalesServi'): void;
  (event: 'recalculototalesProd'): void;
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
          v-model="data.product_product_qty"
          label="Cantidad"
          type="number"
          dense
          label-slot
          @update:model-value="amount"
          :readonly="!data.product_name ? true : false"
        >
        </q-input>
      </div>

      <div class="col-10 flex-center">
        <div class="row">
          <div class="col-6 flex-center">
            <q-input
              outlined
              v-model="data.product_name"
              label="Producto"
              dense
              label-slot
              @update:model-value="descriptionName"
            >
            </q-input>
          </div>
          <div class="col-1"></div>
          <div class="col-5 flex-center">
            <q-input
              outlined
              v-model="data.product_part_number"
              label="Número de Parte"
              dense
              label-slot
            >
            </q-input>
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col-6 flex-center">
            <!-- <q-input
              outlined
              v-model="data.product_proveedores_c"
              label="Proveedor"
              dense
              label-slot
            >
            </q-input> -->
            <div class="col-md-6 col-xs-12">
              <q-input
                outlined
                v-model="data.product_proveedores_c"
                label="Proveedores"
                class="col-md-6 col-sm-12"
                :readonly="bloqueadoProveedor"
                dense
                label-slot
              >
                <template v-slot:prepend>
                  <q-avatar>
                    <q-icon name="" size="sm" />
                  </q-avatar>
                </template>
                <template v-slot:after>
                  <q-btn
                    dense
                    outline
                    icon="north_west"
                    color="primary"
                    @click="openDialogProveedor"
                  />
                  <q-btn
                    dense
                    outline
                    icon="close"
                    color="negative"
                    @click="clearProveedor"
                  />
                </template>
              </q-input>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row q-col-gutter-xs col-md-6 col-xs-12 flex-center">
      <div class="col-md-3 col-xs-5">
        <q-input
          outlined
          v-model="data.product_product_list_price"
          label="Precio"
          type="number"
          dense
          label-slot
          @update:model-value="mountservice"
          :readonly="!data.product_name ? true : false"
        >
        </q-input>
      </div>
      <div class="col-md-2 col-xs-4">
        <q-input
          outlined
          v-model="data.product_product_discount"
          label="Descuento"
          type="number"
          dense
          label-slot
          @update:model-value="discount"
          :readonly="bloqueado"
        >
        </q-input>
      </div>
      <div class="col-md-2 col-xs-3">
        <q-select
          v-model="data.product_discount"
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
          v-model="data.product_product_unit_price"
          label="Precio por unidad"
          type="number"
          dense
          label-slot
        >
        </q-input>
      </div>
      <div class="col-md-2 col-xs-6">
        <q-input
          outlined
          v-model="data.product_product_total_price"
          label="Total"
          type="number"
          dense
          label-slot
        >
        </q-input>
      </div>
      <div class="col-md-4 col-xs-12">
        <q-input
          outlined
          v-model="data.product_item_description"
          label="Descripción"
          dense
          label-slot
        >
        </q-input>
      </div>
      <div class="col-md-4 col-xs-8">
        <q-input
          outlined
          v-model="data.product_description"
          label="Nota"
          dense
          label-slot
        >
        </q-input>
      </div>
      <div class="col-md-4 col-xs-4">
        <q-select
          v-model="data.product_product_delivery_time"
          :options="listDeliveryTime"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          outlined
          dense
          label="Tiempro de Entrega"
        />
      </div>
    </div>
  </div>
  <!-- <pre>{{ data }}</pre> -->

  <RelacionadoProveedor
    account_id=""
    ref="advancedFilterProveedor"
    @selectItem="selectRelaProveedor"
    id=""
  />
</template>
