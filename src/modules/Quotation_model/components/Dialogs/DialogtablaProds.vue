<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ListProducts } from '../../utils/types';
import { useQuotationStore } from '../../store/QuotationStore';

const props = defineProps<{
  idProds: string;
}>();

const open = ref(false);
const storeMaestra = useQuotationStore();
const listando = ref();

const data = ref({
  idmodelo: props.idProds,
  typesearch: 'productos',
});

onMounted(async () => {
  const lista2 = (await storeMaestra.getListModelProducts(
    data.value
  )) as ListProducts;
  // console.log(lista2);
  listando.value = lista2.items.map((it: ItemsP2) => {
    return {
      almacen: it.almacen,
      idprod: it.id,
      nombre: it.name,
      aio: it.codigoaio_c,
      precio: it.price,
      anio: it.anio_c,
      reservados: it.stock[0].total,
      disponibles: it.stock[1].total,
      confirmados: it.stock[2].total,
    };
  });
  // console.log(listando.value);
});

const columnasP = [
  {
    name: 'almacen',
    requered: true,
    label: 'Almacen',
    align: 'center',
    field: 'almacen',
    sortable: true,
  },
  {
    name: 'nombre',
    requered: true,
    label: 'Nombre',
    align: 'center',
    field: 'nombre',
    sortable: true,
  },
  {
    name: 'aio',
    requered: true,
    label: 'Codigo AIO',
    align: 'center',
    field: 'aio',
    sortable: true,
  },
  {
    name: 'precio',
    requered: true,
    label: 'Precio',
    align: 'center',
    field: 'precio',
    sortable: true,
  },
  {
    name: 'anio',
    requered: true,
    label: 'Año',
    align: 'center',
    field: 'anio',
    sortable: true,
  },
  {
    name: 'reservados',
    requered: true,
    label: 'Reservados',
    align: 'center',
    field: 'reservados',
    sortable: true,
  },
  {
    name: 'nombre',
    requered: true,
    label: 'Disponible',
    align: 'center',
    field: 'disponibles',
    sortable: true,
  },
  {
    name: 'confirmados',
    requered: true,
    label: 'Confirmado',
    align: 'center',
    field: 'confirmados',
    sortable: true,
  },
];

const openDialog = () => {
  open.value = !open.value;
};

// const emit = defineEmits<{ (event: 'enviandotele', datased: any): void }>();
defineExpose({
  openDialog,
});
</script>

<template>
  <q-dialog :maximized="$q.screen.lt.sm" v-model="open" full-width>
    <q-card>
      <q-card-section class="bg-primary">
        <!-- <div class="text-h6 white">Lista de Productos</div> -->
        <!-- <span>
          <q-text color="white">Lista de Productos</q-text>
        </span> -->
        <q-btn
          dense
          flat
          color="white"
          :icon="!$q.screen.xs ? 'close' : 'arrow_back_ios'"
          v-close-popup
          align="right"
        >
          <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
        </q-btn>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pt-none">
        <q-table
          title="Lista de Productos"
          :rows="listando"
          :columns="columnasP"
          row-key="nombre"
          :loading="loads"
          class="my-sticky-header-table"
        >
          <!-- <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width />
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td auto-width>
                <q-btn
                  size="sm"
                  color="accent"
                  round
                  dense
                  @click="props.expand = !props.expand"
                  :icon="props.expand ? 'remove' : 'add'"
                >
                </q-btn>
              </q-td>
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.value }}
              </q-td>
            </q-tr>
          </template> -->
        </q-table>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="Cerrar" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
// .xl-dialog {
//   width: 1000px;
//   min-height: inherit;
//   max-width: 100vw;
//   height: 800px;
//   max-height: 95vh;
// }

.full-width {
  width: -webkit-fill-available;
}
</style>
