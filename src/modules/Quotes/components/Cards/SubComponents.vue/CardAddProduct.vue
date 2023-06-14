<script lang="ts">
export default {
  name: 'CardAddProduct',
};
</script>
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import FilterProduct from '../../Dialogs/DialogsFilters/FilterProduct.vue';
import { useQuotesStore } from 'src/modules/Quotes/store/QuotesStore';
import VerProduct from '../../Dialogs/DialogsFilters/VerProduct.vue';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import SelectProduct from '../../Dialogs/DialogsFilters/SelectProduct.vue';
import { useQuasar } from 'quasar';
const props = withDefaults(
  defineProps<{
    dataEdit?: any;
  }>(),
  {
    dataEdit: '',
  }
);

const data = ref({
  cantidad: 0,
  producto: '',
  chasis: '',
  color: '',
  gestion: '',
  almacen: '',
  precio: 0,
  tipodes: 'Amount',
  descuento: '',
  preciounidad: 0,
  total: 0,
  descripcion: '',
  nota: '',
  tiempoentrega: 'inmediate',
  idmodelo: '',
  idproducto: '',
  idstock: '',
  procedencia: '',
  number: 0,
  flag_chasis: 0,
  parent_product: 'HANI_ItemStock',
  id: '',
  idquotes: '',
  idgrupo: '',
});

const $q = useQuasar();
const clickColor = ref(false);
const listSelect = ref();
const cancelar = ref(true);
const listAuxi = ref();
const cargar = ref(false);
const cargareditar = ref(false);
const quotesStore = useQuotesStore();
const cotizacionInfoRapida = ref();
const filterProductRef = ref<InstanceType<typeof FilterProduct> | null>(null);
const selectProductRef = ref<InstanceType<typeof SelectProduct> | null>(null);
const verProductRef = ref<InstanceType<typeof VerProduct> | null>(null);

onMounted(async () => {
  if (props.dataEdit != '') {
    data.value = {
      cantidad: props.dataEdit.product_qty,
      producto: props.dataEdit.name,
      chasis: props.dataEdit.part_number,
      color: props.dataEdit.color,
      gestion: props.dataEdit.gestion,
      almacen: props.dataEdit.almacen,
      precio: props.dataEdit.product_list_price,
      tipodes: props.dataEdit.discount,
      descuento: props.dataEdit.product_discount,
      preciounidad: props.dataEdit.product_unit_price,
      total: props.dataEdit.product_total_price,
      descripcion: props.dataEdit.description,
      nota: props.dataEdit.item_description,
      tiempoentrega: props.dataEdit.product_delivery_time,
      idmodelo: '',
      idproducto: props.dataEdit.product_id,
      idstock: '',
      procedencia: props.dataEdit.product_procedencia,
      number: 0,
      flag_chasis: 0,
      parent_product: 'HANI_ItemStock',
      id: props.dataEdit.id,
      idquotes: props.dataEdit.parent_id,
      idgrupo: props.dataEdit.group_id,
    };
  } else {
  }
  listAuxi.value = await quotesStore.getFilterProductosVer2Store('');
  listSelect.value = listAuxi.value;
});

// JSON DE ENTRADA DE UN CHASIS PARA MANDAR A LA VISTA==============
// {
//     "id_hanq_modelo": "9165429F-0AD2-4FDA-AB0C-2DA0C969554B",
//     "name_hanq_modelo": "FOX TRENDLINE 1,6",
//     "codigoaio_c_hanq_modelo": "3019367",
//     "iddivision_c_hanq_modelo": "03",
//     "idamercado_c_hanq_modelo": "03_01",
//     "marca_c_hanq_modelo": null,
//     "id_aos_products": "7F42C1D0-8A21-4A30-AF55-B32FFF24BCCD",
//     "name_aos_products": "FOX TRENDLINE 1,6",
//     "currency_id_aos_products": "-99",
//     "price_aos_products": 18750,
//     "price_usdollar_aos_products": 18750,
//     "anio_c_aos_products_cstm": 2017,
//     "almacen_c_aos_products_cstm": "02_SC00_S300",
//     "procedencia_c_aos_products_cstm": "BR",
//     "procedencia_c_value": "Brasil",
//     "centro_c_aos_products_cstm": "02_SC00",
//     "centro_c_value": "Centro Santa Cruz",
//     "id_hanq_stock": "2CA8B014-BEB4-41D1-8B0A-8AFFC2DB3769",
//     "chasis_c_hanq_stock": "9BWAB45Z8H4039264",
//     "motor_c_hanq_stock": "CFZ R12801",
//     "nombre_color_c_hanq_stock": "PLATA TUNGSTEN",
//     "gestion_hanq_stock": 2017,
//     "lote_c_hanq_stock": "39264",
//     "stock_c_hanq_stock": 1,
//     "almacen_c_hanq_stock": "02_SC00_S300",
//     "almacen_c_hanq_stock_value": "S300",
//     "ubicacion_c_hanq_stock": "",
//     "estado_cotizacion_c_hanq_stock": "Draft",
//     "estadia_c": 0,
//     "total_estadia": 250
// }
//==================================================================
const chasisIngreso = (item: any) => {
  data.value = {
    cantidad: 1,
    producto: item.name_hanq_modelo,
    chasis: item.chasis_c_hanq_stock,
    color: item.nombre_color_c_hanq_stock,
    gestion: item.gestion_hanq_stock,
    almacen: item.centro_c_value,
    precio: item.price_aos_products,
    tipodes: 'Amount',
    descuento: '',
    preciounidad: item.price_aos_products,
    total: item.price_aos_products,
    descripcion: '',
    nota: '',
    tiempoentrega: 'inmediate',
    idmodelo: item.id_hanq_modelo,
    idproducto: item.id_aos_products,
    idstock: item.id_hanq_stock,
    procedencia: item.procedencia_c_value,
    number: 0,
    flag_chasis: 1,
    parent_product: 'HANI_ItemStock',
    id: '',
    idquotes: '',
    idgrupo: '',
  };
  clickColor.value = true;
};
watch(
  () => data.value.cantidad,
  async () => {
    emit('recalculototalesProd');
  }
);

//calcualando la logica==================================================================================
const logicaAgregar = () => {
  if (data.value.tipodes == 'Percentage' && data.value.descuento > 100)
    data.value.descuento = 100;
  if (data.value.tipodes == 'Percentage' && data.value.descuento < 0)
    data.value.descuento = 0;

  if (
    data.value.tipodes == 'Amount' &&
    data.value.descuento > data.value.precio
  )
    data.value.descuento = data.value.precio;
  if (data.value.tipodes == 'Amount' && data.value.descuento < 0)
    data.value.descuento = 0;

  if (data.value.cantidad < 1) data.value.cantidad = 1;
  calculandoDescue();
  calculandoTotal();
  emit('recalculototalesProd');
};
const calculandoDescue = () => {
  if (data.value.tipodes == 'Amount') {
    data.value.preciounidad = data.value.precio - data.value.descuento;
  } else if (data.value.tipodes == 'Percentage') {
    const aux = data.value.precio * data.value.descuento;
    data.value.preciounidad = data.value.precio - aux / 100;
  }
};
const calculandoTotal = () => {
  data.value.total = data.value.preciounidad * Number(data.value.cantidad);
};
// ==========================================================================================================

const cerrarCard = () => {
  data.value = {
    cantidad: 0,
    producto: '',
    chasis: '',
    color: '',
    gestion: '',
    almacen: '',
    precio: 0,
    tipodes: 'Amount',
    descuento: '',
    preciounidad: 0,
    total: 0,
    descripcion: '',
    nota: '',
    tiempoentrega: '',
    idmodelo: '',
    idproducto: '',
    idstock: '',
    procedencia: '',
    number: 0,
    flag_chasis: 0,
    parent_product: '',
    id: '',
    idquotes: '',
    idgrupo: '',
  };
  logicaAgregar();
  cancelar.value = false;
  // emit('idstockCerrarCard', val);
};

const verPorColores = (idprod: string, idmod: string, info: any) => {
  cotizacionInfoRapida.value = info;
  verProductRef.value?.openDialog(idprod, idmod, info);
};

const cotizacionRapida = (info: any) => {
  data.value = {
    cantidad: 1,
    producto: info.namemodelo,
    chasis: '',
    color: '',
    gestion: info.anio_c,
    almacen: info.valuecentro,
    precio: info.price,
    tipodes: 'Amount',
    descuento: '',
    preciounidad: info.price,
    total: info.price,
    descripcion: '',
    nota: '',
    tiempoentrega: 'inmediate',
    idmodelo: info.idmodelo,
    idproducto: info.idproducto,
    idstock: '',
    procedencia: info.valueprocedencia,
    number: 0,
    flag_chasis: 0,
    parent_product: 'HANI_ItemStock',
    id: '',
    idquotes: '',
    idgrupo: '',
  };
  cotizacionInfoRapida.value = info;
  clickColor.value = true;
};
const cambiarColor = (idprod: string, idmod: string) => {
  verProductRef.value?.openDialog(idprod, idmod, cotizacionInfoRapida.value);
};

const openDialogProd = () => {
  filterProductRef.value?.openDialog();
};
const verSelectFiltro = () => {
  selectProductRef.value?.openDialog();
};
// cambio de monto a comas y punto ==================================================================>
// const cambioAmount = () => {
//   data.value.precio = data.value.precio.toLocaleString('en-ES', {
//     minimumFractionDigits: 2,
//   });
//   data.value.preciounidad = data.value.preciounidad.toLocaleString('en-ES', {
//     minimumFractionDigits: 2,
//   });
//   data.value.total = data.value.total.toLocaleString('en-ES', {
//     minimumFractionDigits: 2,
//   });
// };

// ==================================================================================================>

const optioneslis = [
  { label: 'Inmediato', value: 'inmediate' },
  { label: '1 días', value: '03_08_01' },
  { label: '2 días', value: '03_08_02' },
  { label: '15 días', value: '03_08_15' },
  { label: '30 días', value: '03_08_30' },
  { label: '45 días', value: '03_08_45' },
  { label: '60 días', value: '03_08_60' },
  { label: 'Otros', value: 'other' },
];

const tipodescuentolista = [
  { label: 'Porcentaje', value: 'Percentage' },
  { label: 'Monto', value: 'Amount' },
];

// watch(
//   () => data.value.descuento,
//   async () => {
//     console.log('object');
//   }
// );

const emit = defineEmits<{
  (event: 'recalculototalesProd'): void;
  (event: 'recalculototalesNoSto'): void;
  (event: 'recalculototalesServi'): void;
}>();
const exposeData = () => {
  return data.value;
};

defineExpose({
  exposeData,
  data,
});
</script>
<template>
  <!-- <q-card bordered flat class="q-pa-xs col-12"> -->
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
    <div class="row col-12">
      <div
        class="row q-col-gutter-x-xs q-col-gutter-y-lg col-md-6 col-xs-12 flex-center"
      >
        <div class="col-md-2 col-xs-2">
          <q-input
            outlined
            v-model="data.cantidad"
            label="Cantidad"
            type="number"
            dense
            label-slot
            @update:model-value="logicaAgregar"
            :readonly="!data.producto ? true : false"
          >
          </q-input>
        </div>
        <div class="col-md-5 col-xs-10">
          <q-input
            outlined
            v-model="data.producto"
            label="Producto"
            type="text"
            dense
            label-slot
            clearable
            readonly
            @click="verSelectFiltro"
          >
            <template v-slot:after>
              <q-btn
                dense
                outline
                icon="search"
                color="primary"
                @click="openDialogProd"
              />
            </template>
          </q-input>
        </div>
        <!-- :clickable="clickColor" sacando por cambio -->
        <div
          class="col-md-5 col-xs-12 q-gutter-xs"
          v-if="data.chasis == '' && data.producto != ''"
        >
          <q-item
            :clickable="data.producto != '' ? true : false"
            @click="cambiarColor(data.idproducto, data.idmodelo)"
          >
            <q-item-section>
              <div align="right">
                <q-btn
                  dense
                  outline
                  icon="add_to_photos"
                  size="md"
                  color="primary"
                />
                <q-tooltip
                  class="bg-indigo"
                  :offset="[10, 10]"
                  transition-show="scale"
                  transition-hide="scale"
                  >Seleccionar chasis y/o color!</q-tooltip
                >
              </div>
              <div>
                <span class="text-weight-medium">Gestión :</span>
                <span class="text-grey-8"> {{ data.gestion }}</span>
              </div>
              <div>
                <span class="text-weight-medium">Almacen :</span>
                <span class="text-grey-8"> {{ data.almacen }}</span>
              </div>
            </q-item-section>
          </q-item>

          <!-- </q-label> -->
        </div>
        <div class="col-md-5 col-xs-12 q-gutter-xs" v-else>
          <q-item
            :clickable="data.producto != '' ? true : false"
            @click="cambiarColor(data.idproducto, data.idmodelo)"
          >
            <q-item-section>
              <div>
                <span class="text-weight-medium">Chasis :</span>
                <span class="text-grey-8"> {{ data.chasis }}</span>
              </div>
              <div>
                <span class="text-weight-medium">Color :</span>
                <span class="text-grey-8"> {{ data.color }}</span>
              </div>
              <div>
                <span class="text-weight-medium">Gestión :</span>
                <span class="text-grey-8"> {{ data.gestion }}</span>
              </div>
              <div>
                <span class="text-weight-medium">Almacen :</span>
                <span class="text-grey-8"> {{ data.almacen }}</span>
              </div>
            </q-item-section>
          </q-item>

          <!-- </q-label> -->
        </div>
      </div>
      <!-- ************************************************************* -->
      <div class="row q-col-gutter-xs col-md-6 col-xs-12 flex-center">
        <div class="col-md-3 col-xs-5">
          <q-input
            outlined
            v-model="data.precio"
            label="Precio"
            dense
            label-slot
            @update:model-value="logicaAgregar"
            readonly
          >
          </q-input>
        </div>
        <div class="col-md-2 col-xs-3">
          <q-select
            v-model="data.tipodes"
            :options="tipodescuentolista"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            outlined
            dense
            @update:model-value="logicaAgregar"
          />
        </div>
        <div class="col-md-2 col-xs-4">
          <q-input
            outlined
            v-model="data.descuento"
            label="Descuento"
            type="number"
            dense
            label-slot
            @update:model-value="logicaAgregar"
          >
          </q-input>
        </div>
        <div class="col-md-3 col-xs-6">
          <q-input
            outlined
            v-model="data.preciounidad"
            label="Precio por unidad"
            dense
            label-slot
            @update:model-value="logicaAgregar"
          >
          </q-input>
        </div>
        <div class="col-md-2 col-xs-6">
          <q-input outlined v-model="data.total" label="Total" dense label-slot>
          </q-input>
        </div>
        <div class="col-md-4 col-xs-12">
          <q-input
            outlined
            v-model="data.descripcion"
            label="Descripción"
            dense
            label-slot
          >
          </q-input>
        </div>
        <div class="col-md-4 col-xs-8">
          <q-input outlined v-model="data.nota" label="Nota" dense label-slot>
          </q-input>
        </div>
        <div class="col-md-4 col-xs-4">
          <q-select
            v-model="data.tiempoentrega"
            :options="optioneslis"
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
  </div>
  <!-- <pre>{{ data }}</pre> -->

  <FilterProduct
    ref="filterProductRef"
    id=""
    @seleccionandoChasisParte2="chasisIngreso"
    @seleccionandoChasisUnico="chasisIngreso"
  />
  <VerProduct ref="verProductRef" id="" @seleccionandoChasis="chasisIngreso" />
  <SelectProduct
    ref="selectProductRef"
    id=""
    @seleccionandoChasisDos="chasisIngreso"
    @cotizacionRapidaDos="cotizacionRapida"
  />
</template>
<style lang="scss" scoped>
.under {
  text-decoration: underline;
}
</style>
