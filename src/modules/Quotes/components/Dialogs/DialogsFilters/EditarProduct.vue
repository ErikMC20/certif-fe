<script lang="ts">
export default {
  name: 'EditarProduct',
};
</script>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuotesStore } from 'src/modules/Quotes/store/QuotesStore';
import { useDialogTabs as useDialogTabsT } from 'src/composables/Dialog/useDialog';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import CardAddProduct from '../../Cards/SubComponents.vue/CardAddProduct.vue';
const props = defineProps<{
  id: string;
}>();

const showFilter = ref(false);
const loading = ref(false);
const quotesStore = useQuotesStore();
const listProduct = ref();
const cargar = ref(false);
const dataEditarSend = ref();

const cardAddProductRef = ref<InstanceType<typeof CardAddProduct> | null>(null);

const lista = ref();

// onMounted(async () => {});

const openDialogEditar = (item: any) => {
  cargar.value = true;
  dataEditarSend.value = item;
  showFilter.value = true;
  cargar.value = false;
};
const saveEditar = (item: any) => {
  cargar.value = true;
  dataEditarSend.value = item;
  showFilter.value = true;
  cargar.value = false;
};

const closeDialog = () => {
  showFilter.value = false;
};

const emit = defineEmits<{
  (event: 'seleccionandoChasis', item: any): void;
}>();

defineExpose({
  openDialogEditar,
  closeDialog,
});
</script>
<template>
  <div>
    <q-dialog
      v-model="showFilter"
      full-width
      :headerDisabled="false"
      :footerDisabled="false"
      :loading="loading"
      :persistent="true"
    >
      <q-card class="my-card">
        <!-- ======================================================================= FIN DE LA CARD =====================================-->
        <q-card-section>
          <CardAddProduct
            ref="cardAddProductRef"
            :id="dataEditarSend.idproducto"
            :dataeditar="dataEditarSend"
          />
        </q-card-section>
        <q-card-actions class="flex flex-center">
          <q-btn
            color="primary"
            icon="playlist_add_check"
            label="EDITAR"
            class="q-mr-sm"
            @click="saveEditar"
            :disable="loading"
          />
          <q-btn
            v-close-popup
            color="red"
            icon="close"
            label="CANCELAR"
            :disable="loading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
  <!-- <q-inner-loading
    :showing="cargar"
    label="Cargando productos con colores..."
    label-class="text-teal"
    label-style="font-size: 1.1em"
  /> -->
</template>
<style lang="scss" scoped>
.under {
  text-decoration: underline;
}
</style>
