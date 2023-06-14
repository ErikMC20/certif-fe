<script lang="ts" setup>
import { watch } from 'fs';
import { ref, onMounted, computed } from 'vue';
import DataNew from './DataNew.vue';

const props = defineProps<{
  id: string;
  data?: any;
}>();

const dataNewRef = ref<InstanceType<typeof DataNew> | null>(null);
const data = ref({
  editor: '',
});
const aux = ref();
data.value.editor = computed(() => props.data);

// onMounted(async () => {

// });

const sendFinal = (send: any) => {
  // aux.value = dataNewRef.value?.templaSend();
  console.log(send);
};

const exposeData = () => {
  // return dataCabe.value;
};
defineExpose({
  exposeData,
});
</script>
<template>
  <q-card class="my-card">
    <q-card-section
      class="row justify-between bg-primary q-pa-lg text-white"
      flat
      align="center"
    >
      <span>
        <q-icon name="square_foot" size="sm" color="white" />
        Editor de Descripción
      </span>
    </q-card-section>
    <q-separator></q-separator>
    <q-card-section>
      <q-scroll-area style="height: 500px; max-width: 1200px">
        <!-- <pre>{{ props.data }}</pre> -->
        <div class="row">
          <!-- <div class="col-md-12 col-xs-12 text-primary" align="center">
          <q-label> Edición</q-label>
        </div> -->
          <div class="q-pa-md q-gutter-xs">
            <q-editor
              v-model="data.editor"
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
            >
            </q-editor>
          </div>
        </div>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>

<style lang="scss" scoped></style>
