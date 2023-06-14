<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { RelationInfoLead } from '../../utils/types';
// import ViewCardVue from 'src/components/MainCard/ViewCard .vue';
import AddColor from 'src/modules/Quotation_model/components/Dialogs/AddColor.vue';
import { useQuotationStore } from '../../store/QuotationStore';

const props = withDefaults(
  defineProps<{ id?: string; data?: RelationInfoLead }>(),
  {}
);

const storeQuotation = useQuotationStore();
const cargar = ref(false);
const listando = ref();
// const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>();
const addcolorRef = ref<InstanceType<typeof AddColor> | null>(null);

// const isEditing = computed(() => baseCardRef.value?.isEditing === 'edit');
const data = ref({
  imgcolor: 'imagenvaciaNew.png',
});

const exposeData = () => {
  // return leadRelations.value;
};
const addFot = () => {
  openDialog();
};

const openDialog = () => {
  addcolorRef.value?.openDialog();
  console.log('entrado al color');
};

onMounted(async () => {
  cargar.value = true;
  // await ListStockTotal();
  const lista2 = await storeQuotation.getlistColors(props.id);
  listando.value = lista2.map((it) => {
    return {
      nombre: it.name,
      reservado: it.stock[0].total,
      disponible: it.stock[1].total,
      confirmados: it.stock[2].total,
    };
  });

  console.log(listando.value);

  cargar.value = false;
});

const opcioneslist = [
  {
    id: '1231',
    label: 'NEGRO NINJA',
    value: 'unos',
    reservado: '2',
    disponible: '5',
    confirmado: '3',
    fotos: '4',
  },
  {
    id: '1232',
    label: 'BLANCO PURO',
    value: 'doss',
    reservado: '2',
    disponible: '5',
    confirmado: '3',
    fotos: '4',
  },
  {
    id: '1233',
    label: 'AZUL',
    value: 'tress',
    reservado: '2',
    disponible: '5',
    confirmado: '3',
    fotos: '4',
  },
  {
    id: '1234',
    label: 'ROJO',
    value: 'cuatros',
    reservado: '2',
    disponible: '5',
    confirmado: '3',
    fotos: '4',
  },
  {
    id: '1235',
    label: 'PLATA PLATEADO',
    value: 'cincos',
    reservado: '2',
    disponible: '5',
    confirmado: '3',
    fotos: '4',
  },
];
defineExpose({
  exposeData,
});
</script>
<template>
  <q-card class="my-card">
    <q-card-section class="row justify-between">
      <span>
        <q-icon name="ballot" size="sm" color="primary" class="col-6" /> Lista
        de Colores
      </span>
      <span class="q-gutter-md"
        ><q-btn push color="primary" label="Actualizar" icon="event_repeat" />
        <q-btn
          push
          color="primary"
          label="Agregar Color"
          icon="auto_fix_high"
          @click="() => openDialog()"
      /></span>
      <!-- <span
        ><q-checkbox
          left-label
          v-model="data.prioridad"
          size="xs"
          label="Prioridad Alta"
          color="primary"
          true-value="High"
          false-value="Short" />
        <q-icon
          name="local_fire_department"
          :color="data.prioridad == 'High' ? 'red' : 'grey-5'"
        ></q-icon
      ></span> -->
      <!-- <q-btn push color="primary" icon="favorite" />
      <q-btn push color="primary" icon="auto_fix_high" /> -->
    </q-card-section>
    <q-separator></q-separator>
    <q-card-section>
      <div class="col-xs-12 col-md-3 q-gutter-xs">
        <template v-if="opcioneslist.length > 0">
          <!-- <q-card class="my-card q-gutter-xs"> -->
          <template v-for="(row, index) in listando" :key="index">
            <q-card class="q-gutter-xs flex items-center row">
              <div class="col-md-1 col-xs-1" align="center">
                <!-- <q-icon name="colorize"></q-icon> -->
                <img
                  :src="data.imgcolor"
                  style="height: 30px; max-width: 40px"
                />
              </div>
              <div class="col-md-3 col-xs-5" align="left">
                <div class="q-gutter-sm">
                  <q-label> {{ row.nombre }}</q-label>
                </div>
                <div class="q-gutter-sm">
                  <q-label> Color </q-label>
                </div>
              </div>
              <div class="col-md-4 col-xs-6 item-center" align="center">
                <div class="q-gutter-xs">
                  <q-label> Disponible: {{ row.disponible }}</q-label>
                </div>
                <div class="q-gutter-xs">
                  <q-label> Reservado: {{ row.reservado }}</q-label>
                </div>

                <!-- <q-label> Reservado: {{ row.confirmado }}</q-label> -->
              </div>
              <div class="col-md-2 col-xs-4" align="center">
                <q-label> Fotos: {{ row.fotos }} / 5</q-label>
              </div>
              <div class="col-md- col-xs-1" align="center">
                <q-icon
                  name="colorize"
                  size="sm"
                  color="primary"
                  @click="addFot()"
                ></q-icon>
              </div>
            </q-card>
          </template>
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
              style="width: 220px; height: 200px"
            />
            <br /><br />
            <div class="text-h6 text-dark text-center">
              Lista vacía <br />
              <small class="text-grey-5"
                >No se encontraron contactos relacionadas...</small
              >
            </div>
          </q-card>
        </template>
      </div>
    </q-card-section>
    <q-separator inset />
    <q-inner-loading
      :showing="cargar"
      label="Cargando colores..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </q-card>
  <AddColor ref="addcolorRef" id="" />
</template>
