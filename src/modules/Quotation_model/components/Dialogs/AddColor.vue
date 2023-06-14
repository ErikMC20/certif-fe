<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
// import spanish from '../../../../../boot/dateLanguage';../../../../../composables/Activity/useBusquedaPro
import { useBusquedaPro } from '../../../../composables/Activity/useBusquedaPro';
// import { dataimages } from '../../utils/types';
const props = withDefaults(
  defineProps<{
    account_id: string;
    persistent?: boolean;
    title?: string;
  }>(),
  {
    persistent: false,
    title: 'Agregar Color',
  }
);

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

const data = ref({
  name: '',
  color: '',
  archivocolor: [],
  vercolor: '',
  archivocostado: [],
  vercostado: '',
  archivoperfil: [],
  verperfil: '',
  archivoatras: [],
  veratras: '',
  archivofrontal: [],
  verfrontal: '',
});
const tcolor = ref();
const addColorP = ref(true);
onMounted(async () => {
  data.value = {
    name: '',
    color: '',
    archivocolor: [],
    vercolor: 'imagenvaciaNew.png',
    archivocostado: [],
    vercostado: 'imagenvaciaNew.png',
    archivoperfil: [],
    verperfil: 'imagenvaciaNew.png',
    archivoatras: [],
    veratras: 'imagenvaciaNew.png',
    archivofrontal: [],
    verfrontal: 'imagenvaciaNew.png',
  };
});
// tcolor.value = computed(() => {
//   const transcolor = data.value.color.replace('#', '%23');
//   return ;
// });

const filteredContacts = computed(() => {
  return listPros.value.filter((contact) => contact.id !== props.account_id);
});

const onSubmit = () => {
  console.log(dataFilter.value);
  // onClose();
  submitFilter(dataFilter.value);
};

const openDialog = () => {
  // showFilter.value = !showFilter.value;
  showFilter.value = true;
};

const vaciarcostado = () => {
  data.value.archivocostado = [];
  data.value.vercostado = 'imagenvaciaNew.png';
};
const vaciarperfil = () => {
  data.value.archivoperfil = [];
  data.value.verperfil = 'imagenvaciaNew.png';
};
const vaciaratras = () => {
  data.value.archivoatras = [];
  data.value.veratras = 'imagenvaciaNew.png';
};
const vaciarfrontal = () => {
  data.value.archivofrontal = [];
  data.value.verfrontal = 'imagenvaciaNew.png';
};
const vaciarcolor = () => {
  data.value.archivocolor = [];
  data.value.vercolor = 'imagenvaciaNew.png';
};
const onReset = () => {
  clearFilter();
};

const previcostado = (value: File) => {
  // console.log(value);
  data.value.vercostado = URL.createObjectURL(value);
};
const previperfil = (value: File) => {
  // console.log(value);
  data.value.verperfil = URL.createObjectURL(value);
};
const previatras = (value: File) => {
  // console.log(value);
  data.value.veratras = URL.createObjectURL(value);
};
const previfrontal = (value: File) => {
  // console.log(value);
  data.value.verfrontal = URL.createObjectURL(value);
};
const previcolor = (value: File) => {
  // console.log(value);
  data.value.vercolor = URL.createObjectURL(value);
};
const mayus = (value: string) => {
  // console.log(value);
  data.value.name = value.toUpperCase();
};

const clearColornom = () => {
  data.value.name = '';
};
defineEmits(['selectItem', 'showAccount']);
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
        <q-card class="my-card" v-if="(addColorP = true)">
          <q-card-section class="text-white row q-col-gutter-sm">
            <div class="col-10">
              <q-input
                outlined
                v-model="data.name"
                label="Nombre del Color"
                dense
                label-slot
                @update:model-value="mayus(data.name)"
              >
                <template v-slot:prepend>
                  <q-avatar>
                    <q-icon name="palette" size="sm" />
                  </q-avatar>
                </template>
                <template v-slot:after>
                  <q-btn
                    dense
                    outline
                    icon="close"
                    color="negative"
                    @click="clearColornom"
                  />
                </template>
              </q-input>
            </div>
            <div class="col-xs-4 col-md-4" align="center">
              <q-card class="q-pa-sm">
                <img
                  :src="data.vercolor"
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
                v-model="data.archivocolor"
                dense
                @update:model-value="previcolor(data.archivocolor)"
                label="Agregar color..."
              >
                <template v-slot:prepend>
                  <q-icon name="colorize" />
                </template>
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click.stop.prevent="vaciarcolor()"
                    class="cursor-pointer"
                  />
                </template>
              </q-file>
            </div>
            <div class="col-12"><q-separator></q-separator></div>
            <div class="col-xs-6 col-md-6">
              <q-intersection transition="scale" class="example-item">
                <q-card class="q-pa-sm">
                  <img
                    :src="data.vercostado"
                    style="height: 150px; max-width: 260px"
                  />
                  <div class="text-primary" align="center">Costado</div>

                  <q-file
                    outlined
                    v-model="data.archivocostado"
                    dense
                    @update:model-value="previcostado(data.archivocostado)"
                    label="Agregar costado..."
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="vaciarcostado()"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </q-card>
              </q-intersection>
            </div>
            <div class="col-xs-6 col-md-6">
              <q-intersection transition="scale" class="example-item">
                <q-card class="q-pa-sm">
                  <img
                    :src="data.verperfil"
                    style="height: 150px; max-width: 260px"
                  />
                  <div class="text-primary" align="center">Perfil</div>
                  <q-file
                    outlined
                    v-model="data.archivoperfil"
                    dense
                    @update:model-value="previperfil(data.archivoperfil)"
                    label="Agregar perfil..."
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="vaciarperfil()"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </q-card>
              </q-intersection>
            </div>
            <div class="col-xs-6 col-md-6">
              <q-intersection transition="scale" class="example-item">
                <q-card class="q-pa-sm">
                  <img
                    :src="data.veratras"
                    style="height: 150px; max-width: 260px"
                  />
                  <div class="text-primary" align="center">Atras</div>
                  <q-file
                    outlined
                    v-model="data.archivoatras"
                    dense
                    @update:model-value="previatras(data.archivoatras)"
                    label="Agregar atras..."
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="vaciaratras()"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </q-card>
              </q-intersection>
            </div>
            <div class="col-xs-6 col-md-6">
              <q-intersection transition="scale" class="example-item">
                <q-card class="q-pa-sm">
                  <img
                    :src="data.verfrontal"
                    style="height: 150px; max-width: 260px"
                  />
                  <div class="text-primary" align="center">Frontal</div>
                  <q-file
                    outlined
                    v-model="data.archivofrontal"
                    dense
                    @update:model-value="previfrontal(data.archivofrontal)"
                    label="Agregar frontal..."
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="vaciarfrontal()"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </q-card>
              </q-intersection>
            </div>
          </q-card-section>
          <!-- <pre>{{ tcolor }}</pre>
          <pre>{{ data }}</pre> -->
        </q-card>
        <!-- ---------------------------------------------------------------------------------------------------------para leer -->
        <q-card class="my-card" v-else>
          <q-card-section class="text-white row q-col-gutter-sm">
            <div class="col-10">
              <q-input
                outlined
                v-model="data.name"
                label="Nombre del Color"
                dense
                label-slot
                @update:model-value="mayus(data.name)"
              >
                <template v-slot:prepend>
                  <q-avatar>
                    <q-icon name="palette" size="sm" />
                  </q-avatar>
                </template>
                <template v-slot:after>
                  <q-btn
                    dense
                    outline
                    icon="close"
                    color="negative"
                    @click="clearColornom"
                  />
                </template>
              </q-input>
            </div>
            <div class="col-xs-4 col-md-4" align="center">
              <q-card class="q-pa-sm">
                <img
                  :src="data.vercolor"
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
                v-model="data.archivocolor"
                dense
                @update:model-value="previcolor(data.archivocolor)"
                label="Agregar color..."
              >
                <template v-slot:prepend>
                  <q-icon name="colorize" />
                </template>
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click.stop.prevent="vaciarcolor()"
                    class="cursor-pointer"
                  />
                </template>
              </q-file>
            </div>
            <div class="col-12"><q-separator></q-separator></div>
            <div class="col-xs-6 col-md-6">
              <q-intersection transition="scale" class="example-item">
                <q-card class="q-pa-sm">
                  <img
                    :src="data.vercostado"
                    style="height: 150px; max-width: 260px"
                  />
                  <div class="text-primary" align="center">Costado</div>

                  <q-file
                    outlined
                    v-model="data.archivocostado"
                    dense
                    @update:model-value="previcostado(data.archivocostado)"
                    label="Agregar costado..."
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="vaciarcostado()"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </q-card>
              </q-intersection>
            </div>
            <div class="col-xs-6 col-md-6">
              <q-intersection transition="scale" class="example-item">
                <q-card class="q-pa-sm">
                  <img
                    :src="data.verperfil"
                    style="height: 150px; max-width: 260px"
                  />
                  <div class="text-primary" align="center">Perfil</div>
                  <q-file
                    outlined
                    v-model="data.archivoperfil"
                    dense
                    @update:model-value="previperfil(data.archivoperfil)"
                    label="Agregar perfil..."
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="vaciarperfil()"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </q-card>
              </q-intersection>
            </div>
            <div class="col-xs-6 col-md-6">
              <q-intersection transition="scale" class="example-item">
                <q-card class="q-pa-sm">
                  <img
                    :src="data.veratras"
                    style="height: 150px; max-width: 260px"
                  />
                  <div class="text-primary" align="center">Atras</div>
                  <q-file
                    outlined
                    v-model="data.archivoatras"
                    dense
                    @update:model-value="previatras(data.archivoatras)"
                    label="Agregar atras..."
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="vaciaratras()"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </q-card>
              </q-intersection>
            </div>
            <div class="col-xs-6 col-md-6">
              <q-intersection transition="scale" class="example-item">
                <q-card class="q-pa-sm">
                  <img
                    :src="data.verfrontal"
                    style="height: 150px; max-width: 260px"
                  />
                  <div class="text-primary" align="center">Frontal</div>
                  <q-file
                    outlined
                    v-model="data.archivofrontal"
                    dense
                    @update:model-value="previfrontal(data.archivofrontal)"
                    label="Agregar frontal..."
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="vaciarfrontal()"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </q-card>
              </q-intersection>
            </div>
          </q-card-section>
          <!-- <pre>{{ tcolor }}</pre>
          <pre>{{ data }}</pre> -->
        </q-card>
      </template>

      <template #footer>
        <q-btn
          color="primary"
          icon="palette"
          label="GUARDAR"
          class="q-mr-sm"
          @click="onSubmit"
          :disable="loading"
        />
        <q-btn
          color="red"
          icon="close"
          label="CANCELAR"
          @click="onReset"
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
