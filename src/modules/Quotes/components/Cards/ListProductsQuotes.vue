<script lang="ts">
import { onMounted, ref, toRefs, watch, computed } from 'vue';
import { arrayArticles } from '../../utils/types';
import { useDialogTabs as useDialogTabsT } from 'src/composables/Dialog/useDialog';
import { getRelationBetweenModules } from 'src/services/GlobalService';
import { TableName, Attributes } from '../../../../components/types/index';
import { ListProducts } from '../../../Quotation_model/utils/types';
import { useQuotesStore } from '../../store/QuotesStore';
import EditarProduct from '../Dialogs/DialogsFilters/EditarProduct.vue';
import AddProducts from '../Dialogs/AddProducts.vue';
import ViewGeneral from '../../views/ViewGeneral.vue';
</script>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    id: string;
    dataListProductQuotes?: any;
    dataListNewsProducts?: any;
    datatotal?: any;
    editing?: boolean;
    readMode?: boolean;
  }>(),
  {
    readMode: false,
  }
);
const { datatotal, dataListNewsProducts } = toRefs(props);
const ListaProductosNuevos = ref();
const totalesLLegada = ref();
const quotesStore = useQuotesStore();
const agrupandoGruposEditar = ref();
const cancelar = ref(false);
const editButtns = ref(false);
const isEditing = ref(props.readMode);
const deletecargar = ref(false);
const deletecargarPro = ref(false);
const data = ref({
  totalporG: 0,
  descuentoporG: 0,
  totalfinalporG: 0,
});

const data22 = ref({
  totalporG: 0,
  descuentoporG: 0,
  totalfinalporG: 0,
});

const dataentradaTODO = ref({
  totalporG: 0,
  descuentoporG: 0,
  totalfinalporG: 0,
});
const editarProductRef = ref<InstanceType<typeof EditarProduct> | null>(null);
const addProductsRef = ref<InstanceType<typeof AddProducts> | null>(null);
const viewGeneralRef = ref<InstanceType<typeof ViewGeneral> | null>(null);

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 5,
});
// const pagesNumber = computed(() =>
//   Math.ceil(row.listProducts.length / pagination.value.rowsPerPage)
// );

onMounted(async () => {
  if (props.id != '') {
    agrupandoGruposEditar.value = await quotesStore.getListArticuloVer2Store(
      props.id
    );
    // agrupandoGruposEditar.value = props.dataListProductQuotes;
    const armando = agrupandoGruposEditar.value;
    agrupandoGruposEditar.value.map((item: any) => {
      dataentradaTODO.value.totalporG =
        dataentradaTODO.value.totalporG + item.attributesGroup.total_amt;
      dataentradaTODO.value.descuentoporG =
        dataentradaTODO.value.descuentoporG +
        item.attributesGroup.discount_amount;
      dataentradaTODO.value.totalfinalporG =
        dataentradaTODO.value.totalfinalporG +
        item.attributesGroup.total_amount;
    });
    ListaProductosNuevos.value = armando.map((item: any) => {
      return {
        attributesGroup: {
          id: item.attributesGroup.id,
          name: item.attributesGroup.name,
          modified_user_id: item.attributesGroup.modified_user_id,
          created_by: item.attributesGroup.created_by,
          assigned_user_id: item.attributesGroup.assigned_user_id,
          total_amt: item.attributesGroup.total_amt,
          // total_amt_usdollar: '20344.827586',
          discount_amount: item.attributesGroup.discount_amount,
          // discount_amount_usdollar: '-304.741379',
          subtotal_amount: item.attributesGroup.subtotal_amount,
          // subtotal_amount_usdollar: '20040.086207',
          total_amount: item.attributesGroup.total_amount,
          // total_amount_usdollar: '20040.086207',
          // parent_name: '',
          parent_type: item.attributesGroup.parent_type,
          parent_id: item.attributesGroup.parent_id,
          // number: 1,
          currency_id: item.attributesGroup.currency_id,
          // aos_products_quotes: ''
        },
        listProducts: item.listProducts.map((it) => {
          return {
            id: it.idapq,
            name: it.name,
            modified_user_id: it.modified_user_id,
            created_by: it.created_by,
            // description: '',
            assigned_user_id: it.assigned_user_id,
            // currency_id: item.attributesGroup.currency_id,
            part_number: it.part_number,
            // item_description: '',
            number: it.number,
            product_qty: it.product_qty,
            product_list_price: it.product_list_price,
            // product_list_price_usdollar: '18750.000000',
            product_discount: it.product_discount,
            // product_discount_usdollar: '159.626437',
            product_discount_amount: it.product_discount_amount,
            // product_discount_amount_usdollar: '-159.626437',
            discount: it.discount,
            product_unit_price: it.product_unit_price,
            // product_unit_price_usdollar: it.preciounidad,
            // vat_amt: '.000000',
            // vat_amt_usdollar: '.000000',
            product_total_price: it.product_total_price,
            product_flag_chasis_c: it.product_flag_chasis_c,
            // product_total_price_usdollar: '18590.373563',
            // parent_name: 'NOMBRE DE LA COTIZACION',
            parent_type: 'AOS_Quotes',
            parent_id: it.parent_id,
            idmodelo: it.idmodelo,
            product_id: it.product_id,
            group_id: it.group_id,
            // group_name: item.attributesGroup.name,
            // group_id: '1b35baa0-a179-9e33-5536-64106ce711c8',
            chasis: it.chasis_c,
            color: it.nombre_color_c,
            gestion: it.gestion,
            almacen: it.almacen_c,
          };
        }),
      };
    });
    calculandototalesENTRA();
    emit('dataEditRead', ListaProductosNuevos.value);
  } else {
    console.log('entrando a la lista de productos', props.dataListNewsProducts);
    ListaProductosNuevos.value = props.dataListNewsProducts;
    data.value.totalporG = 0;
    data.value.descuentoporG = 0;
    data.value.totalfinalporG = 0;
    ListaProductosNuevos.value.map((item: any) => {
      data.value.totalporG =
        data.value.totalporG + item.attributesGroup.total_amt;
      data.value.descuentoporG =
        data.value.descuentoporG + item.attributesGroup.discount_amount;
      data.value.totalfinalporG =
        data.value.totalfinalporG + item.attributesGroup.total_amount;
    });
    // totalesLLegada.value = props.datatotal;
    // calculandototalesPROPS();
    isEditing.value = true;
    // console.log('entrando a la lista', totalesLLegada.value);
  }
  // calculandototalesENTRA();
});

const calculandototalesENTRA = () => {
  data.value.totalporG = 0;
  data.value.descuentoporG = 0;
  data.value.totalfinalporG = 0;
  agrupandoGruposEditar.value.map((item: any) => {
    data.value.totalporG =
      data.value.totalporG + item.attributesGroup.total_amt;
    data.value.descuentoporG =
      data.value.descuentoporG + item.attributesGroup.discount_amount;
    data.value.totalfinalporG =
      data.value.totalfinalporG + item.attributesGroup.total_amount;
  });
};

const calculandototalesPROPS = () => {
  data.value.totalporG = 0;
  data.value.descuentoporG = 0;
  data.value.totalfinalporG = 0;
  ListaProductosNuevos.value.map((item: any) => {
    data.value.totalporG =
      data.value.totalporG + Number(item.attributesGroup.total_amt);
    data.value.descuentoporG =
      data.value.descuentoporG + Number(item.attributesGroup.discount_amount);
    data.value.totalfinalporG =
      data.value.totalfinalporG + Number(item.attributesGroup.total_amount);
  });
};

watch(
  () => props.id,
  async () => {
    if (props.id != '') {
      isEditing.value = false;
      refreshList();
    }
  }
);

const refreshList = async () => {
  agrupandoGruposEditar.value = await quotesStore.getListArticuloVer2Store(
    props.id
  );
  // agrupandoGruposEditar.value = props.dataListProductQuotes;
  const armando = agrupandoGruposEditar.value;
  ListaProductosNuevos.value = armando.map((item: any) => {
    return {
      attributesGroup: {
        id: item.attributesGroup.id,
        name: item.attributesGroup.name,
        modified_user_id: item.attributesGroup.modified_user_id,
        created_by: item.attributesGroup.created_by,
        assigned_user_id: item.attributesGroup.assigned_user_id,
        total_amt: item.attributesGroup.total_amt,
        // total_amt_usdollar: '20344.827586',
        discount_amount: item.attributesGroup.discount_amount,
        // discount_amount_usdollar: '-304.741379',
        subtotal_amount: item.attributesGroup.subtotal_amount,
        // subtotal_amount_usdollar: '20040.086207',
        total_amount: item.attributesGroup.total_amount,
        // total_amount_usdollar: '20040.086207',
        // parent_name: '',
        parent_type: item.attributesGroup.parent_type,
        parent_id: item.attributesGroup.parent_id,
        // number: 1,
        currency_id: item.attributesGroup.currency_id,
        // aos_products_quotes: ''
      },
      listProducts: item.listProducts.map((it) => {
        return {
          id: it.idapq,
          name: it.name,
          modified_user_id: it.modified_user_id,
          created_by: it.created_by,
          // description: '',
          assigned_user_id: it.assigned_user_id,
          // currency_id: item.attributesGroup.currency_id,
          part_number: it.part_number,
          // item_description: '',
          number: it.number,
          product_qty: it.product_qty,
          product_list_price: it.product_list_price,
          // product_list_price_usdollar: '18750.000000',
          product_discount: it.product_discount,
          // product_discount_usdollar: '159.626437',
          product_discount_amount: it.product_discount_amount,
          // product_discount_amount_usdollar: '-159.626437',
          discount: it.discount,
          product_unit_price: it.product_unit_price,
          // product_unit_price_usdollar: it.preciounidad,
          // vat_amt: '.000000',
          // vat_amt_usdollar: '.000000',
          product_total_price: it.product_total_price,
          product_flag_chasis_c: it.product_flag_chasis_c,
          // product_total_price_usdollar: '18590.373563',
          // parent_name: 'NOMBRE DE LA COTIZACION',
          parent_type: 'AOS_Quotes',
          parent_id: it.parent_id,
          idmodelo: it.idmodelo,
          product_id: it.product_id,
          group_id: it.group_id,
          // group_name: item.attributesGroup.name,
          // group_id: '1b35baa0-a179-9e33-5536-64106ce711c8',
          chasis: it.chasis_c,
          color: it.nombre_color_c,
          gestion: it.gestion,
          almacen: it.almacen_c,
        };
      }),
    };
  });
  calculandototalesENTRA();
  emit('dataEditRead', ListaProductosNuevos.value);
};
const emit = defineEmits<{
  (event: 'dataEditRead', elem: any): void;
}>();

const columnsProds = [
  {
    name: 'numero',
    align: 'left',
    label: 'Nro',
    field: 'numero',
    sortable: true,
    style: 'padding: 7px 5px',
    headerStyle: 'padding: 7px 5px',
  },
  {
    name: 'product_qty',
    align: 'left',
    label: 'Cantidad',
    field: 'product_qty',
    sortable: true,
    style: 'padding: 7px 5px',
    headerStyle: 'padding: 7px 5px',
  },
  {
    name: 'producto',
    align: 'left',
    label: 'Producto',
    field: 'producto',
    sortable: true,
  },
  {
    name: 'chasisnumero',
    align: 'left',
    label: 'Descripcion',
    field: 'chasisnumero',
    sortable: true,
  },
  {
    name: 'precio',
    align: 'left',
    label: 'Precio',
    field: 'precio',
    sortable: false,
  },
  {
    name: 'actions',
    align: 'center',
    label: '',
    field: 'actions',
    sortable: false,
  },
];
//  para editart y vambiar==============================================================================
const cambiarprod = (elem: any) => {
  // editarProductRef.value?.openDialogEditar(elem);  PARA EDITAR SOLO UNO
  addProductsRef.value?.openDialogEditar(elem);
  // isEditing.value = true;
};
const editarprod = (elem: any) => {
  // editarProductRef.value?.openDialogEditar(elem);  PARA EDITAR SOLO UNO
  addProductsRef.value?.openDialogEditarID(elem);
  isEditing.value = true;
};
//  para eliminar==============================================================================
const eliminarGrupo = async (elem: any) => {
  deletecargar.value = true;
  agrupandoGruposEditar.value = await quotesStore.deleteGroupProductsStore(
    props.id,
    elem.id
  );
  refreshList();
  deletecargar.value = false;
};
const eliminarProducto = async (elem: any) => {
  deletecargarPro.value = true;
  agrupandoGruposEditar.value = await quotesStore.deleteProductStore(
    props.id,
    elem.id
  );
  refreshList();
  deletecargarPro.value = false;
};
// fin de eliminar===================================================================================
const exposeListNew = () => {
  cancelar.value = false;
};

defineExpose({
  exposeListNew,
  totalesLLegada,
  isEditing,
});
</script>
<template>
  <!-- <pre>idquotes{{ data }}</pre>
  <pre>editando---{{ dataListNewsProducts }}</pre> -->
  <template v-if="ListaProductosNuevos == ''">
    <div class="flex flex-center">
      <q-item v-ripple>
        <q-item-section side>
          <q-avatar
            icon="remove_shopping_cart"
            color="teal"
            text-color="white"
          />
        </q-item-section>
        <q-item-section side> Sin Productos... </q-item-section>
      </q-item>
    </div>
  </template>
  <template v-else>
    <q-list separator style="max-height: 300px; overflow-y: auto" flat bordered>
      <template v-for="(row, index) in ListaProductosNuevos" :key="index">
        <q-expansion-item icon="airport_shuttl" header-class=" bg-teal-1">
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar
                icon="production_quantity_limits"
                color="teal"
                text-color="white"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">
                <span class="text-weight-medium">
                  {{ row.attributesGroup.name }}</span
                >
              </q-item-label>
              <q-item-label lines="1">
                <!-- <span class="text-weight-medium"></span> -->
                <span class="text-teal">Nombre de grupo</span>
              </q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">
                <span class="text-weight-medium">Cantidad :</span>
                <span class="text-grey-8">{{ row.listProducts.length }}</span>
              </q-item-label>
            </q-item-section>

            <q-item-section class="q-pa-xs row">
              <div
                class="text-grey-8 q-gutter-md"
                v-if="editing == true && props.id != ''"
              >
                <q-btn
                  size="md"
                  dense
                  outline
                  icon="mode_edit"
                  color="primary"
                  label="Editar"
                  @click="editarprod(row)"
                >
                  <q-tooltip>Editar grupo</q-tooltip>
                </q-btn>
                <q-btn
                  size="md"
                  dense
                  outline
                  icon="close"
                  color="red"
                  label="Eliminar"
                  @click="eliminarGrupo(row.attributesGroup)"
                >
                  <q-tooltip class="bg-red" :offset="[10, 10]"
                    >Eliminar grupo!</q-tooltip
                  >
                </q-btn>
              </div>
              <div class="text-grey-8 q-gutter-md" v-if="!props.id">
                <q-btn
                  size="md"
                  dense
                  outline
                  icon="mode_edit"
                  color="primary"
                  @click="cambiarprod(row)"
                >
                  <q-tooltip class="bg-indigo" :offset="[10, 10]"
                    >Editar grupo</q-tooltip
                  >
                </q-btn>
              </div>
            </q-item-section>
          </template>

          <q-separator />
          <!-- ========================================================================== PARA EL LOS STOCKS===================== -->
          <!-- <template v-for="(item, index) in row.listProducts" :key="index"> -->

          <q-table
            flat
            :rows="row.listProducts"
            :columns="columnsProds"
            row-key="producto"
            hide-bottom
            v-model:pagination="pagination"
            hide-pagination
          >
            <template v-slot:body="props">
              <q-tr
                :props="props"
                :class="
                  props.row.product_parent_type_c == 'HANI_ItemStock'
                    ? 'bg-blue-grey-1'
                    : 'bg-brown-1'
                "
              >
                <q-td key="numero" :props="props">
                  {{ props.rowIndex + 1 }}
                </q-td>
                <q-td key="product_qty" :props="props">
                  <p class="q-ma-none">
                    {{ props.row.product_qty }}
                  </p>
                </q-td>
                <q-td key="producto" :props="props">
                  <p class="q-ma-none">
                    {{ props.row.name }}
                  </p>
                </q-td>
                <q-td key="chasisnumero" :props="props">
                  <p class="q-ma-none">
                    <span class="text-bold">Chasis:</span>
                    {{ props.row.part_number }}
                  </p>
                  <p class="q-ma-none">
                    <span class="text-bold">Color:</span>
                    {{ props.row.color }}
                  </p>
                  <p class="q-ma-none">
                    <span class="text-bold">Gestión:</span>
                    {{ props.row.gestion }}
                  </p>
                  <p class="q-ma-none">
                    <span class="text-bold">Almacen:</span>
                    {{ props.row.almacen }}
                  </p>
                </q-td>
                <q-td key="precio" :props="props">
                  <p class="q-ma-none">
                    <span class="text-bold">Precio:</span>
                    {{ props.row.product_list_price }}
                  </p>
                  <p class="q-ma-none">
                    <span class="text-bold">Descuento:</span>
                    {{ props.row.product_discount_amount }}
                  </p>
                  <p class="q-ma-none">
                    <span class="text-bold">Tipo descuento:</span>
                    {{ props.row.product_discount }} {{ props.row.discount }}
                  </p>
                  <p class="q-ma-none">
                    <span class="text-bold">Total:</span>
                    {{ props.row.product_total_price }}
                  </p>
                </q-td>
                <q-td key="actions" :props="props" class="item-center">
                  <!-- <p class="q-ma-none">
                    <q-btn
                      size="sm"
                      flat
                      dense
                      icon="mode_edit"
                      color="primary"
                    >
                      <q-tooltip>Editar</q-tooltip>
                    </q-btn>
                  </p> -->
                  <p class="q-ma-none" v-if="props.id != '' && editing == true">
                    <q-btn
                      size="md"
                      flat
                      dense
                      icon="deleted"
                      color="red"
                      @click="eliminarProducto(props.row)"
                    >
                      <q-tooltip class="bg-red" :offset="[10, 10]"
                        >Eliminar producto!</q-tooltip
                      >
                    </q-btn>
                  </p>
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <div class="row justify-center q-mt-md">
            <q-pagination
              v-model="pagination.page"
              color="teal"
              :max="Math.ceil(row.listProducts.length / pagination.rowsPerPage)"
              size="sm"
            ></q-pagination>
          </div>
        </q-expansion-item>
        <!-- <q-card-section>
          <div class="text-subtitle2">
            Total:{{
              data22.totalporG +
              row.attributesGroup.total_amt.toLocaleString('en-ES', {
                minimumFractionDigits: 2,
              })
            }}
          </div>
          <div class="text-subtitle2">
            Descuento:-{{
              data22.descuentoporG +
              row.attributesGroup.discount_amount.toLocaleString('en-ES', {
                minimumFractionDigits: 2,
              })
            }}
          </div>
          <div class="text-h6">
            Total Final:
            {{
              data22.totalfinalporG +
              row.attributesGroup.total_amount.toLocaleString('en-ES', {
                minimumFractionDigits: 2,
              })
            }}
          </div>
        </q-card-section> -->
        <!-- <pre>editar true----{{ editing }}</pre>
        <pre>id no hay---{{ props.id }}</pre> -->
      </template>
      <q-inner-loading
        :showing="deletecargarPro"
        label="Eliminando producto..."
        label-class="text-teal"
        label-style="font-size: 1.1em"
      />
      <q-inner-loading
        :showing="deletecargar"
        label="Eliminando grupo..."
        label-class="text-teal"
        label-style="font-size: 1.1em"
      />
    </q-list>
    <div>
      <q-card class="my-card" flat bordered>
        <q-card-section>
          <div class="text-subtitle2">
            Total:{{
              datatotal.totalporgrupos.toLocaleString('en-ES', {
                minimumFractionDigits: 2,
              })
            }}
          </div>
          <div class="text-subtitle2" v-if="datatotal.descuentoporgrupos > 0">
            Descuento:-{{
              datatotal.descuentoporgrupos.toLocaleString('en-ES', {
                minimumFractionDigits: 2,
              })
            }}
          </div>
          <div class="text-subtitle2" v-else>
            Descuento:{{
              datatotal.descuentoporgrupos.toLocaleString('en-ES', {
                minimumFractionDigits: 2,
              })
            }}
          </div>
          <div class="text-h6">
            Total Final:
            {{
              datatotal.totalfinalporgrupos.toLocaleString('en-ES', {
                minimumFractionDigits: 2,
              })
            }}
          </div>
        </q-card-section>
      </q-card>
    </div>
    <!-- <pre>{{ ListaProductosNuevos }}</pre> -->
    <!-- <pre>datatotal{{ totalesLLegada }}</pre> -->
  </template>

  <EditarProduct ref="editarProductRef" id="" />
  <AddProducts ref="addProductsRef" :idQuotes="props.id" />
</template>
