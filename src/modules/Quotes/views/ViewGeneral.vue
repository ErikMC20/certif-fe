<script lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import CardInfo from '../components/Cards/CardInfo.vue';
import CommercialOffer from '../components/Cards/CommercialOffer.vue';
import CustomersData from '../components/Cards/CustomersData.vue';
import ViewGeneralSkeleton from 'src/components/Skeletons/ViewGeneralSkeleton.vue';
import { useAsyncState } from '@vueuse/core';
import { useQuotesStore } from '../store/QuotesStore';
import AssignedSingleUser2 from 'src/components/AssignedUsers/AssignedSingleUser2.vue';
import { useQuotesService } from '../services/QuotesService';
import AddProducts from '../components/Dialogs/AddProducts.vue';
import CommentsList from 'src/components/Comments/CommentsList.vue';
import { QInput, useQuasar } from 'quasar';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import ListProductsQuotes from '../components/Cards/ListProductsQuotes.vue';
import { RowTableCINITContactModel } from '../../../components/types/index';
import { userStore } from 'src/modules/Users/store/UserStore';
import ViewChangecontrol from 'src/modules/Quotes/components/Cards/ViewChangecontrol.vue';
</script>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    id: string;
    nameModule?: string;
    dataIntro?: any;
    dataIntroModuleSubPanel?: any;
    dataDupli?: any;
    listaDupli?: any;
    cambioEdit?: boolean;
  }>(),
  {
    dataDupli: '',
    listaDupli: '',
    cambioEdit: false,
  }
);

const cardsInfos = ref();
const asigneduser = ref();
const parte1 = ref();
const parte2 = ref();
const parte3 = ref();
const parte4List = ref();
const parte5totales = ref();
const asigform = ref();
const listArticles = ref();
//para la lsita de proudctos=====================================
const listNewProducts = ref([]);
const listadatatotal = ref();
const edit = ref(false);
const activeEdit = ref(false);
const agrupandoGrupos = ref();
//para duplicar=====================================================
// const dataduplicar = ref(props.dataDupli);
const atributosdupli = ref(props.dataDupli.attributes);
const listadupli = ref(props.listaDupli);
//=================================================================
const editingFalse = ref(props.cambioEdit);
const accountContactOpportunitie = ref();
const totalesgrupos = ref({
  totalporgrupos: 0,
  descuentoporgrupos: 0,
  totalfinalporgrupos: 0,
});
const cargarnuevo = ref(false);
const quotesStore = useQuotesStore();
const { userCRM } = userStore();
// iduserasignertoID.value = cardsInfos.value.data.attributes.assigneduser;

// const dataInfoCardToSubPanels = ref(
//
// );

const infoCardRef = ref<InstanceType<typeof CardInfo> | null>(null);
const listProductsQuotesRef = ref<InstanceType<
  typeof ListProductsQuotes
> | null>(null);

const commercialOfferRef = ref<InstanceType<typeof CommercialOffer> | null>(
  null
);
const customersDataRef = ref<InstanceType<typeof CustomersData> | null>(null);
const assignedSingleUserRef = ref<InstanceType<
  typeof AssignedSingleUser2
> | null>(null);
const { setUserAssigned } = useQuotesService();
const localIdValue = ref(props.id || '');
const data = ref({
  moneda: 'Dolares',
});
const commentCreate = ref('');
const tab = ref(props.id ? 'productos' : 'productos');
const addProductsRef = ref<InstanceType<typeof AddProducts> | null>(null);

const openDialogPro = async (val: any) => {
  await addProductsRef.value?.openDialog(val.value);
};

const languageStore = useFormOptionsStore();
const isSomeCardEditing = computed(() => {
  return [
    infoCardRef.value?.isEditing,
    commercialOfferRef.value?.isEditing,
    customersDataRef.value?.isEditing,
    activeEdit.value,
  ].some((value) => !!value);
});

const { state, isLoading, execute } = useAsyncState(
  async () => {
    await languageStore.getAccountLanguage();
    await languageStore.getLeadsOptions();
    await languageStore.getReservasOptions();
    if (props.id != '') {
      await quotesStore.getModuleTypeIDPro('Quotes', props.id);
      cardsInfos.value = quotesStore.CardInfoQuotesgetter;
      asigneduser.value = quotesStore.GetIdAssignedUser;
    }
  },
  {} as any,
  {}
);
const datInfocarQuotesVG = ref(props.dataIntroModuleSubPanel);
const dataSendInfocarQuotesVG = ref();
onMounted(async () => {
  if (!!datInfocarQuotesVG.value) {
    dataSendInfocarQuotesVG.value = datInfocarQuotesVG.value.datInfocarQuotes;
  } else {
    dataSendInfocarQuotesVG.value = undefined;
  }
  if (!props.id) {
    activeEdit.value = true;
  }
  if (props.listaDupli != '') {
    listNewProducts.value = listadupli.value;
    console.log('vaio', listNewProducts.value);
  }
  calculandototalesGRUPOS();
});
// console.log(listArticles.value);
const validandoInput = async (): Promise<boolean | undefined> => {
  return (await Promise.all([infoCardRef.value?.rulesInput()])).every(
    (val) => !!val
  );
};

const saveQuotesNew = async () => {
  const validarData = await validandoInput();
  if (!validarData) {
    console.log('mal values');
    return;
  }
  cargarnuevo.value = true;
  parte1.value = infoCardRef.value?.exposeData();
  parte2.value = commercialOfferRef.value?.exposeData();
  parte3.value = customersDataRef.value?.exposeData();

  asigform.value = assignedSingleUserRef.value?.dataSend.id;

  await saveListOfProducts();
  parte4List.value = agrupandoGrupos.value;
  parte5totales.value = totalesgrupos.value;
  // console.log(
  //   'parte1',
  //   parte1.value,
  //   'parte2',
  //   parte2.value,
  //   'parte3',
  //   parte3.value,
  //   'parte4 list',
  //   parte4List.value,
  //   'parte5 totales',
  //   parte5totales.value
  // );
  const newQuotes = await quotesStore.postcrearQuotes(
    parte1.value,
    parte2.value,
    parte3.value,
    parte4List.value,
    parte5totales.value,
    props.id,
    asigform.value
  );

  console.log('guardando del View General', newQuotes);
  emit('submitReturnid', newQuotes);
  commentCreate.value = '';
  localIdValue.value = newQuotes as string;
  editingFalse.value = false;
  cargarnuevo.value = false;
  activeEdit.value = false;
  edit.value = false;
};

const listmoneda = [
  { label: 'US Dollars', value: 'Dolares' },
  { label: 'Bolivianos $b', value: 'Bolivianos' },
];

const onChangeUserAssigned = async (id: string) => {
  await setUserAssigned(localIdValue.value, id);
  emit('submitComplete', localIdValue.value);
};

// const recaltotal = () => {
//   console.log('calculos22', totalesgrupos.value);
//   console.log('calculos22 lista', listNewProducts.value);

//   calculandototalesGRUPOS();
// };

watch(
  () => listNewProducts.value,
  async () => {
    calculandototalesGRUPOS();
  },
  { deep: true }
);

watch(
  () => props.cambioEdit,
  async () => {
    editingFalse.value = props.cambioEdit;
  },
  { deep: true }
);
const ListaProds = async (val: any) => {
  // console.log('entrnado al view general', val);
  listNewProducts.value.push(val);
  // const at = listNewProducts.value;
  // listadatatotal.value = val2;
  // console.log('lista en el view general--------', listadatatotal.value);
  // emit('llevandoLista', val);
  calculandototalesGRUPOS();
};

const calculandototalesGRUPOS = () => {
  totalesgrupos.value.totalporgrupos = 0;
  totalesgrupos.value.descuentoporgrupos = 0;
  totalesgrupos.value.totalfinalporgrupos = 0;
  listNewProducts.value.map((item: any) => {
    totalesgrupos.value.totalporgrupos =
      totalesgrupos.value.totalporgrupos + item.attributesGroup.total_amt;
    totalesgrupos.value.descuentoporgrupos =
      totalesgrupos.value.descuentoporgrupos +
      item.attributesGroup.discount_amount;
    totalesgrupos.value.totalfinalporgrupos =
      totalesgrupos.value.totalfinalporgrupos +
      item.attributesGroup.total_amount;
  });
};

const saveListOfProducts = async () => {
  agrupandoGrupos.value = listNewProducts.value;
  // console.log('mostrando el json del producto', agrupandoGrupos.value);
  // emit('llevandoLista', val);
  // calculandototalesGRUPOS();
};
// editando producto====================================================================
const SendDataEdit = (val: any) => {
  listNewProducts.value = val;
  // console.log('dataenviadada de produ', listNewProducts.value);
};

const activarEditar = async () => {
  edit.value = true;
  activeEdit.value = true;
};
const cancelEdit = () => {
  edit.value = false;
  activeEdit.value = false;
};
// watch(datatotal, (value) => {
//   console.log('datatotal', props.datatotal);
//   totalesLLegada.value = value;
// });

// ========================================================================================
const cargarStage = ref(false);
const getCambio = (item: boolean) => {
  cargarStage.value = item;
};

const emit = defineEmits<{
  (event: 'submitComplete', localIdValue: any): void;
  (event: 'submitReturnid', item: any): void;
}>();

defineExpose({
  saveQuotesNew,
  isSomeCardEditing,
  listNewProducts,
});

const getOpportunity = async (val: any) => {
  customersDataRef.value?.getopportunity({
    idOpportunity: val.idopportuniti,
    isCardInfoEdited: infoCardRef.value?.isEditing,
  });
};
</script>
<template>
  <div v-if="isLoading"><ViewGeneralSkeleton /></div>
  <div v-else class="row q-col-gutter-lg">
    <div class="col-xs-12 col-sm-12 col-md-5">
      <div class="row q-gutter-y-xs">
        <!-- {{ editingFalse }} -->
        <CardInfo
          :id="localIdValue"
          ref="infoCardRef"
          :dataInfoCard="cardsInfos"
          @idAccount="getOpportunity"
          :datacarfinfoOpp="dataIntro"
          :dataInfocardforModule="dataSendInfocarQuotesVG"
          :dataDupli2="atributosdupli"
          :readMode="editingFalse"
          @cambioStage="getCambio"
        />
        <CommercialOffer
          :id="localIdValue"
          ref="commercialOfferRef"
          :dataDupli2="atributosdupli"
          :readMode="editingFalse"
          editFalseIn=""
          data=""
        />
        <CustomersData
          :id="localIdValue"
          ref="customersDataRef"
          :dataCustomDataOpp="props.dataIntro"
          :ModuleSubPanelInfo="props.dataIntroModuleSubPanel"
          :dataDupli2="atributosdupli"
          :readMode="editingFalse"
          data=""
          opportunity-change=""
          edit-false=""
        />
      </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-7">
      <AssignedSingleUser2
        ref="assignedSingleUserRef"
        :module="'AOS_Quotes'"
        :module-id="localIdValue"
        :withList="false"
        @changeUser="onChangeUserAssigned"
      />

      <q-separator inset></q-separator>

      <q-separator inset></q-separator>
      <div class="q-gutter-y-md sticky">
        <q-card>
          <q-card-section style="padding: 0px">
            <q-tabs
              class="q-ma-none"
              v-model="tab"
              indicator-color="primary"
              :inline-label="!$q.screen.xs"
              :active-color="$q.dark.isActive ? 'orange' : 'primary'"
              align="justify"
              :no-caps="$q.screen.xs ? true : false"
            >
              <q-tab name="productos" icon="person" label="Productos" />
              <q-tab name="comentarios" icon="comment" label="Comentarios" />

              <q-tab
                name="historychanges"
                icon="history"
                label="Historial"
                :disable="!localIdValue"
              />
            </q-tabs>
            <q-separator />
            <q-tab-panels
              v-model="tab"
              animated
              style="min-height: fit-content"
              class=""
            >
              <q-tab-panel
                name="comentarios"
                style="min-height: 500px"
                class="q-py-sm"
                v-if="!!localIdValue"
              >
                <CommentsList :id="props.id" descCRM3="" modulo="'Quotes'">
                </CommentsList>
              </q-tab-panel>
              <q-tab-panel
                name="comentarios"
                style="min-height: 500px"
                class="q-pd-sm"
                v-else
              >
                <q-input
                  autogrow
                  outlined
                  bottom-slots
                  v-model="commentCreate"
                  placeholder="Escriba su comentario"
                  dense
                  color="primary"
                  ref="commentRef"
                  :rules="[(val) => !!val || 'El campo es requerido']"
                >
                  <template v-slot:before> </template>
                </q-input>
              </q-tab-panel>
              <q-tab-panel name="productos">
                <div class="q-gutter-sm">
                  <div class="col-md-6 col-xs-12 items-center q-gutter-md">
                    <div class="flex flex-center" v-if="props.id">
                      <q-item v-ripple v-if="!edit">
                        <q-btn
                          outline
                          color="primary"
                          label="Editar"
                          icon="mode_edit"
                          @click="activarEditar"
                        />
                      </q-item>
                    </div>
                    <div class="row justify-between items-center" v-else>
                      <div class="col-4">
                        <q-select
                          v-model="data.moneda"
                          :options="listmoneda"
                          label="Moneda"
                          outlined
                          dense
                          options-dense
                          map-options
                          option-value="value"
                          option-label="label"
                          transition-show="flip-up"
                          transition-hide="flip-down"
                          color="primary"
                        />
                      </div>
                      <div class="col-4">
                        <q-btn
                          color="primary"
                          icon="add_shopping_cart"
                          label="Agregar grupo producto"
                          @click="() => openDialogPro(data.moneda)"
                          v-if="!$q.screen.xs"
                          :disable="!data.moneda ? true : false"
                        />
                      </div>
                    </div>
                    <div class="row justify-between items-center" v-if="edit">
                      <div class="col-4">
                        <q-select
                          v-model="data.moneda"
                          :options="listmoneda"
                          label="Moneda"
                          outlined
                          dense
                          options-dense
                          map-options
                          option-value="value"
                          option-label="label"
                          transition-show="flip-up"
                          transition-hide="flip-down"
                          color="primary"
                        />
                      </div>
                      <div v-if="edit">
                        <q-item v-ripple>
                          <q-btn
                            outline
                            dense
                            label="Cancelar"
                            icon="cancel"
                            class="float-right"
                            :color="!$q.dark.isActive ? 'grey-8' : 'white'"
                            @click="cancelEdit"
                          />
                        </q-item>
                      </div>

                      <div class="col-4">
                        <q-btn
                          color="primary"
                          icon="add_shopping_cart"
                          label="Agregar grupo producto"
                          @click="() => openDialogPro(data.moneda)"
                          v-if="!$q.screen.xs"
                          :disable="!data.moneda ? true : false"
                        />
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-12 col-xs-12">
                        <ListProductsQuotes
                          ref="listProductsQuotesRef"
                          :id="localIdValue"
                          :dataListProductQuotes="listArticles"
                          :dataListNewsProducts="listNewProducts"
                          :datatotal="totalesgrupos"
                          :editing="activeEdit"
                          @dataEditRead="SendDataEdit"
                        />
                      </div>
                    </div>
                    <!-- <pre>para el total VIewGen---{{ totalesgrupos }}</pre>
                    <pre>para listar en el View---{{ listNewProducts }}</pre>
                    <pre>{{ data }}</pre> -->
                  </div>
                </div>
              </q-tab-panel>
              <q-tab-panel name="historychanges" v-if="localIdValue !== null">
                <ViewChangecontrol :id="localIdValue"></ViewChangecontrol>
              </q-tab-panel>
              <q-tab-panel name="historychanges" v-else>
                <ViewChangecontrol :id="'0'"></ViewChangecontrol>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>

  <AddProducts
    ref="addProductsRef"
    :idQuotes="id"
    @enviandoproductos="ListaProds"
  />
  <q-inner-loading
    :showing="cargarnuevo"
    label="Creando la cotización..."
    label-class="text-teal"
    label-style="font-size: 1.1em"
  />
  <q-inner-loading
    :showing="cargarStage"
    label="Cambiando el estado..."
    label-class="text-teal"
    label-style="font-size: 1.1em"
  />
</template>
<style scoped>
.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 10px;
}
</style>
