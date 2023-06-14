<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { QuotationTableStore } from '../../store/QuotationTableStore';
import { useQuotationStore } from '../../store/QuotationStore';
const props = withDefaults(
  defineProps<{
    persistent?: boolean;
    title?: string;
    id: string;
  }>(),
  {
    persistent: false,
    title: 'Agregar Video',
  }
);

const data = ref({
  nombre: '',
  descripcion: '',
  idmodelo: '',
  nombremodelo: '',
  tipo: 'Video',
  idcategoria: '',
});

const dataread = ref({
  nombre: '',
  descripcion: '',
  idmodelo: '',
  nombremodelo: '',
  tipo: 'Video',
  idcategoria: '',
});
const editar = ref(false);
const tableStore = QuotationTableStore();
const listDivision = ref();
const listaModelo = ref();
const quotationStore = useQuotationStore();
const creandoload = ref(false);
const showFilter = ref(false);
const isFiltering = ref(false);
const loading = ref(false);

onMounted(async () => {
  listaModelo.value = await quotationStore.getModuloQuotationStore(
    'HANQ_Modelo',
    props.id
  );
  listDivision.value = await tableStore.getDivisionLead();
  // https://www.youtube.com/embed/kOkQ4T5WO9E
  data.value = {
    nombre: '',
    descripcion: '',
    idmodelo: '',
    nombremodelo: '',
    tipo: 'Video',
    idcategoria: '',
  };
});

const openDialog = () => {
  showFilter.value = true;
};

const vaciarfile = () => {
  data.value.nombre = '';
};
const guardarVideo = async () => {
  const listaCategoria = await quotationStore.getCategoryModelStore();
  creandoload.value = true;
  data.value.idmodelo = props.id;
  data.value.nombremodelo = listaModelo.value.name;
  data.value.idcategoria = listaCategoria.find(
    (elem) => elem.name == data.value.tipo
  ).id;
  console.log(data.value);
  await quotationStore.saveVideoStore(data.value);
  showFilter.value = false;
  creandoload.value = false;
};

const closeDialog = () => {
  showFilter.value = false;
};

// const resetDialog = () => {
//   if(){

//   }else{

//   }
// };

const listdocumento = [
  {
    label: 'Público',
    value: 'Publico',
  },
  {
    label: 'Privado',
    value: 'Privado',
  },
];
const listaestado = [
  {
    label: 'Activo',
    value: 'Publico',
  },
  {
    label: 'Borrador',
    value: 'Privado',
  },
  {
    label: 'FAQ',
    value: 'Privado',
  },
  {
    label: 'Caducado',
    value: 'Privado',
  },
  {
    label: 'En revisión',
    value: 'Privado',
  },
  {
    label: 'Pendiente',
    value: 'Privado',
  },
  {
    label: 'Archivado',
    value: 'Privado',
  },
];

defineEmits(['selectItem', 'showAccount']);
defineExpose({
  openDialog,
  closeDialog,
});
</script>
<template>
  <div>
    <dialog-component
      v-model="showFilter"
      :sizeDialog="isFiltering ? 'dialog-sm' : 'dialog-sm'"
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
        <!-- <pre>{{ showFilter }}</pre> -->
        <q-card class="my-card" v-if="editar == false">
          <q-card-section class="text-white row q-col-gutter-sm">
            <div class="col-12">
              <q-input
                outlined
                v-model="data.nombre"
                label="Enlace del video..."
                dense
                label-slot
              >
                <template v-slot:prepend>
                  <q-icon name="perm_media" />
                </template>
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click.stop.prevent="vaciarfile()"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </div>
            <div class="col-xs-12 col-md-12" align="center">
              <q-card class="q-pa-sm" v-if="data.nombre != ''">
                <q-video
                  :src="data.nombre"
                  style="height: 200px; max-width: 720px"
                />
              </q-card>
              <q-card class="q-pa-sm" v-else>
                <q-icon
                  name="perm_media"
                  size="xl"
                  color="teal"
                  style="height: 200px; max-width: 720px"
                />
              </q-card>
            </div>
            <div class="col-md-12 col-xs-12">
              <q-input
                v-model="data.descripcion"
                type="text"
                label="Descripción"
                outlined
                dense
                color="primary"
              >
              </q-input>
            </div>
          </q-card-section>
          <!-- <pre>{{ data }}</pre> -->
        </q-card>
        <!-- ---------------------------------------------------------------------------------------------------------para leer -->
        <q-card class="my-card" v-else>
          <q-card-section class="text-white row q-col-gutter-sm">
            <div class="col-12">
              <q-input
                outlined
                v-model="dataread.nombre"
                label="Enlace del video..."
                dense
                label-slot
              >
                <template v-slot:prepend>
                  <q-icon name="perm_media" />
                </template>
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click.stop.prevent="vaciarfile()"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </div>
            <div class="col-xs-12 col-md-12" align="center">
              <q-card class="q-pa-sm" v-if="dataread.nombre != ''">
                <q-video
                  :src="dataread.nombre"
                  style="height: 200px; max-width: 720px"
                />
              </q-card>
              <q-card class="q-pa-sm" v-else>
                <q-icon
                  name="perm_media"
                  size="xl"
                  color="teal"
                  style="height: 200px; max-width: 720px"
                />
              </q-card>
            </div>
            <div class="col-md-12 col-xs-12">
              <q-input
                v-model="data.descripcion"
                type="text"
                label="Descripción"
                outlined
                dense
                color="primary"
              >
              </q-input>
            </div>
          </q-card-section>
          <!-- <pre>{{ dataread }}</pre> -->
          <q-inner-loading
            :showing="creandoload"
            label="Guardando enlaces de video..."
            label-class="text-teal"
            label-style="font-size: 1.1em"
          />
        </q-card>
      </template>

      <template #footer>
        <q-btn
          color="primary"
          icon="perm_media"
          label="GUARDAR"
          class="q-mr-sm"
          @click="guardarVideo"
          :disable="loading"
        />
        <q-btn
          color="red"
          icon="close"
          label="CANCELAR"
          @click="closeDialog"
          :disable="loading"
        />
      </template>
    </dialog-component>
  </div>
</template>
<style scoped>
.q-chip {
  max-width: 140px;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90px;
  font-size: 0.8rem;
  text-align: right;
}
.text-brand {
  color: #a2aa33;
}
.bg-brand {
  background: #a2aa33;
}
</style>
