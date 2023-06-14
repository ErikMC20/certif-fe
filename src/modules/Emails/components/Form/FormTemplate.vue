<script setup lang="ts">
import { ref, onMounted } from 'vue';
const emits = defineEmits(['submitForm']);
const props = defineProps({
  templateData: {
    type: Object,
    default: () => ({
      id: 0,
      description: '',
      division: '',
      documents: [],
      module: '',
      name: '',
      subject: '',
      surveys: [],
      variables: '',
      type: '',
      createdBy: '',
      userAssigned: '',
      created: '',
      editor: `<div style="text-align: center; background-color: #003c9c; color: white; height: 200px;">
&nbsp; &nbsp; <font size="7"><b>Hello Hansa</b>!
</font></div>`,
    }),
  },
  optionDivisions: {
    type: Array,
    default: () => [],
  },
  optionsSurvey: {
    type: Array,
    default: () => [],
  },
  optionsModule: {
    type: Array,
    default: () => [],
  },
  optionsType: {
    type: Array,
    default: () => [],
  },
});

const currentTemplateData = ref(props.templateData);

onMounted(() => {
  currentTemplateData.value = props.templateData;
});

const submitting = () => {
  emits('submitForm', currentTemplateData);
};

const test = () => {
  console.log('Hello component');
};

defineExpose({
  test,
  submitting,
});
</script>

<template>
  <q-form class="q-pa-md row q-col-gutter-md" @submit.prevent="submitting">
    <div class="col-12 col-md-5">
      <q-card class="q-pa-xs">
        <div class="q-px-sm q-py-sm text-bold text-subtitle1">
          <q-icon name="description" class="q-mr-sm" />
          Datos de Plantilla
        </div>
        <q-card-section class="card-template-section">
          <q-select
            v-model="currentTemplateData.division"
            :options="optionDivisions"
            outlined
            label="División"
            dense
            class="q-mb-md"
          />
          <q-input
            v-model="currentTemplateData.name"
            type="text"
            outlined
            dense
            label="Nombre"
            class="q-mb-md"
            :rules="[(val) => !!val || 'Se requiere un nombre ']"
          />
          <q-input
            v-model="currentTemplateData.userAssigned"
            type="text"
            outlined
            dense
            label="Usuario Asignado"
            class="q-mb-md"
          />
          <q-input
            v-model="currentTemplateData.description"
            type="textarea"
            outlined
            dense
            label="Descripción"
            class="q-mb-md"
          />
          <q-select
            class="q-mb-md"
            dense
            label="Encuesta"
            multiple
            outlined
            :options="optionsSurvey"
            type="text"
            use-chips
            v-model="currentTemplateData.surveys"
          />
          <q-select
            v-model="currentTemplateData.modules"
            :options="optionsModule"
            type="text"
            outlined
            dense
            label="Módulo"
            class="q-mb-md"
          />
          <q-select
            v-model="currentTemplateData.type"
            :options="optionsType"
            type="text"
            outlined
            dense
            label="Tipo"
            class="q-mb-md"
          />
          <q-input
            v-model="currentTemplateData.subject"
            type="textarea"
            outlined
            dense
            label="Asunto"
            class="q-mb-md"
          />
          <q-input
            v-model="currentTemplateData.variables"
            type="text"
            outlined
            dense
            label="Variable"
            class="q-mb-md"
          />
          <q-file
            v-model="currentTemplateData.documents"
            label="Insertar documentos"
            outlined
            use-chips
            multiple
            dense
          />
        </q-card-section>
      </q-card>
    </div>
    <div class="col-12 col-md-7">
      <q-card class="q-pa-xs">
        <div class="q-px-sm q-py-sm text-bold text-subtitle1">
          <q-icon name="preview" class="q-mr-sm" />
          Visualizacion de Plantilla
        </div>
        <q-card-section class="card-template-email-section">
          <q-editor
            v-model="currentTemplateData.editor"
            flat
            toolbar-text-color="white"
            max-height="85%"
            toolbar-bg="primary"
            :toolbar="[
              [
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
              [
                {
                  label: $q.lang.editor.formatting,
                  icon: $q.iconSet.editor.formatting,
                  list: 'no-icons',
                  options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
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
          />
        </q-card-section>
      </q-card>
    </div>
  </q-form>
</template>
