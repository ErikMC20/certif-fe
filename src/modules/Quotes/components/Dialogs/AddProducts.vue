<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import CardAddProduct from '../Cards/SubComponents.vue/CardAddProduct.vue';
import CardAddService from '../Cards/SubComponents.vue/CardAddService.vue';
import CardAddItem from '../Cards/SubComponents.vue/CardAddItem.vue';
import { useQuotesStore } from '../../store/QuotesStore';
import { MonedaType } from '../../utils/types';
import { userStore } from 'src/modules/Users/store/UserStore';
import { ListProducts } from '../../../Quotation_model/utils/types';
import { DataAssginedUser, Grupo } from '../../../../components/types/index';
const props = withDefaults(
  defineProps<{
    idQuotes: string;
    persistent?: boolean;
    title?: string;
  }>(),
  {
    idQuotes: '',
    persistent: true,
    title: 'Nuevo grupo de Productos',
  }
);
const showFilter = ref(false);
const isFiltering = ref(false);
const loading = ref(false);
const ListPrincipal = ref([] as any);
const ListDatosProd = ref([] as any);
const ListDatosNoStock = ref([] as any);
const ListDatosService = ref([] as any);
const dataEditServi = ref();
// para editar================================
const ListaEditar = ref([] as any);
const GrupoEditar = ref();
const grupoEd = ref({
  name: '',
  modified_user_id: '',
  created_by: '',
  assigned_user_id: '',
  total_amt: 0,
  // total_amt_usdollar: '20344.827586',
  discount_amount: 0,
  // discount_amount_usdollar: '-304.741379',
  subtotal_amount: 0,
  // subtotal_amount_usdollar: '20040.086207',
  total_amount: 0,
  // total_amount_usdollar: '20040.086207',
  // parent_name: '',
  parent_type: 'AOS_Quotes',
  // parent_id: 'edbe21cc-35a4-66f5-d4d2-64106ce092d2',
  // number: 1,
  currency_id: '',
  // aos_products_quotes: '',
  id: '',
  parent_id: '',
});
// para cambios=============================================>
const AllCambios = ref(false);
// =========================================================>
const nueva = ref(false);
// const persistent = ref(false); opcional
const cardAddProductRef = ref<InstanceType<typeof CardAddProduct> | null>(null);
// const cardAddServicestRef = ref<InstanceType<typeof CardAddService> | null>(
//   null
// );

// const cardAddItemsRef = ref<InstanceType<typeof CardAddItem> | null>(null);
const quotesStore = useQuotesStore();
const { userCRM } = userStore();
const data = ref({
  idgrupo: '',
  nombregrupo: 'items',
  idmoneda: '',
  monedagrupo: '',
  totalgrupo: 0,
  descuentogrupo: 0,
  totalfinalgrupo: 0,
});

const unGroup = ref({
  attributesGroup: {},
  listProducts: [],
});
onMounted(async () => {
  if (props.idQuotes != '') {
    nueva.value = false;
  }
});

const agregarProd = () => {
  // unGroup.value.attributesGroup.id;
  if (nueva.value) {
    // console.log('agregando prod');
    ListaEditar.value.push({ el: CardAddProduct, dataE: '' });
  } else {
    // console.log('nuevo priduc');
    ListPrincipal.value.push(CardAddProduct);
  }
  // dataEditServi.value = '';
  // calculandototales();
};

const agregarServ = () => {
  if (nueva.value) {
    // console.log('agregando prod');
    ListaEditar.value.push({ el: CardAddService, dataE: '' });
  } else {
    // console.log('nuevo priduc');
    ListPrincipal.value.push(CardAddService);
  }
  // dataEditServi.value = '';
};
const agregarItemno = () => {
  // ListPrincipal.value.push(CardAddItem);
  if (nueva.value) {
    // console.log('agregando prod');
    ListaEditar.value.push({ el: CardAddItem, dataE: '' });
  } else {
    // console.log('nuevo priduc');
    ListPrincipal.value.push(CardAddItem);
  }
  // dataEditServi.value = '';
};
// para abrir el dialog con la moneda==================================================
const openDialog = async (val: string) => {
  var auxMoneda = await quotesStore.getMonedaStore();
  auxMoneda = auxMoneda.find((elem: MonedaType) => elem.name == val);
  if (auxMoneda) {
    data.value.idmoneda = auxMoneda.id;
    data.value.monedagrupo = auxMoneda.name;
  } else {
    data.value.idmoneda = '-99';
    data.value.monedagrupo = val;
  }
  unGroup.value = {
    attributesGroup: {},
    listProducts: [],
  };
  // ListDatos.value = '';
  ListPrincipal.value = [];
  data.value.totalgrupo = 0;
  data.value.descuentogrupo = 0;
  data.value.totalfinalgrupo = 0;
  showFilter.value = true;
};

const closeDialog = () => {
  showFilter.value = false;
};
//para guardar el grupo de los productos===========================================
const savelistProd = () => {
  calculandototales();
  AllCambios.value = true;
  const lista = cardAddProductRef.value;
  // console.log(lista);
  ListDatosProd.value = lista
    .filter(
      (fit) => fit.exposeData().producto != '' && fit.exposeData().cantidad > 0
    )
    .map((item: any, index) => {
      // console.log(item);
      return {
        name: item.exposeData().producto,
        modified_user_id: userCRM.id,
        created_by: userCRM.id,
        description: '',
        assigned_user_id: userCRM.id,
        currency_id: data.value.idmoneda,
        part_number: item.exposeData().chasis,
        item_description: item.exposeData().descripcion,
        number: index + 1,
        product_qty: item.exposeData().cantidad,
        product_list_price: item.exposeData().precio,
        // product_list_price_usdollar: '18750.000000',
        product_discount: item.exposeData().descuento,
        // product_discount_usdollar: '159.626437',
        product_discount_amount: item.exposeData().descuento * -1,
        // product_discount_amount_usdollar: '-159.626437',
        discount: item.exposeData().tipodes,
        product_unit_price: item.exposeData().preciounidad,
        // product_unit_price_usdollar: item.exposeData().preciounidad,
        // vat_amt: '.000000',
        // vat_amt_usdollar: '.000000',
        product_total_price: item.exposeData().total,
        // product_total_price_usdollar: '18590.373563',
        // parent_name: 'NOMBRE DE LA COTIZACION',
        parent_type: 'AOS_Quotes',
        // parent_id: 'edbe21cc-35a4-66f5-d4d2-64106ce092d2',
        product_id: item.exposeData().idproducto,
        // group_name: item.exposeData().attributesGroup.name,
        // group_id: '1b35baa0-a179-9e33-5536-64106ce711c8',
        product_procedencia: item.exposeData().procedencia,
        product_delivery_time: item.exposeData().tiempoentrega,
        product_flag_chasis_c: item.exposeData().flag_chasis,
        product_parent_type_c: item.exposeData().parent_product,
        chasis: item.exposeData().chasis,
        color: item.exposeData().color,
        gestion: item.exposeData().gestion,
        almacen: item.exposeData().almacen,
        id: item.exposeData().id,
        parent_id: item.exposeData().idquotes,
        group_id: item.exposeData().idgrupo,
      };
    });
  ListDatosNoStock.value = lista
    .filter(
      (fit) =>
        fit.exposeData().product_name != '' &&
        Number(fit.exposeData().product_product_qty) > 0
    )
    .map((item: any, index) => {
      return {
        name: item.exposeData().product_name,
        modified_user_id: userCRM.id,
        created_by: userCRM.id,
        description: '',
        assigned_user_id: userCRM.id,
        currency_id: data.value.idmoneda,
        part_number: item.exposeData().product_part_number,
        item_description: item.exposeData().product_item_description,
        number: index + 1,
        product_qty: item.exposeData().product_product_qty,
        product_list_price: item.exposeData().product_product_list_price,
        // product_list_price_usdollar: '18750.000000',
        product_discount: item.exposeData().product_product_discount,
        // product_discount_usdollar: '159.626437',
        product_discount_amount:
          item.exposeData().product_product_discount * -1,
        // product_discount_amount_usdollar: '-159.626437',
        discount: item.exposeData().product_discount,
        product_unit_price: item.exposeData().product_product_unit_price,
        // product_unit_price_usdollar: item.exposeData().preciounidad,
        // vat_amt: '.000000',
        // vat_amt_usdollar: '.000000',
        product_total_price: item.exposeData().product_product_total_price,
        // product_total_price_usdollar: '18590.373563',
        // parent_name: 'NOMBRE DE LA COTIZACION',
        parent_type: 'AOS_Quotes',
        // parent_id: 'edbe21cc-35a4-66f5-d4d2-64106ce092d2',
        product_id: '',
        // group_name: item.exposeData().attributesGroup.name,
        // group_id: '1b35baa0-a179-9e33-5536-64106ce711c8',
        product_procedencia: item.exposeData().product_proveedores_c,
        product_delivery_time: item.exposeData().product_product_delivery_time,
        product_flag_chasis_c: item.exposeData().product_flag_chasis_c,
        product_parent_type_c: item.exposeData().product_parent_type_c,
        id: item.exposeData().id,
        parent_id: item.exposeData().idquotes,
        group_id: item.exposeData().idgrupo,
      };
    });
  ListDatosService.value = lista
    .filter(
      (fit) =>
        fit.exposeData().service_name != '' &&
        Number(fit.exposeData().service_product_qty) > 0
    )
    .map((item: any, index) => {
      return {
        name: item.exposeData().service_name,
        modified_user_id: userCRM.id,
        created_by: userCRM.id,
        description: '',
        assigned_user_id: userCRM.id,
        currency_id: data.value.idmoneda,
        // part_number: item.exposeData().chasis,
        item_description: '',
        number: index + 1,
        product_qty: item.exposeData().service_product_qty,
        product_list_price: item.exposeData().service_product_list_price,
        // product_list_price_usdollar: '18750.000000',
        product_discount: item.exposeData().service_product_discount,
        // product_discount_usdollar: '159.626437',
        product_discount_amount:
          item.exposeData().service_product_discount * -1,
        // product_discount_amount_usdollar: '-159.626437',
        discount: item.exposeData().service_discount,
        product_unit_price: item.exposeData().service_product_unit_price,
        // product_unit_price_usdollar: item.exposeData().preciounidad,
        // vat_amt: '.000000',
        // vat_amt_usdollar: '.000000',
        product_total_price: item.exposeData().service_product_total_price,
        // product_total_price_usdollar: '18590.373563',
        // parent_name: 'NOMBRE DE LA COTIZACION',
        parent_type: 'AOS_Quotes',
        // parent_id: 'edbe21cc-35a4-66f5-d4d2-64106ce092d2',
        product_id: '0',
        // group_name: item.exposeData().attributesGroup.name,
        // group_id: '1b35baa0-a179-9e33-5536-64106ce711c8',
        product_procedencia: item.exposeData().procedencia,
        product_delivery_time: item.exposeData().tiempoentrega,
        product_flag_chasis_c: item.exposeData().service_flag_chasis_c,
        product_parent_type_c: item.exposeData().service_parent_type_c,
        id: item.exposeData().id,
        parent_id: item.exposeData().idquotes,
        group_id: item.exposeData().idgrupo,
      };
    });
  if (!props.idQuotes || nueva.value == false) {
    unGroup.value.attributesGroup = {
      name: data.value.nombregrupo,
      modified_user_id: userCRM.id,
      created_by: userCRM.id,
      assigned_user_id: userCRM.id,
      total_amt: data.value.totalgrupo,
      // total_amt_usdollar: '20344.827586',
      discount_amount: data.value.descuentogrupo,
      // discount_amount_usdollar: '-304.741379',
      subtotal_amount: data.value.totalfinalgrupo,
      // subtotal_amount_usdollar: '20040.086207',
      total_amount: data.value.totalfinalgrupo,
      // total_amount_usdollar: '20040.086207',
      // parent_name: '',
      parent_type: 'AOS_Quotes',
      // parent_id: 'edbe21cc-35a4-66f5-d4d2-64106ce092d2',
      // number: 1,
      currency_id: data.value.idmoneda,
      // aos_products_quotes: '',
    };
  } else {
    unGroup.value.attributesGroup = {
      name: grupoEd.value.name,
      modified_user_id: userCRM.id,
      created_by: grupoEd.value.created_by,
      assigned_user_id: grupoEd.value.assigned_user_id,
      total_amt: data.value.totalgrupo,
      // total_amt_usdollar: '20344.827586',
      discount_amount: data.value.descuentogrupo,
      // discount_amount_usdollar: '-304.741379',
      subtotal_amount: data.value.totalfinalgrupo,
      // subtotal_amount_usdollar: '20040.086207',
      total_amount: data.value.totalfinalgrupo,
      // total_amount_usdollar: '20040.086207',
      // parent_name: '',
      parent_type: 'AOS_Quotes',
      // parent_id: 'edbe21cc-35a4-66f5-d4d2-64106ce092d2',
      // number: 1,
      currency_id: grupoEd.value.currency_id,
      // aos_products_quotes: '',
      id: grupoEd.value.id,
      parent_id: grupoEd.value.parent_id,
    };
  }

  const uniendoPart = ListDatosProd.value.concat(ListDatosNoStock.value);
  const uniendoPartdos = uniendoPart.concat(ListDatosService.value);
  unGroup.value.listProducts = uniendoPartdos;
  // console.log('lista de datos del ADD product', unGroup.value, data.value);

  emits('enviandoproductos', unGroup.value);

  showFilter.value = false;
};

const cancelarlistProd = () => {
  ListPrincipal.value = [];
  data.value.nombregrupo = 'items';
  showFilter.value = false;
};

const calculandototales = () => {
  data.value.totalgrupo = 0;
  data.value.descuentogrupo = 0;
  data.value.totalfinalgrupo = 0;

  let descAux = 0;
  let totalAux = 0;
  let totalFinal = 0;
  const lista = cardAddProductRef.value;
  lista.map((item: any) => {
    if (item.exposeData().parent_product == 'HANI_ItemStock') {
      totalAux =
        totalAux + item.exposeData().precio * item.exposeData().cantidad;
      descAux =
        descAux +
        (item.exposeData().precio - item.exposeData().preciounidad) *
          item.exposeData().cantidad;
      totalFinal = totalFinal + item.exposeData().total;
    }
    if (item.exposeData().product_parent_type_c == 'HANI_ItemNoStock') {
      totalAux =
        totalAux +
        Number(item.exposeData().product_product_list_price) *
          Number(item.exposeData().product_product_qty);
      descAux =
        descAux +
        (Number(item.exposeData().product_product_list_price) -
          Number(item.exposeData().product_product_unit_price)) *
          Number(item.exposeData().product_product_qty);
      totalFinal =
        totalFinal + Number(item.exposeData().product_product_total_price);
    }

    if (item.exposeData().service_parent_type_c == 'HANI_Servicio') {
      totalAux =
        totalAux +
        Number(item.exposeData().service_product_list_price) *
          Number(item.exposeData().service_product_qty);

      descAux =
        descAux +
        (Number(item.exposeData().service_product_list_price) -
          Number(item.exposeData().service_product_unit_price)) *
          Number(item.exposeData().service_product_qty);
      totalFinal =
        totalFinal + Number(item.exposeData().service_product_total_price);
    }
    data.value.totalgrupo = data.value.totalgrupo + totalAux;
    data.value.descuentogrupo = data.value.descuentogrupo + descAux;
    data.value.totalfinalgrupo = data.value.totalfinalgrupo + totalFinal;
    descAux = 0;
    totalAux = 0;
    totalFinal = 0;
  });
};
// PARA EDITAR EL GRUPO DE =======================================================
const openDialogEditarID = async (val: any) => {
  // console.log(val);
  // data.value.idmoneda =
  unGroup.value = val;
  showFilter.value = true;
  grupoEd.value = unGroup.value.attributesGroup;
  // console.log(grupoEd.value);

  const listProduEdit = unGroup.value.listProducts;
  ListaEditar.value = [];
  listProduEdit.map((elem: any) => {
    // dataEditServi.value = '';
    // console.log(elem);
    if (elem.product_id != '' && elem.product_id != '0') {
      // ListPrincipal.value.push(CardAddProduct);
      // dataEditServi.value = elem;

      ListaEditar.value.push({
        el: CardAddProduct,
        dataE: elem,
      });
    }
    if (elem.product_id == '' || elem.product_id === null) {
      // console.log('card', elem);
      // ListPrincipal.value.push(CardAddItem);
      // dataEditServi.value = elem;
      ListaEditar.value.push({
        el: CardAddItem,
        dataE: elem,
      });
    }
    if (elem.product_id == '0') {
      // console.log('card', elem);
      // ListPrincipal.value.push(CardAddService);
      // dataEditServi.value = elem;
      ListaEditar.value.push({
        el: CardAddService,
        dataE: elem,
      });
    }
  });
  nueva.value = true;
  // console.log('lista', ListaEditar.value);
};

// ===============================================================================
// PARA EDITAR EL GRUPO CUANDO TIENES UNA NUEVA COTIZACION
const openDialogEditar = async (val: any) => {
  // console.log(val);
  // data.value.idmoneda =
  unGroup.value = val;
  showFilter.value = true;
  // grupoEd.value = unGroup.value.attributesGroup;
  // console.log(grupoEd.value.id);

  const listProduEdit = unGroup.value.listProducts;
  ListaEditar.value = [];
  listProduEdit.map((elem: any) => {
    // dataEditServi.value = '';
    // console.log(elem);
    if (elem.product_id != '' && elem.product_id != '0') {
      // ListPrincipal.value.push(CardAddProduct);
      // dataEditServi.value = elem;

      ListaEditar.value.push({
        el: CardAddProduct,
        dataE: elem,
      });
    }
    if (elem.product_id == '' || elem.product_id === null) {
      // console.log('card', elem);
      // ListPrincipal.value.push(CardAddItem);
      // dataEditServi.value = elem;
      ListaEditar.value.push({
        el: CardAddItem,
        dataE: elem,
      });
    }
    if (elem.product_id == '0') {
      // console.log('card', elem);
      // ListPrincipal.value.push(CardAddService);
      // dataEditServi.value = elem;
      ListaEditar.value.push({
        el: CardAddService,
        dataE: elem,
      });
    }
  });
  nueva.value = true;
  // console.log('lista', ListaEditar.value);
};

// ===============================================================================
const opcionesItem = [
  { label: 'items', valueEn: 'items' },
  { label: 'Accesorios', valueEn: 'accesorios' },
  { label: 'Repuestos', valueEn: 'repuestos' },
];

const emits = defineEmits<{
  (event: 'enviandoproductos', item: any): void;
  (click: 'calculoExtra', ej: boolean): true;
}>();

// const emits = defineEmits(['enviandoproductos', 'calculoExtra']);
const exposeData = () => {
  return data.value;
};
defineExpose({
  openDialog,
  closeDialog,
  exposeData,
  openDialogEditar,
  openDialogEditarID,
});
</script>
<template>
  <div>
    <dialog-component
      v-model="showFilter"
      :sizeDialog="isFiltering ? 'dialog-lg' : 'dialog-lg'"
      :headerDisabled="false"
      :footerDisabled="false"
      :loading="loading"
      :persistent="persistent"
    >
      <template #header>
        <q-card class="my-card no-border-radius">
          <q-card-section class="bg-primary text-white q-pa-sm">
            <div class="text-h6">
              <slot name="header-button"> </slot>
              {{ title }}
              <q-btn
                v-if="!persistent"
                flat
                icon="close"
                dense
                class="float-right"
                @click="closeDialog"
              />
            </div>
          </q-card-section>
        </q-card>
      </template>

      <template #body>
        <!-- <pre>nueva- {{ nueva }}</pre>
        <pre>id del quotes{{ idQuotes }}</pre> -->
        <q-card class="my-card">
          <q-card-section class="row q-gutter-sm">
            <q-card bordered flat class="q-pa-md col-12">
              <div class="row q-col-gutter-sm flex items-center">
                <div class="col-md-2 col-xs-6">Nombre de Grupo :</div>
                <div class="col-md-4 col-xs-6">
                  <q-select
                    v-model="data.nombregrupo"
                    :options="opcionesItem"
                    outlined
                    dense
                    map-options
                    emit-value
                    option-value="valueEn"
                    option-label="label"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    color="primary"
                  />
                </div>
                <div class="col-md-6 col-xs-12">
                  <q-btn-group spread>
                    <q-btn
                      push
                      label="Producto"
                      icon="view_in_ar"
                      text-color="black"
                      color="yellow"
                      size="md"
                      glossy
                      :disable="!data.nombregrupo ? true : false"
                      @click="agregarProd"
                    />
                    <q-btn
                      push
                      label="Servicios"
                      icon="design_services"
                      text-color="black"
                      color="amber"
                      size="md"
                      glossy
                      :disable="!data.nombregrupo ? true : false"
                      @click="agregarServ"
                    />
                    <q-btn
                      push
                      label="Item No Stock"
                      text-color="black"
                      icon="assignment"
                      color="orange"
                      size="md"
                      glossy
                      :disable="!data.nombregrupo ? true : false"
                      @click="agregarItemno"
                    />
                  </q-btn-group>
                </div>
              </div>
            </q-card>
            <!-- <pre>{{ dataEditServi }}</pre> -->
            <template v-if="!nueva">
              <template v-for="(element, index) in ListPrincipal" :key="index">
                <component
                  :is="element"
                  ref="cardAddProductRef"
                  @recalculototalesProd="calculandototales"
                  @recalculototalesNoSto="calculandototales"
                  @recalculototalesServi="calculandototales"
                  dataEdit=""
                >
                </component>
                <!-- <q-card bordered flat class="q-pa-xs col-12">
                <component :is="CardAddService" ref="cardAddServicestRef">
                </component>
              </q-card>
              <q-card bordered flat class="q-pa-xs col-12">
                <component :is="CardAddItem" ref="cardAddItemsRef"></component>
              </q-card> -->
              </template>
              <!-- <pre>Lista Principal{{ ListPrincipal }}</pre> -->
            </template>
            <template v-else>
              <template
                v-for="({ el, dataE }, index) in ListaEditar"
                :key="index"
              >
                <!-- das{{ dataE }}
                {{ index }} -->
                <component
                  :is="el"
                  ref="cardAddProductRef"
                  @recalculototalesProd="calculandototales"
                  @recalculototalesNoSto="calculandototales"
                  @recalculototalesServi="calculandototales"
                  :dataEdit="dataE"
                >
                </component>
              </template>
              <!-- <pre>Lista de editar{{ ListaEditar }}</pre> -->
            </template>
          </q-card-section>
          <q-card-section v-if="data.totalgrupo != 0">
            <q-separator></q-separator>
            <div class="text-subtitle2">
              Total :{{
                data.totalgrupo.toLocaleString('en-ES', {
                  minimumFractionDigits: 2,
                })
              }}
            </div>
            <div class="text-subtitle2">
              Descuento:-{{
                data.descuentogrupo.toLocaleString('en-ES', {
                  minimumFractionDigits: 2,
                })
              }}
            </div>
            <div class="text-h6">
              Total Final:
              {{
                data.totalfinalgrupo.toLocaleString('en-ES', {
                  minimumFractionDigits: 2,
                })
              }}
            </div>
          </q-card-section>
        </q-card>

        <!-- <pre>???{{ data }}</pre> -->
      </template>
      <template #footer>
        <q-card class="row">
          <q-card-section>
            <q-btn
              color="primary"
              icon="playlist_add_check"
              label="GUARDAR LISTA DE PRODUCTOS"
              class="q-mr-sm"
              @click="savelistProd"
              :disable="loading"
            />
            <q-btn
              color="red"
              icon="close"
              label="CANCELAR"
              @click="cancelarlistProd"
              :disable="loading"
            />
          </q-card-section>
        </q-card>
      </template>
    </dialog-component>
  </div>
</template>
<style scoped></style>
