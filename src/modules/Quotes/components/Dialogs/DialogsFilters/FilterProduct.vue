<script lang="ts">
export default {
  name: 'FilterProduct',
};
</script>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuotesStore } from 'src/modules/Quotes/store/QuotesStore';
import VerProduct from './VerProduct.vue';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { userStore } from 'src/modules/Users/store/UserStore';

const props = defineProps<{
  id: string;
}>();

const editar = ref(false);
const showFilter = ref(false);
const persistent = ref(false);
const title = ref('Búsqueda de Producto');
const isFiltering = ref(false);
const loading = ref(false);
const quotesStore = useQuotesStore();
const { userCRM } = userStore();
const listAuxi = ref();
const cargar = ref(false);
const verProductRef = ref<InstanceType<typeof VerProduct> | null>(null);

const data = ref({
  pagina: 1,
  numregistros: 20,
  iddivision: userCRM.iddivision,
  idamercado: userCRM.idamercado,
  filter: '',
  name: '',
  anio: '',
  codaio: '',
  available: '',
  praice: '',
  almacen: '',
  chasis: '',
});

const dataread = ref({
  nombre: '',
});

onMounted(async () => {
  listAuxi.value = await quotesStore.getFilterProductosVer2LupaStore(
    data.value
  );
});

const verPorColores = (idprod: string, idmod: string, info: any) => {
  verProductRef.value?.openDialog(idprod, idmod, info);
};

const chasisIngresoParte2 = (item: any) => {
  emit('seleccionandoChasisParte2', item);
  closeDialog();
};

const seleccionProdu = (item: any) => {
  let elementoModi = {
    id_hanq_modelo: item.idmodelo,
    name_hanq_modelo: item.namemodelo,
    codigoaio_c_hanq_modelo: item.aiomodelo,
    iddivision_c_hanq_modelo: item.modelodivicion,
    idamercado_c_hanq_modelo: item.modeloamercado,
    // marca_c_hanq_modelo: null,
    id_aos_products: item.idproducto,
    name_aos_products: item.nameproduct,
    // currency_id_aos_products: '-99',
    price_aos_products: item.price,
    // price_usdollar_aos_products: 18750,
    // anio_c_aos_products_cstm: 2017,
    // almacen_c_aos_products_cstm: '02_SC00_S300',
    procedencia_c_aos_products_cstm: item.procedencia_c,
    procedencia_c_value: item.valueprocedencia,
    // centro_c_aos_products_cstm: '02_SC00',
    centro_c_value: item.valuecentro,
    // id_hanq_stock: '2CA8B014-BEB4-41D1-8B0A-8AFFC2DB3769',
    chasis_c_hanq_stock: item.chasis_c,
    // motor_c_hanq_stock: 'CFZ R12801',
    nombre_color_c_hanq_stock: item.nombre_color_c,
    gestion_hanq_stock: item.anio_c,
    // lote_c_hanq_stock: '39264',
    // stock_c_hanq_stock: 1,
    // almacen_c_hanq_stock: '02_SC00_S300',
    // almacen_c_hanq_stock_value: 'S300',
    // ubicacion_c_hanq_stock: '',
    // estado_cotizacion_c_hanq_stock: 'Draft',
    // estadia_c: 0,
    // total_estadia: 250,
  };
  emit('seleccionandoChasisUnico', elementoModi);
  closeDialog();
};

const buscarProd = async () => {
  cargar.value = true;
  listAuxi.value = await quotesStore.getFilterProductosVer2LupaStore(
    data.value
  );
  cargar.value = false;
  isFiltering.value = true;
};

const openDialog = () => {
  showFilter.value = true;
};

const limpiarfiltro = () => {
  data.value = {
    pagina: 1,
    numregistros: 20,
    iddivision: userCRM.iddivision,
    idamercado: userCRM.idamercado,
    filter: '',
    name: '',
    anio: '',
    codaio: '',
    available: '',
    praice: '',
    almacen: '',
    chasis: '',
  };
  isFiltering.value = false;
};
const closeDialog = () => {
  showFilter.value = false;
  isFiltering.value = false;
};
const emit = defineEmits<{
  (event: 'seleccionandoChasisParte2', item: any): void;
  (event: 'seleccionandoChasisUnico', item: any): void;
}>();
defineExpose({
  openDialog,
  closeDialog,
});
</script>
<template>
  <div>
    <dialog-component
      v-model="showFilter"
      :sizeDialog="isFiltering ? 'dialog-lg' : 'dialog-sm'"
      :headerDisabled="false"
      :footerDisabled="false"
      :loading="loading"
      :persistent="persistent"
      @keyup.enter="buscarProd"
    >
      <template #header>
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
                @click="closeDialog"
              />
            </div>
          </q-card-section>
        </q-card>
      </template>

      <template #body>
        <div class="row bg-white">
          <Transition enter-active-class="animated lightSpeedInRight">
            <div class="col-md-8 col-sm-12" v-if="isFiltering">
              <q-card class="no-border-radius bg-none" flat>
                <q-card-section>
                  <div class="text-h6 q-mb-sm flex flex-center text-teal">
                    Lista de productos
                  </div>
                  <template v-if="listAuxi.length > 0">
                    <q-list bordered>
                      <q-virtual-scroll
                        style="max-height: 90vh"
                        :items="listAuxi"
                        separator
                        v-slot="{ item, index }"
                      >
                        <!--=============================== PRODUCTO SSS= =======================-->
                        <q-item :key="index" v-if="!item.chasis_c">
                          <q-item-section
                            avatar
                            class="col-md-2 flex flex-center"
                          >
                            <q-avatar
                              square
                              size="70px"
                              font-size="102px"
                              v-if="item.url_modelo_image1_c != ''"
                            >
                              <img
                                :src="HANSACRM3_URL + item.url_modelo_image1_c"
                              />
                            </q-avatar>
                            <q-avatar
                              rounded
                              color="teal"
                              text-color="white"
                              icon="airport_shuttle"
                              size="xl"
                              v-else
                            />
                          </q-item-section>

                          <q-item-section
                            class="col-md-3"
                            @click="seleccionProdu(item)"
                          >
                            <q-item-label lines="1">
                              <!-- <span class="text-weight-medium">Precio :</span> -->
                              <span class="text-teal under">{{
                                item.nameproduct
                              }}</span>
                            </q-item-label>
                            <q-item-label lines="1">
                              <span class="text-weight-medium">{{
                                item.valuecentro
                              }}</span>
                              <!-- <span class="text-grey-8"> </span> -->
                            </q-item-label>
                          </q-item-section>

                          <q-item-section class="col-md-2">
                            <q-item-label lines="1">
                              <span class="text-weight-medium">Precio :</span>
                              <span class="text-grey-8">{{ item.price }}</span>
                              <q-tooltip
                                anchor="center right"
                                self="center left"
                                :offset="[10, 10]"
                                class="bg-amber text-black"
                              >
                                <strong class="text-subtitle2">{{
                                  item.precio_min_c
                                }}</strong>
                                <q-icon name="loyalty" />
                              </q-tooltip>
                            </q-item-label>
                            <q-item-label lines="1">
                              <span class="text-weight-medium"
                                >Confirmados :</span
                              >
                              <span class="text-primary text-weight-bolder">{{
                                item.confirmados
                              }}</span>
                            </q-item-label>
                            <q-item-label lines="1">
                              <span class="text-weight-medium"
                                >Disponible :</span
                              >
                              <span class="text-primary text-weight-bolder">{{
                                item.disponibles
                              }}</span>
                            </q-item-label>
                          </q-item-section>

                          <q-item-section class="col-md-2">
                            <q-item-label lines="1">
                              <span class="text-weight-medium">Gestión :</span>
                              <span class="text-grey-8">
                                {{ item.anio_c }}</span
                              >
                            </q-item-label>
                            <q-item-label lines="1">
                              <span class="text-weight-medium"
                                >Procedencia :</span
                              >
                              <span class="text-grey-8">
                                {{ item.valueprocedencia }}</span
                              >
                            </q-item-label>
                            <q-item-label lines="1">
                              <span class="text-weight-medium"
                                >Reservados :</span
                              >
                              <span class="text-primary text-weight-bolder">{{
                                item.reservados
                              }}</span>
                            </q-item-label>
                          </q-item-section>
                          <q-item-section class="col-md-2 flex flex-center">
                            <q-btn
                              dense
                              outline
                              icon="palette"
                              color="teal"
                              label="Ver Colores"
                              @click="
                                verPorColores(
                                  item.idproducto,
                                  item.idmodelo,
                                  item
                                )
                              "
                            >
                            </q-btn>
                          </q-item-section>
                        </q-item>
                        <!-- ==================PRODUCTO CON CHASIS UNICO!!1====================================== -->
                        <q-item :key="index" v-if="item.chasis_c">
                          <q-item-section
                            avatar
                            class="col-md-2 flex flex-center"
                          >
                            <q-avatar
                              square
                              size="70px"
                              font-size="102px"
                              v-if="item.url_modelo_image1_c != ''"
                            >
                              <img
                                :src="HANSACRM3_URL + item.url_modelo_image1_c"
                              />
                            </q-avatar>
                            <q-avatar
                              rounded
                              color="teal"
                              text-color="white"
                              icon="airport_shuttle"
                              size="xl"
                              v-else
                            />
                          </q-item-section>

                          <q-item-section
                            class="col-md-3"
                            @click="seleccionProdu(item)"
                          >
                            <q-item-label lines="1">
                              <!-- <span class="text-weight-medium">Precio :</span> -->
                              <span class="text-teal under">{{
                                item.nameproduct
                              }}</span>
                            </q-item-label>
                            <q-item-label lines="1">
                              <span class="text-weight-medium">{{
                                item.valuecentro
                              }}</span>
                              <!-- <span class="text-grey-8"> </span> -->
                            </q-item-label>
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
                              >
                                <strong class="text-subtitle2">{{
                                  item.precio_min_c
                                }}</strong>
                                <q-icon name="loyalty" />
                              </q-tooltip>
                            </q-item-label>
                            <q-item-label lines="1">
                              <span class="text-weight-medium">Chasis</span>
                            </q-item-label>
                            <q-item-label lines="1">
                              <span class="text-primary text-weight-bolder">{{
                                item.chasis_c
                              }}</span>
                            </q-item-label>
                          </q-item-section>

                          <q-item-section class="col-md-3">
                            <q-item-label lines="1">
                              <span class="text-weight-medium">Gestión :</span>
                              <span class="text-grey-8">
                                {{ item.anio_c }}</span
                              >
                            </q-item-label>
                            <q-item-label lines="1">
                              <span class="text-weight-medium"
                                >Procedencia :</span
                              >
                              <span class="text-grey-8">
                                {{ item.valueprocedencia }}</span
                              >
                            </q-item-label>
                            <q-item-label lines="1">
                              <span class="text-weight-medium">Color :</span>
                              <span class="text-primary text-weight-bolder">{{
                                item.nombre_color_c
                              }}</span>
                            </q-item-label>
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
                      <span class="block"
                        >No se encontraron coincidencias.</span
                      >
                      <slot name="no-data"></slot>
                    </div>
                  </template>
                </q-card-section>
              </q-card>
            </div>
          </Transition>
          <div :class="isFiltering ? 'col-md-4' : 'col-md-12'">
            <q-card class="no-border-radius" flat bordered>
              <q-card-section class="row q-col-gutter-sm">
                <div class="col-md-12 col-xs-12">
                  <q-input
                    v-model="data.name"
                    type="text"
                    label="Nombre"
                    outlined
                    dense
                    color="primary"
                  >
                  </q-input>
                </div>
                <div class="col-md-12 col-xs-12">
                  <q-input
                    v-model="data.anio"
                    type="text"
                    label="Año"
                    outlined
                    dense
                    color="primary"
                  >
                  </q-input>
                </div>
                <div class="col-md-12 col-xs-12">
                  <q-input
                    v-model="data.codaio"
                    type="text"
                    label="Codigo AIO"
                    outlined
                    dense
                    color="primary"
                  >
                  </q-input>
                </div>

                <div class="col-md-12 col-xs-12">
                  <q-input
                    v-model="data.praice"
                    type="text"
                    label="Precio"
                    outlined
                    dense
                    color="primary"
                  >
                  </q-input>
                </div>

                <div class="col-md-12 col-xs-12">
                  <q-input
                    v-model="data.almacen"
                    type="text"
                    label="Almacen"
                    outlined
                    dense
                    color="primary"
                  >
                  </q-input>
                </div>

                <div class="col-md-12 col-xs-12">
                  <q-input
                    v-model="data.chasis"
                    type="text"
                    label="Chasis"
                    outlined
                    dense
                    color="primary"
                  >
                  </q-input>
                </div>
                <q-checkbox
                  v-model="data.available"
                  size="xs"
                  label="Solo Disponibles"
                  color="primary"
                  true-value="yes"
                  false-value=""
                />
                <!-- </div> -->
              </q-card-section>
              <!-- <pre>{{ data }}</pre> -->
            </q-card>
          </div>
        </div>
        <q-inner-loading
          :showing="cargar"
          label="Cargando productos..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </template>

      <template #footer>
        <q-btn
          color="primary"
          icon="drive_eta"
          label="BUSCAR"
          class="q-mr-sm"
          @click="buscarProd"
          :disable="cargar"
        />
        <q-btn
          color="red"
          icon="cleaning_services"
          label="LIMPIAR"
          @click="limpiarfiltro"
          :disable="cargar"
        />
      </template>
    </dialog-component>
  </div>
  <VerProduct
    ref="verProductRef"
    id=""
    @seleccionandoChasis="chasisIngresoParte2"
  />
</template>
<style lang="scss" scoped>
.under {
  text-decoration: underline;
}
</style>
