<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { ItemsP, ListProducts } from '../../utils/types';
import { useQuotationStore } from '../../store/QuotationStore';
import DialogtablaProds from '../Dialogs/DialogtablaProds.vue';
import { userStore } from 'src/modules/Users/store/UserStore';

const props = withDefaults(defineProps<{ id?: string }>(), {});

const data = ref({
  idmodelo: props.id,
  typesearch: 'almacen',
});
const $q = useQuasar();
const listModels = ref();
const StockTotal = ref();
const listItemns = ref([]);
const storeMaestra = useQuotationStore();
const listando = ref();
const ListProdsDialog = ref(false);
const dialogtablaProdsRef = ref<InstanceType<typeof DialogtablaProds> | null>(
  null
);
const cargar = ref(false);

onMounted(async () => {
  // $q.loading.show({
  //   spinner: QSpinnerPuff,
  //   message: 'Cargando lista de Almacenes',
  // });
  cargar.value = true;
  await ListStockTotal();
  const lista2 = (await storeMaestra.getListModelProducts(
    data.value
  )) as ListProducts;
  listando.value = lista2.items.map((it: ItemsP) => {
    return {
      Almacen: it.almacen,
      Reservado: it.stock[0].total,
      Disponible: it.stock[1].total,
      Confirmados: it.stock[2].total,
    };
  });
  // console.log('id del producto: ' + lista2);
  // $q.loading.hide();
  cargar.value = false;
});

const ListStockTotal = async () => {
  listModels.value = await storeMaestra.getListModelProducts(data.value);
  listItemns.value = listModels.value.items;
  StockTotal.value = listModels.value.allstock;
  if (StockTotal.value == null) {
    StockTotal.value = 0;
  } else {
  }
  // console.log(listItemns.value);
};

const openAlmacen = async () => {
  // console.log('abriendo modal');

  ListProdsDialog.value = !ListProdsDialog.value;
  // advancedFilterAco.value?.openDialog();
  dialogtablaProdsRef.value?.openDialog();
};

const exposeData = () => {
  // return leadRelations.value;
};

// const opcioneslist = [
//   {
//     id: '1231',
//     label: 'C300',
//     value: 'unos',
//     reservado: '2',
//     disponible: '5',
//     fotos: '4',
//   },
//   {
//     id: '1232',
//     label: 'S200',
//     value: 'doss',
//     reservado: '2',
//     disponible: '5',
//     fotos: '4',
//   },
//   {
//     id: '1233',
//     label: 'L100',
//     value: 'tress',
//     reservado: '2',
//     disponible: '5',
//     fotos: '4',
//   },
// ];

defineExpose({
  exposeData,
});
</script>

<template>
  <q-card class="my-card col-12">
    <q-card-section class="row justify-between">
      <span>
        <q-icon name="library_books" size="sm" color="primary" /> Lista por
        Regional
      </span>
      <span>
        <q-icon name="inventory" size="sm" color="primary" />
        Stock:
        {{ StockTotal }}
      </span>
    </q-card-section>
    <q-separator></q-separator>
    <!-- <pre>{{ listando }}</pre> -->
    <q-card-section>
      <div class="col-xs-12 col-md-3 q-pa-sm">
        <template v-if="listItemns.length > 0">
          <q-scroll-area style="height: 600px; max-width: 800px">
            <q-list bordered class="rounded-borders" style="max-width: 850px">
              <template v-for="(row, index) in listando" :key="index">
                <q-item clickable>
                  <q-item-section avatar @click="openAlmacen()">
                    <q-avatar
                      rounded
                      color="primary"
                      text-color="white"
                      icon="layers"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label
                      lines="1"
                      class="text-primary text-weight-bold text-capitalize"
                      >{{ row.Almacen }}</q-item-label
                    >
                    <q-item-label caption lines="2">
                      <span class="text-weight-regular text-primary"
                        >Regional</span
                      >
                    </q-item-label>
                  </q-item-section>
                  <q-item-section v-show="$q.screen.xs ? false : true">
                    <q-item-label caption lines="1">
                      <span class="text-weight-regular text-primary"
                        >Disponible:</span
                      >
                      <span class="text-black q-pl-xs">
                        {{ row.Disponible }}</span
                      >
                    </q-item-label>
                  </q-item-section>
                  <q-item-section v-show="$q.screen.xs ? false : true">
                    <q-item-label caption lines="1">
                      <span class="text-weight-regular text-primary"
                        >Reservados:</span
                      >
                      <span class="text-black q-pl-xs">
                        {{ row.Reservado }}</span
                      >
                    </q-item-label>
                  </q-item-section>
                  <q-item-section v-show="$q.screen.xs ? false : true">
                    <q-item-label caption lines="1">
                      <span class="text-weight-regular text-primary"
                        >Confirmados:</span
                      >
                      <span class="text-black q-pl-xs">
                        {{ row.Confirmados }}</span
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
    </q-card-section>
    <q-separator inset />
    <q-inner-loading
      :showing="cargar"
      label="Cargando almacenes..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </q-card>
  <DialogtablaProds ref="dialogtablaProdsRef" :idProds="props.id" />
</template>
