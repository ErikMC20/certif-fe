<script lang="ts">
export default {
  name: 'ViewDocuments',
};
</script>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { useQuotationStore } from '../store/QuotationStore';
import AddDocuments from '../components/Dialogs/AddDocuments.vue';
const props = defineProps<{
  id: string;
}>();

const viewdocument = ref('upload/0');
const link = ref('');
const alert = ref(false);
const quotationStore = useQuotationStore();
const listData = ref([]);
const crear = ref(false);
const editF = ref(false);
const addDocumentsRef = ref<InstanceType<typeof AddDocuments> | null>(null);

const data = ref({
  nombre: '',
  archivo: '',
  categoria: '',
  fechapubli: '',
  tipodocumento: '',
  division: '',
  montocontrato: '',
  estado: '',
  ruta: '',
  version: '',
  fechacadu: '',
  documento: '',
  regional: '',
});

const link2 = `${HANSACRM3_URL}/index.php?entryPoint=download&type=Documents&id=`;

onMounted(async () => {
  listData.value = await quotationStore.getListsPestaStore(
    props.id,
    'documents'
  );
});

const agregarDocuments = () => {
  crear.value = true;
  editF.value = true;
};
const sendIdDocWeb = (id: string) => {
  link.value = id;
  viewdocument.value = `${HANSACRM3_URL}/upload/${id}`;
};
const cancelDatosEdit = () => {
  crear.value = false;
  editF.value = false;
};

const openDialog = () => {
  addDocumentsRef.value?.openDialog();
};
</script>

<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="row col-12 justify-between">
        <div
          class="col-xl-2 col-lg-3 col-md-3 col-sm-12 col-xs-12 q-mb-sm text-primary"
          align="center"
        >
          <q-label>Documentos </q-label>
        </div>
        <div class="col-xl-4 col-lg-6 col-md-7 col-sm-12 col-xs-12 q-mb-sm">
          <div class="row justify-end">
            <slot name="buttons">
              <q-btn
                class="desktop-only"
                icon="picture_as_pdf"
                color="primary"
                @click="openDialog"
                label="Agregar Documento"
                size="md"
              />
            </slot>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-3 q-pa-md">
          <div
            v-if="listData.length > 0 && !$q.screen.xs"
            col-3
            q-pa-md
            column
            items-end
          >
            <q-scroll-area style="height: 70vh">
              <q-list class="scroll q-none">
                <template v-for="(row, index) in listData" :key="index">
                  <q-item
                    class="q-my-sm"
                    clickable
                    @click="sendIdDocWeb(row.id)"
                    active-class="my-menu-link"
                    :active="link === row.id"
                  >
                    <q-item-section avatar>
                      <!-- <img src="pdf3.jpg" style="width: 30px; height: 35px" /> -->
                      <q-icon name="picture_as_pdf" size="xl" color="red" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ row.document_name }}</q-item-label>
                      <q-item-label caption lines="1" class="text-primary">{{
                        row.template_type
                      }}</q-item-label>
                      <q-item-label caption lines="1"
                        >Feche de Creación: {{ row.date_entered }}</q-item-label
                      >
                      <q-item-label caption lines="1"
                        >Usuario Asignado: {{ row.nameuser }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <q-separator inset />
                </template>
              </q-list>
            </q-scroll-area>
          </div>
          <div v-else-if="listData.length > 0 && $q.screen.xs">
            <q-list>
              <template v-for="(row, index) in listData" :key="index">
                <q-item class="q-my-sm" clickable active-class="my-menu-link">
                  <q-item-section avatar>
                    <a :href="link2 + row.id">
                      <!-- <img src="pdf.png" style="width: 30px; height: 35px" /> -->
                      <q-icon name="picture_as_pdf" size="xl" color="red" />
                    </a>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ row.name }}</q-item-label>
                    <q-item-label caption lines="1" class="text-primary">{{
                      row.type
                    }}</q-item-label>
                    <q-item-label caption lines="1"
                      >Feche de Creación: {{ row.date_entered }}</q-item-label
                    >
                    <q-item-label caption lines="1"
                      >Usuario Asignado: {{ row.nameuser }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-separator inset />
              </template>
            </q-list>
          </div>
          <div v-else class="text-center">
            <span>No se encontraron documentos.</span>
          </div>
        </div>
        <template v-if="crear == false">
          <div class="col-9 q-pa-md column items-end" v-if="!$q.screen.xs">
            <template v-if="viewdocument === 'upload/0'">
              <q-card
                style="height: 70vh; width: 100%"
                flat
                bordered
                class="my-card column flex-center"
              >
                <!-- <img src="pdf3.jpg" style="width: 300px; height: 200px" /> -->

                <q-icon name="picture_as_pdf" size="xl" color="red" />
                <div class="text-h5 q-mt-sm q-mb-xs">
                  Visualice un documento seleccionado.
                </div>
              </q-card>
            </template>
            <template v-else>
              <iframe
                :src="viewdocument"
                style="height: 70vh; width: 100%"
                frameborder="0"
              >
              </iframe>
            </template>
          </div>
        </template>
        <template v-else>
          <div class="col-9 q-pa-md" v-if="!$q.screen.xs">
            <q-card class="my-card">
              <div class="row q-col-gutter-md">
                <div class="col-md-6 col-xs-12">
                  <q-input
                    v-model="data.nombre"
                    type="text"
                    label="Nombre de Documento"
                    outlined
                    dense
                    color="primary"
                  >
                  </q-input>
                </div>
                <div class="col-md-6 col-xs-12">
                  <q-select
                    v-model="data.estado"
                    :options="listMercado"
                    label="Estado"
                    outlined
                    dense
                    options-dense
                    map-options
                    option-value="cod_amercado"
                    option-label="label"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    color="primary"
                  >
                  </q-select>
                </div>
                <div class="col-md-6 col-xs-12">
                  <q-input
                    v-model="data.archivo"
                    type="text"
                    label="archivoov"
                    outlined
                    dense
                    color="primary"
                  >
                  </q-input>
                </div>
                <div class="col-md-6 col-xs-12">
                  <q-input
                    v-model="data.ruta"
                    type="text"
                    label="Ruta/ Tramo/ Región"
                    outlined
                    dense
                    color="primary"
                  >
                  </q-input>
                </div>
                <div class="col-md-6 col-xs-12">
                  <q-select
                    v-model="data.categoria"
                    :options="listDivision"
                    label="Categoria"
                    outlined
                    dense
                    options-dense
                    map-options
                    option-value="cod_div"
                    option-label="label"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    color="primary"
                  >
                  </q-select>
                </div>
                <div class="col-md-6 col-xs-12">
                  <q-input
                    v-model="data.version"
                    type="text"
                    label="Versión"
                    outlined
                    dense
                    color="primary"
                  >
                  </q-input>
                </div>
                <div class="col-md-6 col-xs-12">
                  <q-input
                    v-model="data.fechapubli"
                    type="text"
                    label="Fecha de Publicación"
                    outlined
                    dense
                    color="primary"
                  >
                  </q-input>
                </div>
                <div class="col-md-6 col-xs-12">
                  <q-input
                    v-model="data.fechacadu"
                    type="text"
                    label="Fecha de Caducidad"
                    outlined
                    dense
                    color="primary"
                  >
                  </q-input>
                </div>
                <div class="col-md-6 col-xs-12">
                  <q-select
                    v-model="data.tipodocumento"
                    :options="listDivision"
                    label="Tipo de Documento"
                    outlined
                    dense
                    options-dense
                    map-options
                    option-value="cod_div"
                    option-label="label"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    color="primary"
                  >
                  </q-select>
                </div>
                <div class="col-md-6 col-xs-12">
                  <q-select
                    v-model="data.documento"
                    :options="listDivision"
                    label="Documento"
                    outlined
                    dense
                    options-dense
                    map-options
                    option-value="cod_div"
                    option-label="label"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    color="primary"
                  >
                  </q-select>
                </div>
                <div class="col-md-6 col-xs-12">
                  <q-select
                    v-model="data.division"
                    :options="listMercado"
                    label="División"
                    outlined
                    dense
                    options-dense
                    map-options
                    option-value="cod_amercado"
                    option-label="label"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    color="primary"
                  >
                  </q-select>
                </div>
                <div class="col-md-6 col-xs-12">
                  <q-select
                    v-model="data.regional"
                    :options="listDivision"
                    label="Regional"
                    outlined
                    dense
                    options-dense
                    map-options
                    option-value="cod_div"
                    option-label="label"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    color="primary"
                  >
                  </q-select>
                </div>
                <div class="col-md-6 col-xs-12">
                  <q-input
                    v-model="data.montocontrato"
                    type="text"
                    label="Monto del contrato"
                    outlined
                    dense
                    color="primary"
                  >
                  </q-input>
                </div>
              </div>
              <q-separator></q-separator>
              <div class="flex justify-center">
                <q-card-section>
                  <q-btn
                    color="primary"
                    class="q-mr-md"
                    icon="picture_as_pdf"
                    :loading="loadingView"
                    @click="saveTechnicalNew"
                    >Guardar</q-btn
                  >
                  <q-btn color="negative" @click="cancelDatosEdit()"
                    >Cancelar</q-btn
                  >
                </q-card-section>
              </div>
            </q-card>
          </div>
        </template>
        <template>
          <q-dialog v-model="alert">
            <q-card>
              <iframe
                :src="viewdocument"
                style="height: 80vh; width: 100%"
                frameborder="0"
              >
              </iframe>
            </q-card>
          </q-dialog>
        </template>
      </div>
    </q-card-section>
  </q-card>
  <AddDocuments ref="addDocumentsRef" id="" />
</template>

<style lang="sass">
.my-menu-link
  color: white
  background: #1BC1C6
</style>
