<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
// import spanish from '../../../../../boot/dateLanguage';../../../../../composables/Activity/useBusquedaPro
import { useBusquedaPro } from '../../../../composables/Activity/useBusquedaPro';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import { QuotationTableStore } from '../../store/QuotationTableStore';
import moment from 'moment';
import { useQuotationStore } from '../../store/QuotationStore';
import { QInput } from 'quasar';
const props = withDefaults(
  defineProps<{
    idModule: string;
    persistent?: boolean;
    title?: string;
  }>(),
  {
    persistent: false,
    title: 'Agregar Documento',
  }
);
const subjectInputRef = ref<InstanceType<typeof QInput> | null>(null);
const {
  loading,
  isFiltering,
  showFilter,
  show_more_field,
  formInputs,
  dataFilter,
  HANSACRM3_URL,
  listPros,
  submitFilter,
  clearFilter,
  onClose,
} = useBusquedaPro();

const rulesInput = async (): Promise<boolean | undefined> => {
  return (await Promise.all([subjectInputRef.value?.validate()])).every(
    (input) => !!input
  );
};

const data = ref({
  nombre: '',
  archivo: [],
  verarchivo: '',
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

const dataread = ref({
  nombre: '',
  archivo: [],
  verarchivo: '',
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
const useQuotationStoreRef = useQuotationStore();
const tcolor = ref();
const editar = ref(false);
const languageStore = useFormOptionsStore();
const tableStore = QuotationTableStore();
const listDivision = ref();

const regionesOptions = computed(() => {
  return languageStore.leadsOptions.regions
    .map((region) => region.regiones)
    .flat();
});

onMounted(async () => {
  await languageStore.HANQModelOptions;
  listDivision.value = await tableStore.getDivisionLead();
  data.value = {
    nombre: '',
    archivo: [],
    verarchivo: '',
    categoria: '',
    fechapubli: moment().format('YYYY-MM-DD'),
    tipodocumento: '',
    division: '',
    montocontrato: '',
    estado: '',
    ruta: '',
    version: '1',
    fechacadu: moment().add(15, 'd').format('YYYY-MM-DD'),
    documento: '',
    regional: '',
  };
});
// tcolor.value = computed(() => {
//   const transcolor = data.value.color.replace('#', '%23');
//   return ;
// });

// const filteredContacts = computed(() => {
//   return listPros.value.filter((contact) => contact.id !== props.idModule);
// });

const validandoInput = async (): Promise<boolean | undefined> => {
  return (await Promise.all([rulesInput()])).every((val) => !!val);
};
const respons = ref();
const onSubmit = async () => {
  const validarData = await validandoInput();
  if (!validarData) {
    return;
  }

  const dataSend = {
    name: data.value.nombre,
    category_id: data.value.categoria.value,
    subcategory_id: '',
    active_date: data.value.fechapubli,
    exp_date: data.value.fechacadu,
    template_type: data.value.tipodocumento.value,
    iddivision_c: data.value.division.cod_div,
    montocontrato_c: data.value.montocontrato,
    status: data.value.estado.value,
    ruta_tramo_region_c: data.value.ruta,
    revision: data.value.version,
    documento_c: data.value.documento.value,
    regional_c: data.value.regional,
  };

  respons.value = await useQuotationStoreRef.saveDocuments(
    dataSend,
    data.value.archivo,
    'AOS_Quotes',
    props.idModule
  );

  if (!!respons.value) {
    showFilter.value = false;
    emit('reload', props.idModule);
  }
};

const openDialog = () => {
  // showFilter.value = !showFilter.value;
  showFilter.value = true;
};

const vaciarfile = () => {
  data.value.archivo = '';
  // data.value.vercolor = 'imagenvaciaNew.png';
};
const onReset = () => {
  clearFilter();
};

const previDocumento = (value: File) => {
  data.value.verarchivo = URL.createObjectURL(value);
  data.value.nombre = value.name;
};
const vaciarDocumento = () => {
  data.value.archivo = [];
};

const closeDialog = () => {
  showFilter.value = false;
};

const clearColornom = () => {
  data.value.nombre = '';
};

const listdocumento = languageStore.HANQModelOptions.hansaEstadoDocument;

const listaestado = languageStore.HANQModelOptions.documentStatus;
const listCategorio = languageStore.HANQModelOptions.documentCategory;
const listTemplateType = languageStore.HANQModelOptions.documentTemplateType;

const emit = defineEmits<{ (event: 'reload', item: string): void }>();

defineExpose({
  openDialog,
  onClose,
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
        <!-- <pre>{{ persistent ? 'is persistent!' : 'is not persistent' }}</pre> -->
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
                @click="onClose"
              />
            </div>
          </q-card-section>
        </q-card>
      </template>

      <template #body>
        <q-card class="my-card" v-if="editar == false">
          <q-card-section class="text-white row q-col-gutter-sm">
            <div class="col-12">
              <!-- <q-input
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
              </q-input> -->
              <q-file
                outlined
                v-model="data.archivo"
                dense
                @update:model-value="previDocumento(data.archivo)"
                label="Agregar Documento..."
              >
                <template v-slot:prepend>
                  <q-icon name="picture_as_pdf" />
                </template>
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click.stop.prevent="vaciarDocumento()"
                    class="cursor-pointer"
                  />
                </template>
              </q-file>
            </div>
            <div class="col-xs-12 col-md-12" align="center">
              <q-card class="q-pa-sm" v-if="data.verarchivo != ''">
                <img
                  :src="data.verarchivo"
                  style="height: 200px; max-width: 720px"
                />
              </q-card>
              <q-card class="q-pa-sm" v-else>
                <q-icon
                  name="picture_as_pdf"
                  size="xl"
                  color="red"
                  style="height: 200px; max-width: 720px"
                />
              </q-card>
            </div>
            <div class="col-12">
              <q-input
                outlined
                v-model="data.nombre"
                label="Nombre del Documento"
                dense
                label-slot
                ref="subjectInputRef"
                :rules="[(val) => !!val || 'El campo es requerido']"
              >
                <!-- <template v-slot:prepend>
                  <q-avatar>
                    <q-icon name="picture_as_pdf" size="sm" />
                  </q-avatar>
                </template> -->
                <!-- <template v-slot:after>
                  <q-btn
                    dense
                    outline
                    icon="close"
                    color="negative"
                    @click="clearColornom"
                  />
                </template> -->
              </q-input>
            </div>

            <div class="col-12"><q-separator></q-separator></div>
            <!-- <div class="col-md-6 col-xs-12">
              <q-input
                v-model="data.nombre"
                type="text"
                label="Nombre de Documento"
                outlined
                dense
                color="primary"
              >
              </q-input>
            </div> -->
            <div class="col-md-6 col-xs-12">
              <q-select
                v-model="data.estado"
                :options="listaestado"
                label="Estado"
                outlined
                dense
                options-dense
                map-options
                option-value="value"
                option-label="label"
                transition-show="flip-up"
                transition-hide="flip-down"
                color="primary"
              >
              </q-select>
            </div>
            <!-- <div class="col-md-6 col-xs-12">
              <q-input
                v-model="data.archivo"
                type="text"
                label="archivoov"
                outlined
                dense
                color="primary"
              >
              </q-input>
            </div> -->
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
                :options="listCategorio"
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
                :options="listTemplateType"
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
                :options="listdocumento"
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
                :options="listDivision"
                label="División"
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
                v-model="data.regional"
                outlined
                dense
                :options="regionesOptions"
                option-value="cod_region"
                option-label="label"
                emit-value
                map-options
                type="text"
                label="Region"
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
          </q-card-section>
          <!-- <pre>{{ data }}</pre> -->
        </q-card>
        <!-- ---------------------------------------------------------------------------------------------------------para leer -->
        <q-card class="my-card" v-else>
          <q-card-section class="text-white row q-col-gutter-sm">
            <div class="col-xs-4 col-md-4" align="center">
              <q-card class="q-pa-sm">
                <img
                  :src="dataread.verarchivo"
                  style="height: 100px; max-width: 220px"
                />
              </q-card>
            </div>
            <div class="col-xs-6 col-md-6 center">
              <!-- <q-btn
                label="Selecione un color"
                icon-right="colorize"
                color="primary"
                type="File"
              >
              </q-btn> -->
              <q-file
                outlined
                v-model="dataread.archivo"
                dense
                @update:model-value="previcolor(dataread.archivo)"
                label="Agregar documento..."
              >
                <template v-slot:prepend>
                  <q-icon name="picture_as_pdf" />
                </template>
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click.stop.prevent="vaciarfile()"
                    class="cursor-pointer"
                  />
                </template>
              </q-file>
            </div>
            <div class="col-12"><q-separator></q-separator></div>
            <!-- <div class="col-md-6 col-xs-12">
              <q-input
                v-model="data.nombre"
                type="text"
                label="Nombre de Documento"
                outlined
                dense
                color="primary"
              >
              </q-input>
            </div> -->

            <div class="col-10">
              <q-input
                outlined
                v-model="dataread.nombre"
                label="Nombre del Documento"
                dense
                label-slot
              >
              </q-input>
            </div>
            <div class="col-md-6 col-xs-12">
              <q-select
                v-model="dataread.estado"
                :options="listaestado"
                label="Estado"
                outlined
                dense
                options-dense
                map-options
                option-value="value"
                option-label="label"
                transition-show="flip-up"
                transition-hide="flip-down"
                color="primary"
              >
              </q-select>
            </div>
            <!-- <div class="col-md-6 col-xs-12">
              <q-input
                v-model="data.archivo"
                type="text"
                label="archivoov"
                outlined
                dense
                color="primary"
              >
              </q-input>
            </div> -->
            <div class="col-md-6 col-xs-12">
              <q-input
                v-model="dataread.ruta"
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
                v-model="dataread.categoria"
                :options="listCategorio"
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
                v-model="dataread.version"
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
                v-model="dataread.fechapubli"
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
                v-model="dataread.fechacadu"
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
                v-model="dataread.tipodocumento"
                :options="listTemplateType"
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
                v-model="dataread.documento"
                :options="listdocumento"
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
                v-model="dataread.division"
                :options="listDivision"
                label="División"
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
                v-model="dataread.regional"
                outlined
                dense
                :options="regionesOptions"
                option-value="cod_region"
                option-label="label"
                emit-value
                map-options
                type="text"
                label="Region"
              >
              </q-select>
            </div>
            <div class="col-md-6 col-xs-12">
              <q-input
                v-model="dataread.montocontrato"
                type="text"
                label="Monto del contrato"
                outlined
                dense
                color="primary"
              >
              </q-input>
            </div>
          </q-card-section>
          <!-- <pre>{{ dataread }}</pre> -->
        </q-card>
      </template>

      <template #footer>
        <q-btn
          color="primary"
          icon="picture_as_pdf"
          label="GUARDAR"
          class="q-mr-sm"
          @click="onSubmit"
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
    <!-- <q-dialog v-model="show_more_field">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6 q-pt-none">
            Campos de búsqueda
            <q-btn icon="close" flat dense class="float-right" v-close-popup />
          </div>
          <hr />
          <div class="q-col-gutter-sm">
            <q-checkbox
              v-for="(item, index) in formInputs"
              :key="index"
              keep-color
              v-model="item['visible']"
              :label="item['label']"
              color="primary"
              style="width: 33.3%"
              :val="item['visible']"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog> -->
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
