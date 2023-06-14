<script lang="ts">
export default {
  name: 'DialogFilterEas',
};
</script>
<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  id: string;
}>();

const showFilter = ref(false);
const loading = ref(false);
const Listabusqueda = ref();
const cargar = ref(false);
const fullscreen = ref(false);

const data = ref({
  nombre: '',
});
// onMounted(async () => {

// });
const seleccionarItem = (item: any) => {
  closeDialog();
  emit('seleccionando', item);
};
const openDialog = async (dataIntro: any) => {
  cargar.value = true;
  showFilter.value = true;
  Listabusqueda.value = dataIntro;
  cargar.value = false;
};

// const seleccionarColor = (val: string) => {
//   data.value.imagen = val;
// };

const closeDialog = () => {
  showFilter.value = false;
};

const emit = defineEmits<{
  (event: 'seleccionando', item: any): void;
}>();

defineExpose({
  openDialog,
  closeDialog,
});
</script>
<template>
  <div>
    <q-dialog
      v-model="showFilter"
      :headerDisabled="false"
      :footerDisabled="false"
      :loading="loading"
      :persistent="false"
    >
      <q-card class="my-card" style="width: 400px; max-width: 80vw">
        <!-- ======================================================================= FIN DE LA CARD =====================================-->
        <q-card-section>
          <div class="text-h6 q-mb-sm flex flex-center text-teal">
            Lista de búsqueda
          </div>
          <template v-if="Listabusqueda.length > 0">
            <q-list bordered>
              <q-virtual-scroll
                style="max-height: 90vh"
                :items="Listabusqueda"
                separator
                v-slot="{ item, index }"
              >
                <q-item :key="index" clickable @click="seleccionarItem(item)">
                  <q-item-section avatar>
                    <q-avatar
                      color="teal-3"
                      text-color="text-dark"
                      icon="person_search"
                      font-size="20px"
                      rounded
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ item.nombre }}</q-item-label>
                    <span class="text-teal">seleccionar</span>
                  </q-item-section>
                </q-item>
              </q-virtual-scroll>
            </q-list>
          </template>
          <template v-else>
            <div class="text-h7 text-grey-6 q-py-md text-center">
              <img
                src="empty_list.png"
                alt="lista vacia"
                style="width: 150px; height: 100px"
              />
              <span class="block">No se encontraron coincidencias.</span>
              <slot name="no-data"></slot>
            </div>
          </template>
        </q-card-section>

        <q-separator />

        <!-- <q-card-actions align="right">
          <q-btn
            v-close-popup
            flat
            color="primary"
            label="Salir"
            icon="close"
          />
        </q-card-actions> -->
      </q-card>
    </q-dialog>
  </div>
  <q-inner-loading
    :showing="cargar"
    label="Cargando lista de busqueda..."
    label-class="text-teal"
    label-style="font-size: 1.1em"
  />
</template>
<style lang="scss" scoped>
.under {
  text-decoration: underline;
}
</style>
