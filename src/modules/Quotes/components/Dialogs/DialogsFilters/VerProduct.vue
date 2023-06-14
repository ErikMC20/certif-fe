<script lang="ts">
export default {
  name: 'VerProduct',
};
</script>
<script setup lang="ts">
import { ref } from 'vue';
import { useQuotesStore } from 'src/modules/Quotes/store/QuotesStore';
import { useDialogTabs as useDialogTabsT } from 'src/composables/Dialog/useDialog';
import { HANSACRM3_URL } from 'src/conections/api_conectors';

const props = defineProps<{
  id: string;
}>();

const showFilter = ref(false);
const loading = ref(false);
const quotesStore = useQuotesStore();
const listProduct = ref();
const idmodeloEntra = ref();
const idproductoEntra = ref();
const informacionIntro = ref();
const imagenesCarru = ref();
const imagenesAUX = ref();
const cargar = ref(false);
const fullscreen = ref(false);

const data = ref({
  imagen: '',
});
const lista = ref();
// onMounted(async () => {

// });
const selecionarAuto = (item: any) => {
  closeDialog();
  emit('seleccionandoChasis', item);
};
const openDialog = async (idprodu: string, idmode: string, info: any) => {
  cargar.value = true;
  idmodeloEntra.value = idmode;
  idproductoEntra.value = idprodu;
  informacionIntro.value = info;
  lista.value = await quotesStore.getListProductVerStore(
    idmodeloEntra.value,
    idproductoEntra.value
  );
  imagenesAUX.value = await quotesStore.getImagesVerProductStore(
    idmodeloEntra.value
  );
  imagenesCarru.value = imagenesAUX.value.iamge_caracteristicas;

  console.log('lista Imagenes', imagenesCarru.value);
  listProduct.value = lista.value.stock_list_colors;
  showFilter.value = true;
  cargar.value = false;
};

const selectMasAntiguo = (val: any) => {
  const aux = val;
  const maxValue = Math.max(...aux.map((x) => parseInt(x.estadia_c)));
  const mayoresResultado = aux.filter((x) => x.estadia_c == maxValue);
  const iteman = mayoresResultado[0];
  emit('seleccionandoChasis', iteman);
  closeDialog();
};

const seleccionarColor = (val: string) => {
  data.value.imagen = val;
};

const cotizacionrapida = () => {
  const idrandom = listProduct.value;
  const itemra = idrandom[0].values[0];
  emit('seleccionandoChasis', itemra);
  closeDialog();
};

const closeDialog = () => {
  showFilter.value = false;
};

const emit = defineEmits<{
  (event: 'seleccionandoChasis', item: any): void;
}>();

defineExpose({
  openDialog,
  closeDialog,
});
const slide = ref(1);
</script>
<template>
  <div>
    <q-dialog
      v-model="showFilter"
      full-width
      :headerDisabled="false"
      :footerDisabled="false"
      :loading="loading"
      :persistent="false"
    >
      <q-card class="my-card">
        <!-- <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg" /> -->

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            flat
            color="primary"
            label="Salir"
            icon="palette"
          />
        </q-card-actions>
        <q-separator />
        <q-card-section>
          <q-card class="my-card bg-blue-grey-1" flat bordered>
            <q-card-section horizontal>
              <q-card-section class="flex flex-center col-md-2">
                <q-img
                  :src="HANSACRM3_URL + informacionIntro.name_hanq_modelo"
                  style="height: 100px; max-width: 220px"
                  v-if="informacionIntro.url_modelo_image1_c != ''"
                >
                  <div class="absolute-bottom text-subtitle1 text-center">
                    {{ informacionIntro.modelo_c }}
                  </div>
                </q-img>
                <q-avatar
                  rounded
                  color="indigo"
                  text-color="white"
                  icon="drive_eta"
                  size="xl"
                  v-else
                />
              </q-card-section>

              <q-card-section class="q-pt-xs col-md-4">
                <div class="text-h5 q-mt-sm q-mb-xs">
                  <span class="text-weight-medium text-primary under">{{
                    informacionIntro.nameproduct
                  }}</span>
                </div>
                <div class="text-overline">
                  <span class="text-weight-medium">Almacen :</span>
                  <span class="text-grey-8">{{
                    informacionIntro.valuecentro
                  }}</span>
                </div>
                <div class="q-gutter-md">
                  <q-btn class="glossy" rounded color="orange">
                    <template v-slot:default>
                      <span class="text-white text-h6"> Disponible = </span>
                      <span class="text-black text-h5 text-weight-bolder">
                        {{ informacionIntro.disponibles }}
                      </span>
                    </template>
                  </q-btn>
                  <q-btn class="glossy" rounded color="teal">
                    <template v-slot:default>
                      <span class="text-white text-h6"> Reservados = </span>
                      <span class="text-black text-h5 text-weight-bolder">
                        {{ informacionIntro.reservados }}
                      </span>
                    </template>
                  </q-btn>
                </div>
              </q-card-section>
              <q-card-section class="q-pt-xs col-md-2">
                <div class="text-h5 q-mt-sm q-mb-xs">
                  <span class="text-weight-medium">Precio :</span>
                  <span class="text-grey-8">{{ informacionIntro.price }}</span>
                </div>
                <div class="text-h5 q-mt-sm q-mb-xs">
                  <span class="text-weight-medium">Precio Minimo </span>
                  <!-- <span class="text-grey-8">{{
                    informacionIntro.precio_min_c
                  }}</span> -->
                  <q-tooltip
                    anchor="bottom middle"
                    self="top middle"
                    :offset="[10, 10]"
                    class="bg-amber text-body2 text-h3"
                  >
                    <strong class="text-h6 text-black">{{
                      informacionIntro.precio_min_c
                    }}</strong>
                    <q-icon name="loyalty" />
                  </q-tooltip>
                </div>
              </q-card-section>

              <q-card-section class="q-pt-xs col-md-4">
                <div class="text-h5 q-mt-sm q-mb-xs">
                  <span class="text-weight-medium">Procedencia :</span>
                  <span class="text-grey-8">{{
                    informacionIntro.valueprocedencia
                  }}</span>
                </div>
                <div class="text-h5 q-mt-sm q-mb-xs">
                  <span class="text-weight-medium">Codigo de Fabrica :</span>
                  <span class="text-grey-8">{{
                    informacionIntro.idfabrica_c
                  }}</span>
                </div>
              </q-card-section>
              <!-- <q-card-section class="q-pt-md col-md-1 flex flex-center">
                <q-btn
                  class="glossy"
                  outline
                  color="amber"
                  glossy
                  @click="cotizacionrapida()"
                >
                  <template v-slot:default>
                    <span class="text-black text-subtitle2"
                      >Cotización Rapida</span
                    >
                  </template>
                </q-btn>
              </q-card-section> -->
            </q-card-section>
          </q-card>
        </q-card-section>
        <!-- ======================================================================= FIN DE LA CARD =====================================-->
        <q-card-section class="" align="center">
          <q-carousel
            swipeable
            animated
            arrows
            v-model="data.imagen"
            v-model:fullscreen="fullscreen"
            thumbnails
            infinite
            transition-prev="slide-right"
            transition-next="slide-left"
            @mouseenter="false"
            @mouseleave="true"
          >
            <template
              v-for="item in imagenesCarru"
              :key="item.namecaracteristica"
            >
              <q-carousel-slide
                :name="item.namecaracteristica"
                :img-src="HANSACRM3_URL + item.url_carac_imagen1_c"
                style="max-width: 900px; height: 150px"
              >
              </q-carousel-slide>
            </template>
            <template v-slot:control>
              <q-carousel-control position="bottom-right" :offset="[18, 18]">
                <q-btn
                  push
                  round
                  dense
                  color="white"
                  text-color="primary"
                  :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
                  @click="fullscreen = !fullscreen"
                ></q-btn>
              </q-carousel-control>
            </template>
          </q-carousel>
          <!-- <q-carousel animated v-model="slide" arrows navigation infinite>
            <q-carousel-slide
              :name="1"
              img-src="https://cdn.quasar.dev/img/mountains.jpg"
              style="max-width: 900px; height: 150px"
            /> </q-carousel
        > -->
        </q-card-section>
        <q-card-section class="q-pt-none">
          <template v-if="idmodeloEntra == ''">
            <div>Cargando...</div>
          </template>
          <!-- <template v-else>
            <div>hola</div>
          </template> -->
          <template v-else>
            <q-list
              separator
              bordered
              style="max-height: 300px; overflow-y: auto"
            >
              <template v-for="(row, index) in listProduct" :key="index">
                <q-expansion-item
                  icon="airport_shuttl"
                  header-class=" bg-grey-2"
                >
                  <template v-slot:header>
                    <!-- https://crm-qas.hansa.com.bo/upload/products/4A0A02E2-0FEE-47E1-AFBC-4E7C9889ABA5/7d451ecc-b57c-b3da-d24e-59a97729e4c4_color_c -->
                    <q-item-section avatar>
                      <q-avatar
                        icon="airport_shuttle"
                        color="indigo"
                        text-color="white"
                        size="xl"
                      />
                    </q-item-section>

                    <q-item-section @click="seleccionarColor(row.name)">
                      <q-item-label lines="1">
                        <span class="text-weight-medium"> {{ row.name }}</span>
                      </q-item-label>
                      <q-item-label lines="1">
                        <!-- <span class="text-weight-medium"></span> -->
                        <span class="text-grey-8">Color</span>
                      </q-item-label>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label lines="1">
                        <span class="text-weight-medium">Cantidad :</span>
                        <span class="text-grey-8">{{ row.cantidad }}</span>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-item-btn>
                        <q-btn
                          class="glossy"
                          outline
                          color="orange"
                          @click="selectMasAntiguo(row.values)"
                        >
                          <template v-slot:default>
                            <span class="text-black text-h6"> Seleccionar</span>
                          </template>
                        </q-btn>
                        <q-tooltip
                          class="bg-red"
                          :offset="[10, 10]"
                          transition-show="scale"
                          transition-hide="scale"
                          >Selecciona con mayor estadia</q-tooltip
                        >
                      </q-item-btn>
                    </q-item-section>
                  </template>

                  <q-separator />
                  <!-- ======================================= PARA EL LOS STOCKS===================== -->
                  <template v-for="(item, index) in row.values" :key="index">
                    <q-item>
                      <q-item-section
                        avatar
                        @click="selecionarAuto(item)"
                        class="cursor-pointer"
                      >
                        <q-avatar
                          icon="directions_car"
                          color="cyan"
                          text-color="white"
                          size="xl"
                        />
                        <q-tooltip
                          class="bg-indigo"
                          :offset="[10, 10]"
                          transition-show="scale"
                          transition-hide="scale"
                          >Seleccionar chasis!</q-tooltip
                        >
                      </q-item-section>

                      <!-- <q-item-section>
                        <q-item-label lines="1">
                          <span class="text-weight-medium"> {{ item }}</span>
                        </q-item-label>
                      </q-item-section> -->
                      <q-item-section
                        class="col-md-2 cursor-pointer"
                        @click="selecionarAuto(item)"
                      >
                        <q-item-label lines="1">
                          <span class="text-weight-medium">{{
                            item.chasis_c_hanq_stock
                          }}</span>
                        </q-item-label>
                        <q-item-label lines="1">
                          <span class="text-grey-8"> Chasis</span>
                        </q-item-label>
                        <q-tooltip class="bg-indigo" :offset="[10, 10]"
                          >Seleccionar chasis!</q-tooltip
                        >
                      </q-item-section>
                      <q-item-section class="col-md-2">
                        <q-item-label lines="1">
                          <span class="text-weight-medium">{{
                            item.motor_c_hanq_stock
                          }}</span>
                        </q-item-label>
                        <q-item-label lines="1">
                          <span class="text-grey-8"> Motor</span>
                        </q-item-label>
                      </q-item-section>
                      <q-item-section class="col-md-2">
                        <q-item-label lines="1">
                          <span class="text-weight-medium">{{
                            item.gestion_hanq_stock
                          }}</span>
                        </q-item-label>
                        <q-item-label lines="1">
                          <span class="text-grey-8"> Gestión</span>
                        </q-item-label>
                      </q-item-section>
                      <q-item-section class="col-md-2">
                        <q-item-label lines="1">
                          <span class="text-weight-medium">{{
                            item.almacen_c_hanq_stock_value
                          }}</span>
                        </q-item-label>
                        <q-item-label lines="1">
                          <span class="text-grey-8"> Almacen</span>
                        </q-item-label>
                      </q-item-section>
                      <q-item-section class="col-md-2">
                        <q-item-label lines="1">
                          <span class="text-weight-medium"
                            >Días:{{ item.estadia_c }}</span
                          >
                        </q-item-label>
                        <q-item-label lines="1">
                          <span class="text-grey-8"> Estadia</span>
                        </q-item-label>
                      </q-item-section>
                      <q-item-section class="col-md-2">
                        <q-item-label lines="1">
                          <span class="text-weight-medium">{{
                            item.estado_cotizacion_c_hanq_stock
                          }}</span>
                        </q-item-label>
                        <q-item-label lines="1">
                          <span class="text-grey-8"> Estado</span>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-expansion-item>
              </template>
            </q-list>
          </template>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
  <q-inner-loading
    :showing="cargar"
    label="Cargando productos con colores..."
    label-class="text-teal"
    label-style="font-size: 1.1em"
  />
</template>
<style lang="scss" scoped>
.under {
  text-decoration: underline;
}
</style>
