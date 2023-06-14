<script lang="ts">
export default {
  name: 'VerProduct',
};
</script>
<script setup lang="ts">
import { ref } from 'vue';
import { useQuotesStore } from 'src/modules/Quotes/store/QuotesStore';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import VerProduct from './VerProduct.vue';

const props = defineProps<{
  id: string;
}>();

const showFilter = ref(false);
const loading = ref(false);
const quotesStore = useQuotesStore();
const listSelect = ref([] as any);
const cargar = ref(false);

const data = ref({
  entrada: '',
});
const verProductRef = ref<InstanceType<typeof VerProduct> | null>(null);

const openDialog = async () => {
  showFilter.value = true;
};

const agregarProducto = async (val: any) => {
  cargar.value = true;
  listSelect.value = await quotesStore.getFilterProductosVer2Store(
    data.value.entrada
  );
  cargar.value = false;
};

const verPorColoresDos = (idprod: string, idmod: string, info: any) => {
  cargar.value = true;
  verProductRef.value?.openDialog(idprod, idmod, info);
  cargar.value = false;
  showFilter.value = false;
};

const cotizacionRap = (info: any) => {
  emit('cotizacionRapidaDos', info);
  showFilter.value = false;
  data.value.entrada = '';
};

const chasisIngresoSelec = (val: any) => {
  emit('seleccionandoChasisDos', val);
  data.value.entrada = '';
};

const closeDialog = () => {
  showFilter.value = false;
};

const emit = defineEmits<{
  (event: 'seleccionandoChasisDos', item: any): void;
  (event: 'cotizacionRapidaDos', item: any): void;
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
      @keyup.enter="agregarProducto"
    >
      <q-card class="my-card" style="width: 800px; max-width: 80vw">
        <q-card-section class="row q-gutter-md flex flex-center">
          <div class="col-md-6 col-xs-12">
            <q-input
              outlined
              v-model="data.entrada"
              label="Nombre del Producto"
              type="text"
              dense
              label-slot
              autofocus
              clearable
            >
              <template v-slot:after>
                <q-btn
                  color="primary"
                  icon="drive_eta"
                  label="BUSCAR"
                  class="q-mr-sm"
                  dense
                  @click="agregarProducto"
                  :disable="cargar"
                />
              </template>
            </q-input>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 q-mb-sm flex flex-center text-teal">
            Lista de productos
          </div>
          <template v-if="listSelect.length > 0">
            <q-list bordered>
              <q-virtual-scroll
                style="max-height: 90vh"
                :items="listSelect"
                separator
                v-slot="{ item, index }"
              >
                <q-item :key="index">
                  <q-item-section
                    avatar
                    class="col-md-2 flex flex-center cursor-pointer"
                    @click="
                      verPorColoresDos(item.idproducto, item.idmodelo, item)
                    "
                  >
                    <q-avatar
                      square
                      size="70px"
                      font-size="102px"
                      v-if="item.url_modelo_image1_c != ''"
                    >
                      <img :src="HANSACRM3_URL + item.url_modelo_image1_c" />
                    </q-avatar>
                    <q-avatar
                      rounded
                      color="teal"
                      text-color="white"
                      icon="airport_shuttle"
                      size="xl"
                      v-else
                    />
                    <q-tooltip
                      class="bg-red"
                      :offset="[10, 10]"
                      transition-show="scale"
                      transition-hide="scale"
                      >Eligir Color y/o Chasis</q-tooltip
                    >
                  </q-item-section>

                  <q-item-section
                    class="col-md-4 cursor-pointer"
                    @click="cotizacionRap(item)"
                  >
                    <q-item-label lines="1">
                      <span class="text-teal under">{{
                        item.nameproduct
                      }}</span>
                    </q-item-label>
                    <q-item-label lines="1">
                      <span class="text-weight-medium">{{
                        item.valuecentro
                      }}</span>
                    </q-item-label>
                    <q-tooltip
                      class="bg-indigo"
                      :offset="[10, 10]"
                      transition-show="scale"
                      transition-hide="scale"
                      >Eligir producto</q-tooltip
                    >
                  </q-item-section>

                  <q-item-section class="col-md-3">
                    <q-item-label lines="1">
                      <span class="text-weight-medium">Precio :</span>
                      <span class="text-grey-8">{{ item.price }}</span>
                      <q-tooltip
                        anchor="center right"
                        self="center left"
                        :offset="[10, 10]"
                        class="bg-amber text-black"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <strong class="text-subtitle2">{{
                          item.precio_min_c
                        }}</strong>
                        <q-icon name="loyalty" />
                      </q-tooltip>
                    </q-item-label>
                    <q-item-label lines="1">
                      <span class="text-weight-medium">Confirmados :</span>
                      <span class="text-primary text-weight-bolder">{{
                        item.confirmados
                      }}</span>
                    </q-item-label>
                    <q-item-label lines="1">
                      <span class="text-weight-medium">Disponible :</span>
                      <span class="text-primary text-weight-bolder">{{
                        item.disponibles
                      }}</span>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section class="col-md-3">
                    <q-item-label lines="1">
                      <span class="text-weight-medium">Gestión :</span>
                      <span class="text-grey-8"> {{ item.anio_c }}</span>
                    </q-item-label>
                    <q-item-label lines="1">
                      <span class="text-weight-medium">Procedencia :</span>
                      <span class="text-grey-8">
                        {{ item.valueprocedencia }}</span
                      >
                    </q-item-label>
                    <q-item-label lines="1">
                      <span class="text-weight-medium">Reservados :</span>
                      <span class="text-primary text-weight-bolder">{{
                        item.reservados
                      }}</span>
                    </q-item-label>
                  </q-item-section>
                  <!-- <q-item-section class="col-md-2 flex">
                    <q-btn
                      dense
                      outline
                      icon="palette"
                      color="cyan"
                      label="Ver Colores"
                    >
                    </q-btn>
                  </q-item-section> -->
                </q-item>
              </q-virtual-scroll>
            </q-list>
          </template>
          <template v-else>
            <div class="text-h7 text-grey-6 q-py-md text-center">
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </div>
          </template>
          <q-inner-loading
            :showing="cargar"
            label="Cargando productos..."
            label-class="text-teal"
            label-style="font-size: 1.1em"
          />
        </q-card-section>

        <!-- <q-card-actions align="right">
          <q-btn
            v-close-popup
            flat
            color="primary"
            label="Salir"
            icon="palette"
          />
        </q-card-actions> -->
      </q-card>
    </q-dialog>
  </div>
  <VerProduct
    ref="verProductRef"
    id=""
    @seleccionandoChasis="chasisIngresoSelec"
  />
</template>
<style lang="scss" scoped>
.under {
  text-decoration: underline;
}
</style>
