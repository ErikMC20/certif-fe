<script lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useBusquedaPro } from '../../composables/Activity/useBusquedaPro';
  import { ModelDocuments } from './utils/type';
  import { Loading, QSpinnerPuff } from 'quasar';
  import { useFormOptionsStore } from 'src/stores/formOptionsStore';
  import moment from 'moment';
  import { QInput } from 'quasar';
  import { useDocumentsStore } from './store/DocumentStore';
  import { useQuasar } from 'quasar';
  import {userStore} from 'src/modules/Users/store/UserStore';
</script>
<script setup lang="ts">
  const props = withDefaults(
    defineProps < {
      idModule: string;
      nameModule?: string;
      cantDocument?: string;
      persistent?: boolean;
      title?: string;
    } > (),
    {
      persistent: false,
      title: 'Agregar Documento',
    }
  );
  const {userCRM} = userStore();;
  const $q = useQuasar();
  const { loading, isFiltering, showFilter, onClose } = useBusquedaPro();
  const data = ref({} as ModelDocuments);
  const listDivision = ref();
  const formStore = useDocumentsStore();
  const cargar = ref(false);
  const listaestado = ref();
  const listCategorio = ref();
  const listTemplateType = ref();
  const listdocumento = ref();
  const listRegiones = ref();
  const respons = ref();
  onMounted(async () => {
    const optionsSelectDocuments = await formStore.getLanguagesDocuments();
    listaestado.value = optionsSelectDocuments.documentStatus;
    listCategorio.value = optionsSelectDocuments.documentCategory;
    listTemplateType.value = optionsSelectDocuments.documentTemplateType;
    listdocumento.value = optionsSelectDocuments.hansaEstadoDocument;
    listDivision.value = optionsSelectDocuments.documentDivision;
    listRegiones.value = optionsSelectDocuments.regions;
    data.value = {
      nombre: '',
      archivo: [],
      verarchivo: '',
      categoria: '',
      fechapubli: moment().format('YYYY-MM-DD'),
      tipodocumento: '',
      division: userCRM.iddivision || '',
      montocontrato: '',
      estado: 'Active',
      ruta: '',
      version: props.cantDocument || '1',
      fechacadu: moment().add(15, 'd').format('YYYY-MM-DD'),
      documento: 'Publico',
      regional:  '',
    };
  });
  const subjectInputRef = ref < InstanceType < typeof QInput > | null > (null);
  const rulesInput = async (): Promise<boolean | undefined> => {
    return (await Promise.all([subjectInputRef.value?.validate()])).every(
      (input) => !!input
    );
  };
  const validandoInput = async (): Promise<boolean | undefined> => {
    return (await Promise.all([rulesInput()])).every((val) => !!val);
  };
  const regionesOptions = computed(() => {
    return listRegiones.value.map((region) => region.regiones).flat();
  });
  const openDialog = () => {
    showFilter.value = true;
  };
  const typeDocument = ref();
  const previDocumento = (value: File) => {
    typeDocument.value = value.name.match(/\.[^.]+$/)?.[0].substring(1);
    data.value.verarchivo = URL.createObjectURL(value);
    data.value.nombre = value.name;
  };
  const vaciarDocumento = () => {
    data.value.archivo = [];
  };
  const onSubmit = async () => {
    //cargar.value = true;
    const validarData = await validandoInput();
    if (!validarData) {
      return;
    }
    try {
      $q.loading.show({
        spinner: QSpinnerPuff,
        message: 'Guardando Documento',
      });
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
      respons.value = await formStore.saveDocuments_v2(
        dataSend,
        data.value.archivo,
        props.nameModule,
        props.idModule
      );
      if (!!respons.value) {
        showFilter.value = false;
        emit('reload', props.idModule);
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
          version: '',
          fechacadu: moment().add(15, 'd').format('YYYY-MM-DD'),
          documento: '',
          regional: '',
        };
      }
    } catch (error) {
    } finally {
      $q.loading.hide();
    }
    //cargar.value = false;
  };
  const closeDialog = () => {
    showFilter.value = false;
  };
  const tiposFilter = computed(() => {
    const dataConcat =data.value.categoria.value+'_';
    return listTemplateType.value.filter((r:any) => r.value.toLowerCase().includes(dataConcat.toLowerCase()));
  });
  const datosDefault = () => {
    data.value = {
      nombre: '',
      archivo: [],
      verarchivo: '',
      categoria: '',
      fechapubli: moment().format('YYYY-MM-DD'),
      tipodocumento: '',
      division: userCRM.iddivision || '',
      montocontrato: '',
      estado: 'Active',
      ruta: '',
      version: props.cantDocument || '1',
      fechacadu: moment().add(15, 'd').format('YYYY-MM-DD'),
      documento: 'Publico',
      regional:  '',
    };
  };
  const emit = defineEmits < { (event: 'reload', item: string): void }> ();
  defineExpose({
    openDialog,
    onClose,
  });
</script>
<template>
  <dialog-component v-model="showFilter" :sizeDialog="isFiltering ? 'dialog-lg' : 'dialog-lg'" :headerDisabled="false"
    :footerDisabled="false" :loading="loading" :persistent="persistent" @show="datosDefault">
    <template #header>
      <!-- <pre>{{ persistent ? 'is persistent!' : 'is not persistent' }}</pre> -->
      <!-- <q-card class="my-card no-border-radius">
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
        </q-card> -->
      <div class="bg-primary-3 text-black ">
        <q-toolbar class="bg-primary q-pa-md">
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-avatar text-color="white">
                  <q-icon name="upload_file" size="md"></q-icon>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-white text-h5">Nuevo Documento</q-item-label>
                <q-item-label class="text-grey-4 text-caption" lines="1">Subir documentos ya es facil y sencillo
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-space />
          <q-btn dense flat color="white" :icon="!$q.screen.xs ? 'close' : 'arrow_back_ios'" v-close-popup>
            <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-toolbar>
      </div>
    </template>
    <template #body>
      <q-card class="my-card q-ma-md">
        <q-card-section>
          <div class="row q-col-gutter-lg">
            <div class="col-xs-12 col-sm-12 col-md-4 q-col-gutter-sm">
              <div class="col-md-6 col-xs-12">
                <!-- <q-card class="my-card" style="height: 20vh; width: 100%" flat bordered> -->
                <q-file v-model="data.archivo" dense outlined @update:model-value="previDocumento(data.archivo)"
                  label="Agregar Documento">
                  <template v-slot:prepend>
                    <q-icon name="find_in_page" />
                  </template>
                  <template v-slot:append>
                <q-icon
                  name="close"
                  @click.stop.prevent="vaciarDocumento()"
                  class="cursor-pointer"
                />
              </template>
                </q-file>
                <!-- </q-card> -->
              </div>
              <div class="col-md-6 col-xs-12">
                <q-input outlined v-model="data.nombre" label="Nombre del Documento" dense label-slot
                  ref="subjectInputRef" :rules="[(val) => !!val || 'El campo es requerido']">
                </q-input>
              </div>
              <div class="col-md-6 col-xs-12">
                <q-select v-model="data.division" :options="listDivision" label="División" outlined dense options-dense
                  map-options option-value="cod_div" option-label="label" transition-show="flip-up"
                  transition-hide="flip-down" color="primary">
                </q-select>
              </div>
              <div class="col-md-6 col-xs-12">                
                <q-select v-model="data.categoria" :options="listCategorio"
                      label="Categoria" outlined dense options-dense map-options option-value="cod_div"
                      option-label="label" emit-value color="primary"  />
              </div>
              <div class="col-md-6 col-xs-12">
                <q-select v-model="data.tipodocumento" :options="tiposFilter" label="Tipo de Documento" outlined
                  dense options-dense map-options option-value="cod_div" option-label="label" transition-show="flip-up"
                  transition-hide="flip-down" color="primary">
                </q-select>
              </div>
              <div class="col-md-6 col-xs-12">
                <q-input v-model="data.fechapubli" type="date" label="Fecha de Publicación" outlined dense
                  color="primary">
                </q-input>
              </div>
              <div class="col-md-6 col-xs-12">
                <q-input v-model="data.fechacadu" type="date" label="Fecha de Caducidad" outlined dense color="primary">
                </q-input>
              </div>

              <div class="col-md-6 col-xs-12">
                <q-select v-model="data.estado" :options="listaestado" label="Estado" outlined dense options-dense
                  map-options option-value="value" option-label="label" transition-show="flip-up"
                  transition-hide="flip-down" color="primary">
                </q-select>
              </div>
             
              
              <div class="col-md-6 col-xs-12">
                <q-input v-model="data.version" type="text" label="Versión" outlined dense color="primary">
                </q-input>
              </div>
             
             
              <div class="col-md-6 col-xs-12">
                <q-select v-model="data.documento" :options="listdocumento" label="Documento" outlined dense
                  options-dense map-options option-value="cod_div" option-label="label" transition-show="flip-up"
                  transition-hide="flip-down" color="primary">
                </q-select>
              </div>
             
              <div class="col-md-6 col-xs-12">
                <q-select v-model="data.regional" outlined dense :options="regionesOptions" option-value="cod_region"
                  option-label="label" emit-value map-options type="text" label="Region">
                </q-select>
              </div>
              <div class="col-md-6 col-xs-12">
                <q-input v-model="data.ruta" type="text" label="Ruta/ Tramo/ Región" outlined dense color="primary">
                </q-input>
              </div>
              <div class="col-md-6 col-xs-12">
                <q-input v-model="data.montocontrato" type="number" label="Monto del contrato" outlined dense
                  color="primary">
                </q-input>
              </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-8">
              <div class="col-xs-12 col-md-12" align="center">
                <q-card class="q-pa-sm bg-grey-2" v-if="data.verarchivo != ''">
                  <div v-if="typeDocument === 'pdf'">
                    <iframe :src="data.verarchivo" style="height: 65vh; width: 100%" frameborder="0">
                    </iframe>
                  </div>
                  <div v-else>
                    <img :src="data.verarchivo" style="height: 200px; max-width: 720px" />
                  </div>
                </q-card>
                <q-card class="my-card bg-grey-1 column flex-center" v-else style="height: 70vh; width: 100%" flat
                  bordered>
                  <img src="pdf2.jpg" style="width: 200px; height: 200px" />
                  <br>
                  <div class="text-h7 q-mt-sm q-mb-xs text-weight-bold">
                    Cargue un documento para visualizarlo
                  </div>
                </q-card>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-inner-loading :showing="cargar" label="Cargando documento..." label-class="text-teal"
          label-style="font-size: 1.1em" />
      </q-card>
    </template>
    <template #footer>
      <q-btn color="primary" icon="upload_file" label="GUARDAR" class="q-mr-sm" @click="onSubmit" :disable="loading"
        :loading="cargar" />
      <q-btn color="primary" outline icon="highlight_off" label="CANCELAR" @click="closeDialog" :disable="loading" />
    </template>
  </dialog-component>
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