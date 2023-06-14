<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { QInput } from 'quasar';
import { useQuotationStore } from '../../store/QuotationStore';

const props = defineProps<{
  id: string;
}>();

const dataCabe = ref({
  nombre: '',
  modelo: '',
  descripcion: '',
  idmodelo: '',
  nombremodelo: '',
  tipo: 'Datos cabecera',
  editor: '',
  idcat: '',
});
const dataTecn = ref({
  nombre: '',
  modelo: '',
  descripcion: '',
  idmodelo: '',
  nombremodelo: '',
  tipo: 'Datos tecnicos',
  editor: '',
  idcat: '',
});
const editorprincipal = ref('Hansa');
const listatemplates = ref();
const btnST = ref('one');
const quotationStore = useQuotationStore();
const isEditing = ref(false);
const listaModelo = ref();
const creandoload = ref(false);

onMounted(async () => {
  listaModelo.value = await quotationStore.getModuloQuotationStore(
    'HANQ_Modelo',
    props.id
  );
  listatemplates.value = await quotationStore.getListaTemplates();
});

const saveTechnicalNew = async () => {
  const listaCategoria = await quotationStore.getCategoryModelStore();
  creandoload.value = true;
  if (dataCabe.value.nombre != '') {
    dataCabe.value.idmodelo = props.id;
    dataCabe.value.nombremodelo = listaModelo.value.name;
    dataCabe.value.idcat = listaCategoria.find(
      (elem) => elem.name == dataCabe.value.tipo
    ).id;
    dataCabe.value.editor = editorprincipal.value;
    await quotationStore.saveTechnicalStore(dataCabe.value);
  } else {
    (dataTecn.value.idmodelo = props.id),
      (dataTecn.value.nombremodelo = listaModelo.value.name),
      (dataTecn.value.idcat = listaCategoria.find(
        (elem) => elem.name == dataCabe.value.tipo
      ).id),
      (dataTecn.value.editor = editorprincipal.value);
    await quotationStore.saveTechnicalStore(dataTecn.value);
  }
  creandoload.value = false;
  isEditing.value = false;
  emit('desactivarEditor', isEditing.value);
};
const templaSend = (end: any) => {
  editorprincipal.value = end.description;
};

const cancelDatosEdit = () => {
  isEditing.value = false;
  emit('desactivarEditor', isEditing.value);
};
const emit = defineEmits<{
  (event: 'desactivarEditor', isEditing: boolean): void;
}>();
const exposeData = () => {
  return dataCabe.value;
};
defineExpose({
  exposeData,
});
</script>
<template>
  <q-card class="my-card" style="min-height: 80vh">
    <!-- <q-card-section
      class="row justify-between bg-primary q-pa-sm text-white"
      flat
      align="center"
    >
      <span>
        <q-icon name="settings_applications" size="sm" color="white" /> Datos de
        Cabecera y Datos Técnicos
      </span>
    </q-card-section> -->
    <q-card-section class="row justify-between">
      <div
        class="col-xl-2 col-lg-3 col-md-3 col-sm-12 col-xs-12 q-mb-sm text-primary"
        align="center"
      >
        <q-label> Cabecera y Datos Técnicos </q-label>
      </div>
    </q-card-section>
    <q-separator></q-separator>
    <div class="row">
      <div class="col-md-3 col-xs-12">
        <q-card-section>
          <div class="col-xs-12">
            <q-btn-toggle
              v-model="btnST"
              spread
              class="my-custom-toggle"
              no-caps
              rounded
              glossy
              push
              toggle-color="primary"
              color="white"
              text-color="primary"
              :options="[
                { label: 'Datos Cabecera', value: 'one' },
                { label: 'Datos Tecnicos', value: 'two' },
              ]"
            />
          </div>
        </q-card-section>
        <q-card-section v-if="btnST == 'one'">
          <div class="row q-col-gutter-sm">
            <div class="col-md-12 col-xs-12 text-primary" align="center">
              <q-label> Datos de Cabecera </q-label>
            </div>
            <div class="col-xs-12">
              <q-input
                v-model="dataCabe.nombre"
                ref="subjectInputRef"
                type="text"
                label="Datos de Cabecera"
                outlined
                dense
                color="primary"
                :rules="[(val) => !!val || 'El campo es requerido']"
                :readonly="dataTecn.modelo != '' || dataTecn.nombre != ''"
              >
                <template #before>
                  <q-icon name="psychology" />
                </template>
              </q-input>
            </div>

            <div class="col-md-12 col-xs-12">
              <q-select
                v-model="dataCabe.modelo"
                :options="listatemplates"
                label="Modelo de cabecera"
                outlined
                dense
                options-dense
                option-value="description"
                option-label="name"
                transition-show="flip-up"
                transition-hide="flip-down"
                color="primary"
                @update:model-value="templaSend"
                :readonly="dataTecn.modelo != '' || dataTecn.nombre != ''"
              >
                <template #before>
                  <q-icon name="settings_suggest" />
                </template>
              </q-select>
            </div>
            <div class="col-xs-12">
              <q-input
                v-model="dataCabe.descripcion"
                type="text"
                label="Descripcion"
                outlined
                dense
                color="primary"
              >
                <template #before>
                  <q-icon name="description" />
                </template>
              </q-input>
            </div>
          </div>
          <!-- <pre>{{ dataCabe }}</pre> -->
        </q-card-section>
        <!-- <q-separator></q-separator> -->

        <!-- -------------------------------Para los datos tecnicos----------------------------------->

        <q-card-section v-if="btnST == 'two'">
          <div class="row q-col-gutter-sm">
            <div class="col-md-12 col-xs-12 text-primary" align="center">
              <q-label> Datos Técnicos </q-label>
            </div>
            <div class="col-md-12 col-xs-12">
              <q-input
                v-model="dataTecn.nombre"
                ref="subjectInputRef"
                type="text"
                label="Datos Técnicos"
                outlined
                dense
                color="primary"
                :rules="[(val) => !!val || 'El campo es requerido']"
                :readonly="dataCabe.modelo != '' || dataCabe.nombre != ''"
              >
                <template #before>
                  <q-icon name="perm_data_setting" />
                </template>
              </q-input>
            </div>

            <div class="col-md-12 col-xs-12">
              <q-select
                v-model="dataTecn.modelo"
                :options="listatemplates"
                label="Modelo de datos técnicos"
                outlined
                dense
                options-dense
                option-value="description"
                option-label="name"
                transition-show="flip-up"
                transition-hide="flip-down"
                color="primary"
                @update:model-value="templaSend"
                :readonly="dataCabe.modelo != '' || dataCabe.nombre != ''"
              >
                <template #before>
                  <q-icon name="settings_suggest" />
                </template>
              </q-select>
            </div>
            <div class="col-xs-12">
              <q-input
                v-model="dataTecn.descripcion"
                type="text"
                label="Descripcion"
                outlined
                dense
                color="primary"
              >
                <template #before>
                  <q-icon name="description" />
                </template>
              </q-input>
            </div>
            <!-- <pre>{{ data }}</pre> -->
          </div>
        </q-card-section>
      </div>
      <div class="col-md-9 col-xs-12">
        <q-card-section>
          <q-scroll-area style="height: 400px; max-width: 1200px">
            <div class="q-pa-md q-gutter-xs">
              <q-editor
                v-model="editorprincipal"
                :dense="$q.screen.lt.md"
                :toolbar="[
                  [
                    {
                      label: $q.lang.editor.align,
                      icon: $q.iconSet.editor.align,
                      fixedLabel: true,
                      list: 'only-icons',
                      options: ['left', 'center', 'right', 'justify'],
                    },
                    {
                      label: $q.lang.editor.align,
                      icon: $q.iconSet.editor.align,
                      fixedLabel: true,
                      options: ['left', 'center', 'right', 'justify'],
                    },
                  ],
                  [
                    'bold',
                    'italic',
                    'strike',
                    'underline',
                    'subscript',
                    'superscript',
                  ],
                  ['token', 'hr', 'link', 'custom_btn'],
                  ['print', 'fullscreen'],
                  [
                    {
                      label: $q.lang.editor.formatting,
                      icon: $q.iconSet.editor.formatting,
                      list: 'no-icons',
                      options: [
                        'p',
                        'h1',
                        'h2',
                        'h3',
                        'h4',
                        'h5',
                        'h6',
                        'code',
                      ],
                    },
                    {
                      label: $q.lang.editor.fontSize,
                      icon: $q.iconSet.editor.fontSize,
                      fixedLabel: true,
                      fixedIcon: true,
                      list: 'no-icons',
                      options: [
                        'size-1',
                        'size-2',
                        'size-3',
                        'size-4',
                        'size-5',
                        'size-6',
                        'size-7',
                      ],
                    },
                    {
                      label: $q.lang.editor.defaultFont,
                      icon: $q.iconSet.editor.font,
                      fixedIcon: true,
                      list: 'no-icons',
                      options: [
                        'default_font',
                        'arial',
                        'arial_black',
                        'comic_sans',
                        'courier_new',
                        'impact',
                        'lucida_grande',
                        'times_new_roman',
                        'verdana',
                      ],
                    },
                    'removeFormat',
                  ],
                  ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                  ['undo', 'redo'],
                  ['viewsource'],
                ]"
                :fonts="{
                  arial: 'Arial',
                  arial_black: 'Arial Black',
                  comic_sans: 'Comic Sans MS',
                  courier_new: 'Courier New',
                  impact: 'Impact',
                  lucida_grande: 'Lucida Grande',
                  times_new_roman: 'Times New Roman',
                  verdana: 'Verdana',
                }"
              >
              </q-editor>
            </div>
          </q-scroll-area>
        </q-card-section>
      </div>
    </div>
    <!-- <template> -->
    <q-separator></q-separator>
    <div class="flex justify-center">
      <q-card-section>
        <q-btn
          color="primary"
          class="q-mr-md"
          :loading="loadingView"
          @click="saveTechnicalNew"
          >Guardar</q-btn
        >
        <q-btn color="negative" @click="cancelDatosEdit()">Cancelar</q-btn>
      </q-card-section>
    </div>
    <!-- </template> -->
    <q-inner-loading
      :showing="creandoload"
      label="Creando datos del modelo."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </q-card>
</template>

<style lang="scss" scoped></style>
