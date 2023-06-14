<script lang="ts">
export default {
  name: 'ViewProductAttribute',
};
</script>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useQuotationStore } from '../store/QuotationStore';
import RelacionadoAtri from 'src/components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoAtri.vue';
import RelacionadoConAtri from 'src/components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoConAtri.vue';
// import DialogtablaProds from '../Dialogs/DialogtablaProds.vue';

const props = defineProps<{ id: string }>();

const $q = useQuasar();
// const listItemns = ref([]);
// const storeMaestra = useQuotationStore();
const cargar = ref(false);
const creando = ref(true);
const bloquear = ref(false);
const quotationStore = useQuotationStore();
const isEditing = ref(false);
const listData = ref([]);
const aux = ref();
const creadndoload = ref(false);
const data = ref({
  idmodelo: '',
  nombremodelo: '',
  nombre: '',
  conjunto_atributos: '',
  id_conjunto_atributos: '',
  valor: '',
  atributo: '',
  id_atributo: '',
  descripcion: '',
});

// const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>(null);

const relacionadoAtriRef = ref<InstanceType<typeof RelacionadoAtri> | null>(
  null
);
const relacionadoConAtriRef = ref<InstanceType<
  typeof RelacionadoConAtri
> | null>(null);
// const isEditing = computed(() => baseCardRef.value?.isEditing === 'edit');

// const isSomeCardEditing = computed(() => !!isEditing.value);
onMounted(async () => {
  // cargar.value = true;
  aux.value = await quotationStore.getModuloQuotationStore(
    'HANQ_Modelo',
    props.id
  );
  listData.value = await quotationStore.getListsPestaStore(
    props.id,
    'atributosproducto'
  );
  // cargar.value = false;
  console.log(aux.value, listData.value);
});

const saveAttributeNew = async () => {
  creadndoload.value = true;
  data.value.idmodelo = props.id;
  data.value.nombremodelo = aux.value.name;
  await quotationStore.saveAttributeStore(data.value);
  bloquear.value = false;
  creando.value = true;
  isEditing.value = false;
  creadndoload.value = false;
};

const agregarAtri = async () => {
  bloquear.value = true;
  creando.value = false;
  isEditing.value = true;
};

const cancelDatosEdit = () => {
  bloquear.value = false;
  creando.value = true;
  isEditing.value = false;
};

const selectRelaAtri = (item: any) => {
  data.value.atributo = item.name;
  data.value.id_atributo = item.id;
  relacionadoAtriRef.value?.onClose();
};
const openDialogAtri = () => {
  relacionadoAtriRef.value?.openDialog();
};
const clearAtri = () => {
  data.value.atributo = '';
  data.value.id_atributo = '';
};

const selectRelaConAtri = (item: any) => {
  data.value.conjunto_atributos = item.name;
  data.value.id_conjunto_atributos = item.id;
  relacionadoConAtriRef.value?.onClose();
};
const openDialogConAtri = () => {
  relacionadoConAtriRef.value?.openDialog();
};
const clearConAtri = () => {
  data.value.conjunto_atributos = '';
  data.value.id_conjunto_atributos = '';
};

const exposeData = () => {
  // return leadRelations.value;
};

// const emit = defineEmits<{
//   (event: 'changeDate', dataSend: any): void;
//   (event: 'changeDateR', dataSend: any): void;
// }>();
defineExpose({
  exposeData,
  isEditing,
});
</script>

<template>
  <q-card class="my-card col-12">
    <q-card-section class="row justify-between">
      <!-- <span>
        <q-icon name="widgets" size="sm" color="primary" /> Lista de Atributo
        del Producto
      </span> -->
      <div
        class="col-xl-2 col-lg-3 col-md-3 col-sm-12 col-xs-12 q-mb-sm text-primary"
        align="center"
      >
        <q-label>Lista de Atributo del Producto</q-label>
      </div>
      <div align="right" class="q-gutter-sm">
        <q-btn
          class="desktop-only"
          color="primary"
          icon="account_tree"
          @click="agregarAtri()"
          label="Agregar Atributos"
          size="md"
          :loading="bloquear"
        >
          <template v-slot:loading>
            <q-spinner-gears class="on-left"></q-spinner-gears>
            Agregando...
          </template></q-btn
        >
      </div>
    </q-card-section>

    <template v-if="isEditing">
      <q-separator></q-separator>
      <q-card-section>
        <div class="row q-gutter-sm">
          <div class="col-md-12 col-xs-12 text-primary" align="center">
            <q-icon name="account_tree" size="sm"></q-icon>
            <q-label> Agregar Atributo </q-label>
          </div>
          <div class="col-md-6 col-xs-12">
            <q-input
              v-model="data.nombre"
              type="text"
              label="Nombre"
              outlined
              dense
              color="primary"
              :readonly="creando"
            >
            </q-input>
          </div>
          <div class="col-md-6 col-xs-12">
            <q-input
              outlined
              v-model="data.atributo"
              label="Atributo"
              class="col-md-6 col-sm-12"
              readonly
              dense
              label-slot
            >
              <template v-slot:after>
                <q-btn
                  dense
                  outline
                  icon="north_west"
                  color="primary"
                  @click="openDialogAtri"
                  :disable="creando"
                />
                <q-btn
                  dense
                  outline
                  icon="close"
                  color="negative"
                  @click="clearAtri"
                  :disable="creando"
                />
              </template>
            </q-input>
          </div>

          <div class="col-md-6 col-xs-12">
            <q-input
              v-model="data.valor"
              type="text"
              label="Valor"
              outlined
              dense
              color="primary"
              :readonly="creando"
            >
            </q-input>
          </div>

          <br />
          <div class="col-md-6 col-xs-12">
            <q-input
              outlined
              v-model="data.conjunto_atributos"
              label="Conjunto de Atributos"
              class="col-md-6 col-sm-12"
              readonly
              dense
              label-slot
            >
              <template v-slot:after>
                <q-btn
                  dense
                  outline
                  icon="north_west"
                  color="primary"
                  @click="openDialogConAtri"
                  :disable="creando"
                />
                <q-btn
                  dense
                  outline
                  icon="close"
                  color="negative"
                  @click="clearConAtri"
                  :disable="creando"
                />
              </template>
            </q-input>
          </div>
          <div class="col-md-6 col-xs-12">
            <q-input
              v-model="data.descripcion"
              type="text"
              label="Descripcion"
              outlined
              dense
              color="primary"
              :readonly="creando"
            >
            </q-input>
          </div>
        </div>
      </q-card-section>

      <q-separator></q-separator>
      <div class="flex justify-center">
        <q-card-section>
          <q-btn
            color="primary"
            class="q-mr-md"
            :loading="creadndoload"
            @click="saveAttributeNew"
            >Guardar</q-btn
          >
          <q-btn color="negative" @click="cancelDatosEdit()">Cancelar</q-btn>
        </q-card-section>
      </div>
    </template>

    <q-card-section v-else>
      <div class="col-xs-12 col-md-3 q-pa-sm">
        <template v-if="listData.length > 0">
          <q-scroll-area style="height: 600px; max-width: 1200px">
            <q-list bordered class="rounded-borders" style="max-width: 1200px">
              <template v-for="(row, index) in listData" :key="index">
                <q-item clickable>
                  <q-item-section avatar @click="openAlmacen()">
                    <q-avatar
                      rounded
                      color="primary"
                      text-color="white"
                      icon="account_tree"
                    />
                  </q-item-section>
                  <q-item-section v-show="$q.screen.xs ? false : true">
                    <q-item-label caption lines="1">
                      <span class="text-weight-regular text-primary"
                        >Atributo :</span
                      >
                      <span class="text-black q-pl-xs">
                        {{ row.name_conjuntoatributos }}</span
                      >
                    </q-item-label>
                  </q-item-section>
                  <q-item-section v-show="$q.screen.xs ? false : true">
                    <q-item-label caption lines="1">
                      <span class="text-weight-regular text-primary"
                        >Valor :</span
                      >
                      <span class="text-black q-pl-xs"> {{ row.valor_c }}</span>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section v-show="$q.screen.xs ? false : true">
                    <q-item-label caption lines="1">
                      <span class="text-weight-regular text-primary"
                        >Conjunto de atributos :</span
                      >
                      <span class="text-black q-pl-xs">
                        {{ row.name_atributos }}</span
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
      label="Cargando productos por almacen..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
    <q-inner-loading
      :showing="creadndoload"
      label="Creadndo atributos del producto."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </q-card>
  <DialogtablaProds ref="dialogtablaProdsRef" :idProds="props.id" />
  <RelacionadoAtri
    ref="relacionadoAtriRef"
    @selectItem="selectRelaAtri"
    id=""
  />
  <RelacionadoConAtri
    ref="relacionadoConAtriRef"
    @selectItem="selectRelaConAtri"
    id=""
  />
</template>
