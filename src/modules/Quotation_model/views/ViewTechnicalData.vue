<script lang="ts">
export default {
  name: 'ViewTechnicalData',
};
</script>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import DataNew from '../components/CardsDataTec/DataNew.vue';
import DataEditor from '../components/CardsDataTec/DataEditor.vue';
import { useQuotationStore } from '../store/QuotationStore';

const props = defineProps<{
  id: string;
}>();
const documentRelation = ref([] as { [key: string]: string }[]);
const bloquear = ref(false);
const isEditing = ref(false);

const dataNewRef = ref<InstanceType<typeof DataNew> | null>(null);
// const dataEditorRef = ref<InstanceType<typeof DataEditor> | null>(null);
const listData = ref([]);
const mensaje = ref();
const quotationStore = useQuotationStore();
const aux = ref();
const isSomeCardEditing = computed(() => {
  return isEditing.value;
});

onMounted(async () => {
  const lisAux = await quotationStore.getListsPestaStore(
    props.id,
    'caracteristicas'
  );
  listData.value = lisAux.filter((elem) => {
    if (
      elem.name_categoria == 'Datos tecnicos' ||
      elem.name_categoria == 'Datos cabecera'
    ) {
      return { elem };
    }
  });
  // console.log(aux.value);
});

const openDatosEdit = () => {
  bloquear.value = true;
  isEditing.value = true;
  emit('activareditor', isEditing.value);
};
const cancelDatosEdit = () => {
  bloquear.value = false;
  isEditing.value = false;
};

const desactivando = (send: boolean) => {
  bloquear.value = send;
};
const opcioneslist = [
  {
    id: '1231',
    label: 'C300',
    value: 'unos',
    reservado: '2',
    disponible: '5',
    fotos: '4',
  },
  {
    id: '1232',
    label: 'S200',
    value: 'doss',
    reservado: '2',
    disponible: '5',
    fotos: '4',
  },
  {
    id: '1233',
    label: 'L100',
    value: 'tress',
    reservado: '2',
    disponible: '5',
    fotos: '4',
  },
];
const emit = defineEmits<{
  (event: 'activareditor', isEditing: boolean): void;
}>();
defineExpose({
  // isEditing,
  isSomeCardEditing,
});
</script>

<template>
  <div class="row">
    <div class="col-12 q-gutter-sm">
      <div align="right" class="col-md-12 q-gutter-sm" v-if="bloquear == false">
        <q-btn
          color="primary"
          @click="openDatosEdit()"
          label="Agregar Cabecera y Datos Tecnicos"
          size="md"
        >
        </q-btn>
        <!-- <template v-if="bloquear == true">
          <q-btn
            class="desktop-only"
            color="red"
            @click="cancelDatosEdit()"
            label="Salir Editor"
            size="md"
          />
        </template> -->
      </div>
      <div class="col-md-12">
        <!-- CAMBIARE A UN COMPONENTE -->
        <q-card class="my-card" v-if="bloquear == false">
          <!-- <q-card-section
            class="row justify-between bg-primary q-pa-sm text-white"
            flat
            align="center"
          >
            <span>
              <q-icon name="settings_applications" size="sm" color="white" />
              Lista de Cabecera y Datos Tecnicos
            </span>
          </q-card-section> -->
          <q-card-section class="row justify-between">
            <div
              class="col-xl-2 col-lg-3 col-md-3 col-sm-12 col-xs-12 q-mb-sm text-primary"
              align="center"
            >
              <q-label> Lista de Cabecera y Datos Tecnicos</q-label>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row">
              <div class="col-xs-12 col-md-12 q-pa-md">
                <template v-if="listData.length > 0">
                  <q-list bordered class="rounded-borders">
                    <template v-for="(row, index) in listData" :key="index">
                      <q-item>
                        <q-item-section avatar>
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
                            >{{ row.name_caracteristicas }}</q-item-label
                          >
                          <q-item-label caption lines="2">
                            <span class="text-weight-regular text-primary"
                              >Nombre</span
                            >
                          </q-item-label>
                        </q-item-section>
                        <q-item-section v-show="$q.screen.xs ? false : true">
                          <q-item-label caption lines="1">
                            <span class="text-weight-regular text-primary"
                              >Categoria:</span
                            >
                            <span class="text-black q-pl-xs">
                              {{ row.name_categoria }}</span
                            >
                          </q-item-label>
                        </q-item-section>
                        <q-item-section v-show="$q.screen.xs ? false : true">
                          <q-item-label caption lines="1">
                            <span class="text-weight-regular text-primary"
                              >Usuario Asignado:</span
                            >
                            <span class="text-black q-pl-xs">
                              {{ row.nameuser }}</span
                            >
                          </q-item-label>
                        </q-item-section>
                        <!-- <q-item-section v-show="$q.screen.xs ? false : true">
                          <q-item-label caption lines="1">
                            <span class="text-weight-regular text-primary"
                              >Fotos:</span
                            >
                            <span class="text-black q-pl-xs">
                              {{ row.fotos }}/5</span
                            >
                          </q-item-label>
                        </q-item-section> -->
                      </q-item>

                      <q-separator inset="item" />
                    </template>
                  </q-list>
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
            </div>
          </q-card-section>
        </q-card>
      </div>
      <template v-if="bloquear == true">
        <DataNew
          ref="dataNewRef"
          :id="props.id"
          @desactivarEditor="desactivando"
        />
      </template>
    </div>
  </div>
</template>

<style lang="sass"></style>
