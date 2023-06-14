<script lang="ts" setup>
// export default {
//   name: 'ViewProducts',
// };
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { ItemsP, ListProducts } from '../utils/types';
import { useQuotationStore } from '../store/QuotationStore';
// import DialogtablaProds from '../Dialogs/DialogtablaProds.vue';
import { useStorage } from '@vueuse/core';

const props = withDefaults(defineProps<{ id?: string }>(), {});

const data = ref({
  idmodelo: props.id,
  typesearch: 'productos',
});
const $q = useQuasar();
const listModels = ref();
const StockTotal = ref();
const listItemns = ref([]);
const storeMaestra = useQuotationStore();
const listando = ref();
const listando22 = ref();
const ListProdsDialog = ref(false);
const listalmacen = ref();
const listproducto = ref();
const tabla = ref();
const loads = ref(false);
// const dialogtablaProdsRef = ref<InstanceType<typeof DialogtablaProds> | null>(
//   null
// );
const cargar = ref(false);
const filtermulti = ref([]);
const listar = ref({
  almacenlist: '',
  productolist: '',
  checList: '',
});
const checks = ref({
  disponiblelist: 'no',
  reservadolist: 'no',
  confirmadolist: 'no',
  todo: 'all',
});

onMounted(async () => {
  loads.value = true;

  listalmacen.value = await storeMaestra.getListModelAlmacen(props.id);
  listproducto.value = await storeMaestra.getListModelporProducto(props.id);
  // const listaLocal = useStorage('listalmacenAlm', listalmacen.value);
  // const listaLocal2 = useStorage('listalmacenPro', listproducto.value);
  // listalmacen2 = localStorage.getItem('listalmacenAlm');
  // listproducto2 = localStorage.getItem('listalmacenPro');

  filterlista();
  cargar.value = false;
});

const ListStockTotal = async () => {
  listModels.value = await storeMaestra.getListModelProducts(data.value);
  StockTotal.value = listModels.value.allstock;
  // listItemns.value = listModels.value;
  if (StockTotal.value == null) {
    StockTotal.value = 0;
  } else {
  }
  // console.log(listItemns.value);
};

const openAlmacen = async () => {
  console.log('abriendo modal');

  ListProdsDialog.value = !ListProdsDialog.value;
  // advancedFilterAco.value?.openDialog();
  // dialogtablaProdsRef.value?.openDialog();
};
const filterlista = async () => {
  loads.value = true;
  const pretabla = await storeMaestra.getListaProdsStore(
    props.id,
    listar.value
  );
  listando.value = pretabla.map((it) => {
    return {
      id: it.id_hanq_modelo,
      chasis: it.chasis_c_hanq_stock,
      motor: it.motor_c_hanq_stock,
      color: it.nombre_color_c_hanq_stock,
      gestion: it.gestion_hanq_stock,
      lote: it.lote_c_hanq_stock,
      stock: it.stock_c_hanq_stock,
      estado: it.estado_cotizacion_c_hanq_stock,
    };
  });
  console.log(listando.value, pretabla);
  loads.value = false;
};
const filterlistadis = async () => {
  checks.value = {
    disponiblelist: 'available',
    reservadolist: 'no',
    confirmadolist: 'no',
    todo: 'no',
  };
  listar.value.checList = 'available';
  filterlista();
};
const filterlistares = async () => {
  checks.value = {
    disponiblelist: 'no',
    reservadolist: 'reserved',
    confirmadolist: 'no',
    todo: 'no',
  };
  listar.value.checList = 'reserved';
  filterlista();
};
const filterlistacon = async () => {
  checks.value = {
    disponiblelist: 'no',
    reservadolist: 'no',
    confirmadolist: 'confirmed',
    todo: 'no',
  };
  listar.value.checList = 'confirmed';
  filterlista();
};
const filterlistatod = async () => {
  checks.value = {
    disponiblelist: 'no',
    reservadolist: 'no',
    confirmadolist: 'no',
    todo: 'all',
  };
  listar.value.checList = 'all';
  filterlista();
};

const exposeData = () => {
  // return leadRelations.value;
};
const columnasP = [
  {
    name: 'chasis',
    requered: true,
    label: 'Chasis',
    align: 'center',
    field: 'chasis',
    sortable: true,
  },
  {
    name: 'motor',
    requered: true,
    label: 'Motor',
    align: 'center',
    field: 'motor',
    sortable: true,
  },
  {
    name: 'color',
    requered: true,
    label: 'Color',
    align: 'center',
    field: 'color',
    sortable: true,
  },
  {
    name: 'gestion',
    requered: true,
    label: 'Gestión',
    align: 'center',
    field: 'gestion',
    sortable: true,
  },
  {
    name: 'lote',
    requered: true,
    label: 'Lote',
    align: 'center',
    field: 'lote',
    sortable: true,
  },
  {
    name: 'stock',
    requered: true,
    label: 'Stock',
    align: 'center',
    field: 'stock',
    sortable: true,
  },
  {
    name: 'estado',
    requered: true,
    label: 'Estado',
    align: 'center',
    field: 'estado',
    sortable: true,
  },
];
defineExpose({
  exposeData,
});
</script>

<template>
  <q-card class="my-card col-12">
    <q-card-section class="row justify-between">
      <span>
        <q-icon name="inventory_2" size="sm" color="primary" /> Atributos del
        Producto
      </span>
      <!-- <span>
        <q-icon name="inventory" size="sm" color="primary" />
        Stock:
        {{ StockTotal }}
      </span> -->
    </q-card-section>
    <q-separator></q-separator>
    <!-- <pre>{{ listando }}</pre> -->
    <q-card-section class="row q-col-gutter-sm">
      <div class="col-md-2 col-xs-6">
        <q-select
          v-model="listar.almacenlist"
          :options="listalmacen"
          label="Por almacen"
          outlined
          dense
          options-dense
          option-value="idalmacen"
          option-label="nombrealmacen"
          transition-show="flip-up"
          transition-hide="flip-down"
          color="primary"
          @update:model-value="filterlista()"
        >
        </q-select>
      </div>
      <div class="col-md-4 col-xs-6">
        <q-select
          v-model="listar.productolist"
          :options="listproducto"
          label="Por producto"
          outlined
          dense
          options-dense
          option-value="idprod"
          option-label="datos"
          transition-show="flip-up"
          transition-hide="flip-down"
          color="primary"
          @update:model-value="filterlista()"
        >
        </q-select>
      </div>
      <div class="col-md-6 col-xs-6 flex q-gutter-md">
        <q-checkbox
          dense
          v-model="checks.disponiblelist"
          label="Disponible"
          color="cyan"
          size="md"
          val="available"
          true-value="available"
          false-value="no"
          @update:model-value="filterlistadis()"
        />
        <q-checkbox
          dense
          v-model="checks.reservadolist"
          label="Reservado"
          color="orange"
          size="md"
          val="reserved"
          true-value="reserved"
          false-value="no"
          @update:model-value="filterlistares()"
        />
        <!-- </div>
      <div class="col-md-3 col-xs-6 flex q-gutter-sm"> -->
        <q-checkbox
          dense
          v-model="checks.confirmadolist"
          label="Confirmado"
          color="red"
          size="md"
          val="confirmed"
          true-value="confirmed"
          false-value="no"
          @update:model-value="filterlistacon()"
        />
        <q-checkbox
          dense
          v-model="checks.todo"
          label="Todo"
          color="teal"
          size="md"
          val="all"
          true-value="all"
          false-value="no"
          @update:model-value="filterlistatod()"
        />
      </div>

      <!-- <pre>{{ checks }}</pre>
      <pre>{{ listar }}</pre> -->
    </q-card-section>
    <q-separator></q-separator>
    <q-table
      title="Lista de Productos"
      :rows="listando"
      :columns="columnasP"
      row-key="chasis"
      :loading="loads"
      color="primary"
      class="my-sticky-header-table"
    >
      <!-- <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template> -->

      <!-- <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.chasis" :props="props">
            {{ col.chasis }}
          </q-td>
        </q-tr>
      </template> -->
      <!-- <template v-slot:body="props">
        <q-td :props="props">
          {{ props }}
        </q-td>
      </template> -->
    </q-table>
    <!-- <q-card-section>
      <div class="col-xs-12 col-md-3 q-pa-sm">
        <template v-if="listItemns.length > 0">
        <q-scroll-area style="height: 600px; max-width: 1200px">
          <q-list bordered class="rounded-borders" style="max-width: 1200px">
            <q-item-label header class="row" flex>
              <q-item-section>
                <q-item-label>
                  <span class="text-weight-regular text-primary"> </span>
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <span class="text-weight-regular text-primary"> Chasis </span>
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <span class="text-weight-regular text-primary"> Motor </span>
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <span class="text-weight-regular text-primary"> Color </span>
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <span class="text-weight-regular text-primary">
                    Gestión
                  </span>
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <span class="text-weight-regular text-primary"> Lote </span>
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <span class="text-weight-regular text-primary"> Stock </span>
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <span class="text-weight-regular text-primary"> Estado </span>
                </q-item-label>
              </q-item-section>
            </q-item-label>
            <template v-for="(row, index) in listando" :key="index">
              <q-item clickable>
                <q-item-section avatar>
                  <q-avatar
                    rounded
                    color="primary"
                    text-color="white"
                    icon="inventory_2"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label
                    lines="1"
                    class="text-primary text-weight-bold text-capitalize"
                    >{{ row.chasis_c_hanq_stock }}</q-item-label
                  >
                  <q-item-label caption lines="2">
                    <span class="text-weight-regular text-primary">Chasis</span>
                  </q-item-label>
                </q-item-section>
                <q-item-section
                  v-show="$q.screen.xs ? false : true"
                  class="item-center"
                >
                  <q-item-label caption lines="1">
                    <span class="text-weight-regular text-primary">Motor:</span>
                    <span class="text-black q-pl-xs">
                      {{ row.motor_c_hanq_stock }}</span
                    >
                  </q-item-label>
                </q-item-section>
                <q-item-section v-show="$q.screen.xs ? false : true">
                  <q-item-label caption lines="1">
                    <span class="text-weight-regular text-primary">Color:</span>
                    <span class="text-black q-pl-xs">
                      {{ row.nombre_color_c_hanq_stock }}</span
                    >
                  </q-item-label>
                </q-item-section>
                <q-item-section v-show="$q.screen.xs ? false : true">
                  <q-item-label caption lines="1">
                    <span class="text-weight-regular text-primary"
                      >Gestión:</span
                    >
                    <span class="text-black q-pl-xs">
                      {{ row.gestion_hanq_stock }}</span
                    >
                  </q-item-label>
                </q-item-section>
                <q-item-section v-show="$q.screen.xs ? false : true">
                  <q-item-label caption lines="1">
                    <span class="text-weight-regular text-primary">Lote:</span>
                    <span class="text-black q-pl-xs">
                      {{ row.lote_c_hanq_stock }}</span
                    >
                  </q-item-label>
                </q-item-section>
                <q-item-section v-show="$q.screen.xs ? false : true">
                  <q-item-label caption lines="1">
                    <span class="text-weight-regular text-primary">Stock:</span>
                    <span class="text-black q-pl-xs">
                      {{ row.stock_c_hanq_stock }}</span
                    >
                  </q-item-label>
                </q-item-section>
                <q-item-section v-show="$q.screen.xs ? false : true">
                  <q-item-label caption lines="1">
                    <span class="text-weight-regular text-primary"
                      >Estado:</span
                    >
                    <span class="text-black q-pl-xs">
                      {{ row.estado_cotizacion_c_hanq_stock }}</span
                    >
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-separator inset="item" />
            </template>
          </q-list>
        </q-scroll-area>
        </template>
        <template v-else>
          <q-card
            style="height: 60vh; width: 100%"
            flat
            class="my-card column flex-center"
          >
            <img
              src="list-empty.png"
              alt="lista vacia"
              style="width: 100px; height: 100px"
            />
            <br /><br />
            <div class="text-h6 text-dark text-center">
              Lista vacía <br />
              <small class="text-grey-5"
                >No se encontraron productos en los almacenes</small
              >
            </div>
          </q-card>
        </template>
      </div>
      <q-inner-loading
        :showing="cargar"
        label="Cargando productos por almacen..."
        label-class="text-teal"
        label-style="font-size: 1.1em"
      />
    </q-card-section> -->
    <q-separator inset />
  </q-card>
  <DialogtablaProds ref="dialogtablaProdsRef" :idProds="props.id" />
</template>
